(() => {
  'use strict';

  const STORAGE_KEY = 'tedt:tools:markdown-frontmatter-workbench:v2';
  const LEGACY_STORAGE_KEY = 'tedt:tools:markdown-frontmatter-preview:v1';
  const COOKIE_KEY = 'tedt_markdown_frontmatter_preview';
  const YAML_TOGGLE_STORAGE_KEY = 'tedt:tools:markdown-frontmatter-preview:yaml-expanded';
  const YAML_TOGGLE_COOKIE_KEY = 'tedt_markdown_frontmatter_preview_yaml_expanded';
  const PREFERENCES_STORAGE_KEY = 'tedt:tools:markdown-frontmatter-workbench:preferences:v2';
  const SAMPLE_DOCUMENT = `---
title: Markdown Front Matter Preview
description: A quick visual check for YAML front matter and rendered Markdown.
categories:
  - Tools
  - Writing
tags:
  - markdown
  - yaml
  - preview
published: true
author:
  name: Ted Tschopp
  role: Enterprise Architect
hero_image: /img/social-preview.webp
last_modified: 2026-03-07
---

# Live preview, without the guesswork

Use this page when you want to validate three things quickly:

1. The front matter fence is where you think it is.
2. The YAML shape looks right.
3. The Markdown body renders the way the site will likely present it.

## Why this exists

The failure mode is usually simple: a quote, an indent, or a missing fence.

> Front matter errors are rarely dramatic. They are usually quiet and expensive.

### Useful checks

- Confirm arrays render as arrays.
- Confirm dates and booleans are parsed the way you expect.
- Confirm headings, lists, links, and code blocks read cleanly.


\`\`\`yaml
no_toc: true
mermaid: false
\`\`\`

[View tedt.org](https://tedt.org)
`;

  const sourceInput = document.getElementById('sourceInput');
  const sampleBtn = document.getElementById('sampleBtn');
  const convertHtmlBtn = document.getElementById('convertHtmlBtn');
  const copyMarkdownBtn = document.getElementById('copyMarkdownBtn');
  const sourceCopyBtn = document.getElementById('sourceCopyBtn');
  const sourcePasteBtn = document.getElementById('sourcePasteBtn');
  const sourceClearBtn = document.getElementById('sourceClearBtn');
  const undoDocumentBtn = document.getElementById('undoDocumentBtn');
  const pasteModeSmart = document.getElementById('pasteModeSmart');
  const pasteModePlain = document.getElementById('pasteModePlain');
  const previewCopyHtmlBtn = document.getElementById('previewCopyHtmlBtn');
  const previewCopyBtn = document.getElementById('previewCopyBtn');
  const previewCopyStyledBtn = document.getElementById('previewCopyStyledBtn');
  const parseStatus = document.getElementById('parseStatus');
  const editorMeta = document.getElementById('editorMeta');
  const previewMeta = document.getElementById('previewMeta');
  const rawTextMeta = document.getElementById('rawTextMeta');
  const frontMatterStatus = document.getElementById('frontMatterStatus');
  const yamlStatus = document.getElementById('yamlStatus');
  const lineStats = document.getElementById('lineStats');
  const renderStats = document.getElementById('renderStats');
  const yamlPreviewSection = document.querySelector('.yaml-preview');
  const yamlToggleBtn = document.getElementById('yamlToggleBtn');
  const yamlPreviewTitle = document.getElementById('yamlPreviewTitle');
  const yamlPreviewBody = document.getElementById('yamlPreviewBody');
  const yamlPreviewBodyWrap = document.getElementById('yamlPreviewBodyWrap');
  const yamlPreviewMeta = document.getElementById('yamlPreviewMeta');
  const markdownPreviewBody = document.getElementById('markdownPreviewBody');
  const markdownPreviewTitle = document.getElementById('markdownPreviewTitle');
  const markdownPreviewMeta = document.getElementById('markdownPreviewMeta');
  const documentTab = document.getElementById('documentTab');
  const richImportTab = document.getElementById('richImportTab');
  const documentWorkspace = document.getElementById('documentWorkspace');
  const richImportWorkspace = document.getElementById('richImportWorkspace');
  const richImportInput = document.getElementById('richImportInput');
  const richImportMeta = document.getElementById('richImportMeta');
  const richImportStatus = document.getElementById('richImportStatus');
  const convertedMarkdownOutput = document.getElementById('convertedMarkdownOutput');
  const convertedMarkdownMeta = document.getElementById('convertedMarkdownMeta');
  const richImportPreview = document.getElementById('richImportPreview');
  const insertConvertedBtn = document.getElementById('insertConvertedBtn');
  const appendConvertedBtn = document.getElementById('appendConvertedBtn');
  const replaceBodyBtn = document.getElementById('replaceBodyBtn');
  const copyConvertedBtn = document.getElementById('copyConvertedBtn');
  const clearRichImportBtn = document.getElementById('clearRichImportBtn');
  const chooseImportFileBtn = document.getElementById('chooseImportFileBtn');
  const richImportFileInput = document.getElementById('richImportFileInput');
  const richImportDropZone = document.getElementById('richImportDropZone');
  const openDocumentBtn = document.getElementById('openDocumentBtn');
  const downloadConvertedBtn = document.getElementById('downloadConvertedBtn');
  const pasteRichImportBtn = document.getElementById('pasteRichImportBtn');
  const documentHistory = [];
  let lastDocumentSelection = { start: 0, end: 0 };
  let pendingDocumentText = '';
  const MAX_IMPORT_FILE_BYTES = 5 * 1024 * 1024;
  const validationProfile = document.getElementById('validationProfile');
  const validationSummary = document.getElementById('validationSummary');
  const validationFindings = document.getElementById('validationFindings');
  const dependencyBanner = document.getElementById('dependencyBanner');
  let currentWorkspace = 'document';

  const missingDependencies = [
    ['DOMPurify', window.DOMPurify],
    ['Marked', window.marked],
    ['js-yaml', window.jsyaml],
    ['Turndown', window.TurndownService]
  ].filter(([, dependency]) => !dependency).map(([name]) => name);

  if (missingDependencies.length) {
    dependencyBanner.hidden = false;
    dependencyBanner.textContent = `Could not load required libraries: ${missingDependencies.join(', ')}. Source text remains available, but affected previews and conversions are disabled.`;
  }

  function getCookie(name) {
    const prefix = `${name}=`;
    const match = document.cookie.split('; ').find((entry) => entry.startsWith(prefix));
    return match ? decodeURIComponent(match.slice(prefix.length)) : '';
  }

  function setCookie(name, value) {
    if (!value) {
      document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
      return;
    }

    const encoded = encodeURIComponent(value);
    document.cookie = `${name}=${encoded}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
  }

  function loadStoredBoolean(storageKey, cookieKey, defaultValue) {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved === 'true') {
        return true;
      }
      if (saved === 'false') {
        return false;
      }
    } catch (error) {
      // Local storage is optional in this tool.
    }

    const cookieValue = getCookie(cookieKey);
    if (cookieValue === 'true') {
      return true;
    }
    if (cookieValue === 'false') {
      return false;
    }

    return defaultValue;
  }

  function persistBoolean(storageKey, cookieKey, value) {
    try {
      window.localStorage.setItem(storageKey, value ? 'true' : 'false');
    } catch (error) {
      // Local storage is optional in this tool.
    }
    setCookie(cookieKey, '');
  }

  function loadPreferences() {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(PREFERENCES_STORAGE_KEY) || '{}');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (error) {
      return {};
    }
  }

  function savePreferences() {
    const preferences = {
      workspace: currentWorkspace,
      pasteMode: pasteModePlain.checked ? 'plain' : 'smart',
      validationProfile: validationProfile.value,
      yamlExpanded: yamlToggleBtn.getAttribute('aria-expanded') === 'true'
    };
    try {
      window.localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      // Preferences are optional; keep the editor usable.
    }
  }

  function setYamlExpanded(expanded) {
    yamlPreviewSection.classList.toggle('is-expanded', expanded);
    yamlPreviewBodyWrap.hidden = !expanded;
    yamlToggleBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  }

  function toggleYamlExpanded() {
    const nextValue = yamlToggleBtn.getAttribute('aria-expanded') !== 'true';
    setYamlExpanded(nextValue);
    persistBoolean(YAML_TOGGLE_STORAGE_KEY, YAML_TOGGLE_COOKIE_KEY, nextValue);
    savePreferences();
  }

  if (window.marked) {
    window.marked.setOptions({
      gfm: true,
      breaks: true,
      headerIds: false,
      mangle: false
    });
  }

  const turndownService = window.TurndownService ? new window.TurndownService({
    headingStyle: 'atx',
    hr: '---',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
    strongDelimiter: '**',
    linkStyle: 'inlined'
  }) : null;

  if (!turndownService || !window.DOMPurify) {
    convertHtmlBtn.disabled = true;
  }

  if (turndownService) {
    if (window.turndownPluginGfm && typeof window.turndownPluginGfm.gfm === 'function') {
      turndownService.use(window.turndownPluginGfm.gfm);
    }

    turndownService.remove(['script', 'style', 'noscript', 'template', 'meta', 'link']);
    turndownService.addRule('fencedCodeBlockWithLanguage', {
      filter(node) {
        return node.nodeName === 'PRE' && node.firstChild && node.firstChild.nodeName === 'CODE';
      },
      replacement(content, node) {
        const codeNode = node.firstChild;
        const className = codeNode.getAttribute('class') || '';
        const languageMatch = className.match(/(?:language|lang)-([^\s]+)/);
        const language = languageMatch ? languageMatch[1] : '';
        const code = codeNode.textContent.replace(/\n$/, '');
        return `\n\n\`\`\`${language}\n${code}\n\`\`\`\n\n`;
      }
    });
  }

  function loadInitialDocument() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && saved.trim()) {
        sourceInput.value = saved;
        return;
      }
      const legacySaved = window.localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacySaved && legacySaved.trim()) {
        sourceInput.value = legacySaved;
        window.localStorage.setItem(STORAGE_KEY, legacySaved);
        window.localStorage.removeItem(LEGACY_STORAGE_KEY);
        setCookie(COOKIE_KEY, '');
        return;
      }
    } catch (error) {
      // Local storage is optional in this tool.
    }

    const cookieValue = getCookie(COOKIE_KEY);
    if (cookieValue && cookieValue.trim()) {
      sourceInput.value = cookieValue;
      try {
        window.localStorage.setItem(STORAGE_KEY, cookieValue);
      } catch (error) {
        // The draft remains available for this session if storage is blocked.
      }
      setCookie(COOKIE_KEY, '');
      return;
    }

    sourceInput.value = SAMPLE_DOCUMENT;
  }

  function saveDocument(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch (error) {
      // Ignore persistence failures and keep the app usable.
    }
    setCookie(COOKIE_KEY, '');
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function countLines(value) {
    if (!value.length) {
      return 0;
    }
    return value.split(/\r?\n/).length;
  }

  function splitFrontMatter(value) {
    const normalized = value.replace(/^\uFEFF/, '');
    if (!normalized.startsWith('---\n') && !normalized.startsWith('---\r\n')) {
      return {
        hasFrontMatter: false,
        yaml: '',
        markdown: value,
        error: ''
      };
    }

    const lines = normalized.split(/\r?\n/);
    let closingIndex = -1;
    for (let index = 1; index < lines.length; index += 1) {
      if (lines[index].trim() === '---') {
        closingIndex = index;
        break;
      }
    }

    if (closingIndex === -1) {
      return {
        hasFrontMatter: true,
        yaml: lines.slice(1).join('\n'),
        markdown: '',
        error: 'Opening front matter fence found, but no closing --- fence was detected.'
      };
    }

    return {
      hasFrontMatter: true,
      yaml: lines.slice(1, closingIndex).join('\n'),
      markdown: lines.slice(closingIndex + 1).join('\n'),
      error: ''
    };
  }

  function parseFrontMatterMapping(split) {
    if (!split.hasFrontMatter || !split.yaml.trim()) {
      return { data: null, error: '' };
    }
    if (!window.jsyaml) {
      return { data: null, error: 'YAML preview unavailable because js-yaml did not load.' };
    }
    try {
      const data = window.jsyaml.load(split.yaml);
      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return { data: null, error: 'Front matter must be a YAML mapping.' };
      }
      return { data, error: '' };
    } catch (error) {
      return { data: null, error: error.message || 'YAML parsing failed.' };
    }
  }

  function isBlank(value) {
    return value === undefined || value === null || (typeof value === 'string' && !value.trim());
  }

  function isHttpsUrl(value) {
    try {
      return new URL(String(value)).protocol === 'https:';
    } catch (error) {
      return false;
    }
  }

  function validateDocument(value, profile) {
    const findings = [];
    const add = (severity, message) => findings.push({ severity, message });
    const split = splitFrontMatter(value);

    if (split.error) {
      add('error', split.error);
      return findings;
    }
    if (!split.hasFrontMatter) {
      add('info', 'No front matter detected; the document is valid Markdown-only content.');
      return findings;
    }

    const parsed = parseFrontMatterMapping(split);
    if (parsed.error) {
      add('error', parsed.error);
      return findings;
    }
    add('info', 'Front matter is a valid YAML mapping.');
    if (profile !== 'tedt') {
      return findings;
    }

    const data = parsed.data || {};
    const requiredFields = ['layout', 'title', 'description', 'date', 'categories'];
    requiredFields.forEach((field) => {
      if (isBlank(data[field]) || (Array.isArray(data[field]) && data[field].length === 0)) {
        add('error', `Missing ${field}.`);
      }
    });

    if (!isBlank(data.description) && String(data.description).length > 160) {
      add('warning', `Description is ${String(data.description).length} characters; target 160 or fewer.`);
    }
    ['categories', 'tags', 'keywords'].forEach((field) => {
      if (!isBlank(data[field]) && !Array.isArray(data[field])) {
        add('warning', `${field} should be a YAML array.`);
      }
    });
    ['no_toc', 'mermaid', 'published'].forEach((field) => {
      if (!isBlank(data[field]) && typeof data[field] !== 'boolean') {
        add('warning', `${field} should be a Boolean.`);
      }
    });

    if (!isBlank(data.image)) {
      const imageValue = String(data.image);
      if (!imageValue.startsWith('/') && !isHttpsUrl(imageValue)) {
        add('warning', 'Image paths should start with / or use an HTTPS URL.');
      }
      if (isBlank(data['image-alt'])) {
        add('error', 'image-alt is required when image is set.');
      }
    }
    if (!isBlank(data['image-alt'])) {
      const altText = String(data['image-alt']);
      if (altText.length > 300) {
        add('warning', `image-alt is ${altText.length} characters; target 300 or fewer.`);
      }
      if (altText.split('"').length - 1 === 1) {
        add('warning', 'image-alt contains an unmatched double quote.');
      }
    }
    if (!isBlank(data.permalink) && !/^\/[A-Za-z0-9/_-]*\/$/.test(String(data.permalink))) {
      add('warning', 'Permalink should be a root-relative path ending with /.');
    }
    if (!isBlank(data.canonical) && !isHttpsUrl(data.canonical)) {
      add('warning', 'Canonical URL should use HTTPS.');
    }

    const hasMermaidFence = /```mermaid\b/i.test(split.markdown);
    if (hasMermaidFence && data.mermaid !== true) {
      add('error', 'Mermaid content requires mermaid: true.');
    } else if (!hasMermaidFence && data.mermaid === true) {
      add('info', 'mermaid is enabled, but no Mermaid fence was detected.');
    }

    if (data.layout === 'slide-deck') {
      ['format', 'deck_url', 'deck_sha256', 'slide_count', 'permalink'].forEach((field) => {
        if (isBlank(data[field])) {
          add('error', `slide-deck requires ${field}.`);
        }
      });
      if (!isBlank(data.format) && data.format !== 'standalone-html') {
        add('error', 'slide-deck format should be standalone-html.');
      }
    }

    if (data.substack && data.substack.enabled === true) {
      if (isBlank(data.substack.id)) {
        add('error', 'Enabled Substack publishing requires substack.id.');
      }
      if (!data.substack.delivery || typeof data.substack.delivery.web !== 'boolean' || typeof data.substack.delivery.email !== 'boolean') {
        add('error', 'Enabled Substack publishing requires Boolean delivery.web and delivery.email values.');
      }
    }

    if (!findings.some((finding) => finding.severity === 'error' || finding.severity === 'warning')) {
      add('info', 'No Tedt.org authoring issues detected.');
    }
    return findings;
  }

  function renderValidationFindings(value) {
    const profile = validationProfile.value;
    const findings = validateDocument(value, profile);
    const groups = [
      { severity: 'error', label: 'Errors' },
      { severity: 'warning', label: 'Warnings' },
      { severity: 'info', label: 'Information' }
    ];
    validationSummary.textContent = profile === 'tedt'
      ? 'Tedt.org authoring checks'
      : 'Generic document checks';
    validationFindings.replaceChildren();

    groups.forEach((group) => {
      const groupFindings = findings.filter((finding) => finding.severity === group.severity);
      if (!groupFindings.length) {
        return;
      }
      const section = document.createElement('section');
      section.className = 'validation-group';
      section.dataset.severity = group.severity;
      const heading = document.createElement('h3');
      heading.textContent = `${group.label} (${groupFindings.length})`;
      const list = document.createElement('ul');
      groupFindings.forEach((finding) => {
        const item = document.createElement('li');
        item.className = 'validation-finding';
        item.textContent = finding.message;
        list.appendChild(item);
      });
      section.appendChild(heading);
      section.appendChild(list);
      validationFindings.appendChild(section);
    });
  }

  function getMarkdownBodyStart(value) {
    const normalized = value.replace(/^\uFEFF/, '');
    const bomOffset = value.length - normalized.length;
    if (!normalized.startsWith('---\n') && !normalized.startsWith('---\r\n')) {
      return 0;
    }

    const linePattern = /.*(?:\r\n|\n|$)/g;
    let lineNumber = 0;
    for (const match of normalized.matchAll(linePattern)) {
      if (!match[0]) {
        continue;
      }
      if (lineNumber > 0 && match[0].replace(/\r?\n$/, '').trim() === '---') {
        return bomOffset + match.index + match[0].length;
      }
      lineNumber += 1;
    }

    return -1;
  }

  function getMarkdownBodyFromSource() {
    const split = splitFrontMatter(sourceInput.value);
    return split.error ? '' : split.markdown;
  }

  function normalizeHtmlForMarkdown(htmlText) {
    const parser = new DOMParser();
    const documentValue = parser.parseFromString(htmlText, 'text/html');
    const bodyHtml = documentValue.body ? documentValue.body.innerHTML.trim() : '';
    return bodyHtml || htmlText;
  }

  function normalizeConvertedMarkdown(markdownText) {
    return markdownText
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{4,}/g, '\n\n\n')
      .trim();
  }

  function sanitizeHtml(htmlText) {
    if (!window.DOMPurify) {
      throw new Error('The HTML sanitizer library did not load.');
    }

    return window.DOMPurify.sanitize(htmlText, { USE_PROFILES: { html: true } });
  }

  function convertHtmlFragmentToMarkdown(htmlText) {
    if (!turndownService) {
      throw new Error('The HTML converter library did not load.');
    }

    return normalizeConvertedMarkdown(turndownService.turndown(normalizeHtmlForMarkdown(sanitizeHtml(htmlText))));
  }

  function renderSafeMarkdown(markdownText) {
    if (!window.marked || !window.DOMPurify) {
      return '';
    }
    return sanitizeHtml(window.marked.parse(markdownText));
  }

  function setWorkspace(workspaceName, moveFocus = false) {
    const showDocument = workspaceName === 'document';
    currentWorkspace = showDocument ? 'document' : 'rich-import';
    documentTab.setAttribute('aria-selected', showDocument ? 'true' : 'false');
    richImportTab.setAttribute('aria-selected', showDocument ? 'false' : 'true');
    documentTab.tabIndex = showDocument ? 0 : -1;
    richImportTab.tabIndex = showDocument ? -1 : 0;
    documentWorkspace.hidden = !showDocument;
    richImportWorkspace.hidden = showDocument;
    if (moveFocus) {
      (showDocument ? sourceInput : richImportInput).focus();
    }
    savePreferences();
  }

  function refreshConvertedMarkdownPresentation(markdownText, sourceLabel = 'Edited Markdown') {
    const hasMarkdown = Boolean(markdownText.trim());
    richImportMeta.textContent = sourceLabel;
    convertedMarkdownMeta.textContent = hasMarkdown
      ? `${countLines(markdownText)} ${countLines(markdownText) === 1 ? 'line' : 'lines'}`
      : 'Empty';
    if (hasMarkdown && (!window.marked || !window.DOMPurify)) {
      richImportPreview.textContent = 'Rendered preview unavailable because a required library did not load.';
    } else {
      richImportPreview.innerHTML = hasMarkdown
        ? renderSafeMarkdown(markdownText)
        : '<div class="empty-state">Converted content will render here.</div>';
    }
    insertConvertedBtn.disabled = !hasMarkdown;
    appendConvertedBtn.disabled = !hasMarkdown;
    replaceBodyBtn.disabled = !hasMarkdown;
    copyConvertedBtn.disabled = !hasMarkdown;
    downloadConvertedBtn.disabled = !hasMarkdown;
  }

  function setConvertedMarkdown(markdownText, sourceLabel = 'Plain text') {
    const normalized = normalizeConvertedMarkdown(markdownText);
    convertedMarkdownOutput.value = normalized;
    refreshConvertedMarkdownPresentation(normalized, sourceLabel);
  }

  function convertRichImportHtml(htmlText) {
    try {
      const markdownText = convertHtmlFragmentToMarkdown(htmlText);
      setConvertedMarkdown(markdownText, 'Rich HTML');
      richImportStatus.textContent = markdownText
        ? 'Rich text sanitized and converted to Markdown.'
        : 'The rich text did not contain convertible content.';
    } catch (error) {
      setConvertedMarkdown('', 'Conversion error');
      richImportStatus.textContent = error.message || 'Rich-text conversion failed.';
    }
  }

  function rememberDocumentSelection() {
    lastDocumentSelection = {
      start: sourceInput.selectionStart,
      end: sourceInput.selectionEnd
    };
  }

  function pushDocumentHistory() {
    documentHistory.push({
      value: sourceInput.value,
      selectionStart: sourceInput.selectionStart,
      selectionEnd: sourceInput.selectionEnd
    });
    if (documentHistory.length > 20) {
      documentHistory.shift();
    }
    undoDocumentBtn.disabled = false;
  }

  function restorePreviousDocument() {
    const previous = documentHistory.pop();
    if (!previous) {
      return;
    }
    sourceInput.value = previous.value;
    sourceInput.setSelectionRange(previous.selectionStart, previous.selectionEnd);
    undoDocumentBtn.disabled = documentHistory.length === 0;
    updatePreview();
    setWorkspace('document');
    sourceInput.focus();
    parseStatus.textContent = 'Restored the previous document state.';
  }

  function canEditMarkdownRange(start, end) {
    const split = splitFrontMatter(sourceInput.value);
    const bodyStart = getMarkdownBodyStart(sourceInput.value);
    return !split.error && bodyStart >= 0 && start >= bodyStart && end >= bodyStart;
  }

  function routeRichPasteToImport(htmlText, plainText) {
    richImportInput.value = plainText;
    convertRichImportHtml(htmlText);
    setWorkspace('rich-import');
    richImportStatus.textContent = 'Paste targeted front matter, so the document was protected and the conversion was opened here.';
    richImportInput.focus();
  }

  function applySmartDocumentPaste(htmlText, plainText, start, end) {
    if (!canEditMarkdownRange(start, end)) {
      routeRichPasteToImport(htmlText, plainText);
      return;
    }
    try {
      const markdownText = convertHtmlFragmentToMarkdown(htmlText);
      pushDocumentHistory();
      sourceInput.setRangeText(markdownText, start, end, 'end');
      rememberDocumentSelection();
      updatePreview();
      sourceInput.focus();
      parseStatus.textContent = 'Rich text sanitized and inserted as Markdown.';
    } catch (error) {
      routeRichPasteToImport(htmlText, plainText);
      richImportStatus.textContent = error.message || 'Rich-text conversion failed.';
    }
  }

  function insertConvertedMarkdown() {
    const markdownText = convertedMarkdownOutput.value.trim();
    if (!markdownText) {
      return;
    }
    const start = lastDocumentSelection.start;
    const end = lastDocumentSelection.end;
    if (!canEditMarkdownRange(start, end)) {
      richImportStatus.textContent = 'Move the document cursor into the Markdown body before inserting.';
      return;
    }
    pushDocumentHistory();
    sourceInput.setRangeText(markdownText, start, end, 'end');
    updatePreview();
    setWorkspace('document');
    sourceInput.focus();
    parseStatus.textContent = 'Converted Markdown inserted at the document cursor.';
  }

  function appendConvertedMarkdown() {
    const markdownText = convertedMarkdownOutput.value.trim();
    if (!markdownText) {
      return;
    }
    const split = splitFrontMatter(sourceInput.value);
    if (split.error) {
      richImportStatus.textContent = 'Close the front matter fence before appending content.';
      return;
    }
    pushDocumentHistory();
    const separator = sourceInput.value.endsWith('\n\n')
      ? ''
      : sourceInput.value.endsWith('\n') ? '\n' : '\n\n';
    sourceInput.value = `${sourceInput.value}${separator}${markdownText}`;
    sourceInput.setSelectionRange(sourceInput.value.length, sourceInput.value.length);
    updatePreview();
    setWorkspace('document');
    sourceInput.focus();
    parseStatus.textContent = 'Converted Markdown appended to the document body.';
  }

  function replaceDocumentBody() {
    const markdownText = convertedMarkdownOutput.value.trim();
    if (!markdownText || !window.confirm('Replace the current Markdown body? Front matter will be preserved.')) {
      return;
    }
    const bodyStart = getMarkdownBodyStart(sourceInput.value);
    if (bodyStart < 0) {
      richImportStatus.textContent = 'Close the front matter fence before replacing the body.';
      return;
    }
    pushDocumentHistory();
    sourceInput.value = bodyStart === 0
      ? markdownText
      : `${sourceInput.value.slice(0, bodyStart)}\n${markdownText}`;
    sourceInput.setSelectionRange(sourceInput.value.length, sourceInput.value.length);
    updatePreview();
    setWorkspace('document');
    sourceInput.focus();
    parseStatus.textContent = 'Markdown body replaced. Use Undo to restore it.';
  }

  async function copyConvertedMarkdown() {
    try {
      await navigator.clipboard.writeText(convertedMarkdownOutput.value);
      richImportStatus.textContent = 'Converted Markdown copied to the clipboard.';
    } catch (error) {
      richImportStatus.textContent = 'Markdown copy failed in this browser context.';
    }
  }

  async function pasteRichImportFromClipboard() {
    if (!navigator.clipboard || typeof navigator.clipboard.read !== 'function') {
      richImportStatus.textContent = 'Rich clipboard access is unavailable. Focus the paste area and use Cmd/Ctrl+V.';
      richImportInput.focus();
      return;
    }

    try {
      const clipboardItems = await navigator.clipboard.read();
      const htmlItem = clipboardItems.find((item) => item.types.includes('text/html'));
      if (htmlItem) {
        const htmlText = await (await htmlItem.getType('text/html')).text();
        const plainItem = clipboardItems.find((item) => item.types.includes('text/plain'));
        const plainText = plainItem
          ? await (await plainItem.getType('text/plain')).text()
          : new DOMParser().parseFromString(sanitizeHtml(htmlText), 'text/html').body.textContent || '';
        richImportInput.value = plainText;
        convertRichImportHtml(htmlText);
        richImportStatus.textContent = 'Rich clipboard content sanitized and converted to Markdown.';
        return;
      }

      const plainItem = clipboardItems.find((item) => item.types.includes('text/plain'));
      if (plainItem) {
        const plainText = await (await plainItem.getType('text/plain')).text();
        richImportInput.value = plainText;
        setConvertedMarkdown(plainText, 'Plain clipboard text');
        richImportStatus.textContent = 'Plain clipboard text loaded as Markdown.';
        return;
      }

      richImportStatus.textContent = 'The clipboard does not contain HTML or plain text.';
    } catch (error) {
      richImportStatus.textContent = 'Clipboard access was denied. Focus the paste area and use Cmd/Ctrl+V.';
      richImportInput.focus();
    }
  }

  function downloadConvertedMarkdown() {
    const markdownText = convertedMarkdownOutput.value;
    if (!markdownText) {
      return;
    }
    const blob = new Blob([markdownText], { type: 'text/markdown;charset=utf-8' });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = 'converted-content.md';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
    richImportStatus.textContent = 'Converted Markdown downloaded.';
  }

  function openPendingDocument() {
    if (!pendingDocumentText) {
      return;
    }
    pushDocumentHistory();
    sourceInput.value = pendingDocumentText;
    sourceInput.setSelectionRange(sourceInput.value.length, sourceInput.value.length);
    updatePreview();
    setWorkspace('document');
    sourceInput.focus();
    parseStatus.textContent = 'Local Markdown document opened.';
  }

  function getFileExtension(fileName) {
    const match = String(fileName || '').toLowerCase().match(/(\.[a-z0-9]+)$/);
    return match ? match[1] : '';
  }

  async function processImportFile(file) {
    pendingDocumentText = '';
    openDocumentBtn.disabled = true;
    if (!file) {
      return;
    }
    if (file.size > MAX_IMPORT_FILE_BYTES) {
      richImportStatus.textContent = `${file.name} is larger than the 5 MiB limit.`;
      return;
    }

    const extension = getFileExtension(file.name);
    if (!['.html', '.htm', '.md', '.markdown', '.txt'].includes(extension)) {
      richImportStatus.textContent = `${file.name} is not a supported HTML, Markdown, or text file.`;
      return;
    }

    try {
      const text = await file.text();
      if (!text.trim()) {
        clearRichImport();
        richImportStatus.textContent = `${file.name} is empty.`;
        return;
      }

      richImportInput.value = text;
      if (extension === '.html' || extension === '.htm') {
        convertRichImportHtml(text);
        richImportStatus.textContent = `${file.name} sanitized and converted from HTML.`;
        return;
      }

      const split = splitFrontMatter(text);
      if ((extension === '.md' || extension === '.markdown') && split.hasFrontMatter && !split.error) {
        pendingDocumentText = text;
        openDocumentBtn.disabled = false;
        setConvertedMarkdown(split.markdown, 'Markdown document');
        richImportStatus.textContent = `${file.name} loaded. Open it as a complete document or use its Markdown body.`;
        return;
      }

      setConvertedMarkdown(text, extension === '.txt' ? 'Plain text file' : 'Markdown file');
      richImportStatus.textContent = `${file.name} loaded as Markdown.`;
    } catch (error) {
      setConvertedMarkdown('', 'File error');
      richImportStatus.textContent = `Could not read ${file.name}.`;
    }
  }

  function clearRichImport() {
    richImportInput.value = '';
    pendingDocumentText = '';
    openDocumentBtn.disabled = true;
    richImportFileInput.value = '';
    setConvertedMarkdown('', 'Waiting');
    richImportStatus.textContent = 'Ready for rich text.';
    richImportInput.focus();
  }

  function rebuildSourceWithMarkdown(split, markdownText) {
    if (!split.hasFrontMatter) {
      return markdownText;
    }

    const yamlBlock = split.yaml.trimEnd();
    const yamlSource = yamlBlock ? `${yamlBlock}\n` : '';
    return `---\n${yamlSource}---\n\n${markdownText}`;
  }

  function convertSourceHtmlToMarkdown() {
    const split = splitFrontMatter(sourceInput.value);

    if (split.error) {
      parseStatus.textContent = 'Close the YAML front matter fence before converting HTML.';
      return;
    }

    const sourceHtml = split.hasFrontMatter ? split.markdown.trim() : sourceInput.value.trim();
    if (!sourceHtml) {
      parseStatus.textContent = 'There is no HTML to convert.';
      return;
    }

    try {
      const markdownText = convertHtmlFragmentToMarkdown(sourceHtml);
      sourceInput.value = rebuildSourceWithMarkdown(split, markdownText);
      updatePreview();
      sourceInput.focus();
      parseStatus.textContent = split.hasFrontMatter
        ? 'HTML body converted to Markdown and front matter preserved.'
        : 'HTML converted to Markdown.';
    } catch (error) {
      parseStatus.textContent = error.message || 'HTML conversion failed.';
    }
  }

  function valueToMarkup(value) {
    if (Array.isArray(value)) {
      if (!value.length) {
        return '<span class="text-body-secondary">[]</span>';
      }

      return `<div class="yaml-value-list">${value.map((item) => `<span class="yaml-chip">${escapeHtml(formatScalar(item))}</span>`).join('')}</div>`;
    }

    if (value && typeof value === 'object') {
      return `<pre class="yaml-raw">${escapeHtml(window.jsyaml.dump(value).trim())}</pre>`;
    }

    return escapeHtml(formatScalar(value));
  }

  function formatScalar(value) {
    if (value === null) {
      return 'null';
    }
    if (typeof value === 'boolean') {
      return value ? 'true' : 'false';
    }
    if (value instanceof Date && !Number.isNaN(value.valueOf())) {
      return value.toISOString();
    }
    return String(value);
  }

  function renderYamlPreview(yamlText) {
    if (!yamlText.trim()) {
      yamlPreviewMeta.textContent = 'No keys';
      yamlStatus.textContent = 'No YAML';
      yamlPreviewBody.innerHTML = '<div class="empty-state">No YAML front matter detected. Add an opening <code>---</code> line, your YAML, and a closing <code>---</code> line to populate this panel.</div>';
      return;
    }

    if (!window.jsyaml) {
      yamlPreviewMeta.textContent = 'Unavailable';
      yamlStatus.textContent = 'YAML unavailable';
      yamlPreviewBody.textContent = 'YAML preview unavailable because js-yaml did not load.';
      return;
    }

    try {
      const parsed = window.jsyaml.load(yamlText);

      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        yamlPreviewMeta.textContent = 'Scalar YAML';
        yamlStatus.textContent = 'YAML ready';
        yamlPreviewBody.innerHTML = `<pre class="yaml-raw">${escapeHtml(yamlText)}</pre>`;
        return;
      }

      const entries = Object.entries(parsed);
      yamlPreviewMeta.textContent = `${entries.length} ${entries.length === 1 ? 'key' : 'keys'}`;
      yamlStatus.textContent = 'YAML ready';
      yamlPreviewBody.innerHTML = `<dl class="yaml-grid">${entries.map(([key, value]) => `<dt>${escapeHtml(key)}</dt><dd>${valueToMarkup(value)}</dd>`).join('')}</dl>`;
    } catch (error) {
      yamlPreviewMeta.textContent = 'Parse error';
      yamlStatus.textContent = 'YAML error';
      yamlPreviewBody.innerHTML = `
        <div class="error-box" role="alert">
          <strong>YAML parse error.</strong><br>
          ${escapeHtml(error.message)}
        </div>
        <pre class="yaml-raw mt-3">${escapeHtml(yamlText)}</pre>
      `;
    }
  }

  function renderMarkdownPreview(markdownText) {
    const trimmed = markdownText.trim();

    if (!trimmed) {
      markdownPreviewMeta.textContent = 'Empty';
      markdownPreviewBody.innerHTML = '<div class="empty-state">The Markdown body is empty. Add content below the closing front matter fence to see the rendered preview.</div>';
      return;
    }

    if (!window.marked || !window.DOMPurify) {
      markdownPreviewMeta.textContent = 'Unavailable';
      markdownPreviewBody.textContent = 'Rendered preview unavailable because a required library did not load.';
      return;
    }

    markdownPreviewMeta.textContent = `${countLines(markdownText)} ${countLines(markdownText) === 1 ? 'line' : 'lines'}`;
    markdownPreviewBody.innerHTML = renderSafeMarkdown(markdownText);
  }

  function updatePreview() {
    const value = sourceInput.value;
    const split = splitFrontMatter(value);
    const chars = value.length;
    const lines = countLines(value);

    saveDocument(value);

    lineStats.textContent = `${lines} ${lines === 1 ? 'line' : 'lines'}`;
    renderStats.textContent = `${chars} ${chars === 1 ? 'char' : 'chars'}`;
    rawTextMeta.textContent = `${lines} ${lines === 1 ? 'line' : 'lines'}`;
    editorMeta.textContent = `${lines} lines · ${chars} chars`;
    renderValidationFindings(value);

    if (split.hasFrontMatter) {
      frontMatterStatus.textContent = 'Front matter detected';
    } else {
      frontMatterStatus.textContent = 'No front matter';
    }

    if (split.error) {
      parseStatus.textContent = split.error;
      previewMeta.textContent = 'Incomplete front matter';
      yamlStatus.textContent = 'YAML pending';
      yamlPreviewMeta.textContent = 'Fence issue';
      yamlPreviewBody.innerHTML = `<div class="error-box" role="alert">${escapeHtml(split.error)}</div>`;
      markdownPreviewMeta.textContent = 'Waiting';
      markdownPreviewBody.innerHTML = '<div class="empty-state">Close the YAML front matter fence to render the Markdown body.</div>';
      return;
    }

    parseStatus.textContent = split.hasFrontMatter ? 'Parsed source into YAML front matter and Markdown body.' : 'Rendering the full blob as Markdown because no front matter fence was detected.';
    previewMeta.textContent = split.hasFrontMatter ? 'YAML + Markdown' : 'Markdown only';

    renderYamlPreview(split.yaml);
    renderMarkdownPreview(split.markdown);
  }

  async function copySourceToClipboard() {
    try {
      await navigator.clipboard.writeText(sourceInput.value);
      parseStatus.textContent = 'Source copied to the clipboard.';
    } catch (error) {
      parseStatus.textContent = 'Clipboard copy failed in this browser context.';
    }
  }

  async function copyMarkdownToClipboard() {
    const markdownText = getMarkdownBodyFromSource().trim();

    if (!markdownText) {
      parseStatus.textContent = 'There is no Markdown body to copy.';
      return;
    }

    try {
      await navigator.clipboard.writeText(markdownText);
      parseStatus.textContent = 'Markdown body copied to the clipboard.';
    } catch (error) {
      parseStatus.textContent = 'Markdown copy failed in this browser context.';
    }
  }

  async function pasteSourceFromClipboard() {
    try {
      if (pasteModeSmart.checked && navigator.clipboard && typeof navigator.clipboard.read === 'function') {
        const clipboardItems = await navigator.clipboard.read();
        const htmlItem = clipboardItems.find((item) => item.types.includes('text/html'));
        if (htmlItem) {
          const htmlText = await (await htmlItem.getType('text/html')).text();
          const plainItem = clipboardItems.find((item) => item.types.includes('text/plain'));
          const plainText = plainItem ? await (await plainItem.getType('text/plain')).text() : '';
          applySmartDocumentPaste(
            htmlText,
            plainText,
            sourceInput.selectionStart,
            sourceInput.selectionEnd
          );
          return;
        }
      }

      const text = await navigator.clipboard.readText();
      if (!text) {
        parseStatus.textContent = 'Clipboard is empty.';
        return;
      }

      pushDocumentHistory();
      if (pasteModeSmart.checked && canEditMarkdownRange(sourceInput.selectionStart, sourceInput.selectionEnd)) {
        sourceInput.setRangeText(text, sourceInput.selectionStart, sourceInput.selectionEnd, 'end');
      } else {
        sourceInput.value = text;
        sourceInput.setSelectionRange(sourceInput.value.length, sourceInput.value.length);
      }
      updatePreview();
      sourceInput.focus();
      parseStatus.textContent = pasteModeSmart.checked
        ? 'Plain clipboard text inserted into the Markdown body.'
        : 'Clipboard pasted into the source editor.';
    } catch (error) {
      parseStatus.textContent = 'Clipboard paste failed in this browser context.';
    }
  }

  function buildPreviewClipboardPayload() {
    const richWrapper = document.createElement('div');
    richWrapper.innerHTML = `
      <section>
        <h2>YAML Front Matter</h2>
        ${yamlPreviewBody.innerHTML}
      </section>
      <section>
        <h2>Rendered Markdown</h2>
        ${markdownPreviewBody.innerHTML}
      </section>
    `;

    const plainText = [
      'YAML Front Matter',
      yamlPreviewBody.innerText.trim(),
      '',
      'Rendered Markdown',
      markdownPreviewBody.innerText.trim()
    ].join('\n').trim();

    return {
      html: richWrapper.innerHTML,
      text: plainText
    };
  }

  function copyComputedStyles(sourceNode, targetNode) {
    if (!(sourceNode instanceof Element) || !(targetNode instanceof Element)) {
      return;
    }

    const computed = window.getComputedStyle(sourceNode);
    for (const propertyName of computed) {
      targetNode.style.setProperty(
        propertyName,
        computed.getPropertyValue(propertyName),
        computed.getPropertyPriority(propertyName)
      );
    }

    targetNode.style.setProperty('box-sizing', 'border-box');

    const sourceChildren = Array.from(sourceNode.children);
    const targetChildren = Array.from(targetNode.children);
    for (let index = 0; index < sourceChildren.length; index += 1) {
      copyComputedStyles(sourceChildren[index], targetChildren[index]);
    }
  }

  function createStyledClone(sourceNode) {
    const clone = sourceNode.cloneNode(true);
    copyComputedStyles(sourceNode, clone);
    return clone;
  }

  function buildStyledPreviewClipboardPayload() {
    const wrapper = document.createElement('div');
    wrapper.style.fontFamily = window.getComputedStyle(markdownPreviewBody).fontFamily;
    wrapper.style.color = window.getComputedStyle(markdownPreviewBody).color;
    wrapper.style.background = 'transparent';

    const yamlSection = document.createElement('section');
    yamlSection.style.marginBottom = '1.5rem';
    yamlSection.appendChild(createStyledClone(yamlPreviewTitle));
    yamlSection.appendChild(createStyledClone(yamlPreviewBody));

    const markdownSection = document.createElement('section');
    markdownSection.appendChild(createStyledClone(markdownPreviewTitle));
    markdownSection.appendChild(createStyledClone(markdownPreviewBody));

    wrapper.appendChild(yamlSection);
    wrapper.appendChild(markdownSection);

    return {
      html: wrapper.innerHTML,
      text: [
        'YAML Front Matter',
        yamlPreviewBody.innerText.trim(),
        '',
        'Rendered Markdown',
        markdownPreviewBody.innerText.trim()
      ].join('\n').trim()
    };
  }

  async function copyPreviewRichText() {
    const payload = buildPreviewClipboardPayload();

    try {
      if (navigator.clipboard && window.ClipboardItem) {
        const item = new window.ClipboardItem({
          'text/html': new Blob([payload.html], { type: 'text/html' }),
          'text/plain': new Blob([payload.text], { type: 'text/plain' })
        });
        await navigator.clipboard.write([item]);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(payload.text);
      } else {
        throw new Error('Clipboard API unavailable');
      }

      parseStatus.textContent = 'Preview copied as rich text.';
    } catch (error) {
      parseStatus.textContent = 'Preview rich-text copy failed in this browser context.';
    }
  }

  async function copyPreviewHtml() {
    const payload = buildPreviewClipboardPayload();

    try {
      await navigator.clipboard.writeText(payload.html);
      parseStatus.textContent = 'Preview HTML copied to the clipboard.';
    } catch (error) {
      parseStatus.textContent = 'Preview HTML copy failed in this browser context.';
    }
  }

  async function copyPreviewStyledRichText() {
    const payload = buildStyledPreviewClipboardPayload();

    try {
      if (navigator.clipboard && window.ClipboardItem) {
        const item = new window.ClipboardItem({
          'text/html': new Blob([payload.html], { type: 'text/html' }),
          'text/plain': new Blob([payload.text], { type: 'text/plain' })
        });
        await navigator.clipboard.write([item]);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(payload.text);
      } else {
        throw new Error('Clipboard API unavailable');
      }

      parseStatus.textContent = 'Preview copied as styled rich text.';
    } catch (error) {
      parseStatus.textContent = 'Styled rich-text copy failed in this browser context.';
    }
  }

  sourceInput.addEventListener('input', updatePreview);

  sourceInput.addEventListener('select', rememberDocumentSelection);
  sourceInput.addEventListener('click', rememberDocumentSelection);
  sourceInput.addEventListener('keyup', rememberDocumentSelection);

  sourceInput.addEventListener('paste', (event) => {
    if (!pasteModeSmart.checked || !event.clipboardData) {
      return;
    }
    const htmlText = event.clipboardData.getData('text/html');
    if (!htmlText.trim()) {
      return;
    }
    event.preventDefault();
    const plainText = event.clipboardData.getData('text/plain');
    applySmartDocumentPaste(
      htmlText,
      plainText,
      sourceInput.selectionStart,
      sourceInput.selectionEnd
    );
  });

  documentTab.addEventListener('click', () => setWorkspace('document', true));
  richImportTab.addEventListener('click', () => setWorkspace('rich-import', true));
  [documentTab, richImportTab].forEach((tab) => {
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
        return;
      }
      event.preventDefault();
      const nextTab = event.key === 'ArrowLeft' || event.key === 'Home'
        ? documentTab
        : richImportTab;
      setWorkspace(nextTab === documentTab ? 'document' : 'rich-import');
      nextTab.focus();
    });
  });

  richImportInput.addEventListener('paste', (event) => {
    const clipboardData = event.clipboardData;
    if (!clipboardData) {
      return;
    }

    const htmlText = clipboardData.getData('text/html');
    if (!htmlText.trim()) {
      return;
    }

    event.preventDefault();
    richImportInput.value = clipboardData.getData('text/plain');
    convertRichImportHtml(htmlText);
  });

  richImportInput.addEventListener('input', () => {
    pendingDocumentText = '';
    openDocumentBtn.disabled = true;
    setConvertedMarkdown(richImportInput.value, 'Plain text');
    richImportStatus.textContent = richImportInput.value.trim()
      ? 'Plain text treated as Markdown.'
      : 'Ready for rich text.';
  });

  convertedMarkdownOutput.addEventListener('input', () => {
    pendingDocumentText = '';
    openDocumentBtn.disabled = true;
    refreshConvertedMarkdownPresentation(convertedMarkdownOutput.value, 'Edited Markdown');
    richImportStatus.textContent = convertedMarkdownOutput.value.trim()
      ? 'Converted Markdown edited; rendered preview updated.'
      : 'Converted Markdown is empty.';
  });

  insertConvertedBtn.addEventListener('click', insertConvertedMarkdown);
  appendConvertedBtn.addEventListener('click', appendConvertedMarkdown);
  replaceBodyBtn.addEventListener('click', replaceDocumentBody);
  copyConvertedBtn.addEventListener('click', copyConvertedMarkdown);
  clearRichImportBtn.addEventListener('click', clearRichImport);
  undoDocumentBtn.addEventListener('click', restorePreviousDocument);
  validationProfile.addEventListener('change', updatePreview);
  validationProfile.addEventListener('change', savePreferences);
  pasteModeSmart.addEventListener('change', savePreferences);
  pasteModePlain.addEventListener('change', savePreferences);
  openDocumentBtn.addEventListener('click', openPendingDocument);
  downloadConvertedBtn.addEventListener('click', downloadConvertedMarkdown);
  pasteRichImportBtn.addEventListener('click', pasteRichImportFromClipboard);
  chooseImportFileBtn.addEventListener('click', () => richImportFileInput.click());
  richImportDropZone.addEventListener('click', () => richImportFileInput.click());
  richImportDropZone.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      richImportFileInput.click();
    }
  });
  richImportFileInput.addEventListener('change', () => {
    const file = richImportFileInput.files && richImportFileInput.files[0];
    if (file) {
      void processImportFile(file);
    }
  });
  richImportDropZone.addEventListener('dragenter', (event) => {
    event.preventDefault();
    richImportDropZone.classList.add('is-over');
  });
  richImportDropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    richImportDropZone.classList.add('is-over');
  });
  richImportDropZone.addEventListener('dragleave', (event) => {
    event.preventDefault();
    richImportDropZone.classList.remove('is-over');
  });
  richImportDropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    richImportDropZone.classList.remove('is-over');
    const files = event.dataTransfer && event.dataTransfer.files;
    if (!files || files.length === 0) {
      return;
    }
    if (files.length !== 1) {
      richImportStatus.textContent = 'Drop one file at a time.';
      return;
    }
    void processImportFile(files[0]);
  });

  sourceInput.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      const start = sourceInput.selectionStart;
      const end = sourceInput.selectionEnd;
      const nextValue = `${sourceInput.value.slice(0, start)}  ${sourceInput.value.slice(end)}`;
      sourceInput.value = nextValue;
      sourceInput.selectionStart = start + 2;
      sourceInput.selectionEnd = start + 2;
      updatePreview();
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
      event.preventDefault();
      copySourceToClipboard();
    }
  });

  sampleBtn.addEventListener('click', () => {
    sourceInput.value = SAMPLE_DOCUMENT;
    updatePreview();
    sourceInput.focus();
  });

  convertHtmlBtn.addEventListener('click', () => {
    convertSourceHtmlToMarkdown();
  });

  copyMarkdownBtn.addEventListener('click', () => {
    copyMarkdownToClipboard();
  });

  sourceCopyBtn.addEventListener('click', () => {
    copySourceToClipboard();
  });

  sourcePasteBtn.addEventListener('click', () => {
    pasteSourceFromClipboard();
  });

  sourceClearBtn.addEventListener('click', () => {
    sourceInput.value = '';
    updatePreview();
    sourceInput.focus();
  });

  previewCopyBtn.addEventListener('click', () => {
    copyPreviewRichText();
  });

  previewCopyStyledBtn.addEventListener('click', () => {
    copyPreviewStyledRichText();
  });

  previewCopyHtmlBtn.addEventListener('click', () => {
    copyPreviewHtml();
  });

  yamlToggleBtn.addEventListener('click', () => {
    toggleYamlExpanded();
  });

  loadInitialDocument();
  const storedPreferences = loadPreferences();
  validationProfile.value = storedPreferences.validationProfile === 'tedt' ? 'tedt' : 'generic';
  pasteModePlain.checked = storedPreferences.pasteMode === 'plain';
  pasteModeSmart.checked = !pasteModePlain.checked;
  const yamlExpanded = typeof storedPreferences.yamlExpanded === 'boolean'
    ? storedPreferences.yamlExpanded
    : loadStoredBoolean(YAML_TOGGLE_STORAGE_KEY, YAML_TOGGLE_COOKIE_KEY, false);
  setYamlExpanded(yamlExpanded);
  setCookie(YAML_TOGGLE_COOKIE_KEY, '');
  setWorkspace(storedPreferences.workspace === 'rich-import' ? 'rich-import' : 'document');
  updatePreview();
})();
