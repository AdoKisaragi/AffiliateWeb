(function(){
  "use strict";
  const products=(window.CHOICE_LAB_PRODUCTS||[]).filter(p=>p.published);
  const categories=window.CHOICE_LAB_CATEGORIES||[];
  const categoryName=id=>(categories.find(c=>c.id===id)||{}).name||id;
  const externalNotice='<p class="price-notice">リンク先は外部の販売サイトです。価格や在庫などの最新情報は販売ページでご確認ください。</p>';
  const links=p=>`<div class="shop-links"><a class="shop" href="${p.storeLinks.retailer}" rel="sponsored nofollow">Amazonで商品情報を見る</a><a class="shop" href="${p.storeLinks.partner}" rel="sponsored nofollow">販売ページを見る</a><a class="shop" href="${p.officialUrl}">公式情報を確認する</a></div>${externalNotice}`;
  const specs=(p,limit=3)=>p.specifications.slice(0,limit).map(s=>`<div><dt>${s.label}</dt><dd>${s.value||"情報未設定"}</dd></div>`).join("");
  const card=p=>`<article class="product-card"><div class="product-media"><img src="${p.image}" width="520" height="390" loading="lazy" alt="${p.name}のオリジナルプレースホルダー画像"></div><div class="product-body"><div class="eyebrow">${categoryName(p.category)} / ${p.manufacturer}</div><h3>${p.name}</h3><p class="editor-comment"><strong>商品情報</strong>${p.shortDescription}</p><dl class="spec-pills">${specs(p)}</dl><a class="button button-secondary" href="product-detail.html?id=${p.id}">商品情報を確認する</a>${links(p)}<p class="ad-note">販売サイトへのリンクはアフィリエイト広告です。</p></div></article>`;
  const list=document.querySelector("[data-product-list]");
  if(list){
    const form=document.querySelector("[data-filters]");
    const count=document.querySelector("[data-result-count]");
    const categorySelect=form.elements.category;
    categories.forEach(c=>categorySelect.insertAdjacentHTML("beforeend",`<option value="${c.id}">${c.name}</option>`));
    const query=new URLSearchParams(location.search),queryCategory=query.get("category");
    if(queryCategory) categorySelect.value=queryCategory;
    const updateOptions=()=>{
      const category=categorySelect.value;
      const source=products.filter(p=>!category||p.category===category);
      const fill=(name,values)=>{const el=form.elements[name],current=el.value;el.innerHTML='<option value="">指定なし</option>'+[...new Set(values)].sort().map(v=>`<option>${v}</option>`).join("");el.value=current;};
      fill("subCategory",source.map(p=>p.subCategory));fill("manufacturer",source.map(p=>p.manufacturer));fill("purpose",source.flatMap(p=>p.recommendedFor));fill("feature",source.flatMap(p=>p.features));fill("tag",source.flatMap(p=>p.tags));
      const config=categories.find(c=>c.id===category);
      document.querySelector("[data-category-filter-note]").textContent=config?`このカテゴリーで確認したい項目：${config.filters.join("・")}`:"カテゴリーを選ぶと、カテゴリー固有の確認項目を表示します。";
    };
    const applyQuery=()=>{["feature","tag"].forEach(name=>{const value=query.get(name);if(value&&form.elements[name])form.elements[name].value=value;});};
    const render=()=>{
      const f=new FormData(form);let result=products.filter(p=>(!f.get("category")||p.category===f.get("category"))&&(!f.get("subCategory")||p.subCategory===f.get("subCategory"))&&(!f.get("manufacturer")||p.manufacturer===f.get("manufacturer"))&&(!f.get("purpose")||p.recommendedFor.includes(f.get("purpose")))&&(!f.get("feature")||p.features.includes(f.get("feature")))&&(!f.get("tag")||p.tags.includes(f.get("tag"))));
      result.sort((a,b)=>f.get("sort")==="updated"?b.updatedAt.localeCompare(a.updatedAt):f.get("sort")==="name"?a.name.localeCompare(b.name,"ja"):Number(b.featured)-Number(a.featured));
      count.textContent=`${result.length}件の商品`;list.innerHTML=result.length?result.map(card).join(""):'<div class="empty-state"><h2>条件に合う商品がありません</h2><p>条件を減らしてお試しください。</p></div>';
    };
    categorySelect.addEventListener("change",()=>{updateOptions();render()});form.addEventListener("change",render);form.addEventListener("reset",()=>setTimeout(()=>{updateOptions();render()},0));updateOptions();applyQuery();render();
  }
  const featured=document.querySelector("[data-featured-products]");
  if(featured) featured.innerHTML=products.filter(p=>p.featured).slice(0,4).map(card).join("");
  const compare=document.querySelector("[data-comparison]");
  if(compare){
    const selected=products.filter(p=>p.featured).slice(0,4);
    const labels=[...new Set(selected.flatMap(p=>p.specifications.map(s=>s.label)))].slice(0,4);
    const head=document.querySelector("[data-comparison-head]");
    if(head) head.innerHTML=`<tr><th>商品名</th><th>カテゴリー</th>${labels.map(l=>`<th>${l}</th>`).join("")}<th>詳細</th></tr>`;
    compare.innerHTML=selected.map(p=>`<tr><th scope="row">${p.name}</th><td>${categoryName(p.category)}</td>${labels.map(l=>`<td>${(p.specifications.find(s=>s.label===l)||{}).value||"情報未設定"}</td>`).join("")}<td><a href="product-detail.html?id=${p.id}">確認する</a></td></tr>`).join("");
  }
  const detail=document.querySelector("[data-product-detail]");
  if(detail){
    const p=products.find(x=>x.id===new URLSearchParams(location.search).get("id"))||products[0];
    document.title=`${p.name}｜${categoryName(p.category)}｜CHOICE LAB`;
    detail.innerHTML=`<div class="detail-hero"><div class="product-media"><img src="${p.image}" width="520" height="390" alt="${p.name}のオリジナルプレースホルダー画像"></div><div><div class="eyebrow">${categoryName(p.category)} / ${p.subCategory}</div><h1>${p.name}</h1><p class="lead">${p.description}</p>${links(p)}<p class="ad-note">販売サイトへのリンクはアフィリエイト広告です。</p></div></div>
    <section class="section compact"><div class="two-column"><div><h2>商品の特徴</h2><ul class="check-list">${p.features.map(x=>`<li>${x}</li>`).join("")}</ul><h3>確認したいポイント</h3><ul>${p.advantages.map(x=>`<li>${x}</li>`).join("")}</ul></div><div class="caution-box"><h2>用途によって確認したい点</h2><ul>${p.considerations.map(x=>`<li>${x}</li>`).join("")}</ul></div></div></section>
    <section class="section compact"><div class="two-column"><div><h2>向いている可能性がある人</h2><ul>${p.recommendedFor.map(x=>`<li>${x}</li>`).join("")}</ul></div><div><h2>ほかの商品も比較したい人</h2><ul>${p.notRecommendedFor.map(x=>`<li>${x}</li>`).join("")}</ul></div></div></section>
    <section class="section compact"><h2>商品仕様</h2><div class="spec-table"><dl>${p.specifications.map(s=>`<div><dt>${s.label}</dt><dd>${s.value||"情報未設定"}</dd></div>`).join("")}</dl></div></section>
    <section class="editorial-note"><h2>掲載情報と免責事項</h2><p>この商品はサイト構築用の架空サンプルです。実在商品の使用体験や購入者レビューではありません。商品情報は掲載時点の内容であり、内容を保証するものではありません。最新情報は販売ページとメーカー公式情報をご確認ください。</p><p>更新日：<time datetime="${p.updatedAt}">${p.updatedAt.replaceAll("-","/")}</time></p></section>`;
  }
})();
