(function(){
  "use strict";
  const categories=window.CHOICE_LAB_CATEGORIES||[],articles=window.CHOICE_LAB_ARTICLES||[],products=window.CHOICE_LAB_PRODUCTS||[];
  const fallback="assets/images/common/no-image.svg";
  const image=(src,alt,css="",lazy=true)=>`<img class="${css}" src="${src||fallback}" width="520" height="320" ${lazy?'loading="lazy" ':''}alt="${alt||""}" onerror="this.onerror=null;this.src='${fallback}'">`;
  const hero=document.querySelector(".hero-visual");
  if(hero) hero.innerHTML=image("assets/images/hero/choice-lab-hero.svg","スマートフォン、パソコン、生活用品、防災用品、旅行用品を組み合わせたイラスト","hero-illustration",false);
  const categoryCards=document.querySelector("[data-category-list]");
  if(categoryCards) categoryCards.innerHTML=categories.filter(c=>["gadget","pc","home-appliance","kitchen","daily","disaster","travel","work"].includes(c.id)).map(c=>`<a class="category-card" href="category.html?category=${c.id}" style="--category-accent:${c.accent}">${image(c.image,c.imageAlt,"category-image")}<strong>${c.name}</strong><small>${c.description}</small></a>`).join("");
  const articleList=document.querySelector("[data-article-list]");
  if(articleList) articleList.innerHTML=articles.map(a=>{const c=categories.find(x=>x.id===a.category);return `<article class="article-card">${image(c?.image,c?.imageAlt||"記事カテゴリーのイラスト","article-thumb-image")}<div class="article-body"><div class="eyebrow">${c?c.name:"記事"} / ${a.type}</div><h3>${a.title}</h3><p>${a.description}</p><time datetime="${a.updatedAt}">更新日 ${a.updatedAt.replaceAll("-","/")}</time><br><a class="text-link" href="${a.url}">記事を読む →</a></div></article>`}).join("");
  const categoryPage=document.querySelector("[data-category-page]");
  if(categoryPage){
    const id=new URLSearchParams(location.search).get("category")||categories[0].id,c=categories.find(x=>x.id===id)||categories[0];
    const relatedProducts=products.filter(p=>p.category===c.id&&p.image&&p.image.rightsConfirmed),relatedArticles=articles.filter(a=>a.category===c.id);
    document.title=`${c.name}｜カテゴリー｜CHOICE LAB`;
    const description=document.querySelector('meta[name="description"]');
    if(description) description.content=c.description;
    const gadgetSubcategories=[["充電器","charger.svg"],["モバイルバッテリー","mobile-battery.svg"],["スマホアクセサリー","smartphone-accessory.svg"],["イヤホン・オーディオ","audio.svg"],["その他","other-gadget.svg"]];
    const subcategorySection=c.id==="gadget"?`<section class="section compact"><div class="container"><div class="section-head"><div><h2>種類から確認する</h2></div><p>用途に近い種類から、確認したいポイントを整理できます。</p></div><div class="subcategory-grid">${gadgetSubcategories.map(([name,file])=>`<a href="products.html?category=gadget&subCategory=${encodeURIComponent(name)}">${image(`assets/images/subcategories/${file}`,`${name}を表すイラスト`,"subcategory-image")}<strong>${name}</strong></a>`).join("")}</div></div></section>`:"";
    const empty=(title)=>`<div class="visual-empty">${image("assets/images/common/coming-soon.svg","コンテンツを準備していることを表すイラスト","empty-image")}<p>${title}</p></div>`;
    categoryPage.innerHTML=`<header class="page-header category-header"><div class="container category-header-grid"><div><nav class="breadcrumb"><a href="index.html">ホーム</a> / カテゴリー / ${c.name}</nav><div class="eyebrow">CATEGORY</div><h1>${c.name}</h1><p class="lead">${c.description}</p></div>${image(c.image,c.imageAlt,"category-hero-image",false)}</div></header>${subcategorySection}<section class="section"><div class="container"><div class="affiliate-box"><strong>広告について</strong><p>当サイトは楽天アフィリエイトを利用しています。最新の販売情報は楽天市場でご確認ください。</p></div><div class="section-head"><div><h2>選び方・比較記事</h2></div></div><div class="articles-grid">${relatedArticles.length?relatedArticles.map(a=>`<article class="article-card"><div class="article-body"><div class="eyebrow">${a.type}</div><h3>${a.title}</h3><p>${a.description}</p><a href="${a.url}">記事を読む →</a></div></article>`).join(""):empty("記事は準備中です。")}</div></div></section><section class="section section-soft"><div class="container"><div class="section-head"><div><h2>関連商品</h2></div></div><div class="product-list">${relatedProducts.map(p=>`<article class="simple-product">${image(p.image.src,p.image.alt,"")}<div><span>${p.subCategory}</span><h3>${p.name}</h3><p>${p.shortDescription}</p><a href="product-detail.html?id=${p.id}">商品情報を確認する →</a></div></article>`).join("")||empty("商品情報は準備中です。")}</div><h2>関連カテゴリー</h2><div class="need-grid">${categories.filter(x=>x.id!==c.id).slice(0,4).map(x=>`<a class="need-card" href="category.html?category=${x.id}">${x.name}</a>`).join("")}</div></div></section>`;
  }
})();
