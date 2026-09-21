import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {japaneseSlugify} from '../../src/lib/japaneseSlugify'
import {NewsCategoryInput} from '../../src/components/NewsCategoryInput'

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
