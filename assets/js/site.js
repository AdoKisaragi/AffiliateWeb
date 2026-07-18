(function () {
  "use strict";
  const base = document.body.dataset.base || "";
  const link = (href, label) => `<a href="${base}${href}">${label}</a>`;
  const header = document.querySelector("[data-site-header]");
  const footer = document.querySelector("[data-site-footer]");
  if (header) {
    header.innerHTML = `<div class="notice">当サイトはアフィリエイト広告を利用しています。</div>
      <header class="site-header"><div class="container header-inner">
      <a class="brand" href="${base}index.html" aria-label="CHOICE LAB トップページ"><span class="brand-mark">C</span><span>CHOICE LAB<small>暮らしに合う商品選びを、もっとわかりやすく。</small></span></a>
      <button class="menu-button" type="button" aria-expanded="false" aria-controls="global-nav"><span></span><span></span><span></span><span class="sr-only">メニューを開く</span></button>
      <nav id="global-nav" class="global-nav" aria-label="メインメニュー">
      ${link("index.html","ホーム")}${link("index.html#categories","カテゴリー")}<a class="nav-primary" href="${base}products.html">商品を探す</a>${link("ranking.html","比較記事")}${link("guide.html","選び方ガイド")}${link("index.html#articles","新着記事")}${link("about.html","運営者情報")}
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
      <div><a class="brand brand-footer" href="${base}index.html"><span class="brand-mark">C</span><span>CHOICE LAB</span></a><p>暮らしに合う商品選びを、もっとわかりやすく。</p><p class="footer-description">家電、ガジェット、日用品、防災用品など、暮らしに役立つ商品を整理・比較する商品情報メディアです。</p><p class="muted">掲載中の商品・仕様はデモ用の架空情報です。</p></div>
      <nav aria-label="フッターメニュー"><h2>コンテンツ</h2>${link("index.html#categories","カテゴリー")}${link("products.html","商品一覧")}${link("ranking.html","比較記事")}${link("guide.html","選び方ガイド")}${link("index.html#articles","新着記事")}</nav>
      <nav aria-label="サイト情報"><h2>サイト情報</h2>${link("about.html","運営者情報")}${link("contact.html","お問い合わせ")}${link("privacy.html","プライバシーポリシー")}${link("advertising-policy.html","広告掲載ポリシー")}</nav>
      </div><div class="container associate-disclosure">Amazonのアソシエイトとして、CHOICE LABは適格販売により収入を得ています。</div><div class="container copyright">© 2026 CHOICE LAB. All Rights Reserved.</div></footer>`;
  }
})();
