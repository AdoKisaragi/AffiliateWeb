(function(){
  "use strict";
  const categories=window.CHOICE_LAB_CATEGORIES||[],articles=window.CHOICE_LAB_ARTICLES||[],products=window.CHOICE_LAB_PRODUCTS||[];
  const categoryCards=document.querySelector("[data-category-list]");
  if(categoryCards) categoryCards.innerHTML=categories.slice(0,8).map(c=>`<a class="category-card" href="category.html?category=${c.id}" style="--category-accent:${c.accent}"><span class="category-icon">${c.icon}</span><strong>${c.name}</strong><small>${c.description}</small></a>`).join("");
  const articleList=document.querySelector("[data-article-list]");
  if(articleList) articleList.innerHTML=articles.map(a=>{const c=categories.find(x=>x.id===a.category);return `<article class="article-card"><div class="article-thumb">${c?c.icon:"ARTICLE"}</div><div class="article-body"><div class="eyebrow">${c?c.name:"記事"} / ${a.type}</div><h3>${a.title}</h3><p>${a.description}</p><time datetime="${a.updatedAt}">更新日 ${a.updatedAt.replaceAll("-","/")}</time><br><a class="text-link" href="${a.url}">記事を読む →</a></div></article>`}).join("");
  const categoryPage=document.querySelector("[data-category-page]");
  if(categoryPage){
    const id=new URLSearchParams(location.search).get("category")||categories[0].id,c=categories.find(x=>x.id===id)||categories[0];
    const relatedProducts=products.filter(p=>p.category===c.id),relatedArticles=articles.filter(a=>a.category===c.id);
    document.title=`${c.name}｜カテゴリー｜CHOICE LAB`;
    const description=document.querySelector('meta[name="description"]');
    if(description) description.content=c.description;
    categoryPage.innerHTML=`<header class="page-header"><div class="container"><nav class="breadcrumb"><a href="index.html">ホーム</a> / カテゴリー / ${c.name}</nav><div class="eyebrow">CATEGORY</div><h1>${c.name}</h1><p class="lead">${c.description}</p></div></header><section class="section"><div class="container"><div class="affiliate-box"><strong>広告について</strong><p>このページにはアフィリエイト広告が含まれます。最新情報は販売ページでご確認ください。</p></div><div class="section-head"><div><h2>選び方・比較記事</h2></div></div><div class="articles-grid">${relatedArticles.length?relatedArticles.map(a=>`<article class="article-card"><div class="article-body"><div class="eyebrow">${a.type}</div><h3>${a.title}</h3><p>${a.description}</p><a href="${a.url}">記事を読む →</a></div></article>`).join(""):"<p>記事は準備中です。</p>"}</div></div></section><section class="section section-soft"><div class="container"><div class="section-head"><div><h2>関連商品</h2></div></div><div class="product-list">${relatedProducts.map(p=>`<article class="simple-product"><img src="${p.image}" width="520" height="390" alt="${p.name}のプレースホルダー画像"><div><span>${p.subCategory}</span><h3>${p.name}</h3><p>${p.shortDescription}</p><a href="product-detail.html?id=${p.id}">商品情報を確認する →</a></div></article>`).join("")||"<p>商品情報は準備中です。</p>"}</div><h2>関連カテゴリー</h2><div class="need-grid">${categories.filter(x=>x.id!==c.id).slice(0,4).map(x=>`<a class="need-card" href="category.html?category=${x.id}">${x.name}</a>`).join("")}</div></div></section>`;
  }
})();
