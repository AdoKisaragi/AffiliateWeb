(() => {
  "use strict";

  const slider = document.querySelector(".hero-art");
  if (!slider) return;

  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);

  const slides = (items, duplicate = false) => items.map((anime, index) => {
    const title = escapeHtml(anime.title);
    const thumbnail = escapeHtml(anime.thumbnail);
    const loading = !duplicate && index < 3 ? "eager" : "lazy";
    return `<div class="anime-hero-slide">
      <img src="${thumbnail}" alt="${duplicate ? "" : title}" width="1200" height="1499"
        loading="${loading}" decoding="async" draggable="false">
    </div>`;
  }).join("");

  fetch("../data/anime.json")
    .then(response => {
      if (!response.ok) throw new Error(`Hero anime data request failed: ${response.status}`);
      return response.json();
    })
    .then(data => {
      if (!Array.isArray(data)) throw new TypeError("Anime data must be an array.");
      const featured = data
        .filter(anime => anime && anime.featured === true && anime.title && anime.thumbnail)
        .sort((a, b) => Number(a.rank) - Number(b.rank));
      if (!featured.length) {
        slider.remove();
        return;
      }

      slider.className = "hero-art anime-hero-slider";
      slider.setAttribute("role", "region");
      slider.setAttribute("aria-label", "おすすめアニメ");
      slider.innerHTML = `<div class="anime-hero-track">
        <div class="anime-hero-set">${slides(featured)}</div>
        <div class="anime-hero-set" aria-hidden="true">${slides(featured, true)}</div>
      </div>`;
    })
    .catch(error => {
      console.error(error);
      slider.hidden = true;
    });
})();
