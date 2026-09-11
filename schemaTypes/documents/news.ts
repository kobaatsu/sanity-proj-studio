import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

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
      options: {source: 'title'},
      validation: (rule) => rule.required(),
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
      type: 'string',
      options: {
        list: [
          {title: 'お知らせ', value: 'general'},
          {title: 'プレスリリース', value: 'press'},
          {title: 'イベント', value: 'event'},
          {title: '製品情報', value: 'product'},
        ],
        layout: 'radio',
      },
      initialValue: 'general',
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
