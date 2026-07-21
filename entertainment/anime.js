(() => {
  "use strict";

  const DATA_URL = "../data/anime.json";
  const list = document.querySelector("[data-anime-list]");
  const detail = document.querySelector("[data-anime-detail]");
  const count = document.querySelector("[data-anime-count]");
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
  const safeUrl = value => /^https?:\/\//.test(String(value || "")) ? escapeHtml(value) : "";
  const displayDate = value => value ? escapeHtml(value.replaceAll("-", "年").replace(/年(\d{2})年/, "年$1月").replace(/月(\d{2})$/, "月$1日")) : "";
  const image = (anime, eager = false) => `<img src="${escapeHtml(anime.thumbnail)}" alt="${escapeHtml(anime.title)}のキービジュアル" width="1200" height="1499" loading="${eager ? "eager" : "lazy"}" decoding="async">`;
  const detailUrl = anime => `anime-detail.html?title=${encodeURIComponent(anime.title)}`;
  const nonEmpty = value => value !== undefined && value !== null && value !== "";
  const pairs = entries => Object.entries(entries || {}).filter(([, value]) => nonEmpty(value));

  const card = anime => `<article class="anime-card product-card"><a class="anime-card__link" href="${detailUrl(anime)}" aria-label="${escapeHtml(anime.title)}の詳細を見る"><div class="anime-card__media product-media">${image(anime)}<span class="rank-badge">ランキング ${escapeHtml(anime.rank)}位</span></div><div class="anime-card__body product-body"><h2>${escapeHtml(anime.title)}</h2></div></a></article>`;
  const showError = (container, message) => {
    container.innerHTML = `<div class="anime-state" role="status"><h1>作品が見つかりません</h1><p>${escapeHtml(message)}</p><div class="buttons"><a class="button" href="anime.html">アニメ一覧へ戻る</a><a class="button secondary" href="./">Entertainmentトップへ戻る</a></div></div>`;
  };
  const listSection = (title, items, className = "detail-list") => Array.isArray(items) && items.length
    ? `<section class="anime-detail-section"><h2>${title}</h2><ul class="${className}">${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>` : "";
  const highlightsSection = items => Array.isArray(items) && items.length
    ? `<section class="anime-detail-section"><h2>見どころ</h2><div class="highlight-grid">${items.map(item => `<article><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></article>`).join("")}</div></section>` : "";
  const streamingSection = anime => {
    const services = Array.isArray(anime.streamingServices) ? anime.streamingServices : [];
    const cards = services.map(service => {
      const url = safeUrl(service.isAffiliate ? service.affiliateUrl : service.officialUrl);
      const details = [
        ["配信状況", service.status], ["配信開始日", service.startDate], ["更新", service.updateSchedule],
        ["無料配信期間", service.freePeriod], ["配信条件", service.exclusivity], ["情報確認日", service.checkedAt]
      ].filter(([, value]) => nonEmpty(value));
      return `<article class="streaming-card"><div class="streaming-card__head"><h3>${escapeHtml(service.name)}</h3>${service.type ? `<span class="streaming-type">${escapeHtml(service.type)}</span>` : ""}</div>${details.length ? `<dl>${details.map(([label, value]) => `<div><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl>` : ""}${service.note ? `<p>${escapeHtml(service.note)}</p>` : ""}${url ? `<a class="button secondary" href="${url}" target="_blank" rel="${service.isAffiliate ? "sponsored nofollow noopener noreferrer" : "noopener noreferrer"}">${escapeHtml(service.name)}の${service.isAffiliate ? "広告ページ" : "公式作品ページ"}を見る</a>${service.isAffiliate ? '<small class="ad-label">広告</small>' : ""}` : ""}</article>`;
    }).join("");
    return `<section id="streaming" class="anime-detail-section streaming-section"><h2>どこで見られる？</h2>${cards ? `<div class="streaming-grid">${cards}</div>` : '<div class="unverified-box"><p>現在、公式情報に基づく配信サービスを確認できていません。</p></div>'}<p class="streaming-notice">配信状況、料金、無料期間、見放題対象、配信話数は変更される場合があります。視聴前に各配信サービスの公式ページで最新情報をご確認ください。</p>${anime.streamingCheckedAt ? `<p class="checked-date">配信情報確認日：${displayDate(anime.streamingCheckedAt)}</p>` : ""}</section>`;
  };
  const creditsSection = (title, items) => Array.isArray(items) && items.length
    ? `<section class="anime-detail-section"><h2>${title}</h2><dl class="credit-list">${items.map(item => `<div><dt>${escapeHtml(item.role || item.character)}</dt><dd>${escapeHtml(item.name || item.actor)}</dd></div>`).join("")}</dl></section>` : "";
  const linksSection = links => Array.isArray(links) && links.length
    ? `<section class="anime-detail-section"><h2>公式リンク</h2><div class="official-links">${links.filter(link => safeUrl(link.url)).map(link => `<a href="${safeUrl(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)} <span aria-hidden="true">↗</span></a>`).join("")}</div></section>` : "";
  const relatedSection = (anime, all) => {
    const explicit = Array.isArray(anime.relatedTitles) ? anime.relatedTitles : [];
    const matches = all.filter(item => item.title !== anime.title && (explicit.includes(item.title) || item.genre === anime.genre)).slice(0, 3);
    return matches.length ? `<section class="anime-detail-section"><h2>関連作品</h2><div class="related-grid">${matches.map(item => `<a class="related-card" href="${detailUrl(item)}">${image(item)}<strong>${escapeHtml(item.title)}</strong><span>${explicit.includes(item.title) ? "シリーズ・関連作品" : `同じ「${escapeHtml(anime.genre)}」ジャンル`}</span></a>`).join("")}</div></section>` : "";
  };

  fetch(DATA_URL).then(response => {
    if (!response.ok) throw new Error(`Anime data request failed: ${response.status}`);
    return response.json();
  }).then(data => {
    if (!Array.isArray(data)) throw new TypeError("Anime data must be an array.");
    const animeList = data.filter(anime => anime && anime.title && anime.thumbnail).sort((a, b) => Number(a.rank) - Number(b.rank));
    if (list) {
      list.innerHTML = animeList.map(card).join("");
      if (count) count.textContent = `${animeList.length}作品`;
      if (!animeList.length) showError(list, "現在掲載している作品はありません。");
    }
    if (!detail) return;
    const requestedTitle = new URLSearchParams(location.search).get("title");
    const anime = animeList.find(item => item.title === requestedTitle);
    if (!anime) {
      document.title = "作品が見つかりません｜CHOICE LAB Entertainment";
      showError(detail, "指定された作品は掲載されていないか、URLが変更された可能性があります。");
      return;
    }

    const basicInfo = {
      "正式タイトル": anime.title, "タイトルの読み方": anime.titleReading, "英語タイトル": anime.englishTitle,
      "放送時期": anime.season, "放送開始日": anime.broadcastStart, "放送終了日": anime.broadcastEnd,
      "放送状況": anime.broadcastStatus, "話数": anime.episodes, "1話の時間": anime.episodeDuration,
      "ジャンル": anime.genre, "原作": anime.originalWork, "原作者": anime.originalAuthor,
      "出版社": anime.publisher, "掲載媒体": anime.publication, "アニメーション制作": anime.studio,
      "製作": anime.production, "年齢区分・注意事項": anime.contentRating
    };
    const facts = pairs(basicInfo);
    const summary = anime.shortDescription || anime.description;
    const overview = anime.overview || anime.description;
    const canonicalUrl = `https://adokisaragi.github.io/AffiliateWeb/entertainment/${detailUrl(anime)}`;
    document.title = `${anime.title}｜CHOICE LAB Entertainment`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", summary);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", canonicalUrl);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", anime.title);
    const jsonLd = document.createElement("script");
    jsonLd.type = "application/ld+json";
    jsonLd.textContent = JSON.stringify({"@context":"https://schema.org","@type":"Article",headline:anime.title,description:summary,image:anime.thumbnail,mainEntityOfPage:canonicalUrl,dateModified:anime.updatedAt,publisher:{"@type":"Organization",name:"図解アイテム研究所"}});
    document.head.append(jsonLd);

    detail.innerHTML = `<header class="anime-detail-hero"><div class="anime-detail-hero__copy"><div class="eyebrow">${escapeHtml(anime.genre)}</div><h1>${escapeHtml(anime.title)}</h1><p class="lead">${escapeHtml(summary)}</p><div class="hero-facts">${[["放送時期",anime.season],["放送状況",anime.broadcastStatus],["話数",anime.episodes],["制作",anime.studio]].filter(([,v])=>nonEmpty(v)).map(([l,v])=>`<div><span>${l}</span><strong>${escapeHtml(v)}</strong></div>`).join("")}</div><a class="button" href="#streaming">視聴できるサービスを見る</a></div><div class="anime-detail__media">${image(anime, true)}</div></header>
      ${facts.length ? `<section class="anime-detail-section"><h2>作品の基本情報</h2><dl class="basic-info">${facts.map(([label,value])=>`<div><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl></section>` : ""}
      <section class="anime-detail-section prose-section"><h2>このアニメはどんな作品？</h2><p>${escapeHtml(overview)}</p></section>
      ${listSection("こんな人におすすめ", anime.recommendedFor, "recommend-list")}
      ${highlightsSection(anime.highlights)}
      ${streamingSection(anime)}
      <div class="credits-grid">${creditsSection("スタッフ", anime.staff)}${creditsSection("主要キャスト", anime.cast)}</div>
      ${linksSection(anime.officialLinks)}
      ${relatedSection(anime, animeList)}
      ${Array.isArray(anime.spoilerSections) && anime.spoilerSections.length ? `<section class="anime-detail-section"><h2>ネタバレを含む内容</h2>${anime.spoilerSections.map(section => `<details><summary>${escapeHtml(section.title || anime.spoilerWarning || "内容を表示")}</summary><p>${escapeHtml(section.content)}</p></details>`).join("")}</section>` : ""}
      <section class="anime-detail-section disclosure"><h2>広告・情報について</h2><p>当ページはアフィリエイト広告を利用する場合があります。広告の有無にかかわらず、公式の公開情報を優先して整理します。</p>${anime.updatedAt || anime.streamingCheckedAt ? `<p>${anime.updatedAt ? `更新日：${displayDate(anime.updatedAt)}` : ""}${anime.updatedAt && anime.streamingCheckedAt ? "／" : ""}${anime.streamingCheckedAt ? `配信情報確認日：${displayDate(anime.streamingCheckedAt)}` : ""}</p>` : ""}</section>`;
  }).catch(error => {
    console.error(error);
    const target = list || detail;
    if (target) showError(target, "作品情報を読み込めませんでした。時間をおいて再度お試しください。");
  });
})();
