// Mulberry32: repeatable browser simulations, not security-sensitive randomness.
export function seededRandom(seed = 42) {
  let state = Number(seed) >>> 0;
  return () => {
    state = (state + 0x6D2B79F5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function settingValue(control, value) {
  if (control.type === 'checkbox') return value === 'true';
  if (control.tagName === 'SELECT') {
    return Array.from(control.options).some(option => option.value === value) ? value : null;
  }
  if (control.type === 'number' || control.type === 'range') {
    if (String(value).trim() === '') return null;
    let number = Number(value);
    if (!Number.isFinite(number)) return null;
    const minimum = control.min === '' ? -Infinity : Number(control.min);
    const maximum = control.max === '' ? Infinity : Number(control.max);
    number = Math.min(maximum, Math.max(minimum, number));
    const step = control.step === 'any' ? 0 : Number(control.step || 1);
    if (step > 0) {
      const base = Number.isFinite(minimum) ? minimum : 0;
      number = base + Math.round((number - base) / step) * step;
    }
    return String(Math.min(maximum, Math.max(minimum, Number(number.toFixed(8)))));
  }
  return null;
}

export function loadSettings(root, search = globalThis.location?.search || '') {
  const params = new URLSearchParams(search);
  root.querySelectorAll('[data-setting]').forEach(control => {
    if (!control.id || !params.has(control.id)) return;
    const value = settingValue(control, params.get(control.id));
    if (value === null) return;
    if (control.type === 'checkbox') control.checked = value;
    else control.value = value;
  });
}

export function scenarioURL(root, href = globalThis.location.href) {
  const url = new URL(href);
  url.search = '';
  url.hash = '';
  root.querySelectorAll('[data-setting]').forEach(control => {
    if (control.id) url.searchParams.set(control.id, control.type === 'checkbox' ? String(control.checked) : control.value);
  });
  return url.href;
}
