import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'

export const companyInfo = defineType({
  name: 'companyInfo',
  title: '企業情報',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'name',
      title: '会社名',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: '会社概要',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'logo',
      title: 'ロゴ',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'representative',
      title: '代表者',
      type: 'string',
    }),
    defineField({
      name: 'establishedDate',
      title: '設立日',
      type: 'date',
    }),
    defineField({
      name: 'capital',
      title: '資本金',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: '所在地',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'phone',
      title: '電話番号',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'メールアドレス',
      type: 'string',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'website',
      title: 'Webサイト',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {
    select: {
      title: 'name',
    },
  },
})
