interface PortableTextSpan {
  _type?: string
  text?: string
}

interface PortableTextBlock {
  _type?: string
  children?: PortableTextSpan[]
}

interface NewsBodyRichTextSection {
  _type: 'richText'
  content?: unknown
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isRichTextSection(value: unknown): value is NewsBodyRichTextSection {
  return isRecord(value) && value._type === 'richText'
}

/**
 * Portable Text 配列からテキスト部分のみを抜き出し、改行区切りのプレーンテキストにする。
 * 画像やその他のカスタムブロックは無視する。
 */
export function portableTextToPlainText(blocks: unknown): string {
  if (!Array.isArray(blocks)) return ''

  return (blocks as PortableTextBlock[])
    .filter((block) => block?._type === 'block')
    .map((block) =>
      (block.children ?? [])
        .filter((span) => span?._type === 'span' && typeof span.text === 'string')
        .map((span) => span.text)
        .join(''),
    )
    .filter((line) => line.length > 0)
    .join('\n')
}

/**
 * お知らせ本文（リッチテキスト・画像のセクション配列）からテキスト部分のみを抜き出し、
 * 改行区切りのプレーンテキストにする。画像セクションは無視する。
 */
export function newsBodyToPlainText(sections: unknown): string {
  if (!Array.isArray(sections)) return ''

  return sections
    .filter(isRichTextSection)
    .map((section) => portableTextToPlainText(section.content))
    .filter((text) => text.length > 0)
    .join('\n')
}

/** 改行を除いた文字数を数える（絵文字などのサロゲートペアも1文字として数える） */
export function countCharactersExcludingNewlines(text: string): number {
  return Array.from(text.replace(/[\r\n]/g, '')).length
}
