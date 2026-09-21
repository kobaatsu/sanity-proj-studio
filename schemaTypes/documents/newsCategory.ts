import {defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons/Tag'
import {japaneseSlugify} from '../../src/lib/japaneseSlugify'

export const newsCategory = defineType({
  name: 'newsCategory',
  title: 'お知らせカテゴリ',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'カテゴリ名',
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
            `count(*[_type == "newsCategory" && slug.current == $slug && !(_id in [$publishedId, $draftId])])`,
            {slug: slug.current, publishedId, draftId},
          )

          return existing === 0 || 'このスラッグは既に使用されています'
        }),
    }),
    defineField({
      name: 'order',
      title: '表示順',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: '表示順',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
