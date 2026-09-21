interface ImportMetaEnv {
  readonly SANITY_STUDIO_YAHOO_CLIENT_ID?: string
  readonly SANITY_STUDIO_PREVIEW_URL?: string
  readonly SANITY_STUDIO_TYPESAFE_PROXY_URL?: string
  readonly SANITY_STUDIO_INTERNAL_API_SECRET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
