import {useMemo} from 'react'
import {Flex, Stack, Text} from '@sanity/ui'
import type {ArrayOfObjectsInputProps} from 'sanity'
import {countCharactersExcludingNewlines, newsBodyToPlainText} from '../lib/portableTextToPlainText'

/**
 * 「お知らせ」本文（リッチテキスト・画像のセクション配列）用カスタム入力。
 * 標準の配列入力の下に、全リッチテキストの合計文字数（改行を除く・参考値）を表示する。
 */
export function NewsBodyInput(props: ArrayOfObjectsInputProps) {
  const {value, renderDefault} = props

  const characterCount = useMemo(
    () => countCharactersExcludingNewlines(newsBodyToPlainText(value)),
    [value],
  )

  return (
    <Stack gap={3}>
      {renderDefault(props)}
      <Flex justify="flex-end">
        <Text size={1} muted>
          本文 合計 {characterCount.toLocaleString('ja-JP')} 文字（改行を除く）
        </Text>
      </Flex>
    </Stack>
  )
}
