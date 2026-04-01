import * as pdfjsLib from './vendor/pdfjs/pdf.min.mjs';

const AVAILABLE_LANGUAGE_PACKS = [
  { code: 'eng', label: 'English' },
  { code: 'spa', label: 'Spanish' },
  { code: 'fra', label: 'French' },
  { code: 'deu', label: 'German' },
  { code: 'ita', label: 'Italian' },
  { code: 'por', label: 'Portuguese' },
  { code: 'nld', label: 'Dutch' },
  { code: 'pol', label: 'Polish' },
  { code: 'ces', label: 'Czech' },
  { code: 'ron', label: 'Romanian' },
  { code: 'tur', label: 'Turkish' },
  { code: 'rus', label: 'Russian' },
  { code: 'ukr', label: 'Ukrainian' },
  { code: 'swe', label: 'Swedish' },
  { code: 'dan', label: 'Danish' },
  { code: 'fin', label: 'Finnish' },
  { code: 'nor', label: 'Norwegian' },
  { code: 'jpn', label: 'Japanese' },
  { code: 'kor', label: 'Korean' },
  { code: 'chi_sim', label: 'Chinese, Simplified' },
  { code: 'chi_tra', label: 'Chinese, Traditional' },
  { code: 'hin', label: 'Hindi' },
  { code: 'ara', label: 'Arabic' },
  { code: 'heb', label: 'Hebrew' },
  { code: 'vie', label: 'Vietnamese' }
];

const EXAMPLE_URL = '/media/files/Three_computer-based_models_of_storytelling_BRUTUS.pdf';
const PDF_RENDER_WIDTH = 1400;

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('./vendor/pdfjs/pdf.worker.min.mjs', import.meta.url).href;

const elements = {
  app: document.querySelector('[data-ocr-app]'),
  languageSelect: document.getElementById('ocrLanguage'),
  languagePackBadge: document.getElementById('languagePackBadge'),
  chooseBtn: document.getElementById('ocrChooseBtn'),
  exampleBtn: document.getElementById('ocrExampleBtn'),
  clearBtn: document.getElementById('ocrClearBtn'),
  downloadFullBtn: document.getElementById('ocrDownloadFullBtn'),
  copyFullBtn: document.getElementById('ocrCopyFullBtn'),
  fileInput: document.getElementById('ocrFileInput'),
  dropZone: document.getElementById('ocrDropZone'),
  status: document.getElementById('ocrStatus'),
  progressLabel: document.getElementById('ocrProgressLabel'),
  progressBar: document.getElementById('ocrProgressBar'),
  sourceLabel: document.getElementById('ocrSourceLabel'),
  countLabel: document.getElementById('ocrCountLabel'),
  selectedLanguageLabel: document.getElementById('ocrSelectedLanguageLabel'),
  fullDocumentSection: document.getElementById('ocrFullDocumentSection'),
  fullDocument: document.getElementById('ocrFullDocument'),
  emptyState: document.getElementById('ocrEmptyState'),
  results: document.getElementById('ocrResults'),
  resultsMeta: document.getElementById('ocrResultsMeta')
};

const state = {
  busy: false,
  renderedItems: [],
  disposableUrls: [],
  worker: null,
  currentSourceName: '',
  currentLanguage: 'eng'
};

function setStatus(message, tone = 'secondary') {
  elements.status.className = `alert alert-${tone} mb-3`;
  elements.status.textContent = message;
}

function setProgress(current, total, label) {
  const pct = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
  elements.progressBar.style.width = `${pct}%`;
  elements.progressLabel.textContent = label;
}

function setBusy(isBusy) {
  state.busy = isBusy;
  elements.chooseBtn.disabled = isBusy;
  elements.exampleBtn.disabled = isBusy;
  elements.clearBtn.disabled = isBusy && state.renderedItems.length === 0;
  elements.downloadFullBtn.disabled = isBusy || !elements.fullDocument.value.trim();
  elements.copyFullBtn.disabled = isBusy || !elements.fullDocument.value.trim();
  elements.languageSelect.disabled = isBusy;
  elements.dropZone.classList.toggle('is-busy', isBusy);
}

function updateSourceMeta(name, count = 0) {
  elements.sourceLabel.textContent = name || 'None';
  elements.countLabel.textContent = String(count);
  elements.selectedLanguageLabel.textContent = getLanguageLabel(state.currentLanguage);
  elements.resultsMeta.textContent = count > 0 ? `${count} page${count === 1 ? '' : 's'} / images processed` : 'No pages rendered yet';
}

function getLanguageLabel(code) {
  return AVAILABLE_LANGUAGE_PACKS.find((entry) => entry.code === code)?.label || code;
}

function populateLanguages() {
  elements.languageSelect.innerHTML = '';
  for (const language of AVAILABLE_LANGUAGE_PACKS) {
    const option = document.createElement('option');
    option.value = language.code;
    option.textContent = language.label;
    if (language.code === state.currentLanguage) {
      option.selected = true;
    }
    elements.languageSelect.appendChild(option);
  }
  elements.languagePackBadge.textContent = `${AVAILABLE_LANGUAGE_PACKS.length} on-demand language packs`;
  elements.selectedLanguageLabel.textContent = getLanguageLabel(state.currentLanguage);
}

function disposeUrls() {
  for (const url of state.disposableUrls) {
    URL.revokeObjectURL(url);
  }
  state.disposableUrls = [];
}

function clearResults() {
  disposeUrls();
  state.renderedItems = [];
  state.currentSourceName = '';
  elements.results.replaceChildren();
  elements.emptyState.hidden = false;
  elements.fullDocumentSection.hidden = true;
  elements.fullDocument.value = '';
  setProgress(0, 0, 'Idle');
  updateSourceMeta('', 0);
  setStatus('Ready.');
  elements.downloadFullBtn.disabled = true;
  elements.copyFullBtn.disabled = true;
  elements.fileInput.value = '';
}

function getRenderedTextSegments() {
  return state.renderedItems
    .map((item) => item.textarea.value.trim())
    .filter(Boolean);
}

function buildFullDocumentText({ flattenPageBreaks = false } = {}) {
  const segments = getRenderedTextSegments();
  if (segments.length === 0) {
    return '';
  }

  if (!flattenPageBreaks) {
    return segments.join('\n\n');
  }

  return segments.reduce((combined, segment) => {
    if (!combined) {
      return segment;
    }

    const previousChar = combined.slice(-1);
    const nextChar = segment.charAt(0);
    const shouldFuseWord = previousChar === '-';
    const separator = shouldFuseWord || /[\s\n]/.test(previousChar) || /[\s\n]/.test(nextChar) ? '' : ' ';
    return `${combined}${shouldFuseWord ? '' : separator}${segment}`;
  }, '');
}

function updateFullDocument() {
  const content = buildFullDocumentText();

  elements.fullDocument.value = content;
  elements.fullDocumentSection.hidden = content.length === 0;
  elements.downloadFullBtn.disabled = state.busy || content.length === 0;
  elements.copyFullBtn.disabled = state.busy || content.length === 0;
}

function buildDownloadFilename() {
  const baseName = (state.currentSourceName || 'ocr-output')
    .replace(/\.[a-z0-9]+$/i, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `${baseName || 'ocr-output'}-full-text.txt`;
}

function autosizeTextarea(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = `${Math.max(textarea.scrollHeight + 4, 220)}px`;
}

function createResultCard({ title, subtitle, imageUrl, pageIndex }) {
  const wrapper = document.createElement('article');
  wrapper.className = 'ocr-result-card';

  const head = document.createElement('header');
  head.className = 'ocr-result-head';

  const titleBlock = document.createElement('div');
  const heading = document.createElement('h2');
  heading.className = 'h5 mb-1';
  heading.textContent = title;
  const meta = document.createElement('div');
  meta.className = 'ocr-page-meta';
  meta.textContent = subtitle;
  titleBlock.append(heading, meta);

  const badge = document.createElement('span');
  badge.className = 'badge rounded-pill text-bg-secondary';
  badge.textContent = `Item ${pageIndex + 1}`;

  head.append(titleBlock, badge);

  const grid = document.createElement('div');
  grid.className = 'ocr-result-grid';

  const previewShell = document.createElement('div');
  previewShell.className = 'ocr-preview-shell';
  const image = document.createElement('img');
  image.src = imageUrl;
  image.alt = `${title} preview`;
  previewShell.appendChild(image);

  const textShell = document.createElement('div');
  textShell.className = 'ocr-text-shell';
  const label = document.createElement('label');
  label.className = 'form-label';
  label.textContent = 'Extracted text';
  label.setAttribute('for', `ocr-text-${pageIndex}`);
  const textarea = document.createElement('textarea');
  textarea.id = `ocr-text-${pageIndex}`;
  textarea.className = 'form-control mono';
  textarea.placeholder = 'OCR in progress...';
  textarea.addEventListener('input', () => {
    autosizeTextarea(textarea);
    updateFullDocument();
  });
  textShell.append(label, textarea);

  grid.append(previewShell, textShell);
  wrapper.append(head, grid);
  elements.results.appendChild(wrapper);

  return { wrapper, textarea };
}

async function ensureWorker(languageCode) {
  if (!window.Tesseract?.createWorker) {
    throw new Error('Tesseract runtime failed to load.');
  }

  if (state.worker) {
    await state.worker.terminate();
    state.worker = null;
  }

  state.worker = await window.Tesseract.createWorker(languageCode, 1, {
    workerPath: new URL('./vendor/tesseract/worker.min.js', import.meta.url).href,
    corePath: new URL('./vendor/tesseract-core/', import.meta.url).href,
    cacheMethod: 'write',
    logger(message) {
      if (!state.busy) {
        return;
      }

      if (typeof message.progress === 'number') {
        const pct = Math.round(message.progress * 100);
        setStatus(`OCR runtime: ${message.status || 'working'} (${pct}%)`, 'secondary');
      }
    }
  });
}

async function recognizeImage(imageUrl, textarea, title, currentIndex, totalCount) {
  if (!state.worker) {
    throw new Error('OCR worker is not initialized.');
  }

  setProgress(currentIndex, totalCount, `OCR ${currentIndex} of ${totalCount}`);
  setStatus(`Running OCR for ${title}...`, 'info');
  const result = await state.worker.recognize(imageUrl);
  textarea.value = result.data.text.trim();
  autosizeTextarea(textarea);
  updateFullDocument();
}

async function convertPdfToImages(file) {
  const pdfObjectUrl = URL.createObjectURL(file);
  state.disposableUrls.push(pdfObjectUrl);

  const loadingTask = pdfjsLib.getDocument(pdfObjectUrl);
  const pdf = await loadingTask.promise;
  const pages = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    setProgress(pageNumber - 1, pdf.numPages, `Rendering page ${pageNumber} of ${pdf.numPages}`);
    setStatus(`Rendering PDF page ${pageNumber} of ${pdf.numPages}...`, 'secondary');
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });
    const scale = PDF_RENDER_WIDTH / viewport.width;
    const renderViewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { alpha: false });
    canvas.width = Math.ceil(renderViewport.width);
    canvas.height = Math.ceil(renderViewport.height);

    await page.render({
      canvasContext: context,
      viewport: renderViewport
    }).promise;

    pages.push({
      pageNumber,
      imageUrl: canvas.toDataURL('image/jpeg', 0.92),
      width: canvas.width,
      height: canvas.height
    });
  }

  return pages;
}

function fileLooksLikePdf(file) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

function fileLooksLikeImage(file) {
  return file.type.startsWith('image/') || /\.(png|jpe?g|gif|webp)$/i.test(file.name);
}

function setInputFiles(file) {
  try {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    elements.fileInput.files = dataTransfer.files;
  } catch (_error) {
    // Some browsers block programmatic FileList mutation.
  }
}

async function processFile(file, sourceLabel = file.name) {
  if (state.busy) {
    return;
  }

  if (!fileLooksLikePdf(file) && !fileLooksLikeImage(file)) {
    setStatus('Unsupported file type. Please use a PDF, JPG, PNG, or GIF.', 'warning');
    return;
  }

  clearResults();
  state.currentLanguage = elements.languageSelect.value;
  state.currentSourceName = sourceLabel;
  setBusy(true);
  setInputFiles(file);

  try {
    await ensureWorker(state.currentLanguage);

    let items;
    if (fileLooksLikePdf(file)) {
      items = await convertPdfToImages(file);
    } else {
      const imageUrl = URL.createObjectURL(file);
      state.disposableUrls.push(imageUrl);
      items = [{
        pageNumber: 1,
        imageUrl,
        width: null,
        height: null
      }];
    }

    elements.emptyState.hidden = true;
    updateSourceMeta(sourceLabel, items.length);

    for (let index = 0; index < items.length; index += 1) {
      const item = items[index];
      const title = fileLooksLikePdf(file) ? `Page ${item.pageNumber}` : 'Image';
      const subtitleParts = [sourceLabel];
      if (item.width && item.height) {
        subtitleParts.push(`${item.width}×${item.height}`);
      }

      const rendered = createResultCard({
        title,
        subtitle: subtitleParts.join(' · '),
        imageUrl: item.imageUrl,
        pageIndex: index
      });

      state.renderedItems.push({
        ...item,
        ...rendered
      });

      await recognizeImage(item.imageUrl, rendered.textarea, title, index + 1, items.length);
    }

    setProgress(items.length, items.length, `Done ${items.length} of ${items.length}`);
    setStatus(`Completed OCR for ${sourceLabel}.`, 'success');
  } catch (error) {
    console.error('[ocr-tool] OCR job failed', error);
    setStatus(`OCR failed: ${error.message}`, 'danger');
  } finally {
    if (state.worker) {
      await state.worker.terminate();
      state.worker = null;
    }
    setBusy(false);
    elements.clearBtn.disabled = false;
    updateFullDocument();
  }
}

async function loadExamplePdf() {
  if (state.busy) {
    return;
  }

  setStatus('Loading local example PDF...', 'secondary');
  try {
    const response = await fetch(EXAMPLE_URL);
    if (!response.ok) {
      throw new Error(`Example fetch failed with ${response.status}`);
    }
    const blob = await response.blob();
    const file = new File([blob], 'storytelling-models-example.pdf', { type: 'application/pdf' });
    await processFile(file, 'Example PDF');
  } catch (error) {
    console.error('[ocr-tool] example pdf failed', error);
    setStatus('Failed to load the example PDF. Try a local file instead.', 'warning');
  }
}

async function copyFullDocument() {
  const text = elements.fullDocument.value.trim();
  if (!text) {
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    setStatus('Full document copied to the clipboard.', 'success');
  } catch (error) {
    console.error('[ocr-tool] clipboard write failed', error);
    setStatus('Clipboard copy failed. You can still select and copy the text manually.', 'warning');
  }
}

function downloadFullDocument() {
  const text = buildFullDocumentText({ flattenPageBreaks: true }).trim();
  if (!text) {
    return;
  }

  const downloadUrl = URL.createObjectURL(new Blob([`${text}\n`], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = buildDownloadFilename();
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);
  setStatus('Downloaded full OCR text as a continuous .txt file.', 'success');
}

function handleDrop(event) {
  event.preventDefault();
  elements.dropZone.classList.remove('is-drag-over');
  if (state.busy) {
    return;
  }
  const file = event.dataTransfer?.files?.[0];
  if (file) {
    processFile(file);
  }
}

function handlePaste(event) {
  if (state.busy) {
    return;
  }

  const items = Array.from(event.clipboardData?.items || []);
  const imageItem = items.find((item) => item.type.startsWith('image/'));
  if (!imageItem) {
    return;
  }

  const file = imageItem.getAsFile();
  if (!file) {
    return;
  }

  processFile(file, 'Pasted image');
}

function bindEvents() {
  elements.languageSelect.addEventListener('change', () => {
    state.currentLanguage = elements.languageSelect.value;
    elements.selectedLanguageLabel.textContent = getLanguageLabel(state.currentLanguage);
  });

  elements.chooseBtn.addEventListener('click', () => elements.fileInput.click());
  elements.exampleBtn.addEventListener('click', loadExamplePdf);
  elements.clearBtn.addEventListener('click', clearResults);
  elements.downloadFullBtn.addEventListener('click', downloadFullDocument);
  elements.copyFullBtn.addEventListener('click', copyFullDocument);
  elements.fileInput.addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  });

  elements.dropZone.addEventListener('click', () => {
    if (!state.busy) {
      elements.fileInput.click();
    }
  });
  elements.dropZone.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!state.busy) {
        elements.fileInput.click();
      }
    }
  });
  elements.dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    if (!state.busy) {
      elements.dropZone.classList.add('is-drag-over');
    }
  });
  elements.dropZone.addEventListener('dragleave', (event) => {
    event.preventDefault();
    elements.dropZone.classList.remove('is-drag-over');
  });
  elements.dropZone.addEventListener('drop', handleDrop);

  document.addEventListener('paste', handlePaste);
  window.addEventListener('beforeunload', disposeUrls);
}

function init() {
  populateLanguages();
  bindEvents();
  clearResults();
  elements.clearBtn.disabled = true;
}

init();