(() => {
  if (!document.querySelector('link[href*="brand-network.css"]')) {
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = location.pathname.includes("/entertainment/") ? "../assets/css/brand-network.css" : "assets/css/brand-network.css";
    document.head.append(style);
  }
  const current = document.documentElement.dataset.site || "shopping";
  const depth = location.pathname.includes("/entertainment/") ? "../" : "";
  if (current === "shopping") {
    let image = document.querySelector('meta[property="og:image"]');
    if (!image) {
      image = document.createElement("meta");
      image.setAttribute("property", "og:image");
      document.head.append(image);
    }
    image.content = "https://adokisaragi.github.io/AffiliateWeb/assets/images/og/shopping.svg";
  }
  const bar = document.createElement("nav");
  bar.className = "choice-network";
  bar.setAttribute("aria-label", "CHOICE LAB サイト切り替え");
  bar.innerHTML = `<div class="choice-network__inner">
    <a class="choice-network__name" href="${depth}portal.html">CHOICE LAB</a>
    <div class="choice-network__links">
      <a href="${depth}index.html"${current === "shopping" ? ' aria-current="page"' : ""}>Shopping</a>
      <a href="${depth}entertainment/"${current === "entertainment" ? ' aria-current="page"' : ""}>Entertainment</a>
      <a class="choice-network__portal" href="${depth}portal.html">ジャンルを選ぶ</a>
    </div>
  </div>`;
  document.body.prepend(bar);

  const footer = document.querySelector(".site-footer") || document.querySelector("footer") || document.querySelector("[data-site-footer]");
  if (footer && !footer.querySelector(".choice-network-footer")) {
    const network = document.createElement("section");
    network.className = "container choice-network-footer";
    network.setAttribute("aria-labelledby", "choice-network-title");
    network.innerHTML = `<h2 id="choice-network-title">CHOICE LAB NETWORK</h2>
      <div class="choice-network-footer__links">
        <a href="${depth}index.html"><strong>Shopping${current === "shopping" ? "（現在表示中）" : ""}</strong><span>家電・ガジェット・日用品などの商品選び</span></a>
        <a href="${depth}entertainment/"><strong>Entertainment${current === "entertainment" ? "（現在表示中）" : ""}</strong><span>アニメ・映画・ゲームなどの作品情報</span></a>
      </div>`;
    footer.prepend(network);
    if (footer.matches("[data-site-footer]")) {
      footer.style.background = "#24183e";
      footer.style.color = "#fff";
      footer.style.padding = "30px 0";
    }
  }
})();
