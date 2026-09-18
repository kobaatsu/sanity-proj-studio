import {defineLocations, type PresentationPluginOptions} from 'sanity/presentation'

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    news: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (doc) => ({
        locations: [
          {title: doc?.title || '無題', href: `/news/${doc?.slug}`},
          {title: 'お知らせ一覧', href: '/news'},
        ],
      }),
    }),
    companyInfo: defineLocations({
      select: {name: 'name'},
      resolve: (doc) => ({
        locations: [{title: doc?.name || '企業情報', href: '/company'}],
      }),
    }),
  },
  mainDocuments: [
    {
      route: '/news/:slug',
      filter: `_type == "news" && slug.current == $slug`,
    },
    {
      route: '/company',
      filter: `_type == "companyInfo"`,
    },
  ],
}
