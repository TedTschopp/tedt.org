
const viewportEl = document.getElementById('viewport');
const worldEl = document.getElementById('world');
const statusEl = document.getElementById('status');

const fontSelectEl = document.getElementById('fontSelect');
const loadLocalFontsBtnEl = document.getElementById('loadLocalFonts');
const fontHintEl = document.getElementById('fontHint');

const colorsListEl = document.getElementById('colorsList');
const addColorBtnEl = document.getElementById('addColorBtn');
const saveUrlBtnEl = document.getElementById('saveUrlBtn');
const actionMessageEl = document.getElementById('actionMessage');

const sourceUrlInputEl = document.getElementById('sourceUrlInput');
const analyzeSourceUrlBtnEl = document.getElementById('analyzeSourceUrlBtn');
const uploadSourceImageBtnEl = document.getElementById('uploadSourceImageBtn');
const sourceImageInputEl = document.getElementById('sourceImageInput');
const sourceDropZoneEl = document.getElementById('sourceDropZone');
const sourceStatusEl = document.getElementById('sourceStatus');
const contrastMatrixSummaryEl = document.getElementById('contrastMatrixSummary');
const contrastMatrixTableWrapEl = document.getElementById('contrastMatrixTableWrap');
const workbenchTabEls = Array.from(document.querySelectorAll('.workbenchTab'));
const workbenchPanelEls = Array.from(document.querySelectorAll('[data-workbench-panel]'));
const tokenFormatSelectEl = document.getElementById('tokenFormatSelect');
const tokenExportOutputEl = document.getElementById('tokenExportOutput');
const copyTokensBtnEl = document.getElementById('copyTokensBtn');
const roleMapperOutputEl = document.getElementById('roleMapperOutput');
const paletteAuditResultsEl = document.getElementById('paletteAuditResults');
const themeBuilderResultsEl = document.getElementById('themeBuilderResults');
const comparePaletteInputEl = document.getElementById('comparePaletteInput');
const paletteCompareResultsEl = document.getElementById('paletteCompareResults');
const visionSimulationOutputEl = document.getElementById('visionSimulationOutput');
const uiPreviewBoardEl = document.getElementById('uiPreviewBoard');
const imageSamplerCanvasEl = document.getElementById('imageSamplerCanvas');
const imageSamplerStatusEl = document.getElementById('imageSamplerStatus');
const addSampledColorBtnEl = document.getElementById('addSampledColorBtn');

const DEFAULT_SWATCH_FONT = 'sans-serif';
const SWATCH_FONT_STORAGE_KEY = 'tedt_color_chart_swatch_font';
const SOURCE_FETCH_TIMEOUT_MS = 8000;
const MAX_EXTRACTED_COLORS = 12;
const MAX_REMOTE_IMAGE_CANDIDATES = 5;
const CONTRAST_MATRIX_MAX_SHADES = 96;
const colorShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
const SHADE_DEDUPE_DISTANCE_BY_SHADE = {
    50: 16,
    100: 20,
    200: 24,
    300: 28,
    400: 30,
    500: 30,
    600: 30,
    700: 28,
    800: 24,
    900: 20,
    950: 16,
};
const SEMANTIC_ROLE_DEFINITIONS = [
    { key: 'primary', label: 'primary', scope: 'shared' },
    { key: 'accent', label: 'accent', scope: 'shared' },
    { key: 'danger', label: 'danger', scope: 'shared' },
    { key: 'warning', label: 'warning', scope: 'shared' },
    { key: 'success', label: 'success', scope: 'shared' },
    { key: 'focus', label: 'focus', scope: 'shared' },
    { key: 'background', label: 'background', scope: 'mode' },
    { key: 'surface', label: 'surface', scope: 'mode' },
    { key: 'text', label: 'text', scope: 'mode' },
    { key: 'border', label: 'border', scope: 'mode' },
];
const VISION_SIMULATIONS = [
    { name: 'Protanopia', matrix: [[0.567, 0.433, 0], [0.558, 0.442, 0], [0, 0.242, 0.758]] },
    { name: 'Deuteranopia', matrix: [[0.625, 0.375, 0], [0.7, 0.3, 0], [0, 0.3, 0.7]] },
    { name: 'Tritanopia', matrix: [[0.95, 0.05, 0], [0, 0.433, 0.567], [0, 0.475, 0.525]] },
    { name: 'Achromatopsia', matrix: [[0.299, 0.587, 0.114], [0.299, 0.587, 0.114], [0.299, 0.587, 0.114]] },
    { name: 'Grayscale', matrix: [[0.2126, 0.7152, 0.0722], [0.2126, 0.7152, 0.0722], [0.2126, 0.7152, 0.0722]] },
];

const fontCatalog = [
    // Browser-generic defaults (defined by the user agent)
    { group: 'Default', label: 'Sans-serif', css: 'sans-serif' },
    { group: 'Default', label: 'Serif', css: 'serif' },
    { group: 'Default', label: 'Monospace', css: 'monospace' },
    { group: 'Default', label: 'Cursive', css: 'cursive' },
    { group: 'Default', label: 'Fantasy', css: 'fantasy' },
    { group: 'Default', label: 'System UI', css: 'system-ui' },
    { group: 'Default', label: 'UI Sans-serif', css: 'ui-sans-serif, sans-serif' },
    { group: 'Default', label: 'UI Serif', css: 'ui-serif, serif' },
    { group: 'Default', label: 'UI Monospace', css: 'ui-monospace, monospace' },

    // Google fonts (loaded via /css/consolidated-fonts.css)
    { group: 'Google Fonts', label: 'Cal Sans', css: '"Cal Sans", ' + DEFAULT_SWATCH_FONT },
    { group: 'Google Fonts', label: 'Titillium Web', css: '"Titillium Web", ' + DEFAULT_SWATCH_FONT },
    { group: 'Google Fonts', label: 'Inter', css: 'Inter, ' + DEFAULT_SWATCH_FONT },
    { group: 'Google Fonts', label: 'Inter Tight', css: '"Inter Tight", ' + DEFAULT_SWATCH_FONT },
    { group: 'Google Fonts', label: 'Libre Franklin', css: '"Libre Franklin", ' + DEFAULT_SWATCH_FONT },
    { group: 'Google Fonts', label: 'IBM Plex Sans', css: '"IBM Plex Sans", ' + DEFAULT_SWATCH_FONT },
    { group: 'Google Fonts', label: 'Space Grotesk', css: '"Space Grotesk", ' + DEFAULT_SWATCH_FONT },
    { group: 'Google Fonts', label: 'Source Sans Pro', css: '"Source Sans Pro", ' + DEFAULT_SWATCH_FONT },
    { group: 'Google Fonts', label: 'Merriweather Sans', css: '"Merriweather Sans", ' + DEFAULT_SWATCH_FONT },
    { group: 'Google Fonts', label: 'Oswald', css: 'Oswald, ' + DEFAULT_SWATCH_FONT },
    { group: 'Google Fonts', label: 'Rajdhani', css: 'Rajdhani, ' + DEFAULT_SWATCH_FONT },
    { group: 'Google Fonts', label: 'Roboto', css: 'Roboto, ' + DEFAULT_SWATCH_FONT },

    { group: 'Google Fonts', label: 'Fira Code', css: '"Fira Code", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' },
    { group: 'Google Fonts', label: 'Share Tech Mono', css: '"Share Tech Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' },
    { group: 'Google Fonts', label: 'Press Start 2P', css: '"Press Start 2P", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' },

    { group: 'Google Fonts', label: 'Arsenal', css: 'Arsenal, "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'Google Fonts', label: 'Cinzel', css: 'Cinzel, "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'Google Fonts', label: 'Cinzel Decorative', css: '"Cinzel Decorative", "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'Google Fonts', label: 'Cormorant Garamond', css: '"Cormorant Garamond", "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'Google Fonts', label: 'EB Garamond', css: '"EB Garamond", "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'Google Fonts', label: 'Crimson Pro', css: '"Crimson Pro", "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'Google Fonts', label: 'Libre Baskerville', css: '"Libre Baskerville", "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'Google Fonts', label: 'Cardo', css: 'Cardo, "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'Google Fonts', label: 'Quattrocento', css: 'Quattrocento, "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'Google Fonts', label: 'Playfair Display', css: '"Playfair Display", "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'Google Fonts', label: 'Old Standard TT', css: '"Old Standard TT", "Palatino", "Book Antiqua", Georgia, serif' },

    { group: 'Google Fonts', label: 'Spectral SC', css: '"Spectral SC", "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'Google Fonts', label: 'IM Fell DW Pica', css: '"IM Fell DW Pica", "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'Google Fonts', label: 'IM Fell English', css: '"IM Fell English", "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'Google Fonts', label: 'Alice', css: 'Alice, "Palatino", "Book Antiqua", Georgia, serif' },

    { group: 'Google Fonts', label: 'MedievalSharp', css: 'MedievalSharp, "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'Google Fonts', label: 'Limelight', css: 'Limelight, "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'Google Fonts', label: 'Orbitron', css: 'Orbitron, ' + DEFAULT_SWATCH_FONT },
    { group: 'Google Fonts', label: 'Audiowide', css: 'Audiowide, ' + DEFAULT_SWATCH_FONT },
    { group: 'Google Fonts', label: 'Special Elite', css: '"Special Elite", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' },
    { group: 'Google Fonts', label: 'Bangers', css: 'Bangers, ' + DEFAULT_SWATCH_FONT },
    { group: 'Google Fonts', label: 'Noto Sans Runic', css: '"Noto Sans Runic", ' + DEFAULT_SWATCH_FONT },

    { group: 'Google Fonts', label: 'Sofia Sans', css: '"Sofia Sans", ' + DEFAULT_SWATCH_FONT },
    { group: 'Google Fonts', label: 'Sofia Sans Condensed', css: '"Sofia Sans Condensed", ' + DEFAULT_SWATCH_FONT },
    { group: 'Google Fonts', label: 'Sofia Sans Semi Condensed', css: '"Sofia Sans Semi Condensed", ' + DEFAULT_SWATCH_FONT },
    { group: 'Google Fonts', label: 'Sofia Sans Extra Condensed', css: '"Sofia Sans Extra Condensed", ' + DEFAULT_SWATCH_FONT },

    { group: 'Google Fonts', label: 'Architects Daughter', css: '"Architects Daughter", ' + DEFAULT_SWATCH_FONT },
    { group: 'Google Fonts', label: 'Cedarville Cursive', css: '"Cedarville Cursive", ' + DEFAULT_SWATCH_FONT },
    { group: 'Google Fonts', label: 'Fondamento', css: 'Fondamento, "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'Google Fonts', label: 'Fredericka the Great', css: '"Fredericka the Great", "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'Google Fonts', label: 'Lovers Quarrel', css: '"Lovers Quarrel", "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'Google Fonts', label: 'Marcellus', css: 'Marcellus, "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'Google Fonts', label: 'Patrick Hand', css: '"Patrick Hand", ' + DEFAULT_SWATCH_FONT },
    { group: 'Google Fonts', label: 'Kalam', css: 'Kalam, ' + DEFAULT_SWATCH_FONT },

    { group: 'Google Fonts', label: 'UnifrakturCook', css: 'UnifrakturCook, "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'Google Fonts', label: 'UnifrakturMaguntia', css: 'UnifrakturMaguntia, "Palatino", "Book Antiqua", Georgia, serif' },

    // Local / hosted fonts (loaded via /css/consolidated-fonts.css)
    { group: 'TedT.org', label: 'Optima', css: 'Optima, "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'TedT.org', label: 'Optima Titling', css: '"Optima Titling", Optima, "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'TedT.org', label: 'Manuka', css: 'Manuka, ' + DEFAULT_SWATCH_FONT },
    { group: 'TedT.org', label: 'Manuka Condensed', css: 'ManukaCondensed, ' + DEFAULT_SWATCH_FONT },
    { group: 'TedT.org', label: 'Manuka Slab', css: 'ManukaSlab, "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'TedT.org', label: 'PalmPilot', css: 'PalmPilot, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' },
    { group: 'TedT.org', label: 'Bestiary', css: 'Bestiary, "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'TedT.org', label: 'Shadowrun', css: 'Shadowrun, ' + DEFAULT_SWATCH_FONT },
    { group: 'TedT.org', label: 'Checkbook', css: 'Checkbook, ' + DEFAULT_SWATCH_FONT },
    { group: 'TedT.org', label: 'Dana Library Hand', css: '"Dana Library Hand", ' + DEFAULT_SWATCH_FONT },
    { group: 'TedT.org', label: 'Duvall', css: 'Duvall, "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'TedT.org', label: 'GameEmpire', css: 'GameEmpire, "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'TedT.org', label: 'IrwinAllen', css: 'IrwinAllen, "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'TedT.org', label: 'lp1_regular', css: 'lp1_regular, ' + DEFAULT_SWATCH_FONT },
    { group: 'TedT.org', label: 'lowwe', css: 'lowwe, "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'TedT.org', label: 'UngerFrakturZierbuchstaben', css: 'UngerFrakturZierbuchstaben, "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'TedT.org', label: 'CedarvilleCursive', css: 'CedarvilleCursive, ' + DEFAULT_SWATCH_FONT },
    { group: 'TedT.org', label: 'coelnische_current_fraktur', css: 'coelnische_current_fraktur, "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'TedT.org', label: 'strassburgfraktur', css: 'strassburgfraktur, "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'TedT.org', label: 'SkennertonFraktur', css: 'SkennertonFraktur, "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'TedT.org', label: 'Hillal', css: 'Hillal, ' + DEFAULT_SWATCH_FONT },
    { group: 'TedT.org', label: 'AntiquarianScribe', css: 'AntiquarianScribe, "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'TedT.org', label: 'TerraIgnota', css: 'TerraIgnota, "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'TedT.org', label: 'Quentin', css: 'Quentin, "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'TedT.org', label: 'Souvenir Demi', css: '"Souvenir Demi", "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'TedT.org', label: 'Egyptienne MN Condensed Bold', css: '"Egyptienne MN Condensed Bold", "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'TedT.org', label: 'Ringbearer', css: 'Ringbearer, "Palatino", "Book Antiqua", Georgia, serif' },
    { group: 'TedT.org', label: 'tschopp-housemark-optimum (icons)', css: '"tschopp-housemark-optimum", ' + DEFAULT_SWATCH_FONT },
];

let localFontsLoaded = false;

function supportsLocalFontAccessApi() {
    return ('queryLocalFonts' in window) && (window.isSecureContext || location.hostname === 'localhost');
}

function setLocalFontHint(text, isError = false) {
    if (!fontHintEl) return;
    fontHintEl.style.color = isError ? 'var(--bs-danger-text-emphasis)' : 'var(--bs-body-color)';
    fontHintEl.innerHTML = text;
}

function quoteFontFamily(fontFamily) {
    const safe = String(fontFamily || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return `"${safe}"`;
}

function getFirstFontFamily(fontCss) {
    const css = String(fontCss || '').trim();
    if (!css) return '';
    // Extract first family token (handles quoted family names).
    if (css.startsWith('"') || css.startsWith("'")) {
        const quote = css[0];
        const end = css.indexOf(quote, 1);
        if (end > 1) return css.slice(0, end + 1);
        return '';
    }
    const comma = css.indexOf(',');
    const token = (comma >= 0 ? css.slice(0, comma) : css).trim();
    return token;
}

function scheduleNormalizeAfterFontLoad(fontCss) {
    const family = getFirstFontFamily(fontCss);
    if (!family || !document.fonts || !document.fonts.load) return;

    // Try a couple of shorthands that match our usage (bold 12pt/16pt).
    const probes = [
        `700 12pt ${family}`,
        `700 16pt ${family}`,
    ];

    Promise.allSettled(probes.map(p => document.fonts.load(p)))
        .then(() => scheduleNormalizeColorBoxes())
        .catch(() => {
            // Ignore font loading errors.
        });
}

function applySwatchFont(fontCss) {
    const value = (fontCss && String(fontCss).trim().length > 0) ? fontCss : DEFAULT_SWATCH_FONT;
    document.documentElement.style.setProperty('--swatch-font-family', value);
    fontSelectEl.style.fontFamily = value;
    worldEl.style.fontFamily = value;
    const chartEl = worldEl.querySelector('[data-color-chart]');
    if (chartEl) chartEl.style.fontFamily = value;

    // Font metrics affect wrapping; re-normalize box layout after change.
    scheduleNormalizeColorBoxes();

    // Re-normalize again once the selected font is actually available.
    scheduleNormalizeAfterFontLoad(value);
}

let normalizeColorBoxesRaf = 0;

function scheduleNormalizeColorBoxes() {
    if (normalizeColorBoxesRaf) cancelAnimationFrame(normalizeColorBoxesRaf);
    normalizeColorBoxesRaf = requestAnimationFrame(() => {
        normalizeColorBoxesRaf = 0;
        normalizeColorBoxes();
    });
}

function normalizeColorBoxes() {
    const boxes = Array.from(worldEl.querySelectorAll('.color-box'));
    if (boxes.length === 0) return;

    const measureHeight = (el) => {
        // offsetHeight is not affected by CSS transforms (e.g., world scale),
        // which prevents runaway min-height calculations when zoomed.
        const h = (el && typeof el.offsetHeight === 'number') ? el.offsetHeight : 0;
        if (h > 0) return h;
        // Fallback for edge cases.
        const rect = el?.getBoundingClientRect?.();
        return rect ? rect.height : 0;
    };

    const preferredSlots = [
        'title',
        'subtitle',
        'hex',
        'rgb',
        'cmyk',
        'hls',
        'wcagWhite',
        'wcagBlack',
        'sample',
    ];

    // Cover *all* defined slots so future fields stay aligned automatically.
    const discovered = new Set();
    for (const box of boxes) {
        for (const el of Array.from(box.querySelectorAll('[data-slot]'))) {
            const slot = el?.dataset?.slot;
            if (slot) discovered.add(slot);
        }
    }
    const slots = [
        ...preferredSlots.filter(s => discovered.has(s)),
        ...Array.from(discovered).filter(s => !preferredSlots.includes(s)).sort((a, b) => a.localeCompare(b)),
    ];

    // Clear any previous normalization so measurements reflect intrinsic layout.
    for (const box of boxes) {
        box.style.minHeight = '';
        for (const slot of slots) {
            const el = box.querySelector(`[data-slot="${slot}"]`);
            if (el) el.style.minHeight = '';
        }
    }

    const maxBySlot = Object.fromEntries(slots.map(s => [s, 0]));
    for (const box of boxes) {
        for (const slot of slots) {
            const el = box.querySelector(`[data-slot="${slot}"]`);
            if (!el) continue;
            maxBySlot[slot] = Math.max(maxBySlot[slot], measureHeight(el));
        }
    }

    for (const box of boxes) {
        for (const slot of slots) {
            const el = box.querySelector(`[data-slot="${slot}"]`);
            if (!el) continue;
            const h = Math.ceil(maxBySlot[slot]);
            if (h > 0) el.style.minHeight = `${h}px`;
        }
    }

    // Ensure every box has the same overall height too.
    let maxBoxHeight = 0;
    for (const box of boxes) {
        maxBoxHeight = Math.max(maxBoxHeight, measureHeight(box));
    }
    maxBoxHeight = Math.ceil(maxBoxHeight);
    for (const box of boxes) {
        if (maxBoxHeight > 0) box.style.minHeight = `${maxBoxHeight}px`;
    }
}

function getOrCreateOptgroup(label) {
    const existing = Array.from(fontSelectEl.children).find(el => el.tagName === 'OPTGROUP' && el.label === label);
    if (existing) return existing;
    const optGroupEl = document.createElement('optgroup');
    optGroupEl.label = label;
    fontSelectEl.appendChild(optGroupEl);
    return optGroupEl;
}

async function tryLoadInstalledLocalFonts() {
    if (localFontsLoaded) return;
    localFontsLoaded = true;

    // Local Font Access API (Chromium-based browsers). Requires secure context + permission.
    if (!supportsLocalFontAccessApi()) {
        setLocalFontHint('Installed fonts unavailable here. Requires secure context + browser support.');
        return;
    }

    try {
        // If Permissions API is available, hint at permission state.
        try {
            if (navigator.permissions && navigator.permissions.query) {
                const result = await navigator.permissions.query({ name: 'local-fonts' });
                if (result && result.state === 'denied') {
                    setLocalFontHint('Local font access is denied in this browser profile.', true);
                    return;
                }
            }
        } catch {
            // Ignore permission query failures (not consistently implemented).
        }

        const localFonts = await window.queryLocalFonts();
        const families = Array.from(new Set(localFonts.map(f => f.family).filter(Boolean))).sort((a, b) => a.localeCompare(b));
        if (families.length === 0) return;

        const localGroup = getOrCreateOptgroup('Installed');

        // Remove placeholder (if present).
        Array.from(localGroup.children)
            .filter(el => el.tagName === 'OPTION' && el.dataset && el.dataset.placeholder === 'installed')
            .forEach(el => el.remove());

        const fragment = document.createDocumentFragment();

        for (const family of families) {
            const optionEl = document.createElement('option');
            optionEl.value = `${quoteFontFamily(family)}, ${DEFAULT_SWATCH_FONT}`;
            optionEl.textContent = family;
            fragment.appendChild(optionEl);
        }

        localGroup.appendChild(fragment);
        setLocalFontHint(`Loaded ${families.length} installed font families via Local Font Access API.`);
    } catch {
        // User denied or API error; keep dropdown usable.
        setLocalFontHint('Unable to load installed fonts (permission denied or unsupported).', true);
    }
}

function setupFontDropdown() {
    const groups = new Map();
    for (const font of fontCatalog) {
        if (!groups.has(font.group)) groups.set(font.group, []);
        groups.get(font.group).push(font);
    }

    // Alphabetize within each group by label.
    for (const [groupName, fonts] of groups.entries()) {
        fonts.sort((a, b) => String(a.label).localeCompare(String(b.label), undefined, { sensitivity: 'base' }));
        groups.set(groupName, fonts);
    }

    fontSelectEl.innerHTML = '';

    const preferredOrder = ['Default', 'Installed', 'TedT.org', 'Google Fonts'];
    const orderedGroups = [
        ...preferredOrder,
        ...Array.from(groups.keys()).filter(name => !preferredOrder.includes(name)),
    ];

    for (const groupName of orderedGroups) {
        const fonts = groups.get(groupName) || [];
        const optGroupEl = document.createElement('optgroup');
        optGroupEl.label = groupName;

        if (groupName === 'Installed' && fonts.length === 0) {
            const placeholderEl = document.createElement('option');
            placeholderEl.disabled = true;
            placeholderEl.textContent = '— Click “Load installed fonts” —';
            placeholderEl.dataset.placeholder = 'installed';
            optGroupEl.appendChild(placeholderEl);
        }

        fonts.forEach((font) => {
            const optionEl = document.createElement('option');
            optionEl.value = font.css;
            optionEl.textContent = font.label;
            optionEl.style.fontFamily = font.css;
            optGroupEl.appendChild(optionEl);
        });

        fontSelectEl.appendChild(optGroupEl);
    }

    const saved = localStorage.getItem(SWATCH_FONT_STORAGE_KEY);
    const initialValue = (saved && saved.trim().length > 0) ? saved : DEFAULT_SWATCH_FONT;

    // If the saved value isn't in the list, fall back cleanly.
    const optionToSelect = Array.from(fontSelectEl.options).find(o => o.value === initialValue);
    if (optionToSelect) {
        fontSelectEl.value = initialValue;
    } else {
        fontSelectEl.value = DEFAULT_SWATCH_FONT;
    }

    applySwatchFont(fontSelectEl.value);

    fontSelectEl.addEventListener('change', () => {
        applySwatchFont(fontSelectEl.value);
        scheduleRenderChart();
        try {
            localStorage.setItem(SWATCH_FONT_STORAGE_KEY, fontSelectEl.value);
        } catch {
            // Ignore storage errors (private browsing, quota, etc.)
        }
    });

    // Populate installed fonts when supported, on a user gesture.
    fontSelectEl.addEventListener('pointerdown', () => {
        void tryLoadInstalledLocalFonts();
    }, { passive: true });

    if (loadLocalFontsBtnEl) {
        loadLocalFontsBtnEl.disabled = !supportsLocalFontAccessApi();
        loadLocalFontsBtnEl.addEventListener('click', () => {
            void tryLoadInstalledLocalFonts();
        });
    }

    if (!supportsLocalFontAccessApi()) {
        setLocalFontHint('Installed fonts unavailable in this context. Requires Local Font Access API support, a secure context (HTTPS or localhost), and user permission.');
    }
}

setupFontDropdown();

const viewState = {
    x: 0,
    y: 0,
    scale: 1,
    minScale: 0.25,
    maxScale: 4,
    panStep: 120,
    showStatus: true,
};

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function applyTransform() {
    worldEl.style.transform = `translate(${viewState.x}px, ${viewState.y}px) scale(${viewState.scale})`;
    if (viewState.showStatus) {
        statusEl.textContent = `Zoom: ${Math.round(viewState.scale * 100)}%\nOffset: ${Math.round(viewState.x)}, ${Math.round(viewState.y)}`;
        statusEl.style.display = 'block';
    } else {
        statusEl.style.display = 'none';
    }
}

function zoomAboutPoint(newScale, clientX, clientY) {
    const oldScale = viewState.scale;
    newScale = clamp(newScale, viewState.minScale, viewState.maxScale);
    if (newScale === oldScale) return;

    const worldX = (clientX - viewState.x) / oldScale;
    const worldY = (clientY - viewState.y) / oldScale;
    viewState.scale = newScale;
    viewState.x = clientX - worldX * newScale;
    viewState.y = clientY - worldY * newScale;
    applyTransform();
}

function centerChart() {
    // Center based on the chart container's intrinsic size.
    const chart = worldEl.querySelector('[data-color-chart]');
    if (!chart) return;
    const vw = viewportEl.clientWidth;
    const vh = viewportEl.clientHeight;
    const contentW = chart.scrollWidth;
    const contentH = chart.scrollHeight;
    viewState.x = Math.round((vw - contentW * viewState.scale) / 2);
    viewState.y = Math.round((vh - contentH * viewState.scale) / 2);
    applyTransform();
}

function resetView() {
    viewState.scale = 1;
    viewState.x = 0;
    viewState.y = 0;
    applyTransform();
    // If chart exists, center it.
    centerChart();
}

function panBy(dx, dy) {
    viewState.x += dx;
    viewState.y += dy;
    applyTransform();
}

// Buttons
document.getElementById('zoomIn').addEventListener('click', () => {
    zoomAboutPoint(viewState.scale * 1.15, viewportEl.clientWidth / 2, viewportEl.clientHeight / 2);
});
document.getElementById('zoomOut').addEventListener('click', () => {
    zoomAboutPoint(viewState.scale / 1.15, viewportEl.clientWidth / 2, viewportEl.clientHeight / 2);
});
document.getElementById('reset').addEventListener('click', resetView);

document.getElementById('panLeft').addEventListener('click', () => panBy(-viewState.panStep, 0));
document.getElementById('panRight').addEventListener('click', () => panBy(viewState.panStep, 0));
document.getElementById('panUp').addEventListener('click', () => panBy(0, -viewState.panStep));
document.getElementById('panDown').addEventListener('click', () => panBy(0, viewState.panStep));
document.getElementById('panCenter').addEventListener('click', centerChart);
document.getElementById('toggleStatus').addEventListener('click', () => {
    viewState.showStatus = !viewState.showStatus;
    applyTransform();
});

// Drag to pan
let isDragging = false;
let lastX = 0;
let lastY = 0;

viewportEl.addEventListener('pointerdown', (e) => {
    // Avoid stealing clicks from buttons.
    if (e.target && (e.target.closest && e.target.closest('#controls'))) return;

    // Prevent the browser from starting a text selection while panning.
    e.preventDefault();

    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    document.body.classList.add('is-panning');
    viewportEl.setPointerCapture(e.pointerId);
});

viewportEl.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    panBy(dx, dy);
});

viewportEl.addEventListener('pointerup', () => {
    isDragging = false;
    document.body.classList.remove('is-panning');
});
viewportEl.addEventListener('pointercancel', () => {
    isDragging = false;
    document.body.classList.remove('is-panning');
});

// Wheel to zoom (trackpad friendly)
viewportEl.addEventListener('wheel', (e) => {
    // Let users scroll page if we ever stop using fixed fullscreen.
    e.preventDefault();
    const direction = e.deltaY > 0 ? -1 : 1;
    const factor = direction > 0 ? 1.12 : 1 / 1.12;
    zoomAboutPoint(viewState.scale * factor, e.clientX, e.clientY);
}, { passive: false });

// Keyboard shortcuts
window.addEventListener('keydown', (e) => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT')) return;
    const step = e.shiftKey ? viewState.panStep * 2 : viewState.panStep;
    switch (e.key) {
        case 'ArrowLeft':
            panBy(-step, 0);
            break;
        case 'ArrowRight':
            panBy(step, 0);
            break;
        case 'ArrowUp':
            panBy(0, -step);
            break;
        case 'ArrowDown':
            panBy(0, step);
            break;
        case '+':
        case '=':
            zoomAboutPoint(viewState.scale * 1.15, viewportEl.clientWidth / 2, viewportEl.clientHeight / 2);
            break;
        case '-':
        case '_':
            zoomAboutPoint(viewState.scale / 1.15, viewportEl.clientWidth / 2, viewportEl.clientHeight / 2);
            break;
        case '0':
            resetView();
            break;
    }
});

window.addEventListener('resize', () => {
    // Keep the chart roughly centered on resize.
    centerChart();
});

function getUrlParameters() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    let colorParameter = null;

    // Check for any form of the letter 'C' in the URL (case-insensitive)
    for (const [key, value] of urlSearchParams.entries()) {
        if (key.toLowerCase() === 'c') {
            colorParameter = value;
            break;
        }
    }

    if (colorParameter) {
        const decodedColorParameter = decodeURIComponent(colorParameter.trim().toLowerCase());
        if (decodedColorParameter === 'ted' || decodedColorParameter === 'teds') {
            return [
                // Tedt.org/s old colors
                //  { hex: '#b1b3b3' },
                //  { hex: '#101820' },
                //  { hex: '#00446f' },
                //  { hex: '#e86027' },
                //  { hex: '#00a9e0' },
                //  { hex: '#007bff' },
                //  { hex: '#f2bc57' },
                //  { hex: '#6f1a07' },
                //  { hex: '#00b339' },
                //  { hex: '#f2bc57' },
                //  { hex: '#f90041' },

                { hex: '#0EA6CC' },
                { hex: '#C73A28' },
                { hex: '#E66626' },
                { hex: '#FBAA5A' },
                { hex: '#1A89C7' },
                { hex: '#B73858' },
                { hex: '#00B339' }

            ];
        }
        // Accept # and non-# hex colors, 3, 6, or 8 digits
        const hexColorArray = decodedColorParameter.split(',').map(color => {
            color = color.trim();
            // Add # if missing
            if (!color.startsWith('#') && /^[0-9a-f]{3,8}$/i.test(color)) {
                color = `#${color}`;
            }
            // Expand 3-digit hex to 6-digit
            if (/^#[0-9a-f]{3}$/i.test(color)) {
                color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
            }
            // Convert 8-digit hex to rgba()
            if (/^#[0-9a-f]{8}$/i.test(color)) {
                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);
                const a = parseInt(color.slice(7, 9), 16) / 255;
                return { hex: color, rgba: `rgba(${r},${g},${b},${a.toFixed(2)})` };
            }
            return { hex: color };
        });
        // Validate all colors are either 6 or 8 digit hex
        if (hexColorArray.every(c => /^#[0-9a-f]{6}$/i.test(c.hex) || /^#[0-9a-f]{8}$/i.test(c.hex))) {
            return hexColorArray;
        }
    }
    return null;
}

function getOriginalCParamValue() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    for (const [key, value] of urlSearchParams.entries()) {
        if (key.toLowerCase() === 'c') return value;
    }
    return null;
}

const initialColors = (getUrlParameters() || [
    { hex: '#00664F' },
    { hex: '#FED141' },
    { hex: '#707372' },
    { hex: '#101820' },
    { hex: '#53565A' },
    { hex: '#B1B3B3' },
    { hex: '#006269' },
    { hex: '#00A9E0' },
    { hex: '#3CDBC0' },
    { hex: '#D2D755' },
    { hex: '#658D1B' },
    { hex: '#E87722' },
    { hex: '#F0B323' },
    { hex: '#722257' },
]);

const originalCParamRaw = getOriginalCParamValue();
const originalCParamDecodedLower = originalCParamRaw ? decodeURIComponent(String(originalCParamRaw).trim()).toLowerCase() : '';
let preservePresetC = (originalCParamDecodedLower === 'ted' || originalCParamDecodedLower === 'teds');

const colorNameCache = new Map();

function normalizeHex6(hex) {
    const raw = String(hex || '').trim();
    if (!raw) return '#000000';
    let value = raw.startsWith('#') ? raw : `#${raw}`;
    value = value.toUpperCase();
    if (/^#[0-9A-F]{3}$/.test(value)) {
        value = `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
    }
    if (/^#[0-9A-F]{8}$/.test(value)) {
        // Color input doesn't support alpha; keep RGB portion.
        value = value.slice(0, 7);
    }
    if (!/^#[0-9A-F]{6}$/.test(value)) return '#000000';
    return value;
}

let activeColors = initialColors.map(c => ({ hex: normalizeHex6(c.hex) }));
let activeWorkbenchTab = 'contrastMatrix';
let semanticRoleAssignments = { shared: {}, light: {}, dark: {} };
let latestSampledHex = null;
const imageSamplerState = {
    image: null,
    label: '',
    context: null,
    scaleX: 1,
    scaleY: 1,
};

function getShadeColors(hex) {
    return {
        50: tinycolor(hex).clone().lighten(45).toHexString(),
        100: tinycolor(hex).clone().lighten(40).toHexString(),
        200: tinycolor(hex).clone().lighten(30).toHexString(),
        300: tinycolor(hex).clone().lighten(20).toHexString(),
        400: tinycolor(hex).clone().lighten(10).toHexString(),
        500: tinycolor(hex).toHexString(),
        600: tinycolor(hex).clone().darken(10).toHexString(),
        700: tinycolor(hex).clone().darken(20).toHexString(),
        800: tinycolor(hex).clone().darken(30).toHexString(),
        900: tinycolor(hex).clone().darken(40).toHexString(),
        950: tinycolor(hex).clone().darken(45).toHexString(),
    };
}

function getColorMetrics(hex) {
    const normalizedHex = normalizeHex6(hex);
    const rgb = tinycolor(normalizedHex).toRgb();
    const hls = tinycolor(normalizedHex).toHsl();
    return {
        hex: normalizedHex,
        rgb: { r: rgb.r, g: rgb.g, b: rgb.b },
        hls: {
            h: Math.round(hls.h),
            s: Math.round(hls.s * 100),
            l: Math.round(hls.l * 100),
        },
        cmyk: convertRgbToCmyk(rgb.r, rgb.g, rgb.b),
    };
}

function getContrastReport(foregroundHex, backgroundHex) {
    const foreground = getColorMetrics(foregroundHex);
    const background = getColorMetrics(backgroundHex);
    const ratio = parseFloat(calculateContrastRatio(
        [foreground.rgb.r, foreground.rgb.g, foreground.rgb.b],
        [background.rgb.r, background.rgb.g, background.rgb.b]
    ));
    return {
        foregroundHex: foreground.hex,
        backgroundHex: background.hex,
        ratio,
        aaLarge: ratio >= 3,
        aaNormal: ratio >= 4.5,
        aaaLarge: ratio >= 4.5,
        aaaNormal: ratio >= 7,
    };
}

function getReadableTextColor(backgroundHex) {
    const whiteContrast = getContrastReport('#FFFFFF', backgroundHex).ratio;
    const blackContrast = getContrastReport('#000000', backgroundHex).ratio;
    return whiteContrast >= blackContrast ? '#FFFFFF' : '#000000';
}

function getPaletteShadeRecords(colors) {
    const records = [];
    for (const color of colors || []) {
        const raw = typeof color === 'string' ? color : color?.hex;
        const baseHex = normalizeHex6(raw);
        const shades = getShadeColors(baseHex);
        for (const shade of colorShades) {
            const shadeHex = normalizeHex6(shades[shade]);
            records.push({
                baseHex,
                shade,
                ...getColorMetrics(shadeHex),
                textColor: getReadableTextColor(shadeHex),
                contrastWithWhite: getContrastReport('#FFFFFF', shadeHex).ratio,
                contrastWithBlack: getContrastReport('#000000', shadeHex).ratio,
            });
        }
    }
    return records;
}

function getContrastBadgeLabel(report) {
    if (report.aaaNormal) return 'AAA';
    if (report.aaNormal) return 'AA';
    if (report.aaLarge) return 'Large';
    return 'Fail';
}

function getShadeDisplayName(record) {
    return `${record.baseHex} ${record.shade}`;
}

function renderContrastMatrix() {
    if (!contrastMatrixSummaryEl || !contrastMatrixTableWrapEl) return;

    const allRecords = getPaletteShadeRecords(activeColors);
    const records = allRecords.slice(0, CONTRAST_MATRIX_MAX_SHADES);
    const isCapped = records.length < allRecords.length;

    contrastMatrixSummaryEl.textContent = `${records.length} shades, ${records.length * records.length} pairings${isCapped ? ` (showing first ${CONTRAST_MATRIX_MAX_SHADES})` : ''}.`;
    contrastMatrixTableWrapEl.innerHTML = '';

    const tableEl = document.createElement('table');
    tableEl.className = 'contrastMatrix';

    const theadEl = document.createElement('thead');
    const headerRowEl = document.createElement('tr');
    const cornerEl = document.createElement('th');
    cornerEl.className = 'shadeHeader';
    cornerEl.scope = 'col';
    cornerEl.textContent = 'Text / Background';
    headerRowEl.appendChild(cornerEl);

    for (const record of records) {
        const thEl = document.createElement('th');
        thEl.scope = 'col';
        thEl.textContent = getShadeDisplayName(record);
        thEl.style.backgroundColor = record.hex;
        thEl.style.color = record.textColor;
        headerRowEl.appendChild(thEl);
    }

    theadEl.appendChild(headerRowEl);
    tableEl.appendChild(theadEl);

    const tbodyEl = document.createElement('tbody');
    for (const foreground of records) {
        const rowEl = document.createElement('tr');
        const rowHeaderEl = document.createElement('th');
        rowHeaderEl.className = 'shadeHeader';
        rowHeaderEl.scope = 'row';
        rowHeaderEl.textContent = getShadeDisplayName(foreground);
        rowHeaderEl.style.backgroundColor = foreground.hex;
        rowHeaderEl.style.color = foreground.textColor;
        rowEl.appendChild(rowHeaderEl);

        for (const background of records) {
            const report = getContrastReport(foreground.hex, background.hex);
            const tdEl = document.createElement('td');
            tdEl.style.backgroundColor = background.hex;
            tdEl.style.color = getReadableTextColor(background.hex);

            const ratioEl = document.createElement('span');
            ratioEl.textContent = `${report.ratio.toFixed(2)}:1`;
            tdEl.appendChild(ratioEl);

            const badgeEl = document.createElement('span');
            const badgeLabel = getContrastBadgeLabel(report);
            badgeEl.className = `contrastBadge ${report.aaNormal ? 'pass' : 'fail'}`;
            badgeEl.textContent = badgeLabel;
            tdEl.appendChild(badgeEl);

            rowEl.appendChild(tdEl);
        }

        tbodyEl.appendChild(rowEl);
    }

    tableEl.appendChild(tbodyEl);
    contrastMatrixTableWrapEl.appendChild(tableEl);
}

function getRecordKey(record) {
    return `${record.baseHex}|${record.shade}|${record.hex}`;
}

function getActiveShadeRecords() {
    return getPaletteShadeRecords(activeColors);
}

function getPaletteTokenEntries() {
    const entries = [];
    activeColors.forEach((color, colorIndex) => {
        const baseHex = normalizeHex6(color.hex);
        const shadeColors = getShadeColors(baseHex);
        for (const shade of colorShades) {
            entries.push({
                name: `color-${colorIndex}-${shade}`,
                baseName: `color-${colorIndex}`,
                shade,
                hex: normalizeHex6(shadeColors[shade]),
            });
        }
    });
    return entries;
}

function formatDesignTokens(format) {
    const entries = getPaletteTokenEntries();
    if (format === 'json') {
        const tokens = {};
        for (const entry of entries) {
            if (!tokens[entry.baseName]) tokens[entry.baseName] = {};
            tokens[entry.baseName][entry.shade] = { value: entry.hex, type: 'color' };
        }
        return JSON.stringify(tokens, null, 2);
    }
    if (format === 'scss') {
        const lines = ['$colors: ('];
        for (const entry of entries) lines.push(`  "${entry.name}": ${entry.hex},`);
        lines.push(');');
        return lines.join('\n');
    }
    if (format === 'tailwind') {
        const grouped = [];
        activeColors.forEach((color, colorIndex) => {
            const shadeColors = getShadeColors(color.hex);
            grouped.push(`        color${colorIndex}: {`);
            for (const shade of colorShades) grouped.push(`          ${shade}: '${normalizeHex6(shadeColors[shade])}',`);
            grouped.push('        },');
        });
        return ['module.exports = {', '  theme: {', '    extend: {', '      colors: {', ...grouped, '      }', '    }', '  }', '};'].join('\n');
    }
    if (format === 'bootstrap') {
        const lightRoles = getResolvedRoleColors('light');
        const darkRoles = getResolvedRoleColors('dark');
        return [
            ':root {',
            `  --bs-primary: ${lightRoles.primary?.hex || entries[5]?.hex || '#000000'};`,
            `  --bs-secondary: ${lightRoles.accent?.hex || entries[16]?.hex || '#6c757d'};`,
            `  --bs-body-bg: ${lightRoles.background?.hex || '#ffffff'};`,
            `  --bs-body-color: ${lightRoles.text?.hex || '#000000'};`,
            `  --bs-border-color: ${lightRoles.border?.hex || '#dee2e6'};`,
            `  --bs-danger: ${lightRoles.danger?.hex || '#dc3545'};`,
            `  --bs-warning: ${lightRoles.warning?.hex || '#ffc107'};`,
            `  --bs-success: ${lightRoles.success?.hex || '#198754'};`,
            '}',
            '',
            '[data-bs-theme="dark"] {',
            `  --bs-primary: ${darkRoles.primary?.hex || lightRoles.primary?.hex || '#0d6efd'};`,
            `  --bs-secondary: ${darkRoles.accent?.hex || lightRoles.accent?.hex || '#6c757d'};`,
            `  --bs-body-bg: ${darkRoles.background?.hex || '#000000'};`,
            `  --bs-body-color: ${darkRoles.text?.hex || '#ffffff'};`,
            `  --bs-border-color: ${darkRoles.border?.hex || '#495057'};`,
            `  --bs-danger: ${darkRoles.danger?.hex || lightRoles.danger?.hex || '#dc3545'};`,
            `  --bs-warning: ${darkRoles.warning?.hex || lightRoles.warning?.hex || '#ffc107'};`,
            `  --bs-success: ${darkRoles.success?.hex || lightRoles.success?.hex || '#198754'};`,
            '}',
        ].join('\n');
    }
    return [':root {', ...entries.map(entry => `  --${entry.name}: ${entry.hex};`), '}'].join('\n');
}

function renderTokenExporter() {
    if (!tokenExportOutputEl || !tokenFormatSelectEl) return;
    tokenExportOutputEl.value = formatDesignTokens(tokenFormatSelectEl.value || 'css');
}

function findBestRecord(records, predicate, fallbackIndex = 0) {
    return records.find(predicate) || records[fallbackIndex] || records[0];
}

function ensureSemanticRoleAssignments() {
    const records = getActiveShadeRecords();
    if (records.length === 0) return;
    const recordKeys = new Set(records.map(getRecordKey));
    const sortedByLightness = [...records].sort((a, b) => a.hls.l - b.hls.l);
    const darkest = sortedByLightness[0];
    const lightest = sortedByLightness[sortedByLightness.length - 1];
    semanticRoleAssignments.shared ||= {};
    semanticRoleAssignments.light ||= {};
    semanticRoleAssignments.dark ||= {};
    const sharedDefaults = {
        primary: findBestRecord(records, r => r.baseHex === normalizeHex6(activeColors[0]?.hex) && r.shade === '500'),
        accent: findBestRecord(records, r => r.baseHex === normalizeHex6(activeColors[1]?.hex) && r.shade === '500', 1),
        danger: findBestRecord(records, r => r.hls.h <= 25 || r.hls.h >= 340, 0),
        warning: findBestRecord(records, r => r.hls.h >= 30 && r.hls.h <= 65, 0),
        success: findBestRecord(records, r => r.hls.h >= 95 && r.hls.h <= 155, 0),
        focus: findBestRecord(records, r => r.shade === '500', 0),
    };
    const lightDefaults = {
        background: lightest,
        surface: findBestRecord(records, r => r.shade === '50' && r.hls.l >= 70, records.length - 1),
        text: darkest,
        border: findBestRecord(records, r => r.shade === '200', Math.min(2, records.length - 1)),
    };
    const darkDefaults = {
        background: darkest,
        surface: findBestRecord(records, r => r.shade === '900' || r.shade === '950', 0),
        text: lightest,
        border: findBestRecord(records, r => r.shade === '700' || r.shade === '800', 0),
    };
    for (const role of SEMANTIC_ROLE_DEFINITIONS) {
        if (role.scope === 'shared') {
            if (!semanticRoleAssignments.shared[role.key] || !recordKeys.has(semanticRoleAssignments.shared[role.key])) {
                semanticRoleAssignments.shared[role.key] = getRecordKey(sharedDefaults[role.key] || records[0]);
            }
        } else {
            if (!semanticRoleAssignments.light[role.key] || !recordKeys.has(semanticRoleAssignments.light[role.key])) {
                semanticRoleAssignments.light[role.key] = getRecordKey(lightDefaults[role.key] || records[0]);
            }
            if (!semanticRoleAssignments.dark[role.key] || !recordKeys.has(semanticRoleAssignments.dark[role.key])) {
                semanticRoleAssignments.dark[role.key] = getRecordKey(darkDefaults[role.key] || records[0]);
            }
        }
    }
}

function getResolvedRoleColors(mode = 'light') {
    const records = getActiveShadeRecords();
    ensureSemanticRoleAssignments();
    const byKey = Object.fromEntries(records.map(record => [getRecordKey(record), record]));
    const resolved = {};
    for (const role of SEMANTIC_ROLE_DEFINITIONS) {
        const key = role.scope === 'shared'
            ? semanticRoleAssignments.shared[role.key]
            : semanticRoleAssignments[mode]?.[role.key];
        resolved[role.key] = byKey[key] || records[0];
    }
    return resolved;
}

function createRoleSelect(role, scope, records) {
    const assignmentBucket = scope === 'shared' ? semanticRoleAssignments.shared : semanticRoleAssignments[scope];
    const selectedKey = assignmentBucket?.[role.key];
    const selectedRecord = records.find(record => getRecordKey(record) === selectedKey) || records[0];
    const rowEl = document.createElement('div');
    rowEl.className = 'roleRow';

    const labelEl = document.createElement('label');
    labelEl.setAttribute('for', `role-${scope}-${role.key}`);
    labelEl.textContent = role.label;

    const swatchEl = document.createElement('div');
    swatchEl.className = 'roleSwatch';
    swatchEl.style.backgroundColor = selectedRecord?.hex || '#000000';

    const selectEl = document.createElement('select');
    selectEl.className = 'roleSelect';
    selectEl.id = `role-${scope}-${role.key}`;
    selectEl.setAttribute('aria-label', scope === 'shared' ? `${role.label} role color` : `${scope} ${role.label} role color`);
    for (const record of records) {
        const optionEl = document.createElement('option');
        optionEl.value = getRecordKey(record);
        optionEl.textContent = `${getShadeDisplayName(record)} ${record.hex}`;
        if (optionEl.value === selectedKey) optionEl.selected = true;
        selectEl.appendChild(optionEl);
    }
    selectEl.addEventListener('change', () => {
        assignmentBucket[role.key] = selectEl.value;
        renderWorkbench();
    });

    rowEl.appendChild(labelEl);
    rowEl.appendChild(swatchEl);
    rowEl.appendChild(selectEl);
    return rowEl;
}

function appendRoleSection(title, roles, scope, records) {
    const sectionEl = document.createElement('div');
    sectionEl.className = 'workbenchStack roleSection';
    const titleEl = document.createElement('div');
    titleEl.className = 'workbenchCard';
    titleEl.innerHTML = `<strong>${title}</strong>`;
    sectionEl.appendChild(titleEl);
    for (const role of roles) sectionEl.appendChild(createRoleSelect(role, scope, records));
    roleMapperOutputEl.appendChild(sectionEl);
}

function renderRoleMapper() {
    if (!roleMapperOutputEl) return;
    const records = getActiveShadeRecords();
    ensureSemanticRoleAssignments();
    roleMapperOutputEl.innerHTML = '';
    const sharedRoles = SEMANTIC_ROLE_DEFINITIONS.filter(role => role.scope === 'shared');
    const modeRoles = SEMANTIC_ROLE_DEFINITIONS.filter(role => role.scope === 'mode');
    appendRoleSection('Shared roles', sharedRoles, 'shared', records);
    appendRoleSection('Light mode roles', modeRoles, 'light', records);
    appendRoleSection('Dark mode roles', modeRoles, 'dark', records);
}

function addAuditFinding(container, state, title, text) {
    const findingEl = document.createElement('div');
    findingEl.className = 'auditFinding';
    findingEl.dataset.state = state;
    findingEl.innerHTML = `<strong>${title}</strong><br>${text}`;
    container.appendChild(findingEl);
}

function renderPaletteAudit() {
    if (!paletteAuditResultsEl) return;
    const records = getActiveShadeRecords();
    const lightRoles = getResolvedRoleColors('light');
    const darkRoles = getResolvedRoleColors('dark');
    paletteAuditResultsEl.innerHTML = '';
    addAuditFinding(paletteAuditResultsEl, 'success', 'Palette audit', `${activeColors.length} base colors and ${records.length} generated shades available.`);

    const lightBodyContrast = getContrastReport(lightRoles.text?.hex || '#000000', lightRoles.background?.hex || '#ffffff');
    addAuditFinding(
        paletteAuditResultsEl,
        lightBodyContrast.aaNormal ? 'success' : 'warning',
        'Light text on background',
        `${lightBodyContrast.ratio.toFixed(2)}:1 (${getContrastBadgeLabel(lightBodyContrast)})`
    );

    const darkBodyContrast = getContrastReport(darkRoles.text?.hex || '#ffffff', darkRoles.background?.hex || '#000000');
    addAuditFinding(
        paletteAuditResultsEl,
        darkBodyContrast.aaNormal ? 'success' : 'warning',
        'Dark text on background',
        `${darkBodyContrast.ratio.toFixed(2)}:1 (${getContrastBadgeLabel(darkBodyContrast)})`
    );

    const primaryContrast = getContrastReport(lightRoles.background?.hex || '#ffffff', lightRoles.primary?.hex || '#000000');
    addAuditFinding(
        paletteAuditResultsEl,
        primaryContrast.aaNormal ? 'success' : 'warning',
        'Primary surface contrast',
        `${primaryContrast.ratio.toFixed(2)}:1 between background and primary.`
    );

    const neutrals = records.filter(record => record.hls.s <= 12);
    addAuditFinding(
        paletteAuditResultsEl,
        neutrals.length > 0 ? 'success' : 'warning',
        'Neutral support',
        neutrals.length > 0 ? `${neutrals.length} low-saturation shades found.` : 'No low-saturation neutral candidates found.'
    );

    let nearDuplicateCount = 0;
    for (let i = 0; i < activeColors.length; i++) {
        for (let j = i + 1; j < activeColors.length; j++) {
            if (colorDistance(activeColors[i].hex, activeColors[j].hex) < 30) nearDuplicateCount += 1;
        }
    }
    addAuditFinding(
        paletteAuditResultsEl,
        nearDuplicateCount === 0 ? 'success' : 'warning',
        'Base color separation',
        nearDuplicateCount === 0 ? 'No near-duplicate base colors detected.' : `${nearDuplicateCount} near-duplicate base color pairings detected.`
    );
}

function renderThemeBuilder() {
    if (!themeBuilderResultsEl) return;
    const lightRoles = getResolvedRoleColors('light');
    const darkRoles = getResolvedRoleColors('dark');
    const themes = [
        {
            name: 'Light theme',
            background: lightRoles.background?.hex || '#ffffff',
            surface: lightRoles.surface?.hex || '#f8f9fa',
            text: lightRoles.text?.hex || '#000000',
            accent: lightRoles.primary?.hex || '#0d6efd',
        },
        {
            name: 'Dark theme',
            background: darkRoles.background?.hex || '#000000',
            surface: darkRoles.surface?.hex || '#101820',
            text: darkRoles.text?.hex || '#ffffff',
            accent: darkRoles.accent?.hex || '#0d6efd',
        },
    ];

    themeBuilderResultsEl.innerHTML = '';
    for (const theme of themes) {
        const report = getContrastReport(theme.text, theme.background);
        const cardEl = document.createElement('div');
        cardEl.className = 'themeCard';
        cardEl.style.background = theme.background;
        cardEl.style.color = theme.text;
        cardEl.innerHTML = `<strong>${theme.name}</strong><span>${report.ratio.toFixed(2)}:1 body contrast (${getContrastBadgeLabel(report)})</span>`;
        const stripEl = document.createElement('div');
        stripEl.className = 'swatchStrip';
        for (const hex of [theme.background, theme.surface, theme.text, theme.accent]) {
            const swatchEl = document.createElement('span');
            swatchEl.className = 'miniSwatch';
            swatchEl.style.backgroundColor = hex;
            stripEl.appendChild(swatchEl);
        }
        cardEl.appendChild(stripEl);
        themeBuilderResultsEl.appendChild(cardEl);
    }
}

function parsePaletteText(text) {
    const matches = String(text || '').match(/#?[0-9a-f]{3,8}\b/gi) || [];
    return matches
        .map(value => normalizeHex6(value))
        .filter((hex, index, arr) => /^#[0-9A-F]{6}$/.test(hex) && arr.indexOf(hex) === index)
        .map(hex => ({ hex }));
}

function renderPaletteCompare() {
    if (!paletteCompareResultsEl || !comparePaletteInputEl) return;
    const comparison = parsePaletteText(comparePaletteInputEl.value);
    paletteCompareResultsEl.innerHTML = '';
    if (comparison.length === 0) {
        const emptyEl = document.createElement('div');
        emptyEl.className = 'workbenchCard';
        emptyEl.textContent = 'Enter another palette to compare against the active colors.';
        paletteCompareResultsEl.appendChild(emptyEl);
        return;
    }
    for (const color of comparison) {
        const nearest = activeColors
            .map(active => ({ hex: normalizeHex6(active.hex), distance: colorDistance(color.hex, active.hex) }))
            .sort((a, b) => a.distance - b.distance)[0];
        const rowEl = document.createElement('div');
        rowEl.className = 'comparisonRow';
        rowEl.innerHTML = `<strong>${color.hex}</strong><br>Nearest match: ${nearest.hex} (${Math.round(nearest.distance)} RGB distance)`;
        paletteCompareResultsEl.appendChild(rowEl);
    }
}

function applyColorVisionMatrix(hex, matrix) {
    const rgb = tinycolor(hex).toRgb();
    const transformed = matrix.map(row => Math.round(row[0] * rgb.r + row[1] * rgb.g + row[2] * rgb.b));
    return rgbToHex(...transformed.map(value => clamp(value, 0, 255)));
}

function renderVisionSimulation() {
    if (!visionSimulationOutputEl) return;
    visionSimulationOutputEl.innerHTML = '';
    for (const simulation of VISION_SIMULATIONS) {
        const rowEl = document.createElement('div');
        rowEl.className = 'visionRow';
        const titleEl = document.createElement('strong');
        titleEl.textContent = simulation.name;
        const stripEl = document.createElement('div');
        stripEl.className = 'visionStrip';
        for (const color of activeColors) {
            const swatchEl = document.createElement('span');
            swatchEl.className = 'visionSwatch';
            swatchEl.style.backgroundColor = applyColorVisionMatrix(color.hex, simulation.matrix);
            stripEl.appendChild(swatchEl);
        }
        rowEl.appendChild(titleEl);
        rowEl.appendChild(stripEl);
        visionSimulationOutputEl.appendChild(rowEl);
    }
}

function renderUiPreviewBoard() {
    if (!uiPreviewBoardEl) return;
    const modes = [
        { label: 'Light Mode', roles: getResolvedRoleColors('light') },
        { label: 'Dark Mode', roles: getResolvedRoleColors('dark') },
    ];
    uiPreviewBoardEl.innerHTML = '';
    const wrapperEl = document.createElement('div');
    wrapperEl.className = 'previewModeGrid';
    for (const mode of modes) {
        const background = mode.roles.background?.hex || '#ffffff';
        const surface = mode.roles.surface?.hex || '#f8f9fa';
        const text = mode.roles.text?.hex || '#000000';
        const primary = mode.roles.primary?.hex || '#0d6efd';
        const accent = mode.roles.accent?.hex || '#6610f2';
        const border = mode.roles.border?.hex || '#dee2e6';
        const primaryText = getReadableTextColor(primary);
        const boardEl = document.createElement('div');
        boardEl.className = 'previewBoard';
        boardEl.style.background = background;
        boardEl.style.color = text;
        boardEl.style.borderColor = border;
        boardEl.innerHTML = `<strong>${mode.label}</strong><span>Semantic roles applied to common controls.</span>`;
        const controlsEl = document.createElement('div');
        controlsEl.className = 'previewControls';
        controlsEl.innerHTML = `
            <span class="previewButton" style="background:${primary};color:${primaryText};border-color:${primary};">Sample Button</span>
            <span class="previewBadge" style="background:${accent};color:${getReadableTextColor(accent)};">Badge</span>
            <span class="previewButton" style="background:${surface};color:${text};border-color:${border};">Secondary</span>
        `;
        boardEl.appendChild(controlsEl);
        wrapperEl.appendChild(boardEl);
    }
    uiPreviewBoardEl.appendChild(wrapperEl);
}

function renderImagePicker() {
    if (!imageSamplerStatusEl) return;
    if (!imageSamplerState.image) {
        imageSamplerStatusEl.textContent = 'Upload, paste, or drop an image, then click the preview to sample a color.';
        return;
    }
    imageSamplerStatusEl.textContent = latestSampledHex
        ? `Sampled ${latestSampledHex} from ${imageSamplerState.label}.`
        : `Loaded ${imageSamplerState.label}. Click the preview to sample a color.`;
}

function setActiveWorkbenchTab(tabName) {
    activeWorkbenchTab = tabName;
    for (const tabEl of workbenchTabEls) {
        const isActive = tabEl.dataset.workbenchTab === tabName;
        tabEl.setAttribute('aria-selected', isActive ? 'true' : 'false');
    }
    for (const panelEl of workbenchPanelEls) {
        panelEl.hidden = panelEl.dataset.workbenchPanel !== tabName;
    }
}

function renderWorkbench() {
    renderContrastMatrix();
    renderTokenExporter();
    renderRoleMapper();
    renderPaletteAudit();
    renderThemeBuilder();
    renderPaletteCompare();
    renderVisionSimulation();
    renderUiPreviewBoard();
    renderImagePicker();
    setActiveWorkbenchTab(activeWorkbenchTab);
}

function isSimilarToKeptColorShade(hex, keptColors) {
    for (const keptColor of keptColors) {
        const shadeColors = getShadeColors(keptColor.hex);
        for (const [shade, shadeHex] of Object.entries(shadeColors)) {
            const distance = SHADE_DEDUPE_DISTANCE_BY_SHADE[shade] || 24;
            if (colorDistance(hex, shadeHex) <= distance) return true;
        }
    }
    return false;
}

function normalizePaletteColors(colors) {
    const seen = new Set();
    const normalized = [];
    for (const color of colors || []) {
        const raw = typeof color === 'string' ? color : color?.hex;
        const hex = normalizeHex6(raw);
        if (hex === '#000000' && !/^#?0{6}$/i.test(String(raw || ''))) continue;
        if (seen.has(hex)) continue;
        if (isSimilarToKeptColorShade(hex, normalized)) continue;
        seen.add(hex);
        normalized.push({ hex });
        if (normalized.length >= MAX_EXTRACTED_COLORS) break;
    }
    return normalized;
}

function setSourceStatus(text, state = 'info') {
    if (!sourceStatusEl) return;
    sourceStatusEl.textContent = String(text || '');
    sourceStatusEl.dataset.state = state;
}

function setSourceBusy(isBusy) {
    [sourceUrlInputEl, analyzeSourceUrlBtnEl, uploadSourceImageBtnEl, sourceImageInputEl].forEach((el) => {
        if (el) el.disabled = !!isBusy;
    });
    if (sourceDropZoneEl) sourceDropZoneEl.setAttribute('aria-busy', isBusy ? 'true' : 'false');
}

function setActiveColorsFromPalette(colors, sourceLabel) {
    const normalized = normalizePaletteColors(colors);
    if (normalized.length === 0) throw new Error('No readable colors were found.');
    activeColors = normalized;
    preservePresetC = false;
    updateUrlFromActiveColors();
    renderColorsOverlay();
    renderWorkbench();
    scheduleRenderChart();
    const label = sourceLabel ? ` from ${sourceLabel}` : '';
    setSourceStatus(`Extracted ${normalized.length} colors${label}.`, 'success');
}

function setQueryParamCaseInsensitive(params, targetKey, value) {
    const lower = String(targetKey).toLowerCase();
    for (const key of Array.from(params.keys())) {
        if (key.toLowerCase() === lower) params.delete(key);
    }
    params.set(targetKey, value);
}

function updateUrlFromActiveColors() {
    if (preservePresetC) return;
    const params = new URLSearchParams(window.location.search);
    const hexList = activeColors
        .map(c => normalizeHex6(c.hex))
        .map(h => h.replace('#', ''))
        .join(',');
    setQueryParamCaseInsensitive(params, 'c', hexList);

    const nextUrl = `${window.location.pathname}?${params.toString()}${window.location.hash || ''}`;
    window.history.replaceState(null, '', nextUrl);
}

let actionMessageTimer = 0;

function showActionMessage(text) {
    if (!actionMessageEl) return;
    actionMessageEl.textContent = String(text || '');
    actionMessageEl.classList.add('is-visible');
    if (actionMessageTimer) window.clearTimeout(actionMessageTimer);
    actionMessageTimer = window.setTimeout(() => {
        actionMessageEl.classList.remove('is-visible');
        actionMessageEl.textContent = '';
        actionMessageTimer = 0;
    }, 2200);
}

async function copyTextToClipboard(text) {
    const value = String(text || '');
    if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(value);
        return;
    }
    // Fallback for older browsers / insecure contexts.
    const ta = document.createElement('textarea');
    ta.value = value;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.style.top = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
}

function getDerivedColorMeta(color) {
    const metrics = getColorMetrics(color.hex);
    return {
        rgb: metrics.rgb,
        hls: tinycolor(metrics.hex).toHsl(),
        cmyk: metrics.cmyk,
    };
}

async function getColorName(hex) {
    const key = normalizeHex6(hex);
    if (colorNameCache.has(key)) return colorNameCache.get(key);
    try {
        const name = await fetchColorNameFromApi(key);
        const safe = (name && String(name).trim().length > 0) ? String(name).trim() : key;
        colorNameCache.set(key, safe);
        return safe;
    } catch {
        colorNameCache.set(key, key);
        return key;
    }
}

let renderChartRaf = 0;

function scheduleRenderChart() {
    if (renderChartRaf) cancelAnimationFrame(renderChartRaf);
    renderChartRaf = requestAnimationFrame(() => {
        renderChartRaf = 0;
        void renderChart({ center: false });
    });
}

function renderColorsOverlay() {
    if (!colorsListEl) return;
    colorsListEl.innerHTML = '';

    activeColors.forEach((color, index) => {
        const rowEl = document.createElement('div');
        rowEl.className = 'colorRow';

        const swatchEl = document.createElement('input');
        swatchEl.type = 'color';
        swatchEl.className = 'colorSwatch';
        swatchEl.value = normalizeHex6(color.hex);
        swatchEl.setAttribute('aria-label', `Pick color ${index + 1}`);

        const metaEl = document.createElement('div');
        metaEl.className = 'colorMeta';

        const nameEl = document.createElement('div');
        nameEl.className = 'colorName';
        nameEl.textContent = 'Loading…';

        const hexEl = document.createElement('div');
        hexEl.className = 'colorHex';
        hexEl.textContent = normalizeHex6(color.hex);

        metaEl.appendChild(nameEl);
        metaEl.appendChild(hexEl);

        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'deleteColorBtn';
        delBtn.textContent = '×';
        delBtn.setAttribute('aria-label', `Delete color ${index + 1}`);

        delBtn.addEventListener('click', () => {
            if (activeColors.length <= 1) return;
            activeColors.splice(index, 1);
            preservePresetC = false;
            updateUrlFromActiveColors();
            renderColorsOverlay();
            renderWorkbench();
            scheduleRenderChart();
        });

        swatchEl.addEventListener('input', () => {
            const nextHex = normalizeHex6(swatchEl.value);
            activeColors[index].hex = nextHex;
            preservePresetC = false;
            updateUrlFromActiveColors();
            hexEl.textContent = nextHex;
            // Reset cached name for this entry.
            nameEl.textContent = 'Loading…';
            void getColorName(nextHex).then(n => {
                nameEl.textContent = n;
            });
            renderWorkbench();
            scheduleRenderChart();
        });

        rowEl.appendChild(swatchEl);
        rowEl.appendChild(metaEl);
        rowEl.appendChild(delBtn);

        colorsListEl.appendChild(rowEl);

        void getColorName(color.hex).then(n => {
            // Ensure we don't overwrite if this row has been rebuilt.
            if (rowEl.isConnected) nameEl.textContent = n;
        });
    });
}

const colorUsageDescriptions = [
    "Backgrounds and subtle highlights", // 50
    "Backgrounds and light accents",    // 100
    "Light accents and borders",        // 200
    "Secondary backgrounds",            // 300
    "Primary backgrounds",              // 400
    "Primary elements and text",        // 500
    "Hover states and active elements", // 600
    "Headers and strong accents",       // 700
    "Strong accents and warnings",      // 800
    "Critical elements and alerts",     // 900
    "Dark accents and overlays"         // 950
];

function calculateContrastRatio(rgbColor1, rgbColor2) {
    function calculateLuminance(r, g, b) {
        const linearRgb = [r, g, b].map(value => {
            value /= 255;
            return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
        });
        return linearRgb[0] * 0.2126 + linearRgb[1] * 0.7152 + linearRgb[2] * 0.0722;
    }

    const luminance1 = calculateLuminance(...rgbColor1);
    const luminance2 = calculateLuminance(...rgbColor2);
    const brighterLuminance = Math.max(luminance1, luminance2);
    const darkerLuminance = Math.min(luminance1, luminance2);
    return ((brighterLuminance + 0.05) / (darkerLuminance + 0.05)).toFixed(2);
}

function convertRgbToCmyk(red, green, blue) {
    const cyan = 1 - red / 255;
    const magenta = 1 - green / 255;
    const yellow = 1 - blue / 255;
    const black = Math.min(cyan, magenta, yellow);
    if (black >= 1) return [0, 0, 0, 100];
    return [
        Math.round((cyan - black) / (1 - black) * 100),
        Math.round((magenta - black) / (1 - black) * 100),
        Math.round((yellow - black) / (1 - black) * 100),
        Math.round(black * 100),
    ];
}

async function fetchColorNameFromApi(hexColor) {
    const response = await fetch(`https://api.color.pizza/v1/${hexColor.substring(1)}`);
    const data = await response.json();
    return data.colors[0].name;
}

function rgbToHex(red, green, blue) {
    return tinycolor({ r: red, g: green, b: blue }).toHexString().toUpperCase();
}

function makeColorCandidate(hex, weight, source, firstSeen) {
    const normalized = normalizeHex6(hex);
    const tiny = tinycolor(normalized);
    if (!tiny.isValid()) return null;
    return {
        hex: normalized,
        weight: Number(weight) || 1,
        source: source || 'unknown',
        firstSeen: Number.isFinite(firstSeen) ? firstSeen : 0,
    };
}

function addColorCandidate(candidates, value, weight = 1, source = 'unknown') {
    const tiny = tinycolor(String(value || '').trim());
    if (!tiny.isValid() || tiny.getAlpha() < 0.4) return;
    const candidate = makeColorCandidate(tiny.toHexString(), weight, source, candidates.length);
    if (candidate) candidates.push(candidate);
}

function extractColorCandidatesFromCssText(cssText, weight = 1, source = 'css') {
    const text = String(cssText || '');
    const candidates = [];
    const patterns = [
        /#[0-9a-f]{3,8}\b/gi,
        /rgba?\([^)]*\)/gi,
        /hsla?\([^)]*\)/gi,
    ];

    for (const pattern of patterns) {
        const matches = text.match(pattern) || [];
        for (const match of matches) addColorCandidate(candidates, match, weight, source);
    }

    return candidates;
}

function colorDistance(hexA, hexB) {
    const a = tinycolor(hexA).toRgb();
    const b = tinycolor(hexB).toRgb();
    return Math.sqrt(
        Math.pow(a.r - b.r, 2) +
        Math.pow(a.g - b.g, 2) +
        Math.pow(a.b - b.b, 2)
    );
}

function mergeAndRankPaletteCandidates(candidates, limit = MAX_EXTRACTED_COLORS) {
    const groups = [];
    for (const candidate of candidates || []) {
        if (!candidate || !tinycolor(candidate.hex).isValid()) continue;
        const hsl = tinycolor(candidate.hex).toHsl();
        const saturationBoost = 1 + (hsl.s * 0.55);
        const contrastBoost = (hsl.l > 0.08 && hsl.l < 0.94) ? 1.08 : 0.82;
        const neutralMateriality = (hsl.s < 0.08 && candidate.weight < 12) ? 0.72 : 1;
        const score = candidate.weight * saturationBoost * contrastBoost * neutralMateriality;
        const existing = groups.find(group => colorDistance(group.hex, candidate.hex) < 22);
        if (existing) {
            existing.score += score;
            existing.weight += candidate.weight;
            existing.firstSeen = Math.min(existing.firstSeen, candidate.firstSeen);
            if (score > existing.bestScore) {
                existing.hex = candidate.hex;
                existing.bestScore = score;
            }
        } else {
            groups.push({
                hex: candidate.hex,
                score,
                bestScore: score,
                weight: candidate.weight,
                firstSeen: candidate.firstSeen,
            });
        }
    }

    groups.sort((a, b) => {
        const scoreDiff = b.score - a.score;
        if (Math.abs(scoreDiff) > 0.001) return scoreDiff;
        return a.firstSeen - b.firstSeen;
    });

    return groups.slice(0, limit).map(group => group.hex);
}

async function loadImageElementFromBlob(blob) {
    const objectUrl = URL.createObjectURL(blob);
    try {
        const image = new Image();
        await new Promise((resolve, reject) => {
            image.onload = () => resolve(undefined);
            image.onerror = () => reject(new Error('Could not load image pixels.'));
            image.src = objectUrl;
        });
        return image;
    } finally {
        window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
    }
}

async function extractPaletteFromImageElement(image, sourceWeight = 1) {
    const naturalWidth = image.naturalWidth || image.width;
    const naturalHeight = image.naturalHeight || image.height;
    if (!naturalWidth || !naturalHeight) throw new Error('Image has no readable dimensions.');

    const maxSide = 180;
    const scale = Math.min(1, maxSide / Math.max(naturalWidth, naturalHeight));
    const width = Math.max(1, Math.round(naturalWidth * scale));
    const height = Math.max(1, Math.round(naturalHeight * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('Canvas is unavailable.');
    context.drawImage(image, 0, 0, width, height);

    let data;
    try {
        data = context.getImageData(0, 0, width, height).data;
    } catch {
        throw new Error('Browser security blocked direct pixel analysis. Upload or paste a screenshot/image instead.');
    }

    const buckets = new Map();
    const step = Math.max(1, Math.floor(Math.sqrt((width * height) / 9000)));
    let firstSeen = 0;
    for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
            const offset = (y * width + x) * 4;
            const alpha = data[offset + 3];
            if (alpha < 128) continue;
            const red = data[offset];
            const green = data[offset + 1];
            const blue = data[offset + 2];
            const key = `${red >> 4},${green >> 4},${blue >> 4}`;
            const bucket = buckets.get(key) || { r: 0, g: 0, b: 0, count: 0, firstSeen: firstSeen++ };
            bucket.r += red;
            bucket.g += green;
            bucket.b += blue;
            bucket.count += 1;
            buckets.set(key, bucket);
        }
    }

    const candidates = [];
    for (const bucket of buckets.values()) {
        if (bucket.count < 2 && buckets.size > 8) continue;
        const red = Math.round(bucket.r / bucket.count);
        const green = Math.round(bucket.g / bucket.count);
        const blue = Math.round(bucket.b / bucket.count);
        const candidate = makeColorCandidate(rgbToHex(red, green, blue), bucket.count * sourceWeight, 'image', bucket.firstSeen);
        if (candidate) candidates.push(candidate);
    }

    return mergeAndRankPaletteCandidates(candidates);
}

async function extractPaletteFromImageBlob(blob) {
    const image = await loadImageElementFromBlob(blob);
    return extractPaletteFromImageElement(image, 1.4);
}

function isImageType(type) {
    return /^image\//i.test(String(type || ''));
}

function looksLikeImageUrl(url) {
    return /\.(?:png|jpe?g|gif|webp|svg|bmp|ico)(?:[?#]|$)/i.test(String(url || ''));
}

async function fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), SOURCE_FETCH_TIMEOUT_MS);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response;
    } finally {
        window.clearTimeout(timeout);
    }
}

function resolveSourceUrl(value, baseUrl) {
    try {
        const url = new URL(String(value || '').trim(), baseUrl || window.location.href);
        if (!['http:', 'https:'].includes(url.protocol)) return null;
        return url.href;
    } catch {
        return null;
    }
}

function collectDocumentColorCandidates(doc) {
    const candidates = [];
    const metaSelectors = [
        'meta[name="theme-color"]',
        'meta[name="msapplication-TileColor"]',
        'meta[name="apple-mobile-web-app-status-bar-style"]',
    ];
    for (const selector of metaSelectors) {
        doc.querySelectorAll(selector).forEach((el) => {
            addColorCandidate(candidates, el.getAttribute('content'), 24, 'meta');
        });
    }

    doc.querySelectorAll('[style]').forEach((el) => {
        candidates.push(...extractColorCandidatesFromCssText(el.getAttribute('style') || '', 2.5, 'inline-style'));
    });
    doc.querySelectorAll('style').forEach((el) => {
        candidates.push(...extractColorCandidatesFromCssText(el.textContent || '', 1.8, 'style-block'));
    });

    return candidates;
}

function collectLinkedSourceUrls(doc, pageUrl) {
    const cssUrls = Array.from(doc.querySelectorAll('link[rel~="stylesheet"][href]'))
        .map(el => resolveSourceUrl(el.getAttribute('href'), pageUrl))
        .filter(Boolean)
        .slice(0, 6);

    const manifestUrls = Array.from(doc.querySelectorAll('link[rel="manifest"][href]'))
        .map(el => resolveSourceUrl(el.getAttribute('href'), pageUrl))
        .filter(Boolean)
        .slice(0, 2);

    const imageSelectors = [
        'link[rel~="icon"][href]',
        'link[rel="apple-touch-icon"][href]',
        'meta[property="og:image"][content]',
        'meta[name="twitter:image"][content]',
    ];
    const imageUrls = [];
    for (const selector of imageSelectors) {
        doc.querySelectorAll(selector).forEach((el) => {
            const raw = el.getAttribute('href') || el.getAttribute('content');
            const resolved = resolveSourceUrl(raw, pageUrl);
            if (resolved && !imageUrls.includes(resolved)) imageUrls.push(resolved);
        });
    }

    return { cssUrls, manifestUrls, imageUrls: imageUrls.slice(0, MAX_REMOTE_IMAGE_CANDIDATES) };
}

async function analyzeImageUrl(url) {
    const response = await fetchWithTimeout(url, { credentials: 'omit' });
    const contentType = response.headers.get('content-type') || '';
    if (!isImageType(contentType) && !looksLikeImageUrl(url)) throw new Error('URL did not return a readable image.');
    const blob = await response.blob();
    if (!isImageType(blob.type) && !looksLikeImageUrl(url)) throw new Error('URL did not return a readable image.');
    return extractPaletteFromImageBlob(blob);
}

async function analyzeHtmlUrl(url) {
    const response = await fetchWithTimeout(url, { credentials: 'omit' });
    const contentType = response.headers.get('content-type') || '';
    if (isImageType(contentType)) {
        const blob = await response.blob();
        return extractPaletteFromImageBlob(blob);
    }
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html.slice(0, 900000), 'text/html');
    const candidates = collectDocumentColorCandidates(doc);
    const linked = collectLinkedSourceUrls(doc, url);

    for (const cssUrl of linked.cssUrls) {
        try {
            const cssResponse = await fetchWithTimeout(cssUrl, { credentials: 'omit' });
            const cssText = await cssResponse.text();
            candidates.push(...extractColorCandidatesFromCssText(cssText.slice(0, 350000), 1.2, 'stylesheet'));
        } catch {
            // Cross-origin stylesheets are often blocked; continue with readable sources.
        }
    }

    for (const manifestUrl of linked.manifestUrls) {
        try {
            const manifestResponse = await fetchWithTimeout(manifestUrl, { credentials: 'omit' });
            const manifest = await manifestResponse.json();
            addColorCandidate(candidates, manifest.theme_color, 22, 'manifest');
            addColorCandidate(candidates, manifest.background_color, 14, 'manifest');
        } catch {
            // Ignore blocked or invalid manifests.
        }
    }

    for (const imageUrl of linked.imageUrls) {
        try {
            const imageColors = await analyzeImageUrl(imageUrl);
            imageColors.forEach((hex, index) => {
                const candidate = makeColorCandidate(hex, 16 - index, 'linked-image', candidates.length + index);
                if (candidate) candidates.push(candidate);
            });
        } catch {
            // Ignore blocked linked images.
        }
    }

    return mergeAndRankPaletteCandidates(candidates);
}

async function analyzeSourceUrl(rawUrl) {
    const url = resolveSourceUrl(rawUrl, window.location.href);
    if (!url) throw new Error('Enter a valid http(s) website or image URL.');
    if (looksLikeImageUrl(url)) {
        try {
            return await analyzeImageUrl(url);
        } catch {
            // Some image-looking URLs are routed through HTML; try document parsing before failing.
        }
    }
    return analyzeHtmlUrl(url);
}

async function handleAnalyzeSourceUrl() {
    const rawUrl = sourceUrlInputEl ? sourceUrlInputEl.value : '';
    setSourceBusy(true);
    setSourceStatus('Analyzing URL…', 'info');
    try {
        const colors = await analyzeSourceUrl(rawUrl);
        const sourceName = new URL(rawUrl, window.location.href).hostname || 'URL';
        setActiveColorsFromPalette(colors, sourceName);
    } catch (error) {
        const message = String(error?.message || error || 'Unable to analyze URL.');
        const blocked = /failed|network|cors|security|load|abort|http/i.test(message);
        setSourceStatus(blocked
            ? 'Browser security blocked direct analysis. Upload or paste a screenshot/image instead.'
            : message,
            blocked ? 'warning' : 'error');
    } finally {
        setSourceBusy(false);
    }
}

async function setSourceImageFromFile(file) {
    if (!(file instanceof File) || !isImageType(file.type)) throw new Error('Choose an image file or paste a screenshot.');
    const image = await loadImageElementFromBlob(file);
    setImageSamplerImage(image, file.name || 'image');
    const colors = await extractPaletteFromImageElement(image, 1.4);
    setActiveColorsFromPalette(colors, file.name || 'image');
}

async function handleSourceImageFile(file) {
    setSourceBusy(true);
    setSourceStatus('Reading image…', 'info');
    try {
        await setSourceImageFromFile(file);
    } catch (error) {
        setSourceStatus(String(error?.message || error || 'Unable to read image.'), 'error');
    } finally {
        setSourceBusy(false);
    }
}

function drawImageSamplerImage() {
    if (!imageSamplerCanvasEl || !imageSamplerState.image) return;
    const image = imageSamplerState.image;
    const maxWidth = 320;
    const maxHeight = 180;
    const naturalWidth = image.naturalWidth || image.width;
    const naturalHeight = image.naturalHeight || image.height;
    if (!naturalWidth || !naturalHeight) return;
    const scale = Math.min(1, maxWidth / naturalWidth, maxHeight / naturalHeight);
    const width = Math.max(1, Math.round(naturalWidth * scale));
    const height = Math.max(1, Math.round(naturalHeight * scale));
    imageSamplerCanvasEl.width = width;
    imageSamplerCanvasEl.height = height;
    const context = imageSamplerCanvasEl.getContext('2d', { willReadFrequently: true });
    if (!context) return;
    context.clearRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    imageSamplerState.context = context;
    imageSamplerState.scaleX = naturalWidth / width;
    imageSamplerState.scaleY = naturalHeight / height;
}

function setImageSamplerImage(image, label) {
    imageSamplerState.image = image;
    imageSamplerState.label = label || 'image';
    latestSampledHex = null;
    drawImageSamplerImage();
    renderImagePicker();
}

function handleImageSamplerClick(event) {
    if (!imageSamplerCanvasEl || !imageSamplerState.context) return;
    const rect = imageSamplerCanvasEl.getBoundingClientRect();
    const x = Math.max(0, Math.min(imageSamplerCanvasEl.width - 1, Math.floor((event.clientX - rect.left) * (imageSamplerCanvasEl.width / rect.width))));
    const y = Math.max(0, Math.min(imageSamplerCanvasEl.height - 1, Math.floor((event.clientY - rect.top) * (imageSamplerCanvasEl.height / rect.height))));
    const pixel = imageSamplerState.context.getImageData(x, y, 1, 1).data;
    latestSampledHex = rgbToHex(pixel[0], pixel[1], pixel[2]);
    renderImagePicker();
}

function addSampledColorToPalette() {
    if (!latestSampledHex) {
        showActionMessage('Sample a color from the image first.');
        return;
    }
    activeColors = normalizePaletteColors([...activeColors, { hex: latestSampledHex }]);
    preservePresetC = false;
    updateUrlFromActiveColors();
    renderColorsOverlay();
    renderWorkbench();
    scheduleRenderChart();
}

function setupWorkbenchControls() {
    for (const tabEl of workbenchTabEls) {
        tabEl.addEventListener('click', () => setActiveWorkbenchTab(tabEl.dataset.workbenchTab || 'contrastMatrix'));
    }
    if (tokenFormatSelectEl) tokenFormatSelectEl.addEventListener('change', renderTokenExporter);
    if (copyTokensBtnEl) {
        copyTokensBtnEl.addEventListener('click', async () => {
            try {
                await copyTextToClipboard(tokenExportOutputEl?.value || '');
                showActionMessage('Copied tokens to clipboard.');
            } catch {
                showActionMessage('Could not copy tokens (clipboard unavailable).');
            }
        });
    }
    if (comparePaletteInputEl) comparePaletteInputEl.addEventListener('input', renderPaletteCompare);
    if (imageSamplerCanvasEl) imageSamplerCanvasEl.addEventListener('click', handleImageSamplerClick);
    if (addSampledColorBtnEl) addSampledColorBtnEl.addEventListener('click', addSampledColorToPalette);
}

function setupSourceExtractionControls() {
    if (analyzeSourceUrlBtnEl) {
        analyzeSourceUrlBtnEl.addEventListener('click', () => {
            void handleAnalyzeSourceUrl();
        });
    }

    if (sourceUrlInputEl) {
        sourceUrlInputEl.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter') return;
            event.preventDefault();
            void handleAnalyzeSourceUrl();
        });
    }

    if (uploadSourceImageBtnEl && sourceImageInputEl) {
        uploadSourceImageBtnEl.addEventListener('click', () => sourceImageInputEl.click());
        sourceImageInputEl.addEventListener('change', () => {
            const file = sourceImageInputEl.files && sourceImageInputEl.files[0];
            if (file) void handleSourceImageFile(file);
            sourceImageInputEl.value = '';
        });
    }

    if (sourceDropZoneEl) {
        sourceDropZoneEl.addEventListener('click', () => sourceImageInputEl?.click());
        sourceDropZoneEl.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                sourceImageInputEl?.click();
            }
        });
        sourceDropZoneEl.addEventListener('dragenter', (event) => {
            event.preventDefault();
            sourceDropZoneEl.classList.add('is-over');
        });
        sourceDropZoneEl.addEventListener('dragover', (event) => {
            event.preventDefault();
            sourceDropZoneEl.classList.add('is-over');
        });
        sourceDropZoneEl.addEventListener('dragleave', (event) => {
            event.preventDefault();
            const related = event.relatedTarget;
            if (related && sourceDropZoneEl.contains(related)) return;
            sourceDropZoneEl.classList.remove('is-over');
        });
        sourceDropZoneEl.addEventListener('drop', (event) => {
            event.preventDefault();
            sourceDropZoneEl.classList.remove('is-over');
            const file = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0];
            if (file) void handleSourceImageFile(file);
        });
    }

    window.addEventListener('paste', (event) => {
        if (event.target && event.target.closest && event.target.closest('input, textarea, select')) return;
        const items = event.clipboardData && Array.from(event.clipboardData.items || []);
        if (!items || items.length === 0) return;
        const imageItem = items.find(item => isImageType(item.type));
        if (!imageItem) return;
        const file = imageItem.getAsFile();
        if (!file) return;
        event.preventDefault();
        void handleSourceImageFile(file);
    });
}

async function generateColorChart({ center = false } = {}) {
    const chartContainer = document.createElement('div');
    chartContainer.setAttribute('data-color-chart', 'true');
    chartContainer.style.display = 'grid';
    chartContainer.style.gridTemplateColumns = `repeat(${colorShades.length + 1}, 200px)`;
    chartContainer.style.gap = '8px';
    chartContainer.style.padding = '0';
    chartContainer.style.margin = '0';
    chartContainer.style.justifyContent = 'center';
    chartContainer.style.gridTemplateColumns = `repeat(${colorShades.length}, 200px)`;

    worldEl.appendChild(chartContainer);

    const headerRow = document.createElement('div');
    headerRow.style.display = 'grid';
    headerRow.style.gridTemplateColumns = `repeat(${colorShades.length}, 200px)`;
    headerRow.style.gap = '8px';
    headerRow.style.fontWeight = 'bold';
    headerRow.style.textAlign = 'center';

    colorShades.forEach((shade, index) => {
        const headerCell = document.createElement('div');
        headerCell.style.display = 'flex';
        headerCell.style.flexDirection = 'column';
        headerCell.style.alignItems = 'center';

        const usageDescription = document.createElement('div');
        usageDescription.textContent = colorUsageDescriptions[index];
        usageDescription.style.fontSize = '16pt';
        usageDescription.style.fontWeight = 'bold';
        usageDescription.style.textAlign = 'center';

        headerCell.appendChild(usageDescription);
        headerRow.appendChild(headerCell);
    });

    chartContainer.insertBefore(headerRow, chartContainer.firstChild);

    const colorDefinitions = activeColors.map(color => ({
        ...color,
        ...getDerivedColorMeta(color),
    }));

    for (const color of colorDefinitions) {
        const baseRgb = tinycolor(color.hex).toRgb();
        const baseRgbArray = [baseRgb.r, baseRgb.g, baseRgb.b];
        const baseCmyk = convertRgbToCmyk(...baseRgbArray);
        const baseHls = tinycolor(color.hex).toHsl();
        const contrastWithWhite = calculateContrastRatio(baseRgbArray, [255, 255, 255]);
        const contrastWithBlack = calculateContrastRatio(baseRgbArray, [0, 0, 0]);
        const baseColorName = await getColorName(color.hex);

        const shadeBoxes = colorShades.map(async (shade, index) => {
            const colorBox = document.createElement('div');
            colorBox.className = 'color-box';
            const shadeColors = getShadeColors(color.hex);
            colorBox.style.backgroundColor = shadeColors[shade];
            colorBox.style.borderRadius = '8px';
            colorBox.style.display = 'flex';
            colorBox.style.flexDirection = 'column';
            colorBox.style.alignItems = 'flex-start';
            colorBox.style.justifyContent = 'flex-start';
            colorBox.style.padding = '10px';
            colorBox.style.fontSize = '12px';
            colorBox.style.textAlign = 'left';
            colorBox.style.position = 'relative';

            if (shade === '500') {
                colorBox.style.border = '4px solid black';
            } else {
                colorBox.style.border = '4px solid rgba(0, 0, 0, 0)';
            }

            const recalculatedRgb = tinycolor(shadeColors[shade]).toRgb();
            const recalculatedRgbArray = [recalculatedRgb.r, recalculatedRgb.g, recalculatedRgb.b];
            const dynamicColorName = await fetchColorNameFromApi(shadeColors[shade]);
            const dynamicNameElement = document.createElement('div');
            dynamicNameElement.dataset.slot = 'title';
            dynamicNameElement.textContent = `${dynamicColorName}`;
            dynamicNameElement.style.fontWeight = 'bold';
            dynamicNameElement.style.textDecoration = 'underline';
            dynamicNameElement.style.fontSize = '12pt';
            colorBox.appendChild(dynamicNameElement);

            const baseColorNameElement = document.createElement('div');
            baseColorNameElement.dataset.slot = 'subtitle';
            if (shade === '500') {
                baseColorNameElement.textContent = `Base Color`;
            } else {
                baseColorNameElement.textContent = `${baseColorName} ${shade}`;
            }
            baseColorNameElement.style.fontWeight = 'bold';
            baseColorNameElement.style.fontSize = '10pt';
            colorBox.appendChild(baseColorNameElement);

            const hexElement = document.createElement('div');
            hexElement.dataset.slot = 'hex';
            hexElement.innerHTML = `<strong>Hex:</strong> ${shadeColors[shade].toUpperCase()}`;

            const rgbElement = document.createElement('div');
            rgbElement.dataset.slot = 'rgb';
            rgbElement.innerHTML = `<strong>RGB:</strong> ${recalculatedRgbArray.join(', ')}`;

            const cmykElement = document.createElement('div');
            cmykElement.dataset.slot = 'cmyk';
            const recalculatedCmyk = convertRgbToCmyk(...recalculatedRgbArray).map(value => isNaN(value) ? 0 : value);
            cmykElement.innerHTML = `<strong>CMYK:</strong> ${recalculatedCmyk.join(', ')}`;

            const hlsElement = document.createElement('div');
            hlsElement.dataset.slot = 'hls';
            const recalculatedHls = tinycolor(shadeColors[shade]).toHsl();
            const recalculatedHlsArray = [
                Math.round(recalculatedHls.h),
                `${Math.round(recalculatedHls.s * 100)}%`,
                `${Math.round(recalculatedHls.l * 100)}%`
            ];
            hlsElement.innerHTML = `<strong>HLS:</strong> ${recalculatedHlsArray.join(', ')}`;

            colorBox.appendChild(hexElement);
            colorBox.appendChild(rgbElement);
            colorBox.appendChild(cmykElement);
            colorBox.appendChild(hlsElement);

            const contrastWithWhiteRatio = parseFloat(calculateContrastRatio(recalculatedRgbArray, [255, 255, 255]));
            const contrastWithBlackRatio = parseFloat(calculateContrastRatio(recalculatedRgbArray, [0, 0, 0]));

            if (contrastWithWhiteRatio > contrastWithBlackRatio) {
                colorBox.style.color = '#ffffff';
            } else if (contrastWithBlackRatio > contrastWithWhiteRatio) {
                colorBox.style.color = '#000000';
            } else {
                colorBox.style.color = contrastWithWhiteRatio >= 4.5 ? '#ffffff' : '#000000';
            }

            const contrastWithWhiteElement = document.createElement('div');
            contrastWithWhiteElement.dataset.slot = 'wcagWhite';
            contrastWithWhiteElement.innerHTML = `<strong>WCAG:White:</strong> ${contrastWithWhiteRatio}:1`;
            colorBox.appendChild(contrastWithWhiteElement);

            const contrastWithBlackElement = document.createElement('div');
            contrastWithBlackElement.dataset.slot = 'wcagBlack';
            contrastWithBlackElement.innerHTML = `<strong>WCAG:Black</strong> ${contrastWithBlackRatio}:1`;
            colorBox.appendChild(contrastWithBlackElement);

            const sampleTextElement = document.createElement('div');
            sampleTextElement.dataset.slot = 'sample';
            sampleTextElement.textContent = 'Gg Aa Rr Qq Ss';
            sampleTextElement.style.fontSize = '16pt';
            sampleTextElement.style.fontWeight = 'bold';

            colorBox.appendChild(sampleTextElement);

            if (shade === '900') {
                const lineBreak = document.createElement('div');
                lineBreak.style.gridColumn = `span ${colorShades.length + 1}`;
                chartContainer.appendChild(lineBreak);
            }

            return colorBox;
        });

        const colorBoxes = await Promise.all(shadeBoxes);
        colorBoxes.forEach(box => chartContainer.appendChild(box));
    }

    // Chart container already attached to world.

    // Normalize square sizing once everything is laid out.
    scheduleNormalizeColorBoxes();

    // Normalize again after fonts are ready (Google fonts / local selection).
    if (document.fonts && document.fonts.ready) {
        try {
            document.fonts.ready.then(() => scheduleNormalizeColorBoxes());
        } catch {
            // Ignore.
        }
    }

    // Initial view: center the generated chart.
    if (center) centerChart();
}

async function renderChart({ center = false } = {}) {
    // Clear existing chart before re-render.
    worldEl.innerHTML = '';
    await generateColorChart({ center });
    // Ensure transform/status stay current.
    applyTransform();
}

applyTransform();
setupSourceExtractionControls();
setupWorkbenchControls();
renderColorsOverlay();
renderWorkbench();
if (addColorBtnEl) {
    addColorBtnEl.addEventListener('click', () => {
        activeColors.push({ hex: '#808080' });
        preservePresetC = false;
        updateUrlFromActiveColors();
        renderColorsOverlay();
        renderWorkbench();
        scheduleRenderChart();
    });
}

if (saveUrlBtnEl) {
    saveUrlBtnEl.addEventListener('click', async () => {
        try {
            preservePresetC = false;
            updateUrlFromActiveColors();
            await copyTextToClipboard(window.location.href);
            showActionMessage('Copied URL to clipboard.');
        } catch {
            showActionMessage('Could not copy URL (clipboard unavailable).');
        }
    });
}

renderChart({ center: true }).then(() => {
    // Center and ensure status is correct once layout is ready.
    requestAnimationFrame(() => {
        centerChart();
        applyTransform();
    });
});
