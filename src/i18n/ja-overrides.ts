import {defineLocaleResourceBundle} from 'sanity'

/**
 * @sanity/locale-ja-jp の訳語を部分的に上書きするための追加リソースバンドル。
 *
 * 使い方:
 * 1. 気になる訳語が表示されている画面を特定する
 * 2. node_modules/@sanity/locale-ja-jp/dist/<namespace>-*.js を検索し、
 *    該当するキーとコメント(英語の原文説明)を見つける
 *    (namespace一覧: canvas, comments, copy-paste, feedback, media-library,
 *     presentation, releases, singleDocRelease, structure, studio, tasks,
 *     validation, vision)
 * 3. 下の配列に同じ namespace・key で上書きしたい訳語を追加する
 *
 * sanity.config.ts で `jaJPLocale()` より後ろの plugins に登録することで、
 * 同一ロケール(ja-JP)・同一namespaceのキーが上書きされる
 * (後から解決されたリソースバンドルが overwrite: true で勝つ仕様)。
 */
export const jaOverrides = [
  // 「ドラフト」(カタカナ) -> 「下書き」に統一
  defineLocaleResourceBundle({
    locale: 'ja-JP',
    namespace: 'structure',
    resources: {
      'action.discard-changes.confirm-dialog.confirm-discard-changes-draft':
        'この下書きドキュメントのすべての変更を破棄してもよろしいですか？',
      'banners.archived-scheduled-draft.description':
        'このスケジュールされた下書きはアーカイブされています',
      'banners.choose-new-document-destination.cannot-create-draft-document':
        '下書きドキュメントを作成できません。',
      'banners.obsolete-draft.actions.compare-draft.text': '下書きを比較する',
      'banners.obsolete-draft.actions.discard-draft.text': '下書きを破棄する',
      'banners.obsolete-draft.actions.publish-draft.text': '下書きを公開する',
      'banners.obsolete-draft.draft-model-inactive.text':
        'ワークスペースは下書きを有効にしていませんが、このドキュメントの下書きバージョンが存在します。',
      'banners.scheduled-draft-override-banner.text':
        'このドキュメントにはスケジュールされた下書きが存在します。今変更を公開すると、スケジュールが実行されるときに上書きされます。',
      'canvas.banner.linked-text.draft': 'この下書きドキュメントはキャンバスにリンクされています',
      'compare-versions.status.draft': '下書き',
      'events.open.draft': '<VersionBadge>下書き</VersionBadge>ドキュメントを開く',
      'panes.document-operation-results.operation-success_discardChanges':
        '最後の公開以降のすべての変更が破棄されました。破棄された下書きは履歴から回復することができます',
      'panes.document-operation-results.operation-success_unpublish':
        'ドキュメントの公開が取り消されました。最新の公開バージョンから下書きが作成されました。',
    },
  }),
  defineLocaleResourceBundle({
    locale: 'ja-JP',
    namespace: 'studio',
    resources: {
      'changes.versions.draft': '下書き',
      'release.chip.draft': '下書き',
      'release.chip.global.drafts': '下書き',
      'release.chip.tooltip.draft-disabled.live-edit':
        'このドキュメントはライブ編集モードで、下書きは無効です',
      'release.dialog.delete-schedule-draft.body-already-current':
        'このスケジュールされた下書きを削除しますか？あなたの下書きはすでに最新です。',
      'release.dialog.delete-schedule-draft.body-will-save-to-draft':
        'このスケジュールされた下書きを削除しますか？変更は下書きに保存されます。',
      'release.dialog.delete-schedule-draft.body-with-choice':
        'このスケジュールされた下書きを削除しますか？',
      'release.dialog.delete-schedule-draft.copy-checkbox':
        'スケジュールされた変更を下書きにコピーして保持する（推奨）',
      'release.dialog.delete-schedule-draft.different-changes-explanation':
        'あなたのスケジュールされた下書きは現在の下書きと異なる変更があります。',
      'release.navbar.drafts': '下書き',
      'release.toast.schedule-publish.success': '下書きのスケジュール設定に成功しました',
      'release.toast.scheduled-draft-published.title': '予定されていた下書きが公開されました',
      'schedule-publish-dialog.header': '公開のための下書きをスケジュールする',
      'timeline.operation.draft-created': '下書きが作成されました',
      'timeline.operation.draft-created_timestamp': '下書き作成: {{timestamp, datetime}}',
    },
  }),
  defineLocaleResourceBundle({
    locale: 'ja-JP',
    namespace: 'releases',
    resources: {
      'banner.confirm-active-scheduled-drafts_other':
        'スケジュール確認が必要なスケジュール済み下書きが {{count}} 件あります',
      'schedule-unpublish-dialog.header': '非公開の下書きをスケジュール',
      'summary.no-documents-cardinality-one.description':
        'このスケジュール済み下書きにはドキュメントが含まれていません。削除された可能性があります。',
    },
  }),
  defineLocaleResourceBundle({
    locale: 'ja-JP',
    namespace: 'tasks',
    resources: {
      'buttons.draft.text': '下書き',
      'panel.drafts.title': '下書き',
    },
  }),
]
