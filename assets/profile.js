// profile.js - repository controls, color tones, and filtering UX

document.addEventListener('DOMContentLoaded', function () {
  const allIcons = Array.from(document.querySelectorAll('i.fas, i.fab'));
  allIcons.forEach(icon => {
    icon.setAttribute('aria-hidden', 'true');
  });

  const repoSection = document.querySelector('.repo-section') || document.querySelector('section.border-t');
  if (!repoSection) return;

  const repoGrid = repoSection.querySelector('.repo-grid') || repoSection.querySelector('div.mt-8.grid');
  if (!repoGrid) return;

  const articles = Array.from(repoGrid.querySelectorAll('article'));
  if (!articles.length) return;

  const toneMap = {
    FrontEnd: 'border-blue-300/40 bg-blue-400/15 text-blue-100',
    Backend: 'border-purple-300/40 bg-purple-400/15 text-purple-100',
    AI: 'border-fuchsia-300/40 bg-fuchsia-400/15 text-fuchsia-100',
    Template: 'border-purple-300/40 bg-purple-400/15 text-purple-100',
    Python: 'border-blue-300/40 bg-blue-400/15 text-blue-100',
    TypeScript: 'border-indigo-300/40 bg-indigo-400/15 text-indigo-100',
    'C#': 'border-indigo-300/40 bg-indigo-400/15 text-indigo-100',
    Go: 'border-blue-300/40 bg-blue-400/15 text-blue-100',
    React: 'border-blue-300/40 bg-blue-400/15 text-blue-100',
    Angular: 'border-pink-300/40 bg-pink-400/15 text-pink-100',
    'Node.js': 'border-purple-300/40 bg-purple-400/15 text-purple-100',
    'Express.js': 'border-purple-300/40 bg-purple-400/15 text-purple-100',
    Django: 'border-purple-300/40 bg-purple-400/15 text-purple-100',
    Flask: 'border-pink-300/40 bg-pink-400/15 text-pink-100',
    FastAPI: 'border-blue-300/40 bg-blue-400/15 text-blue-100',
    Preact: 'border-violet-300/40 bg-violet-400/15 text-violet-100',
    WXT: 'border-fuchsia-300/40 bg-fuchsia-400/15 text-fuchsia-100',
    CLI: 'border-indigo-300/40 bg-indigo-400/15 text-indigo-100',
    Tool: 'border-blue-300/40 bg-blue-400/15 text-blue-100',
    Study: 'border-pink-300/40 bg-pink-400/15 text-pink-100',
    Data: 'border-fuchsia-300/40 bg-fuchsia-400/15 text-fuchsia-100',
  };

  function applyTone(el, tagText, fallbackClass) {
    const tone = toneMap[tagText] || fallbackClass;
    el.classList.remove('border-white/10', 'bg-white/5', 'text-slate-200', 'border-blue-400/20', 'bg-blue-400/10', 'text-blue-100');
    tone.split(' ').forEach(cls => el.classList.add(cls));
  }

  function normalizeTagColors() {
    articles.forEach(article => {
      const isFeatured = article.dataset.featured === 'true';

      const languageBadge = article.querySelector('div.items-start > span');
      if (languageBadge) {
        applyTone(languageBadge, languageBadge.textContent.trim(), 'border-blue-300/40 bg-blue-400/15 text-blue-100');
      }

      const tagSpans = Array.from(article.querySelectorAll('div.mt-3.flex.flex-wrap.gap-2 span'));
      tagSpans.forEach(tag => {
        applyTone(
          tag,
          tag.textContent.trim(),
          isFeatured
            ? 'border-fuchsia-300/45 bg-fuchsia-400/18 text-fuchsia-100'
            : 'border-slate-300/40 bg-slate-400/15 text-slate-100',
        );
      });

      if (isFeatured) {
        article.classList.add('ring-1', 'ring-fuchsia-300/45');
      }
    });
  }

  function normalizeLinks() {
    const allBlankLinks = Array.from(document.querySelectorAll('a[target="_blank"]'));
    allBlankLinks.forEach(link => {
      link.rel = 'noreferrer';
      if (!link.getAttribute('aria-label')) {
        link.setAttribute('aria-label', `${link.textContent.trim()} (opens in a new tab)`);
      }
    });

    articles.forEach(article => {
      const linkGroup = article.querySelector('div.mt-5');
      if (!linkGroup) return;

      linkGroup.classList.remove('text-sm');
      linkGroup.classList.add('flex', 'flex-wrap', 'gap-3', 'text-sm', 'font-semibold');

      const links = Array.from(linkGroup.querySelectorAll('a'));
      const isFeatured = article.dataset.featured === 'true';

      links.forEach(link => {
        link.className = 'inline-flex items-center gap-2 rounded-full border border-blue-300/35 bg-blue-400/15 px-3 py-1.5 text-blue-100 transition hover:-translate-y-0.5 hover:border-blue-200/70 hover:bg-blue-300/25 hover:text-white';

        if (isFeatured) {
          link.className = 'inline-flex items-center gap-2 rounded-full border border-fuchsia-300/45 bg-fuchsia-400/18 px-3 py-1.5 text-fuchsia-100 transition hover:-translate-y-0.5 hover:border-fuchsia-200/75 hover:bg-fuchsia-300/25 hover:text-white';
        }

        if (/pergamum-biblioteca\.pucpr\.br/i.test(link.href)) {
          link.className = 'inline-flex items-center gap-2 rounded-full border border-pink-300/45 bg-pink-400/18 px-3 py-1.5 text-pink-100 transition hover:-translate-y-0.5 hover:border-pink-200/70 hover:bg-pink-300/25 hover:text-white';
        }
      });

      if (isFeatured && links[0]) {
        links[0].className = 'inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-300/30 px-3 py-1.5 text-white transition hover:-translate-y-0.5 hover:border-blue-100/90 hover:bg-blue-200/35';
        links[0].innerHTML = '<i class="fas fa-rocket text-xs"></i> Launch Curriculum Tools';
      }
    });
  }

  normalizeTagColors();
  normalizeLinks();

  const allTags = new Set();
  articles.forEach(article => {
    const tagSpans = article.querySelectorAll('div.mt-3.flex.flex-wrap.gap-2 span');
    tagSpans.forEach(span => allTags.add(span.textContent.trim()));
  });

  const sortedTags = Array.from(allTags).sort((a, b) => a.localeCompare(b));

  const controlsWrap = document.createElement('div');
  controlsWrap.className = 'mt-6 rounded-2xl border border-white/10 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 p-4 shadow-xl shadow-slate-950/30';

  const searchRow = document.createElement('div');
  searchRow.className = 'flex flex-col gap-3 md:flex-row md:items-center';

  const searchFieldWrap = document.createElement('label');
  searchFieldWrap.className = 'flex flex-1 items-center gap-3 rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-slate-100 focus-within:border-blue-300/60';

  const searchIcon = document.createElement('i');
  searchIcon.className = 'fas fa-magnifying-glass text-blue-200';

  const searchBar = document.createElement('input');
  searchBar.type = 'search';
  searchBar.placeholder = 'Search repositories, technologies, and descriptions...';
  searchBar.className = 'w-full bg-transparent text-sm text-white placeholder-slate-400 outline-none';
  searchBar.setAttribute('aria-label', 'Search repositories');
  searchBar.setAttribute('aria-describedby', 'repository-results-count');

  const clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.className = 'hidden rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-200 transition hover:bg-white/10';
  clearBtn.textContent = 'Clear';
  clearBtn.setAttribute('aria-label', 'Clear search input');

  const resultCount = document.createElement('div');
  resultCount.id = 'repository-results-count';
  resultCount.className = 'rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.16em] text-slate-300';
  resultCount.setAttribute('role', 'status');
  resultCount.setAttribute('aria-live', 'polite');

  searchFieldWrap.append(searchIcon, searchBar, clearBtn);
  searchRow.append(searchFieldWrap, resultCount);

  const tagContainer = document.createElement('div');
  tagContainer.className = 'mt-4 flex flex-wrap gap-2';

  const tagsToRender = ['All'].concat(sortedTags);
  tagsToRender.forEach(tag => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = tag;
    btn.dataset.tag = tag;
    btn.className = 'rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] transition';
    btn.setAttribute('aria-pressed', tag === 'All' ? 'true' : 'false');

    if (tag === 'All') {
      btn.classList.add('border-white/30', 'bg-white/20', 'text-white');
    } else {
      const tone = toneMap[tag] || 'border-purple-300/35 bg-purple-400/15 text-purple-100';
      tone.split(' ').forEach(cls => btn.classList.add(cls));
    }

    tagContainer.appendChild(btn);
  });

  controlsWrap.append(searchRow, tagContainer);

  const introParagraph = repoSection.querySelector('p.mt-4');
  if (introParagraph) {
    introParagraph.after(controlsWrap);
  } else {
    repoGrid.before(controlsWrap);
  }

  const emptyState = document.createElement('div');
  emptyState.className = 'mt-8 hidden rounded-2xl border border-dashed border-white/20 bg-white/5 p-8 text-center';
  emptyState.innerHTML = '<p class="text-lg font-semibold text-white">No repositories found</p><p class="mt-2 text-sm text-slate-300">Try another keyword or clear the active tag.</p>';
  emptyState.setAttribute('role', 'status');
  emptyState.setAttribute('aria-live', 'polite');
  repoGrid.after(emptyState);

  let activeTag = 'All';

  function updateActiveTagStyles() {
    const buttons = Array.from(tagContainer.querySelectorAll('button'));
    buttons.forEach(btn => {
      if (btn.dataset.tag === activeTag) {
        btn.classList.add('ring-2', 'ring-white/70', 'ring-offset-2', 'ring-offset-slate-950');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('ring-2', 'ring-white/70', 'ring-offset-2', 'ring-offset-slate-950');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }

  function updateCount(visible) {
    resultCount.textContent = `${visible} of ${articles.length} shown`;
  }

  function filterProjects() {
    const search = searchBar.value.trim().toLowerCase();
    let visibleCount = 0;

    articles.forEach(article => {
      const text = article.textContent.toLowerCase();
      const tags = Array.from(article.querySelectorAll('div.mt-3.flex.flex-wrap.gap-2 span')).map(s => s.textContent.trim());
      const matchesSearch = !search || text.includes(search);
      const matchesTag = activeTag === 'All' || tags.includes(activeTag);
      const visible = matchesSearch && matchesTag;

      article.style.display = visible ? '' : 'none';
      if (visible) visibleCount += 1;
    });

    clearBtn.classList.toggle('hidden', search.length === 0);
    updateCount(visibleCount);
    emptyState.classList.toggle('hidden', visibleCount !== 0);
  }

  searchBar.addEventListener('input', filterProjects);

  clearBtn.addEventListener('click', function () {
    searchBar.value = '';
    filterProjects();
    searchBar.focus();
  });

  tagContainer.addEventListener('click', function (event) {
    const button = event.target.closest('button[data-tag]');
    if (!button) return;

    activeTag = button.dataset.tag;
    updateActiveTagStyles();
    filterProjects();
  });

  document.addEventListener('keydown', function (event) {
    const target = event.target;
    const typingInField =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      (target instanceof HTMLElement && target.isContentEditable);

    if (event.key === '/' && document.activeElement !== searchBar && !typingInField) {
      event.preventDefault();
      searchBar.focus();
    }
  });

  updateActiveTagStyles();
  filterProjects();
});
