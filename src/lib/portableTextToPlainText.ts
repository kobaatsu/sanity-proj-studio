interface PortableTextSpan {
  _type?: string
  text?: string
}

interface PortableTextBlock {
  _type?: string
  children?: PortableTextSpan[]
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
