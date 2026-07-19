# CHOICE LAB

家電、ガジェット、日用品、防災用品などを扱う静的な総合商品比較・紹介メディアです。HTML / CSS / Vanilla JavaScriptのみで動作します。

掲載中の商品、企業、仕様、画像はすべて構築用の架空サンプルです。固定価格、在庫、利用者レビューは掲載しません。

## ローカル確認

VS CodeのLive Serverで `index.html` を開きます。主要機能はHTMLの直接表示でも動作します。

## データ構成

- `data/categories.js`: カテゴリー設定
- `data/products.js`: 商品情報
- `data/articles.js`: 記事情報

JSONではなくJavaScriptデータを使用しているため、ローカルファイルとして開いた場合も `fetch` の制限を受けません。

## カテゴリーを追加する

`data/categories.js` に1件追加します。

- `id`: URLに使う重複しない半角英数字
- `name`: 表示名
- `shortName`: 短い表示名
- `description`: カテゴリー説明
- `icon`: 自作図形内に表示する短い文字
- `accent`: 補助アクセント色
- `filters`: カテゴリー固有の確認項目

追加後は `category.html?category=カテゴリーID` で表示できます。トップページのカテゴリーカードもデータから生成されます。

初期カテゴリーはスマホ・ガジェット、パソコン周辺機器、生活家電、キッチン用品、日用品、収納用品、防災用品、旅行用品、カー用品、ペット用品、季節用品、在宅ワーク用品です。健康食品、医薬品、サプリメント、美容効果を訴求する商品は初期対象外です。

## 商品を追加する

`data/products.js` の既存商品を複製して編集します。主な共通項目は `id`、`name`、`slug`、`category`、`subCategory`、`manufacturer`、説明、画像、特徴、対象者、注意点、仕様、タグ、リンク、更新日、公開状態です。

商品固有の仕様は次のような配列で追加します。

```js
specifications: [
  { label: "素材", value: "確認した情報" },
  { label: "本体サイズ", value: "確認した情報" }
]
```

カテゴリーによって項目数や内容を変えられます。確認できない項目は断定せず、`情報未設定` または `公式情報をご確認ください` とします。

価格、価格帯、参考価格、在庫、評価点、レビュー数を保存する項目は追加しないでください。

## 記事を追加する

`data/articles.js` にカテゴリー、記事種別、タイトル、説明、更新日、リンク先を追加します。トップページとカテゴリーページへ反映されます。個別記事ページを増やす場合は既存の `guide.html` を基に作成し、記事URLを設定します。

## アフィリエイト設定

現在はA8.netを通じて楽天市場の商品広告を掲載しています。全体表記は `assets/js/site.js` 冒頭の `CHOICE_LAB_CONFIG` で管理します。

```js
affiliatePrograms: {
  rakuten: { enabled: true, displayName: "A8.net（楽天市場の商品広告）" },
  amazon: { enabled: false, displayName: "Amazon" },
  yahoo: { enabled: false, displayName: "Yahoo!ショッピング" }
}
```

共通の広告開示文も同じ設定にあります。現在参加していないプログラムを `enabled: true` にしないでください。

## 楽天アフィリエイトURLを登録する

`data/products.js` の各商品にある `affiliateLinks.rakuten` を編集します。

```js
rakuten: {
  enabled: true,
  url: "管理画面で発行した正規URL",
  label: "楽天市場で商品情報を見る"
}
```

`enabled` が `true` で、`url` が空でない場合だけボタンが表示されます。現在の架空商品はすべてURLが空のため、楽天ボタンは表示されません。

## A8.net発行HTML広告

発行済みHTML広告は `affiliate-ads/` に商品別ファイルとして保存します。広告コードはタグ、URL、画像、表示文、価格、計測用画像を含めて変更しないでください。商品データの `adFile` に対象ファイルを指定すると、商品詳細ページの「広告」ラベル直下へ読み込まれます。

```js
adFile: "affiliate-ads/anker-323-charger.html"
```

一覧ページには広告HTMLを表示せず、商品詳細へのリンクだけを掲載します。広告の見た目を調整するときは、`assets/css/styles.css` の `.supplied-ad` など外側の要素だけを編集してください。

楽天アフィリエイトで生成されたURLやHTMLソースを許可なく加工せず、短縮URLや独自リダイレクトも使用しないでください。リンク先が楽天市場であることが分かるラベルを維持します。

## 将来Amazonを追加する

Amazonアソシエイトへの参加・サイト登録が完了してから、次の作業を行います。

1. `assets/js/site.js` の `affiliatePrograms.amazon.enabled` を `true` にする
2. 各商品の `affiliateLinks.amazon.enabled` を `true` にする
3. `affiliateLinks.amazon.url` へ正規リンクを登録する
4. プライバシーポリシーと広告掲載ポリシーにAmazon所定の開示文を追加する
5. Amazonへ登録したサイトURLと運営者名を再確認する

URLが空の場合は、設定を有効にしてもボタンは表示されません。Amazonロゴや商品画像を独自に追加・転載しないでください。

## 商品画像の権利管理

商品画像は次の形式で管理します。

```js
image: {
  src: "assets/images/product-placeholder.svg",
  alt: "商品のイメージ画像",
  sourceType: "original-placeholder",
  rightsConfirmed: true
}
```

`rightsConfirmed: false` の商品は一覧や詳細ページへ表示されません。楽天市場の商品ページから画像、レビュー、スクリーンショットをコピーしないでください。正式に提供された広告素材を利用する場合は楽天の生成コードとガイドラインに従い、素材を許可なく加工しないでください。

## 公開前チェック

1. 架空の商品・仕様・運営者情報を確認済みの実情報へ変更
2. 楽天アフィリエイト管理画面で発行した正規URLを登録
3. 公開URL、OGP、`robots.txt`、`sitemap.xml` を更新
4. 楽天アフィリエイトへ公開サイトを登録し、HTTPSで公開
5. 実際に使用していない商品へ体験談を記載していないか確認
6. 固定価格、送料、在庫、ポイント、架空レビュー、誇大表現がないか確認
7. お問い合わせフォームの送信先を設定
8. PC、タブレット、スマートフォンで表示とキーボード操作を確認

## 公開

GitHub PagesではリポジトリのSettings → Pagesから公開ブランチを指定します。レンタルサーバーではファイル一式を公開ディレクトリへアップロードできます。ビルド作業は不要です。

## オリジナル画像の追加・差し替え

サイト独自の画像は `assets/images/` 以下を用途別に管理します。カテゴリー画像は `data/categories.js` の `image` と `imageAlt`、商品詳細用の用途イラストは `data/products.js` 末尾の `usageBySubcategory` で指定します。

新しいカテゴリー画像を追加する場合は、`assets/images/categories/` にSVGを保存し、カテゴリーデータへ次の2項目を追加してください。

```js
image: "assets/images/categories/example.svg",
imageAlt: "カテゴリーの内容を具体的に表す代替テキスト"
```

商品詳細用画像を追加する場合は `assets/images/products/usage/` に保存し、`usageBySubcategory` にサブカテゴリー名、`src`、`alt` を追加します。実在商品の写真や外観の再現には使わず、用途を説明するオリジナルイラストにしてください。`isProductPhoto: false` の画像には、実際の商品と異なる旨の注記が自動表示されます。

画像読み込みに失敗した場合は `assets/images/common/no-image.svg` を表示します。この処理はサイト側の画像だけが対象で、`affiliate-ads/` 内のA8.net広告素材には適用しません。A8.net発行HTMLは編集しないでください。
