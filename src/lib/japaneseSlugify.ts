const YAHOO_FURIGANA_API_URL = 'https://jlp.yahooapis.jp/jsonrpc'

interface YahooFuriganaSubword {
  surface: string
  furigana?: string
  roman?: string
}

interface YahooFuriganaWord extends YahooFuriganaSubword {
  subword?: YahooFuriganaSubword[]
}

interface YahooFuriganaResponse {
  result?: {
    word?: YahooFuriganaWord[]
  }
  error?: {
    message: string
  }
}

function romanOf(word: YahooFuriganaWord | YahooFuriganaSubword): string {
  if (word.roman) return word.roman
  if ('subword' in word && word.subword) {
    return word.subword.map(romanOf).join('')
  }
  return word.surface
}

async function fetchRoman(title: string): Promise<string> {
  const clientId = import.meta.env.SANITY_STUDIO_YAHOO_CLIENT_ID as string | undefined
  if (!clientId) {
    throw new Error(
      'SANITY_STUDIO_YAHOO_CLIENT_ID が設定されていません。.env.local を確認してください。',
    )
  }

  const url = `${YAHOO_FURIGANA_API_URL}?appid=${encodeURIComponent(clientId)}`

  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({
      id: '1',
      jsonrpc: '2.0',
      method: 'jlp.furiganaservice.furigana',
      params: {q: title},
    }),
  })

  if (!response.ok) {
    throw new Error(`Yahoo!ふりがなAPIの呼び出しに失敗しました (status: ${response.status})`)
  }

  const data = (await response.json()) as YahooFuriganaResponse

  if (data.error) {
    throw new Error(`Yahoo!ふりがなAPIエラー: ${data.error.message}`)
  }

  const words = data.result?.word ?? []
  return words.map(romanOf).join('')
}

/**
 * 日本語タイトルを Yahoo!ふりがなAPI でローマ字読みに変換し、
 * ハイフン区切りの slug を生成する。
 */
export async function japaneseSlugify(title: string): Promise<string> {
  const roman = await fetchRoman(title)

  return roman
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
