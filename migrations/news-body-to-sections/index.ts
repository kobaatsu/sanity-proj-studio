import {at, defineMigration, set} from 'sanity/migrate'

/**
 * お知らせ本文（body）を、Portable Text の配列から
 * 「リッチテキスト（richText）・画像（bodyImage）」セクションの配列へ変換する。
 *
 * 旧形式の連続する block をひとつの richText セクションにまとめる。
 * 既に新形式のドキュメントは変更しないため、何度実行しても安全。
 *
 * 実行方法（引数なしはドライラン）:
 *   pnpm exec sanity migration run news-body-to-sections
 *   pnpm exec sanity migration run news-body-to-sections --no-dry-run
 */

interface RichTextSection {
  _type: 'richText'
  _key: string
  content: unknown[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isLegacyBlock(value: unknown): boolean {
  return isRecord(value) && value._type === 'block'
}

function createKey(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 12)
}

function toSections(body: unknown[]): unknown[] {
  const sections: unknown[] = []
  let current: RichTextSection | null = null

  for (const item of body) {
    if (isLegacyBlock(item)) {
      if (!current) {
        current = {_type: 'richText', _key: createKey(), content: []}
        sections.push(current)
      }
      current.content.push(item)
    } else {
      current = null
      sections.push(item)
    }
  }

  return sections
}

export default defineMigration({
  title: 'お知らせ本文をリッチテキスト・画像のセクション配列に変換',
  documentTypes: ['news'],
  filter: 'defined(body)',

  migrate: {
    document(doc) {
      const {body} = doc
      if (!Array.isArray(body) || !body.some(isLegacyBlock)) return undefined

      return at('body', set(toSections(body)))
    },
  },
})
