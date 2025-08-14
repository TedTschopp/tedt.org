/* ==========================================================
   Category Theme Initializer (Integrated)
   - Adds data-cat="<slug>" to .category-theme
   - Sets CSS variables for each category (colors, fonts, shadows)
   - Keeps your legacy font treatments & wild shadows
   ========================================================== */
// Category Theming Module (exports for potential reuse/testing)
(() => {
  // Build alias + palette from unified registry if present
  let EXPLICIT_ALIAS = {};
  let PALETTE = {};
  try {
    const regEl = document.getElementById('category-registry-data');
    if (regEl) {
      const registry = JSON.parse(regEl.textContent || '{}');
      for (const slug in registry) {
        const item = registry[slug];
        if (item.raw_names) {
          item.raw_names.forEach(rn => { if (rn) EXPLICIT_ALIAS[rn] = slug; });
        }
        if (item.class) EXPLICIT_ALIAS[item.class] = slug; // legacy class mapping
        if (item.palette) PALETTE[slug] = item.palette;
      }
    }
  } catch(_) {}

  function slugify(name){
    return name
      .normalize("NFKD").replace(/[\u0300-\u036f]/g,"")
      .replace(/&/g,"and")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g,"-")
      .replace(/(^-|-$)/g,"");
  }

  /* Per-category gradient + legacy font/shadow preferences */
  if (Object.keys(PALETTE).length === 0) {
    PALETTE = {
    "ai":                    { start:"#06b6d4", end:"#a78bfa" },

    "movies":                { start:"#eab308", end:"#f97316", fontTitle:'"Limelight","Times New Roman",Times,serif' },
    "bestiary":              { start:"#16a34a", end:"#f59e0b", fontTitle:'"Bestiary",sans-serif' },
    "monsters":              { start:"#ec4899", end:"#7e22ce", fontTitle:'"Bestiary",sans-serif' },

    "books":                 { start:"#6366f1", end:"#f43f5e", fontTitle:'"Cormorant Garamond","Times New Roman",Times,serif' },
    "communications":        { start:"#0ea5e9", end:"#06b6d4" },
    "computers":             { start:"#84cc16", end:"#22c55e", fontTitle:'"Checkbook",monospace' },

    "dcc": {
      start:"#eae221", end:"#ff001b",
      fontTitle:'"Duvall","Helvetica Neue",Helvetica,Arial,sans-serif',
      titleColor:"rgba(255,0,27,1)",
      titleShadow:'-2px -2px 0px rgba(234,226,33,1),2px 2px 0px rgba(234,226,33,1),2px -2px 0px rgba(234,226,33,1),-2px 2px 0px rgba(234,226,33,1),0px 2px 0px rgba(234,226,33,1),0px -2px 0px rgba(234,226,33,1),2px 0px 0px rgba(234,226,33,1),-2px 0px 0px rgba(234,226,33,1)',
      titleHoverShadow:'-2px -2px 0px rgba(234,226,33,1),2px 2px 0px rgba(234,226,33,1),2px -2px 0px rgba(234,226,33,1),-2px 2px 0px rgba(234,226,33,1),0px 2px 0px rgba(234,226,33,1),0px -2px 0px rgba(234,226,33,1),2px 0px 0px rgba(234,226,33,1),-2px 0px 0px rgba(234,226,33,1),-3px -3px 0px rgba(255,0,27,1),3px 3px 0px rgba(255,0,27,1),3px -3px 0px rgba(255,0,27,1),-3px 3px 0px rgba(255,0,27,1),0px 3px 0px rgba(255,0,27,1),0px -3px 0px rgba(255,0,27,1),3px 0px 0px rgba(255,0,27,1),-3px 0px 0px rgba(255,0,27,1)'
    },

    "dnd":                   { start:"#ef4444", end:"#eab308", fontTitle:'"Quentin","Souvenir Demi",serif' },
    "folklore":              { start:"#92400e", end:"#f59e0b", fontTitle:'"IM Fell DW Pica","Times New Roman",Times,serif', titleStyle:"italic" },
    "gamma-world": {
      start:"#dc143c", end:"#212529",
      fontTitle:'"lowwe","Helvetica Neue",Helvetica,Arial,sans-serif',
      titleColor:"#DC143C",
      titleShadow:'-3px -3px 0px rgba(255,0,27,0),3px 3px 0px rgba(255,0,27,0),3px -3px 0px rgba(255,0,27,0),-3px 3px 0px rgba(255,0,27,0),0px 3px 0px rgba(255,0,27,0),0px -3px 0px rgba(255,0,27,0),3px 0px 0px rgba(255,0,27,0),-3px 0px 0px rgba(255,0,27,0)',
      titleHoverShadow:'-3px -3px 0px rgba(255,0,27,1),3px 3px 0px rgba(255,0,27,1),3px -3px 0px rgba(255,0,27,1),-3px 3px 0px rgba(255,0,27,1),0px 3px 0px rgba(255,0,27,1),0px -3px 0px rgba(255,0,27,1),3px 0px 0px rgba(255,0,27,1),-3px 0px 0px rgba(255,0,27,1)',
      titleHoverColor:"#212529"
    },

    "gurps":                 { start:"#64748b", end:"#eab308", fontTitle:'"Egyptienne MN Condensed Bold",serif', titleTransform:"uppercase" },
    "home":                  { start:"#f472b6", end:"#f43f5e" },
    "maps":                  { start:"#14b8a6", end:"#22c55e", fontTitle:'"MedievalSharp"' },
    "middle-earth":          { start:"#166534", end:"#d97706", fontTitle:'"Ringbearer",serif' },
    "mobile":                { start:"#8b5cf6", end:"#0ea5e9", fontTitle:'"PalmPilot"' },
    "opinion":               { start:"#94a3b8", end:"#0ea5e9" },
    "personal-writing":      { start:"#f43f5e", end:"#a78bfa", fontTitle:'"Cedarville Cursive","Chalkduster","Comic Sans MS",cursive,sans-serif', titleSize:"1.5rem" },
    "philosophy":            { start:"#334155", end:"#6366f1" },
    "projects":              { start:"#3b82f6", end:"#22c55e" },
    "prompts":               { start:"#a78bfa", end:"#f472b6" },
    "quotes":                { start:"#06b6d4", end:"#3b82f6" },
    "religion":              { start:"#eab308", end:"#7e22ce" },
    "reprint":               { start:"#94a3b8", end:"#64748b", fontTitle:'"lp1_regular",monospace' },
    "role-playing-games":    { start:"#7e22ce", end:"#ef4444", fontTitle:'"IM Fell DW Pica","Times New Roman",Times,serif', titleStyle:"italic" },
    "science":               { start:"#0ea5e9", end:"#14b8a6" },
    "shadowrun":             { start:"#c9412f", end:"#000000", fontTitle:'"Shadowrun","Helvetica Neue",Helvetica,Arial,sans-serif' },
    "mutant-crawl-classics": {
      start:"#ffe205", end:"#018249",
      fontTitle:'"IrwinAllen","Helvetica Neue",Helvetica,Arial,sans-serif',
      titleColor:"rgba(1,130,73,1)",
      titleShadow:'-2px -2px 0px rgba(255,226,5,1),2px 2px 0px rgba(255,226,5,1),2px -2px 0px rgba(255,226,5,1),-2px 2px 0px rgba(255,226,5,1),0px 2px 0px rgba(255,226,5,1),0px -2px 0px rgba(255,226,5,1),2px 0px 0px rgba(255,226,5,1),-2px 0px 0px rgba(255,226,5,1)',
      titleHoverShadow:'-2px -2px 0px rgba(255,226,5,1),2px 2px 0px rgba(255,226,5,1),2px -2px 0px rgba(255,226,5,1),-2px 2px 0px rgba(255,226,5,1),0px 2px 0px rgba(255,226,5,1),0px -2px 0px rgba(255,226,5,1),2px 0px 0px rgba(255,226,5,1),-2px 0px 0px rgba(255,226,5,1),-3px -3px 0px rgba(1,130,73,1),3px 3px 0px rgba(1,130,73,1),3px -3px 0px rgba(1,130,73,1),-3px 3px 0px rgba(1,130,73,1),0px 3px 0px rgba(1,130,73,1),0px -3px 0px rgba(1,130,73,1),3px 0px 0px rgba(1,130,73,1),-3px 0px 0px rgba(1,130,73,1)'
    },
    "marchen-engine":        { start:"#a21caf", end:"#f59e0b", fontTitle:'"IM Fell DW Pica",serif', titleStyle:"italic" },
    "draft":                 { start:"#64748b", end:"#94a3b8", fontTitle:'"Fredericka the Great",serif' }
    };
  }

  function applyTheme(el, slug){
    const cfg = PALETTE[slug];
    if (!cfg) return;
                               el.dataset.cat = slug; // enables [data-cat="..."] CSS                               

                               el.style.setProperty("--theme-accent-start",       cfg.start);
                               el.style.setProperty("--theme-accent-end",         cfg.end);

    if (cfg.fontTitle)         el.style.setProperty("--theme-font-title",         cfg.fontTitle);
    if (cfg.titleSize)         el.style.setProperty("--theme-title-size",         cfg.titleSize);
    if (cfg.titleStyle)        el.style.setProperty("--theme-title-style",        cfg.titleStyle);
    if (cfg.titleTransform)    el.style.setProperty("--theme-title-transform",    cfg.titleTransform);
    if (cfg.titleColor)        el.style.setProperty("--theme-title-color",        cfg.titleColor);
    if (cfg.titleShadow)       el.style.setProperty("--theme-title-shadow",       cfg.titleShadow);
    if (cfg.titleHoverColor)   el.style.setProperty("--theme-title-hover-color",  cfg.titleHoverColor);
    if (cfg.titleHoverShadow)  el.style.setProperty("--theme-title-hover-shadow", cfg.titleHoverShadow);

    // Derive a badge border from end color for cohesion
    try {
      const border = hexToRgba(cfg.end, 0.35);
      el.style.setProperty("--theme-badge-border", border);
    } catch {}
  }

  function hexToRgba(hex, a){
    let h = hex.replace("#","");
    if (h.length === 3) h = h.split("").map(c => c+c).join("");
    const n = parseInt(h,16);
    const r = (n>>16)&255, g=(n>>8)&255, b=n&255;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  function toSlug(name){
    if (!name) return "ai";
    const trimmed = name.trim();
    if (EXPLICIT_ALIAS[trimmed]) return EXPLICIT_ALIAS[trimmed];
    return slugify(trimmed);
  }

  function init(){
    // 1. New unified wrappers
    document.querySelectorAll('.category-theme[data-category]').forEach(el => {
      const name = el.getAttribute('data-category');
      applyTheme(el, toSlug(name));
    });
    // 2. Legacy elements without wrapper but with known classes (fallback)
    const legacyClasses = Object.keys(EXPLICIT_ALIAS).concat(Object.keys(PALETTE));
    document.querySelectorAll('h1, h2, h3, span, div').forEach(el => {
      if (el.dataset.cat || el.closest('.category-theme')) return; // already processed or within wrapper
      for (const cls of el.classList) {
        if (legacyClasses.includes(cls) || legacyClasses.includes(cls.replace(/-Post$/,''))) {
          // Wrap legacy element in a .category-theme span for consistency
          const wrapper = document.createElement('span');
          wrapper.className = 'category-theme';
          const raw = cls.replace(/-Post$/,'');
            const slug = toSlug(raw.replace(/_/g,' '));
          wrapper.dataset.category = raw;
          applyTheme(wrapper, slug);
          el.parentNode.insertBefore(wrapper, el);
          wrapper.appendChild(el);
          break;
        }
      }
    });
    // 3. Emit a one-time console summary (debug)
    if (!window.__categoryThemeInitLogged) {
      window.__categoryThemeInitLogged = true;
      const themed = document.querySelectorAll('.category-theme[data-cat]').length;
      console.info(`[category-theme] Initialized ${themed} themed category wrapper(s)`);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once:true });
  } else {
    init();
  }

  // Expose helpers (Item 5)
  window.CategoryTheme = {
    applyTheme, toSlug, init,
    palette: PALETTE,
    alias: EXPLICIT_ALIAS
  };
})();