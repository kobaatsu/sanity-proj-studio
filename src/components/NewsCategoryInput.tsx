import {useCallback, useState} from 'react'
import {Button, Card, Flex, Stack, Text} from '@sanity/ui'
import {SparklesIcon} from '@sanity/icons/Sparkles'
import {type ReferenceInputProps, set, useClient, useFormValue} from 'sanity'
import {suggestNewsCategory, NONE_OPTION_ID} from '../lib/typesafe/suggestNewsCategory'
import {portableTextToPlainText} from '../lib/portableTextToPlainText'

const API_VERSION = '2026-02-01'

interface Suggestion {
  categoryId: string
  categoryTitle: string
  confidence: number
}

/**
 * 「お知らせ」ドキュメントのカテゴリ参照フィールド用カスタム入力。
 * 記事タイトル・本文をもとに TypeSafe (Jev) でカテゴリー候補を提案し、
 * ワンクリックで反映できるボタンを標準の参照入力の上に表示する。
 */
export function NewsCategoryInput(props: ReferenceInputProps) {
  const {onChange, renderDefault} = props
  const client = useClient({apiVersion: API_VERSION})
  const title = useFormValue(['title']) as string | undefined
  const body = useFormValue(['body']) as unknown

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null)

  const plainBody = portableTextToPlainText(body)
  const isBodyEmpty = plainBody.length === 0

  const handleSuggest = useCallback(async () => {
    setError(null)
    setSuggestion(null)

    if (isBodyEmpty) {
      setError('本文を入力してから提案してください。')
      return
    }

    setLoading(true)
    try {
      const categories = await client.fetch<{_id: string; title: string}[]>(
        `*[_type == "newsCategory" && defined(title)]{_id, title}`,
      )
      const categoryOptions = categories.map((category) => ({
        id: category._id,
        title: category.title,
      }))

      const result = await suggestNewsCategory(
        {title: title ?? '', body: plainBody},
        categoryOptions,
      )

      if (result.categoryId === NONE_OPTION_ID) {
        setError('該当しそうなカテゴリーが見つかりませんでした。')
        return
      }

      const matched = categoryOptions.find((category) => category.id === result.categoryId)
      if (!matched) {
        setError('TypeSafe APIから未知のカテゴリーIDが返されました。')
        return
      }

      setSuggestion({
        categoryId: matched.id,
        categoryTitle: matched.title,
        confidence: result.confidence,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : '提案の取得中にエラーが発生しました。')
    } finally {
      setLoading(false)
    }
  }, [client, title, plainBody, isBodyEmpty])

  const handleApply = useCallback(() => {
    if (!suggestion) return
    onChange(set({_type: 'reference', _ref: suggestion.categoryId}))
    setSuggestion(null)
  }, [onChange, suggestion])

  const handleDismiss = useCallback(() => {
    setSuggestion(null)
  }, [])

  return (
    <Stack gap={3}>
      {renderDefault(props)}

      <Card padding={3} radius={2} tone="primary" border>
        <Stack gap={3}>
          <Flex align="center" justify="space-between">
            <Text size={1} weight="medium">
              AIによるカテゴリー提案
            </Text>
            <Button
              icon={SparklesIcon}
              text="カテゴリーを提案"
              tone="primary"
              mode="ghost"
              loading={loading}
              disabled={isBodyEmpty}
              onClick={() => void handleSuggest()}
            />
          </Flex>

          {error && (
            <Text size={1} muted>
              {error}
            </Text>
          )}

          {suggestion && (
            <Card padding={3} radius={2} tone="positive" border>
              <Flex align="center" justify="space-between" gap={3}>
                <Text size={1}>
                  提案: <strong>{suggestion.categoryTitle}</strong>（確信度{' '}
                  {Math.round(suggestion.confidence * 100)}%）
                </Text>
                <Flex gap={2}>
                  <Button text="適用" tone="positive" mode="default" onClick={handleApply} />
                  <Button text="却下" mode="bleed" onClick={handleDismiss} />
                </Flex>
              </Flex>
            </Card>
          )}
        </Stack>
      </Card>
    </Stack>
  )
}
