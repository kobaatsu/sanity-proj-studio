import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {japaneseSlugify} from '../../src/lib/japaneseSlugify'
import {NewsCategoryInput} from '../../src/components/NewsCategoryInput'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isAltOmitted(image: unknown): boolean {
  return isRecord(image) && image.omitAlt === true
}

/** 画像が設定されていて、かつ「ALTを省略」が指定されていない場合にALTを必須とする */
function isAltRequired(image: unknown): boolean {
  return isRecord(image) && Boolean(image.asset) && !isAltOmitted(image)
}

export const news = defineType({
  name: 'news',
  title: 'お知らせ',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'タイトル',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'スラッグ',
      type: 'slug',
      options: {source: 'title', slugify: japaneseSlugify},
      validation: (rule) =>
        rule.required().custom(async (slug, context) => {
          if (!slug?.current) return true

          const client = context.getClient({apiVersion: '2026-02-01'})
          const publishedId = context.document?._id?.replace(/^drafts\./, '')
          const draftId = `drafts.${publishedId}`

          const existing = await client.fetch(
            `count(*[_type == "news" && slug.current == $slug && !(_id in [$publishedId, $draftId])])`,
            {slug: slug.current, publishedId, draftId},
          )

          return existing === 0 || 'このスラッグは既に使用されています'
        }),
    }),
    defineField({
      name: 'publishedAt',
      title: '公開日',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'カテゴリ',
      type: 'reference',
      to: [{type: 'newsCategory'}],
      components: {
        input: NewsCategoryInput,
      },
    }),
    defineField({
      name: 'excerpt',
      title: '概要',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(200).warning('SEOのため200文字以内を推奨します'),
    }),
    defineField({
      name: 'mainImage',
      title: 'メイン画像',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'omitAlt',
          title: 'この画像はALTを省略',
          type: 'boolean',
          description:
            '装飾目的の画像など、内容を説明する必要がない場合にチェックします。サイト上では alt="" として出力されます',
        }),
        defineField({
          name: 'alt',
          title: '代替テキスト（ALT）',
          type: 'string',
          description:
            '画像の内容を説明するテキスト。スクリーンリーダーや画像が表示されない場合に使用されます',
          hidden: ({parent}) => isAltOmitted(parent),
          validation: (rule) =>
            rule.custom((alt, context) => {
              if (!isAltRequired(context.parent)) return true
              return alt?.trim() ? true : '画像を設定した場合は代替テキストを入力してください'
            }),
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: '本文',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publishedAt',
      media: 'mainImage',
    },
  },
})
