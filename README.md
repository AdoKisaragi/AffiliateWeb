# CHOICE LAB

CHOICE LABは「通販・商品選び」と「アニメ・映画・ゲーム」の2つの専門メディアを持つ情報ブランドです。

- 公開URL: `https://adokisaragi.github.io/AffiliateWeb/`
- ブランド入口: `/portal.html`
- Shopping: `/index.html`（既存URLを維持）
- Entertainment: `/entertainment/`
- 運営: 図解アイテム研究所
- 連絡先: [Instagram](https://www.instagram.com/item.guide.jp/) のDM

## 役割

- Shopping: 家電、ガジェット、日用品、防災・旅行用品などの商品比較と選び方
- Entertainment: アニメ、映画、ゲームなどの作品情報、選び方、特集

## ディレクトリ構成

```text
/
├─ portal.html              ブランド入口
├─ index.html               Shoppingトップ（既存）
├─ entertainment/
│  ├─ index.html            Entertainmentトップ
│  └─ styles.css
├─ assets/
│  ├─ css/                  共通・各サイトのCSS
│  ├─ js/                   共通ナビゲーション等
│  └─ images/               オリジナルSVG・OGP
├─ data/                    Shoppingの商品・カテゴリー・記事データ
└─ affiliate-ads/           A8.net発行広告HTML
```

既存の商品、カテゴリー、記事URLを守るため、Shoppingはルート直下から移動していません。

## ローカル確認

リポジトリのルートで静的HTTPサーバーを起動し、`portal.html`、`index.html`、`entertainment/` を確認します。例:

```sh
python -m http.server 8000
```

`http://localhost:8000/portal.html` を開いてください。`file://` よりHTTPサーバーでの確認を推奨します。

## GitHub Pages公開

GitHubの Settings → Pages で、公開ブランチとルートディレクトリを指定します。公開後はサイトマップ、canonical、OGP URLが `https://adokisaragi.github.io/AffiliateWeb/` を向いていることを確認してください。

## コンテンツの追加

### Shopping記事

既存記事HTMLを基に本文、title、description、構造化データ、更新日を設定し、`data/articles.js` に導線を追加します。

### 商品

`data/products.js` の既存項目を基に、重複しない商品ID、商品情報、権利確認済み画像、リンクを追加します。既存の商品IDとURLパラメータは変更しません。

### Entertainment記事

`entertainment/` 内にHTMLを追加し、Entertainmentトップの記事カードと `sitemap.xml` にリンクを追加します。公式画像、場面写真、ポスター、スクリーンショットを許諾なく転載せず、オリジナルSVGまたは利用許諾が確認できる素材を使います。

### アニメ作品

`data/anime.json` に `title`、`thumbnail`、`rank`、`genre`、`description`、`affiliateUrl` を追加します。現在の画像配置に合わせ、画像は `assets/images/anime/` に1200×1499pxのWebP形式で保存し、JSONの画像パスとファイル名を一致させます。作品一覧と詳細は `entertainment/anime.js` がJSONから生成するため、HTMLへ作品情報を直接追加する必要はありません。

#### アニメ詳細情報の更新

詳細ページも `data/anime.json` から生成します。作品別HTMLは作成しません。

- 概要: `shortDescription`（上部の短文）と `overview`（ネタバレなしの概要）
- おすすめ: `recommendedFor` に3～5件の文字列を登録
- 見どころ: `highlights` に `{ "title": "", "description": "" }` を登録
- 基本情報: `season`、`broadcastStart`、`broadcastEnd`、`broadcastStatus`、`episodes`、`episodeDuration`、`studio`など、公式に確認できた項目だけを登録
- スタッフ: `staff` に `{ "role": "", "name": "" }` を登録
- キャスト: `cast` に `{ "character": "", "actor": "" }` を登録
- 公式リンク: `officialLinks` に `{ "label": "", "url": "" }` を登録
- 関連作品: `relatedTitles` に、サイト内に登録済みの正式タイトルを指定
- 更新日: `updatedAt`、配信情報確認日: `streamingCheckedAt` を `YYYY-MM-DD` で登録

配信サービスは `streamingServices` へ追加します。

```json
{
  "name": "サービス名",
  "type": "見放題",
  "status": "配信中",
  "startDate": "YYYY-MM-DD",
  "updateSchedule": "毎週○曜日",
  "freePeriod": "公式に確認できた場合のみ記載",
  "exclusivity": "独占・先行など",
  "officialUrl": "公式作品ページURL",
  "affiliateUrl": "",
  "isAffiliate": false,
  "checkedAt": "YYYY-MM-DD",
  "note": ""
}
```

見放題、レンタル、購入、期間限定無料、最新話無料、広告付き無料、独占配信、先行配信、配信予定、配信終了を区別してください。配信終了時は`status`を更新し、確認日も更新します。空欄項目は画面に表示されません。

情報源はアニメ公式サイト、公式配信情報ページ、配信サービス公式作品ページ、放送局、出版社の順に優先します。まとめサイトや非公式Wikiだけを根拠に登録しません。配信情報は定期的に再確認してください。

アフィリエイトURLを使う場合は`affiliateUrl`と`isAffiliate: true`を設定します。通常の公式リンクは`officialUrl`と`isAffiliate: false`を使用します。A8.net発行広告HTMLはタグ、URL、文言を含めて改変してはいけません。

画像は`assets/images/anime/`へ1200×1499pxのWebPとして追加します。表示時も1200:1499を維持し、切り抜きや引き伸ばしを行いません。

## サイト切り替えリンク

共通切り替えバーとフッターのネットワーク導線は `assets/js/brand-network.js`、表示は `assets/css/brand-network.css` で管理します。Shoppingページはルート基準、Entertainmentページは一階層上への相対パスを使います。

## 広告の重要事項

`affiliate-ads/` に保存したA8.net発行広告HTMLは、タグ、URL、画像、表示文言を含めて変更しないでください。広告掲載箇所では広告であることを明示し、最新の価格・提供状況は販売先で確認するよう案内します。

## 画像・著作権

Entertainmentでは既存作品のキャラクター、公式画像、場面写真、ポスター、ゲーム画面を権利確認なく使用しません。抽象的なオリジナルSVG、自作図解、許諾済み広告素材、公式の埋め込み機能を優先します。

## OGP画像

`assets/images/og/` にブランド入口、Shopping、Entertainment用SVGがあります。差し替える場合は1200×630pxを基準にし、各ページの `og:image` とTwitter Cardを更新します。GitHub PagesやSNSの対応状況に応じてPNG版への変換も検討してください。
