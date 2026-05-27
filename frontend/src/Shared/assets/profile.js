// profile.js - repository controls, color tones, and filtering UX

document.addEventListener("DOMContentLoaded", function () {
  const allIcons = Array.from(document.querySelectorAll("i.fas, i.fab"));
  allIcons.forEach((icon) => {
    icon.setAttribute("aria-hidden", "true");
  });

  const repoSection =
    document.querySelector(".repo-section") ||
    document.querySelector("section.border-t");
  if (!repoSection) return;

  const repoGrid =
    repoSection.querySelector(".repo-grid") ||
    repoSection.querySelector("div.mt-8.grid");
  if (!repoGrid) return;

  const articles = Array.from(repoGrid.querySelectorAll("article"));
  if (!articles.length) return;

  const toneMap = {
    FrontEnd: "border-blue-300/40 bg-blue-400/15 text-blue-100",
    Backend: "border-purple-300/40 bg-purple-400/15 text-purple-100",
    AI: "border-fuchsia-300/40 bg-fuchsia-400/15 text-fuchsia-100",
    Template: "border-purple-300/40 bg-purple-400/15 text-purple-100",
    Python: "border-blue-300/40 bg-blue-400/15 text-blue-100",
    TypeScript: "border-indigo-300/40 bg-indigo-400/15 text-indigo-100",
    "C#": "border-indigo-300/40 bg-indigo-400/15 text-indigo-100",
    Go: "border-blue-300/40 bg-blue-400/15 text-blue-100",
    React: "border-blue-300/40 bg-blue-400/15 text-blue-100",
    Angular: "border-pink-300/40 bg-pink-400/15 text-pink-100",
    "Node.js": "border-purple-300/40 bg-purple-400/15 text-purple-100",
    "Express.js": "border-purple-300/40 bg-purple-400/15 text-purple-100",
    Django: "border-purple-300/40 bg-purple-400/15 text-purple-100",
    Flask: "border-pink-300/40 bg-pink-400/15 text-pink-100",
    FastAPI: "border-blue-300/40 bg-blue-400/15 text-blue-100",
    Preact: "border-violet-300/40 bg-violet-400/15 text-violet-100",
    WXT: "border-fuchsia-300/40 bg-fuchsia-400/15 text-fuchsia-100",
    CLI: "border-indigo-300/40 bg-indigo-400/15 text-indigo-100",
    Tool: "border-blue-300/40 bg-blue-400/15 text-blue-100",
    Study: "border-pink-300/40 bg-pink-400/15 text-pink-100",
    Data: "border-fuchsia-300/40 bg-fuchsia-400/15 text-fuchsia-100",
  };

  function applyTone(el, tagText, fallbackClass) {
    const tone = toneMap[tagText] || fallbackClass;
    el.classList.remove(
      "border-white/10",
      "bg-white/5",
      "text-slate-200",
      "border-blue-400/20",
      "bg-blue-400/10",
      "text-blue-100",
    );
    tone.split(" ").forEach((cls) => el.classList.add(cls));
  }

  function normalizeTagColors() {
    articles.forEach((article) => {
      const isFeatured = article.dataset.featured === "true";

      const languageBadge = article.querySelector("div.items-start > span");
      if (languageBadge) {
        applyTone(
          languageBadge,
          languageBadge.textContent.trim(),
          "border-blue-300/40 bg-blue-400/15 text-blue-100",
        );
      }

      const tagSpans = Array.from(
        article.querySelectorAll("div.mt-3.flex.flex-wrap.gap-2 span"),
      );
      tagSpans.forEach((tag) => {
        applyTone(
          tag,
          tag.textContent.trim(),
          isFeatured
            ? "border-fuchsia-300/45 bg-fuchsia-400/18 text-fuchsia-100"
            : "border-slate-300/40 bg-slate-400/15 text-slate-100",
        );
      });

      if (isFeatured) {
        article.classList.add("ring-1", "ring-fuchsia-300/45");
      }
    });
  }

  function normalizeLinks() {
    const unifiedButtonClass = "action-button";

    const allBlankLinks = Array.from(
      document.querySelectorAll('a[target="_blank"]'),
    );
    allBlankLinks.forEach((link) => {
      link.rel = "noreferrer";
      if (!link.getAttribute("aria-label")) {
        link.setAttribute(
          "aria-label",
          `${link.textContent.trim()} (opens in a new tab)`,
        );
      }
    });

    articles.forEach((article) => {
      const linkGroup = article.querySelector("div.mt-5");
      if (!linkGroup) return;

      linkGroup.classList.remove("text-sm");
      linkGroup.classList.add(
        "flex",
        "flex-wrap",
        "gap-3",
        "text-sm",
        "font-semibold",
      );

      const links = Array.from(linkGroup.querySelectorAll("a"));
      const isFeatured = article.dataset.featured === "true";

      links.forEach((link) => {
        link.className = unifiedButtonClass;
      });

      if (isFeatured && links[0]) {
        links[0].className = unifiedButtonClass;
        links[0].innerHTML =
          '<i class="fas fa-rocket text-xs"></i> Launch Curriculum Tools';
      }
    });
  }

  function setupImageGallery() {
    const figureImages = Array.from(
      repoSection.querySelectorAll("article figure img"),
    );
    if (!figureImages.length) return { isOpen: () => false };

    const modal = document.createElement("div");
    modal.className = "repo-image-modal hidden";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Image gallery");

    const panel = document.createElement("div");
    panel.className = "repo-image-modal__panel";

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "repo-image-modal__close";
    closeBtn.setAttribute("aria-label", "Close gallery");
    closeBtn.innerHTML = "&times;";

    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "repo-image-modal__nav repo-image-modal__nav--prev";
    prevBtn.setAttribute("aria-label", "Previous image");
    prevBtn.innerHTML = "&#10094;";

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "repo-image-modal__nav repo-image-modal__nav--next";
    nextBtn.setAttribute("aria-label", "Next image");
    nextBtn.innerHTML = "&#10095;";

    const imageEl = document.createElement("img");
    imageEl.className = "repo-image-modal__image";
    imageEl.alt = "";

    const caption = document.createElement("p");
    caption.className = "repo-image-modal__caption";

    panel.append(closeBtn, prevBtn, imageEl, nextBtn, caption);
    modal.appendChild(panel);
    document.body.appendChild(modal);

    const style = document.createElement("style");
    style.textContent = `
      .repo-image-modal {
        position: fixed;
        inset: 0;
        background: rgba(2, 6, 23, 0.9);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
      }
      .repo-image-modal.hidden { display: none; }
      .repo-image-modal__panel {
        position: relative;
        width: min(1100px, 100%);
        max-height: calc(100vh - 48px);
        display: grid;
        grid-template-rows: 1fr auto;
        gap: 12px;
      }
      .repo-image-modal__image {
        width: 100%;
        max-height: calc(100vh - 140px);
        object-fit: contain;
        border-radius: 14px;
        border: 1px solid rgba(148, 163, 184, 0.3);
        background: rgba(15, 23, 42, 0.9);
      }
      .repo-image-modal__caption {
        margin: 0;
        text-align: center;
        color: #cbd5e1;
        font-size: 0.875rem;
      }
      .repo-image-modal__close,
      .repo-image-modal__nav {
        position: absolute;
        border: 1px solid rgba(148, 163, 184, 0.35);
        background: rgba(15, 23, 42, 0.78);
        color: #e2e8f0;
        cursor: pointer;
      }
      .repo-image-modal__close {
        top: 12px;
        right: 12px;
        width: 36px;
        height: 36px;
        border-radius: 999px;
        font-size: 1.4rem;
        line-height: 1;
      }
      .repo-image-modal__nav {
        top: 50%;
        transform: translateY(-50%);
        width: 40px;
        height: 40px;
        border-radius: 999px;
        font-size: 1.2rem;
      }
      .repo-image-modal__nav--prev { left: 12px; }
      .repo-image-modal__nav--next { right: 12px; }
      @media (max-width: 640px) {
        .repo-image-modal { padding: 12px; }
        .repo-image-modal__nav { width: 34px; height: 34px; }
      }
    `;
    document.head.appendChild(style);

    const galleryByArticle = new Map();
    const imageMeta = new Map();
    figureImages.forEach((img) => {
      const article = img.closest("article");
      if (!article) return;

      const figure = img.closest("figure");
      const captionText =
        figure?.querySelector("figcaption")?.textContent?.trim() ||
        img.alt ||
        "";

      if (!galleryByArticle.has(article)) {
        galleryByArticle.set(article, []);
      }

      const articleItems = galleryByArticle.get(article);
      const item = {
        src: img.currentSrc || img.src,
        alt: img.alt || captionText,
        caption: captionText,
      };
      articleItems.push(item);
      imageMeta.set(img, { article, index: articleItems.length - 1 });

      img.style.cursor = "zoom-in";
      if (!img.hasAttribute("tabindex")) {
        img.setAttribute("tabindex", "0");
      }
    });

    const state = {
      open: false,
      items: [],
      index: 0,
      lastFocused: null,
    };

    function render() {
      const item = state.items[state.index];
      if (!item) return;

      imageEl.src = item.src;
      imageEl.alt = item.alt || "";
      caption.textContent = item.caption || item.alt || "Repository preview";

      const showNav = state.items.length > 1;
      prevBtn.style.display = showNav ? "block" : "none";
      nextBtn.style.display = showNav ? "block" : "none";
    }

    function close() {
      state.open = false;
      modal.classList.add("hidden");
      document.body.style.overflow = "";
      if (state.lastFocused instanceof HTMLElement) {
        state.lastFocused.focus();
      }
    }

    function open(items, index, triggerEl) {
      state.open = true;
      state.items = items;
      state.index = index;
      state.lastFocused = triggerEl;
      render();
      modal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }

    function step(direction) {
      if (!state.items.length) return;
      state.index =
        (state.index + direction + state.items.length) % state.items.length;
      render();
    }

    figureImages.forEach((img) => {
      const openFromImage = (event) => {
        const meta = imageMeta.get(img);
        if (!meta) return;
        event.preventDefault();
        event.stopPropagation();
        const items = galleryByArticle.get(meta.article) || [];
        open(items, meta.index, img);
      };

      img.addEventListener("click", openFromImage);
      img.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          openFromImage(event);
        }
      });
    });

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", () => step(-1));
    nextBtn.addEventListener("click", () => step(1));

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        close();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (!state.open) return;
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      }
    });

    return {
      isOpen: () => state.open,
    };
  }

  normalizeTagColors();
  normalizeLinks();
  const imageGallery = setupImageGallery();

  const allTags = new Set();
  articles.forEach((article) => {
    const tagSpans = article.querySelectorAll(
      "div.mt-3.flex.flex-wrap.gap-2 span",
    );
    tagSpans.forEach((span) => allTags.add(span.textContent.trim()));
  });

  const sortedTags = Array.from(allTags).sort((a, b) => a.localeCompare(b));

  const controlsWrap = document.createElement("div");
  controlsWrap.className =
    "mt-6 rounded-2xl border border-white/10 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 p-4 shadow-xl shadow-slate-950/30";

  const searchRow = document.createElement("div");
  searchRow.className = "flex flex-col gap-3 md:flex-row md:items-center";

  const searchFieldWrap = document.createElement("label");
  searchFieldWrap.className =
    "flex flex-1 items-center gap-3 rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-slate-100 focus-within:border-blue-300/60";

  const searchIcon = document.createElement("i");
  searchIcon.className = "fas fa-magnifying-glass text-blue-200";

  const searchBar = document.createElement("input");
  searchBar.type = "search";
  searchBar.placeholder =
    "Search repositories, technologies, and descriptions...";
  searchBar.className =
    "w-full bg-transparent text-sm text-white placeholder-slate-400 outline-none";
  searchBar.setAttribute("aria-label", "Search repositories");
  searchBar.setAttribute("aria-describedby", "repository-results-count");

  const clearBtn = document.createElement("button");
  clearBtn.type = "button";
  clearBtn.className =
    "hidden rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-200 transition hover:bg-white/10";
  clearBtn.textContent = "Clear";
  clearBtn.setAttribute("aria-label", "Clear search input");

  const resultCount = document.createElement("div");
  resultCount.id = "repository-results-count";
  resultCount.className =
    "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.16em] text-slate-300";
  resultCount.setAttribute("role", "status");
  resultCount.setAttribute("aria-live", "polite");

  searchFieldWrap.append(searchIcon, searchBar, clearBtn);
  searchRow.append(searchFieldWrap, resultCount);

  const tagContainer = document.createElement("div");
  tagContainer.className = "mt-4 flex flex-wrap gap-2";

  const tagsToRender = ["All"].concat(sortedTags);
  tagsToRender.forEach((tag) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = tag;
    btn.dataset.tag = tag;
    btn.className =
      "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] transition";
    btn.setAttribute("aria-pressed", tag === "All" ? "true" : "false");

    if (tag === "All") {
      btn.classList.add("border-white/30", "bg-white/20", "text-white");
    } else {
      const tone =
        toneMap[tag] || "border-purple-300/35 bg-purple-400/15 text-purple-100";
      tone.split(" ").forEach((cls) => btn.classList.add(cls));
    }

    tagContainer.appendChild(btn);
  });

  controlsWrap.append(searchRow, tagContainer);

  const introParagraph = repoSection.querySelector("p.mt-4");
  if (introParagraph) {
    introParagraph.after(controlsWrap);
  } else {
    repoGrid.before(controlsWrap);
  }

  const emptyState = document.createElement("div");
  emptyState.className =
    "mt-8 hidden rounded-2xl border border-dashed border-white/20 bg-white/5 p-8 text-center";
  emptyState.innerHTML =
    '<p class="text-lg font-semibold text-white">No repositories found</p><p class="mt-2 text-sm text-slate-300">Try another keyword or clear the active tag.</p>';
  emptyState.setAttribute("role", "status");
  emptyState.setAttribute("aria-live", "polite");
  repoGrid.after(emptyState);

  let activeTag = "All";

  function updateActiveTagStyles() {
    const buttons = Array.from(tagContainer.querySelectorAll("button"));
    buttons.forEach((btn) => {
      if (btn.dataset.tag === activeTag) {
        btn.classList.add(
          "ring-2",
          "ring-white/70",
          "ring-offset-2",
          "ring-offset-slate-950",
        );
        btn.setAttribute("aria-pressed", "true");
      } else {
        btn.classList.remove(
          "ring-2",
          "ring-white/70",
          "ring-offset-2",
          "ring-offset-slate-950",
        );
        btn.setAttribute("aria-pressed", "false");
      }
    });
  }

  function updateCount(visible) {
    resultCount.textContent = `${visible} of ${articles.length} shown`;
  }

  function filterProjects() {
    const search = searchBar.value.trim().toLowerCase();
    let visibleCount = 0;

    articles.forEach((article) => {
      const text = article.textContent.toLowerCase();
      const tags = Array.from(
        article.querySelectorAll("div.mt-3.flex.flex-wrap.gap-2 span"),
      ).map((s) => s.textContent.trim());
      const matchesSearch = !search || text.includes(search);
      const matchesTag = activeTag === "All" || tags.includes(activeTag);
      const visible = matchesSearch && matchesTag;

      article.style.display = visible ? "" : "none";
      if (visible) visibleCount += 1;
    });

    clearBtn.classList.toggle("hidden", search.length === 0);
    updateCount(visibleCount);
    emptyState.classList.toggle("hidden", visibleCount !== 0);
  }

  searchBar.addEventListener("input", filterProjects);

  clearBtn.addEventListener("click", function () {
    searchBar.value = "";
    filterProjects();
    searchBar.focus();
  });

  tagContainer.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-tag]");
    if (!button) return;

    activeTag = button.dataset.tag;
    updateActiveTagStyles();
    filterProjects();
  });

  document.addEventListener("keydown", function (event) {
    if (imageGallery.isOpen()) return;

    const target = event.target;
    const typingInField =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      (target instanceof HTMLElement && target.isContentEditable);

    if (
      event.key === "/" &&
      document.activeElement !== searchBar &&
      !typingInField
    ) {
      event.preventDefault();
      searchBar.focus();
    }
  });

  updateActiveTagStyles();
  filterProjects();
});
