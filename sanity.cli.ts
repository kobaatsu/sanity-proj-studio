import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'a3qfw1bg',
    dataset: 'production',
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
    appId: 'r1p5hcuybprbc9xzk46tmv72',
  },
  typegen: {
    enabled: true,
    path: '../web/src/**/*.{ts,tsx,js,jsx,astro}',
    schema: 'schema.json',
    generates: '../web/sanity.types.ts',
    overloadClientMethods: true,
    // 出力先 web/ の prettier 設定が参照するプラグインを studio/ から解決できず整形が失敗するため無効化
    // （生成ファイルは web/.prettierignore で整形対象外）
    formatGeneratedCode: false,
  },
})
