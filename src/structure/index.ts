import type {StructureResolver} from 'sanity/structure'
import {CogIcon} from '@sanity/icons/Cog'

const SINGLETONS = ['companyInfo']

export const structure: StructureResolver = (S) =>
  S.list()
    .id('content')
    .title('コンテンツ')
    .items([
      S.listItem()
        .id('companyInfo')
        .title('企業情報')
        .icon(CogIcon)
        .child(S.document().schemaType('companyInfo').documentId('companyInfo').title('企業情報')),

      S.divider(),

      ...S.documentTypeListItems().filter(
        (listItem) => !SINGLETONS.includes(listItem.getId() as string),
      ),
    ])
