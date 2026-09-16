import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'
import {visionTool} from '@sanity/vision'
import {jaJPLocale} from '@sanity/locale-ja-jp'
import {schemaTypes} from './schemaTypes'
import {structure} from './src/structure'
import {jaOverrides} from './src/i18n/ja-overrides'
import {resolve} from './src/presentation/resolve'

export default defineConfig({
  name: 'default',
  title: 'sanity-proj',

  projectId: 'a3qfw1bg',
  dataset: 'production',

  plugins: [
    structureTool({structure}),
    presentationTool({
      resolve,
      previewUrl: {
        origin: 'http://localhost:3000',
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),
    visionTool(),
    jaJPLocale(),
  ],

  // @sanity/locale-ja-jp の一部訳語をここで上書き（src/i18n/ja-overrides.ts参照）
  i18n: {
    bundles: jaOverrides,
  },

  schema: {
    types: schemaTypes,
  },
})
