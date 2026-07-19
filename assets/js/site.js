window.CHOICE_LAB_CONFIG = {
  siteName: "CHOICE LAB",
  affiliateDisclosure: "当サイトはA8.netのアフィリエイト広告を利用しています。",
  affiliateSupplement: "当サイトのリンクを経由して商品を購入された場合、運営者に報酬が発生することがあります。",
  affiliatePrograms: {
    rakuten: { enabled: true, displayName: "A8.net（楽天市場の商品広告）" },
    amazon: { enabled: false, displayName: "Amazon" },
    yahoo: { enabled: false, displayName: "Yahoo!ショッピング" }
  }
};
(function () {
  "use strict";
  const base = document.body.dataset.base || "";
  const config = window.CHOICE_LAB_CONFIG;
  const instagram = "https://www.instagram.com/item.guide.jp/";
  const link = (href, label) => `<a href="${base}${href}">${label}</a>`;
  const header = document.querySelector("[data-site-header]");
  const footer = document.querySelector("[data-site-footer]");
  if (header) {
    header.innerHTML = `<div class="notice">${config.affiliateDisclosure}</div>
      <header class="site-header"><div class="container header-inner">
      <a class="brand" href="${base}index.html" aria-label="CHOICE LAB トップページ"><span class="brand-mark">C</span><span>CHOICE LAB<small>暮らしに合う商品選びを、もっとわかりやすく。</small></span></a>
      <button class="menu-button" type="button" aria-expanded="false" aria-controls="global-nav"><span></span><span></span><span></span><span class="sr-only">メニューを開く</span></button>
      <nav id="global-nav" class="global-nav" aria-label="メインメニュー">
      ${link("index.html", "ホーム")}${link("index.html#categories", "カテゴリー")}<a class="nav-primary" href="${base}products.html">商品を探す</a>${link("ranking.html", "比較記事")}${link("guide.html", "選び方ガイド")}${link("index.html#articles", "新着記事")}${link("about.html", "運営者情報")}
      </nav></div></header>`;
    const button = header.querySelector(".menu-button");
    const nav = header.querySelector(".global-nav");
    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!open));
      button.querySelector(".sr-only").textContent = open ? "メニューを開く" : "メニューを閉じる";
      nav.classList.toggle("is-open", !open);
    });
  }
  if (footer) {
    footer.innerHTML = `<footer class="site-footer"><div class="container footer-grid">
      <div><a class="brand brand-footer" href="${base}index.html"><span class="brand-mark">C</span><span>CHOICE LAB</span></a><p>暮らしに合う商品選びを、もっとわかりやすく。</p><p class="footer-description">家電、ガジェット、日用品、防災用品など、暮らしに役立つ商品を整理・比較する商品情報メディアです。</p><p class="muted">商品情報は掲載時点の公開情報をもとに整理しています。</p></div>
      <nav aria-label="フッターメニュー"><h2>コンテンツ</h2>${link("index.html#categories", "カテゴリー")}${link("products.html", "商品一覧")}${link("ranking.html", "比較記事")}${link("guide.html", "選び方ガイド")}${link("index.html#articles", "新着記事")}</nav>
      <nav aria-label="運営情報"><h2>運営情報</h2>${link("about.html", "運営者情報")}${link("advertising-policy.html", "広告ポリシー")}${link("privacy.html", "プライバシーポリシー")}${link("disclaimer.html", "免責事項")}</nav>
      <nav aria-label="運営アカウント"><h2>運営アカウント</h2><a href="${instagram}" target="_blank" rel="noopener noreferrer">Instagram<span aria-hidden="true"> ↗</span></a>${link("contact.html", "お問い合わせ")}</nav>
      </div><div class="container footer-operator"><p>CHOICE LABは、図解アイテム研究所が運営しています。図解を使った商品紹介や更新情報はInstagramでも発信しています。</p></div><div class="container associate-disclosure">${config.affiliateDisclosure} ${config.affiliateSupplement}</div><div class="container copyright">© 図解アイテム研究所</div></footer>`;
  }
  const canonicalUrl = `https://adokisaragi.github.io/AffiliateWeb/${location.pathname.split("/").pop() || "index.html"}${location.search}`;
  if (!document.querySelector('link[rel="canonical"]')) {
    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = canonicalUrl;
    document.head.append(canonical);
  }
  if (!document.querySelector('meta[name="twitter:card"]')) {
    const card = document.createElement("meta");
    card.name = "twitter:card";
    card.content = "summary";
    document.head.append(card);
  }
  document.querySelectorAll("[data-affiliate-programs]").forEach(container => {
    const names = Object.values(config.affiliatePrograms).filter(program => program.enabled).map(program => program.displayName);
    container.innerHTML = `<h2>現在利用しているアフィリエイトプログラム</h2><p>${names.join("、")}に関するアフィリエイトプログラムを利用しています。広告リンクを経由して商品を購入された場合、運営者に報酬が発生することがあります。</p>`;
  });
  const guide = document.querySelector(".prose");
  if (guide && document.title.includes("商品選びの基本ガイド")) {
    guide.insertAdjacentHTML("afterbegin", `<section class="visual-guide-intro" aria-labelledby="gadget-guide-title"><div class="eyebrow">VISUAL GUIDE</div><h2 id="gadget-guide-title">スマホ・ガジェットの確認ポイント</h2><p>商品の種類ごとに、購入前に確認したい項目を図で整理しました。具体的な対応条件は販売ページやメーカー情報で確認してください。</p><div class="guide-visual-list"><figure><img src="${base}assets/images/guides/charger-guide.svg" width="800" height="280" loading="lazy" alt="充電器を選ぶときの使用機器、端子、携帯性、ポート数の確認項目"><figcaption>充電器：使用機器・端子・携帯性・ポート数を確認</figcaption></figure><figure><img src="${base}assets/images/guides/mobile-battery-guide.svg" width="800" height="280" loading="lazy" alt="モバイルバッテリーを選ぶときの容量、重量、端子、携帯性、対応機器の確認項目"><figcaption>モバイルバッテリー：容量・重量・端子・携帯性・対応機器を確認</figcaption></figure><figure><img src="${base}assets/images/guides/accessory-guide.svg" width="800" height="280" loading="lazy" alt="スマホアクセサリーを選ぶときの使用目的、対応サイズ、装着方法、携帯性の確認項目"><figcaption>スマホアクセサリー：使用目的・対応サイズ・装着方法・携帯性を確認</figcaption></figure></div></section>`);
  }
})();
