(function () {
  "use strict";
  const config = window.CHOICE_LAB_CONFIG || { affiliatePrograms: {} };
  const products = (window.CHOICE_LAB_PRODUCTS || []).filter(p => p.published && p.image && p.image.rightsConfirmed);
  const categories = window.CHOICE_LAB_CATEGORIES || [];
  const fallbackImage = "assets/images/common/no-image.svg";
  const productImage = p => `<img src="${p.image.src}" width="520" height="390" loading="lazy" alt="${p.image.alt}" onerror="this.onerror=null;this.src='${fallbackImage}'">`;
  const categoryName = id => (categories.find(c => c.id === id) || {}).name || id;
  const affiliateButtons = p => {
    const enabled = Object.entries(p.affiliateLinks || {}).filter(([key, link]) => config.affiliatePrograms[key]?.enabled && link.enabled && link.url);
    if (!enabled.length) return "";
    const notice = enabled.length === 1 && enabled[0][0] === "rakuten" ? "リンク先は楽天市場の販売ページです。価格、在庫、送料、ポイント還元、商品仕様などの最新情報は販売ページでご確認ください。" : "リンク先は外部の販売サイトです。価格、在庫、送料、商品仕様などの最新情報は各販売ページでご確認ください。";
    return `<div class="affiliate-cta"><div class="shop-links">${enabled.map(([key, link]) => `<a class="shop shop-${key}" href="${link.url}" rel="sponsored nofollow">${link.label}</a>`).join("")}</div><p class="price-notice">${notice}</p><p class="ad-note">上記リンクはアフィリエイト広告です。</p></div>`;
  };
  const officialLink = p => p.officialUrl ? `<a class="text-link" href="${p.officialUrl}">公式情報を確認する →</a>` : "";
  const suppliedAd = p => p.adFile ? `<section class="section compact"><h2>7. 販売情報</h2><div class="ad-label">広告</div><div class="supplied-ad"><iframe src="${p.adFile}" title="${p.name}の広告" loading="lazy" scrolling="no"></iframe></div></section>` : "";
  const enableExternalAdLinks = iframe => {
    const updateLinks = () => {
      try {
        iframe.contentDocument?.querySelectorAll("a[href]").forEach(link => {
          link.target = "_blank";
        });
      } catch (error) {
        console.warn("広告リンクの設定を更新できませんでした。", error);
      }
    };
    iframe.addEventListener("load", updateLinks);
    updateLinks();
  };
  const specs = (p, limit = 3) => p.specifications.slice(0, limit).map(s => `<div><dt>${s.label}</dt><dd>${s.value || "情報未設定"}</dd></div>`).join("");
  const card = p => `<article class="product-card"><div class="product-media">${productImage(p)}</div><div class="product-body"><div class="eyebrow">${categoryName(p.category)} / ${p.manufacturer}</div><h3>${p.name}</h3><p class="editor-comment"><strong>短い特徴</strong>${p.shortDescription}</p><p><strong>確認したいポイント：</strong>${p.considerations[0]}</p><p><strong>向いている可能性がある用途：</strong>${p.recommendedFor[0]}</p><a class="button button-secondary" href="product-detail.html?id=${p.id}">商品詳細を見る</a>${affiliateButtons(p)}</div></article>`;
  const list = document.querySelector("[data-product-list]");
  if (list) {
    document.querySelector(".page-header .lead").textContent = "カテゴリーや利用目的から、比較したい商品情報を絞り込めます。";
    document.querySelector(".result-bar small").textContent = "掲載商品";
    const form = document.querySelector("[data-filters]");
    const count = document.querySelector("[data-result-count]");
    const categorySelect = form.elements.category;
    categories.forEach(c => categorySelect.insertAdjacentHTML("beforeend", `<option value="${c.id}">${c.name}</option>`));
    const query = new URLSearchParams(location.search), queryCategory = query.get("category");
    if (queryCategory) categorySelect.value = queryCategory;
    const updateOptions = () => {
      const category = categorySelect.value;
      const source = products.filter(p => !category || p.category === category);
      const fill = (name, values) => { const el = form.elements[name], current = el.value; el.innerHTML = '<option value="">指定なし</option>' + [...new Set(values)].sort().map(v => `<option>${v}</option>`).join(""); el.value = current; };
      fill("subCategory", source.map(p => p.subCategory)); fill("manufacturer", source.map(p => p.manufacturer)); fill("purpose", source.flatMap(p => p.recommendedFor)); fill("feature", source.flatMap(p => p.features)); fill("tag", source.flatMap(p => p.tags));
      const config = categories.find(c => c.id === category);
      document.querySelector("[data-category-filter-note]").textContent = config ? `このカテゴリーで確認したい項目：${config.filters.join("・")}` : "カテゴリーを選ぶと、カテゴリー固有の確認項目を表示します。";
    };
    const applyQuery = () => { ["subCategory", "feature", "tag"].forEach(name => { const value = query.get(name); if (value && form.elements[name]) form.elements[name].value = value; }); };
    const render = () => {
      const f = new FormData(form); let result = products.filter(p => (!f.get("category") || p.category === f.get("category")) && (!f.get("subCategory") || p.subCategory === f.get("subCategory")) && (!f.get("manufacturer") || p.manufacturer === f.get("manufacturer")) && (!f.get("purpose") || p.recommendedFor.includes(f.get("purpose"))) && (!f.get("feature") || p.features.includes(f.get("feature"))) && (!f.get("tag") || p.tags.includes(f.get("tag"))));
      result.sort((a, b) => f.get("sort") === "updated" ? b.updatedAt.localeCompare(a.updatedAt) : f.get("sort") === "name" ? a.name.localeCompare(b.name, "ja") : Number(b.featured) - Number(a.featured));
      count.textContent = `${result.length}件の商品`; list.innerHTML = result.length ? result.map(card).join("") : '<div class="empty-state"><img src="assets/images/common/no-results.svg" width="360" height="220" alt="検索結果が見つからないことを表すイラスト"><h2>条件に合う商品がありません</h2><p>条件を減らしてお試しください。</p></div>';
    };
    categorySelect.addEventListener("change", () => { updateOptions(); render() }); form.addEventListener("change", render); form.addEventListener("reset", () => setTimeout(() => { updateOptions(); render() }, 0)); updateOptions(); applyQuery(); render();
  }
  const featured = document.querySelector("[data-featured-products]");
  if (featured) featured.innerHTML = products.filter(p => p.featured).slice(0, 4).map(card).join("");
  const compare = document.querySelector("[data-comparison]");
  if (compare) {
    const selected = products.filter(p => p.featured).slice(0, 4);
    const labels = [...new Set(selected.flatMap(p => p.specifications.map(s => s.label)))].slice(0, 4);
    const head = document.querySelector("[data-comparison-head]");
    if (head) head.innerHTML = `<tr><th>商品名</th><th>カテゴリー</th>${labels.map(l => `<th>${l}</th>`).join("")}<th>詳細</th></tr>`;
    compare.innerHTML = selected.map(p => `<tr><th scope="row">${p.name}</th><td>${categoryName(p.category)}</td>${labels.map(l => `<td>${(p.specifications.find(s => s.label === l) || {}).value || "情報未設定"}</td>`).join("")}<td><a href="product-detail.html?id=${p.id}">確認する</a></td></tr>`).join("");
  }
  const detail = document.querySelector("[data-product-detail]");
  if (detail) {
    const requestedId = new URLSearchParams(location.search).get("id");
    const p = products.find(x => x.id === requestedId);
    if (!p) {
      document.title = "商品が見つかりません｜CHOICE LAB";
      detail.innerHTML = `<section class="empty-state"><img src="${fallbackImage}" width="360" height="220" alt=""><h1>商品が見つかりません</h1><p>指定された商品は掲載されていないか、URLが変更された可能性があります。</p><div class="button-row"><a class="button" href="products.html">商品一覧へ戻る</a><a class="button button-secondary" href="index.html#categories">カテゴリーから探す</a></div></section>`;
      return;
    }
    document.title = `${p.name}｜${categoryName(p.category)}｜CHOICE LAB`;
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) descriptionMeta.content = `${p.name}の特徴、仕様、購入前に確認したいポイントを公開情報をもとに整理しています。`;
    const canonicalUrl = `https://adokisaragi.github.io/AffiliateWeb/product-detail.html?id=${encodeURIComponent(p.id)}`;
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = canonicalUrl;
    const setMeta = (selector, value) => {
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement("meta");
        const match = selector.match(/\[(property|name)="([^"]+)"\]/);
        meta.setAttribute(match[1], match[2]);
        document.head.append(meta);
      }
      meta.content = value;
    };
    setMeta('meta[property="og:title"]', `${p.name}｜CHOICE LAB`);
    setMeta('meta[property="og:description"]', p.shortDescription);
    setMeta('meta[property="og:url"]', canonicalUrl);
    setMeta('meta[name="twitter:title"]', `${p.name}｜CHOICE LAB`);
    setMeta('meta[name="twitter:description"]', p.shortDescription);
    const structuredData = document.createElement("script");
    structuredData.type = "application/ld+json";
    structuredData.textContent = JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"ホーム","item":"https://adokisaragi.github.io/AffiliateWeb/"},{"@type":"ListItem","position":2,"name":"商品一覧","item":"https://adokisaragi.github.io/AffiliateWeb/products.html"},{"@type":"ListItem","position":3,"name":p.name,"item":canonicalUrl}]});
    document.head.append(structuredData);
    const detailAffiliate = affiliateButtons(p);
    detail.innerHTML = `<div class="detail-hero"><div><div class="product-media">${productImage(p)}</div>${p.image.isProductPhoto === false ? '<p class="image-disclaimer">画像は商品の用途をイメージした当サイト独自のイラストです。実際の商品とは異なります。</p>' : ""}</div><div><div class="eyebrow">${categoryName(p.category)} / ${p.subCategory}</div><h1>${p.name}</h1><p class="lead">${p.description}</p>${officialLink(p)}</div></div>
    <section class="section compact"><h2>1. 商品の特徴</h2><ul class="check-list">${p.features.map(x => `<li>${x}</li>`).join("")}</ul></section>
    <section class="section compact"><h2>2. 商品仕様</h2><div class="spec-table"><dl>${p.specifications.map(s => `<div><dt>${s.label}</dt><dd>${s.value || "情報未設定"}</dd></div>`).join("")}</dl></div></section>
    <section class="section compact"><h2>3. 確認したいポイント</h2><ul>${p.advantages.map(x => `<li>${x}</li>`).join("")}</ul></section>
    <section class="section compact"><h2>4. 向いている可能性がある人</h2><ul>${p.recommendedFor.map(x => `<li>${x}</li>`).join("")}</ul></section>
    <section class="section compact caution-box detail-caution"><h2>5. 用途によって注意したい点</h2><ul>${p.considerations.map(x => `<li>${x}</li>`).join("")}</ul><p>ほかの商品も比較したい人：${p.notRecommendedFor.join("、")}</p></section>
    <section class="editorial-note"><h2>6. 情報の確認方針</h2><dl class="trust-list"><div><dt>確認元</dt><dd>メーカー公式情報、販売ページなどの公開情報</dd></div><div><dt>実機確認</dt><dd>なし（実際の使用感を検証したレビューではありません）</dd></div><div><dt>公開日</dt><dd><time datetime="${p.publishedAt || p.updatedAt}">${(p.publishedAt || p.updatedAt).replaceAll("-", "/")}</time></dd></div><div><dt>更新日</dt><dd><time datetime="${p.updatedAt}">${p.updatedAt.replaceAll("-", "/")}</time></dd></div></dl><p>商品情報は掲載時点の内容です。最新の価格、在庫、仕様、販売条件は販売ページとメーカー公式情報をご確認ください。</p></section>
    ${p.adFile ? suppliedAd(p) : (detailAffiliate ? `<section class="section compact"><h2>7. 販売ページ</h2>${detailAffiliate}</section>` : "")}`;
    detail.querySelectorAll(".supplied-ad iframe").forEach(enableExternalAdLinks);
  }
})();
