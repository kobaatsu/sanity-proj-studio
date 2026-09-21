export interface NewsCategoryOption {
  id: string
  title: string
}

export interface CategorySuggestion {
  categoryId: string
  confidence: number
  probabilities: Record<string, number>
}

interface SuggestNewsCategoryErrorResponse {
  error?: string
}

export const NONE_OPTION_ID = '__none__'

/**
 * 記事タイトル・本文から、既存の「お知らせカテゴリ」一覧の中で
 * 最も適切なものを TypeSafe (Jev) で判定する。
 *
 * ブラウザ (Sanity Studio) から TypeSafe API を直接呼ぶと CORS で
 * ブロックされるため、web-nextjs 側の Route Handler を経由する。
 *
 * エンドポイントの向き先は SANITY_STUDIO_TYPESAFE_PROXY_URL で指定する。
 * Presentation Tool の SANITY_STUDIO_PREVIEW_URL とは用途が異なる
 * （PREVIEW_URLはローカル開発時にlocalhostを指すことが多く、
 * デプロイ済みStudioからはlocalhostに到達できないため共用しない）。
 * 未設定時は開発向けに http://localhost:3000 にフォールバックする。
 */
export async function suggestNewsCategory(
  article: {title: string; body: string},
  categories: NewsCategoryOption[],
): Promise<CategorySuggestion> {
  if (categories.length === 0) {
    throw new Error('カテゴリーが1件も登録されていません。先にお知らせカテゴリを作成してください。')
  }

  const proxyUrl = import.meta.env.SANITY_STUDIO_TYPESAFE_PROXY_URL || 'http://localhost:3000'
  const endpoint = new URL('/api/typesafe/suggest-news-category', proxyUrl).toString()
  const internalSecret = import.meta.env.SANITY_STUDIO_INTERNAL_API_SECRET as string | undefined

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(internalSecret ? {'X-Internal-Secret': internalSecret} : {}),
    },
    body: JSON.stringify({
      title: article.title,
      body: article.body,
      categories,
    }),
  })

  if (!response.ok) {
    const errorBody = (await response
      .json()
      .catch(() => null)) as SuggestNewsCategoryErrorResponse | null
    throw new Error(
      errorBody?.error ?? `カテゴリー提案APIの呼び出しに失敗しました (status: ${response.status})`,
    )
  }

  return (await response.json()) as CategorySuggestion
}
