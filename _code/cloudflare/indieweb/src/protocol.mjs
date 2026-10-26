export const OWNER = 'https://tedt.org/';
export const ENDPOINT = 'https://tedt.org/micropub';
export const MEDIA_ORIGIN = 'https://media.tedt.org';
export const MAX_POST = 96 * 1024;
export const MAX_UPLOAD = 5 * 1024 * 1024;
export const POST_TYPES = ['article', 'note', 'photo', 'reply', 'like', 'repost', 'bookmark', 'rsvp', 'audio', 'video', 'event', 'checkin'];
const URL_PROPERTIES = new Set(['in-reply-to', 'like-of', 'repost-of', 'bookmark-of', 'audio', 'video', 'syndication']);
const PROPERTIES = new Set(['name', 'content', 'summary', 'photo', 'audio', 'video', 'category', 'published', 'updated', 'in-reply-to', 'like-of', 'repost-of', 'bookmark-of', 'rsvp', 'start', 'end', 'location', 'checkin', 'post-status', 'mp-slug', 'mp-syndicate-to', 'syndication', 'visibility']);
const PLACE_PROPERTIES = new Set(['name', 'url', 'latitude', 'longitude', 'street-address', 'locality', 'region', 'country-name', 'postal-code']);
export class ProtocolError extends Error {
  constructor(status, error, message) { super(message); this.status = status; this.error = error; }
}
export function invalid(message) { throw new ProtocolError(400, 'invalid_request', message); }
export function publicUrl(value) {
  if (typeof value !== 'string' || value.length > 2048 || /[\u0000-\u0020\u007f\\]/.test(value)) invalid('A URL must be an absolute public HTTP or HTTPS URL.');
  let url;
  try { url = new URL(value); } catch { invalid('A URL must be absolute.'); }
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.port ||
      !host.includes('.') || host.endsWith('.local') || host.endsWith('.localhost') || host.endsWith('.internal') ||
      host === 'localhost' || host.includes(':') || /^\d+(?:\.\d+){0,3}$/.test(host)) invalid('A URL must use a public host without credentials or a custom port.');
  return url.href;
}
function text(value, label) {
  if (typeof value !== 'string' || value.length > 65536 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) invalid(`${label} must be text without control characters.`);
  return value;
}
function place(value) {
  if (typeof value === 'string') return publicUrl(value);
  if (!value || Array.isArray(value) || typeof value !== 'object' || !Array.isArray(value.type) ||
      value.type.length !== 1 || !['h-card', 'h-adr', 'h-geo'].includes(value.type[0]) ||
      !value.properties || Object.keys(value).some(k => !['type', 'properties'].includes(k))) invalid('A place must be a URL or an h-card, h-adr, or h-geo object.');
  const result = { type: value.type, properties: {} };
  for (const [key, values] of Object.entries(value.properties)) {
    if (!PLACE_PROPERTIES.has(key) || !Array.isArray(values) || values.length !== 1) invalid(`Unsupported place property: ${key}.`);
    let v = text((key === 'latitude' || key === 'longitude') && typeof values[0] === 'number' ? String(values[0]) : values[0], key);
    if (key === 'name' && v.length > 200) invalid('The place name must be at most 200 characters.');
    if (key === 'url') v = publicUrl(v);
    if (key === 'latitude' || key === 'longitude') {
      const limit = key === 'latitude' ? 90 : 180;
      if (!v.trim() || !Number.isFinite(Number(v)) || Math.abs(Number(v)) > limit) invalid(`Invalid ${key}.`);
    }
    result.properties[key] = [v];
  }
  return result;
}
export function validateProperties(input, type = 'h-entry', { now = new Date() } = {}) {
  if (!input || Array.isArray(input) || typeof input !== 'object') invalid('properties must be an object.');
  if (!['h-entry', 'h-event'].includes(type)) invalid('Only h-entry and h-event are supported.');
  const result = {};
  for (const [key, values] of Object.entries(input)) {
    if (!PROPERTIES.has(key)) invalid(`Unsupported property: ${key}. Nothing was saved.`);
    if (!Array.isArray(values) || values.length > 32) invalid(`${key} must be an array of at most 32 values.`);
    if (!values.length) continue;
    result[key] = values.map(value => {
      if (key === 'content' && value && typeof value === 'object') {
        const keys = Object.keys(value);
        if (keys.length !== 1 || !['html', 'text'].includes(keys[0])) invalid('Content objects must contain exactly html or text.');
        return { [keys[0]]: text(value[keys[0]], 'content') };
      }
      if (key === 'photo' && value && typeof value === 'object') {
        if (Object.keys(value).some(k => !['value', 'alt'].includes(k)) || !Object.hasOwn(value, 'value')) invalid('Photo objects support value and alt.');
        return { value: publicUrl(value.value), alt: text(value.alt || '', 'photo alt') };
      }
      if (key === 'checkin' || key === 'location') return place(value);
      if (URL_PROPERTIES.has(key) || key === 'photo') return publicUrl(value);
      return text(value, key);
    });
  }
  for (const key of ['name', 'summary', 'content', 'published', 'updated', 'rsvp', 'start', 'end', 'post-status', 'mp-slug', 'visibility']) {
    if ((result[key]?.length || 0) > 1) invalid(`${key} accepts one value.`);
  }
  if (result.name?.[0].length > 200) invalid('The entry name must be at most 200 characters.');
  if (result['post-status'] && !['published', 'draft'].includes(result['post-status'][0])) invalid('post-status must be published or draft.');
  if (result.visibility && result.visibility[0] !== 'public') invalid('Private and unlisted publication are unsupported. Use post-status=draft for private authoring.');
  if (result.rsvp && (!['yes', 'no', 'maybe', 'interested'].includes(result.rsvp[0]) || !result['in-reply-to']?.length)) invalid('An RSVP needs a valid value and an in-reply-to event URL.');
  if (result['mp-slug'] && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(result['mp-slug'][0])) invalid('mp-slug must contain lowercase letters, digits, and single hyphens.');
  if ((result['mp-slug']?.[0].length || 0) > 80) invalid('mp-slug is too long.');
  // The existing Mastodon pipeline owns syndication; other targets need a later adapter.
  if (result['mp-syndicate-to']?.some(v => v !== 'https://tschopp.net/@Ted')) invalid('Only the existing Mastodon publishing identity is supported for syndication.');
  for (const key of ['published', 'updated', 'start', 'end']) {
    if (result[key] && (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(result[key][0]) || !Number.isFinite(Date.parse(result[key][0])))) invalid(`${key} needs an ISO 8601 date and time.`);
  }
  for (const key of ['published', 'updated', 'start', 'end']) {
    if (!result[key]) continue;
    const value = result[key][0], parts = /^(\d{4})-(\d{2})-(\d{2})T/.exec(value);
    const date = new Date(0); date.setUTCFullYear(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));
    if (date.getUTCFullYear() !== Number(parts[1]) || date.getUTCMonth() !== Number(parts[2]) - 1 || date.getUTCDate() !== Number(parts[3])) invalid(`${key} has an invalid calendar date.`);
  }
  if (result.published && Date.parse(result.published[0]) > now.getTime() && result['post-status']?.[0] !== 'draft') invalid('Future-dated publication is unsupported. Save a draft first.');
  if (result.start && result.end && Date.parse(result.end[0]) < Date.parse(result.start[0])) invalid('An event cannot end before it starts.');
  if (type === 'h-event' && (!result.name?.[0]?.trim() || !result.start)) invalid('An event needs a name and start time.');
  if (!['name', 'content', 'photo', 'audio', 'video', 'in-reply-to', 'like-of', 'repost-of', 'bookmark-of', 'checkin'].some(k => result[k]?.length)) invalid('The entry has no supported content.');
  if (new TextEncoder().encode(JSON.stringify(result)).byteLength > MAX_POST) invalid('The entry is too large.');
  if (ownedMedia(result).length > 16) invalid('An entry can reference at most 16 uploaded media items.');
  return result;
}
export function ownedMedia(properties) {
  const matches = JSON.stringify(properties).match(/https:\/\/media\.tedt\.org\/files\/([a-f0-9]{64}\.(?:jpg|png|gif|webp|avif|mp3|ogg|wav|m4a|mp4|webm|vtt))/g) || [];
  return [...new Set(matches.map(value => value.split('/').pop()))];
}
export function formPayload(form) {
  const properties = Object.create(null); const data = Object.create(null);
  for (let [key, value] of form.entries()) {
    if (typeof value !== 'string') invalid('Upload files to the media endpoint before creating an entry.');
    if (['h', 'action', 'url', 'access_token'].includes(key)) {
      if (Object.hasOwn(data, key)) invalid(`Duplicate ${key}.`);
      data[key] = value; continue;
    }
    if (key === 'content[html]' || key === 'content[text]') { value = { [key.slice(8, -1)]: value }; key = 'content'; }
    else if (key.endsWith('[]')) key = key.slice(0, -2);
    else if (key.includes('[') || key.includes(']')) invalid(`Unsupported form field: ${key}. Use JSON for nested properties.`);
    (properties[key] ||= []).push(value);
  }
  if (data.action) {
    if (Object.keys(properties).length || data.h) invalid('Action requests cannot contain create properties.');
    return data;
  }
  if (data.url) invalid('The server assigns the URL for a new entry.');
  return { type: [data.h ? `h-${data.h}` : 'h-entry'], properties, access_token: data.access_token };
}
export function patchProperties(current, patch, type, now, { publishedImmutable = true, created } = {}) {
  if (Object.keys(patch).some(k => !['action', 'url', 'replace', 'add', 'delete', 'access_token'].includes(k))) invalid('Unsupported update parameter.');
  if (!['replace', 'add', 'delete'].some(k => Object.hasOwn(patch, k))) invalid('An update needs replace, add, or delete.');
  const next = structuredClone(current);
  for (const operation of ['replace', 'add', 'delete']) {
    if (patch[operation] === undefined) continue;
    const change = patch[operation];
    if (operation === 'delete' && Array.isArray(change)) {
      for (const key of change) { if (!PROPERTIES.has(key)) invalid(`Unsupported property: ${key}.`); delete next[key]; }
      continue;
    }
    if (!change || Array.isArray(change) || typeof change !== 'object') invalid(`${operation} must be an object.`);
    for (const [key, values] of Object.entries(change)) {
      if (!PROPERTIES.has(key) || !Array.isArray(values)) invalid(`Invalid update property: ${key}.`);
      if (operation === 'replace') next[key] = values;
      if (operation === 'add') next[key] = [...(next[key] || []), ...values].filter((v, i, a) => a.findIndex(x => JSON.stringify(x) === JSON.stringify(v)) === i);
      if (operation === 'delete') next[key] = (next[key] || []).filter(v => !values.some(x => JSON.stringify(x) === JSON.stringify(v)));
    }
  }
  // Publication identity is stable even when source properties are edited.
  if (JSON.stringify(next['mp-slug']) !== JSON.stringify(current['mp-slug'])) invalid('mp-slug cannot be changed after creation.');
  if (publishedImmutable && JSON.stringify(next.published) !== JSON.stringify(current.published)) invalid('The publication date cannot be changed after publication.');
  if (!publishedImmutable && current['post-status']?.[0] === 'draft' && next['post-status']?.[0] === 'published' && !patch.replace?.published && current.published?.[0] === created) next.published = [now.toISOString()];
  next.published ||= [now.toISOString()];
  next.updated = [now.toISOString()];
  return validateProperties(next, type, { now });
}
export function mediaFormat(bytes, contentType) {
  const b = new Uint8Array(bytes); const ascii = (start, length) => String.fromCharCode(...b.slice(start, start + length));
  const mime = contentType.split(';')[0].trim().toLowerCase();
  const valid = {
    'image/jpeg': ['jpg', b[0] === 255 && b[1] === 216 && b[2] === 255],
    'image/png': ['png', b.length >= 8 && [...b.slice(0, 8)].join(',') === '137,80,78,71,13,10,26,10'],
    'image/gif': ['gif', ['GIF87a', 'GIF89a'].includes(ascii(0, 6))],
    'image/webp': ['webp', ascii(0, 4) === 'RIFF' && ascii(8, 4) === 'WEBP'],
    'image/avif': ['avif', ascii(4, 4) === 'ftyp' && /avif|avis/.test(ascii(8, 24))],
    'text/vtt': ['vtt', ascii(0, 6) === 'WEBVTT'],
    'audio/mpeg': ['mp3', ascii(0, 3) === 'ID3' || (b[0] === 255 && (b[1] & 224) === 224)],
    'audio/ogg': ['ogg', ascii(0, 4) === 'OggS'],
    'audio/wav': ['wav', ascii(0, 4) === 'RIFF' && ascii(8, 4) === 'WAVE'],
    'audio/mp4': ['m4a', ascii(4, 4) === 'ftyp'],
    'video/mp4': ['mp4', ascii(4, 4) === 'ftyp'],
    'audio/webm': ['webm', [...b.slice(0, 4)].join(',') === '26,69,223,163'],
    'video/webm': ['webm', [...b.slice(0, 4)].join(',') === '26,69,223,163'],
  }[mime];
  if (!valid?.[1]) invalid('Unsupported media type or file signature. Use JPEG, PNG, GIF, WebP, AVIF, MP3, Ogg, WAV, MP4, WebM, or WebVTT captions.');
  if (!b.length || b.length > MAX_UPLOAD) throw new ProtocolError(413, 'invalid_request', 'Client uploads must be at most 5 MiB.');
  return { extension: valid[0], contentType: mime };
}
