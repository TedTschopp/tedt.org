import { createClient, httpsUrl } from './common.js';
import { analyze } from './analysis.js';
import { providers } from './providers/index.js';

const $ = id => document.getElementById(id);
const number = value => value == null ? 'Unknown' : new Intl.NumberFormat('en-US').format(value);
const date = value => value == null ? 'Unknown date' : new Date(value).toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
const statusNames = { flag: 'Pattern observed', clear: 'Not triggered', insufficient: 'Not enough data', unavailable: 'Unavailable', declared: 'Self-declared bot' };
let controller = null;
let report = null;
let activeSignal = null;
let visiblePosts = 50;

function node(tag, text = null, className = null) {
  const value = document.createElement(tag);
  if (text != null) value.textContent = text;
  if (className) value.className = className;
  return value;
}

function link(text, url) {
  const safe = httpsUrl(url);
  if (!safe) return node('span', text);
  const value = node('a', text);
  value.href = safe;
  value.target = '_blank';
  value.rel = 'noopener noreferrer';
  return value;
}

function badge(text, state) {
  const value = node('span', text, 'badge');
  if (state) value.dataset.state = state;
  return value;
}

function setStatus(message, state = 'ready') {
  $('status').textContent = message;
  $('status').dataset.state = state;
}

function updateProvider() {
  const provider = providers.get($('platform').value);
  $('account').placeholder = provider.placeholder;
  $('account-help').textContent = provider.inputHelp;
}

function setBusy(busy) {
  ['platform', 'account', 'scan-limit', 'check-button', 'example-button'].forEach(id => { $(id).disabled = busy; });
  $('cancel-button').hidden = !busy;
  $('check-form').setAttribute('aria-busy', String(busy));
}

function resetReport() {
  report = null;
  activeSignal = null;
  $('results').hidden = true;
  $('empty-state').hidden = false;
  $('report-link-field').hidden = true;
  $('post-search').value = '';
  $('post-filter').value = 'all';
  $('active-filter').hidden = true;
}

function renderOverview(data, provider) {
  const { profile, coverage } = data;
  const header = node('div', null, 'profile-header');
  const initials = profile.name.split(/\s+/).slice(0, 2).map(part => Array.from(part)[0] || '').join('').toUpperCase();
  const monogram = node('span', initials, 'profile-monogram');
  monogram.setAttribute('aria-hidden', 'true');
  const text = node('div', null, 'profile-text');
  text.append(node('span', provider.label, 'profile-site'), node('h2', profile.name), link(profile.handle, profile.url));
  if (profile.bio) text.append(node('p', profile.bio));
  header.append(monogram, text);
  const stats = node('dl', null, 'stats');
  [['Followers', profile.followers], ['Following', profile.following], ['Posts reported by profile', profile.postsCount], ['Original posts scanned', coverage.ownPosts]].forEach(([label, value]) => {
    const stat = node('div');
    stat.append(node('dt', label), node('dd', number(value)));
    stats.append(stat);
  });
  $('overview').replaceChildren(header, stats);
}

function renderAssessment(data) {
  const { summary, profile } = data;
  let title = summary.checked === 0 ? 'Not enough activity to assess' : summary.flagged === 0 ? 'No configured patterns triggered' : summary.flagged >= 4 ? 'Several patterns to review' : 'Patterns to review';
  if (summary.smallSample) title = 'A small sample of public activity';
  const content = [node('h2', title), node('p', `${summary.flagged} of ${summary.checked} eligible behavior checks triggered. ${summary.total - summary.checked} behavior checks lack enough data. Profile metadata is shown separately below.`)];
  if (profile.declaredBot === true) content.push(node('p', 'This Mastodon account identifies itself as a bot in its public profile.'));
  content.push(node('p', 'These observations are prompts for a closer look. They do not establish automation or AI authorship.'));
  if (summary.smallSample) content.push(node('p', 'Fewer than 20 original posts were available. Many checks need a larger sample.'));
  $('assessment').replaceChildren(...content);
}

function renderCoverage(data, provider) {
  const c = data.coverage;
  const scope = c.exhausted ? 'Reached the end of the public feed returned by the API.' : `This is a bounded sample, requested up to ${number(c.limit)} original posts.`;
  const lines = [node('p', `${number(c.ownPosts)} original posts and replies, plus ${number(c.boosts)} boosts or reposts. ${scope}`)];
  if (c.oldest != null) lines.push(node('p', `Dated originals: ${date(c.oldest)} to ${date(c.newest)}. Checked ${date(Date.parse(data.checkedAt))}.`));
  lines.push(node('p', `${number(c.timedReplies)} of ${number(c.otherReplies)} replies to other accounts have usable timing. ${number(c.pages)} feed pages; ${number(c.requests)} API requests.`));
  c.warnings.forEach(warning => lines.push(node('p', warning, 'notice')));
  if (provider.id === 'mastodon' && !c.ownPosts) lines.push(node('p', 'This server returned no original public posts. Private posts, visibility restrictions, and server policies may limit the feed.', 'notice'));
  const sources = node('p', 'Data source: ');
  sources.append(link(c.source?.label || provider.label, c.source?.url || data.profile.url));
  lines.push(sources);
  $('coverage').replaceChildren(...lines);
}

function renderSignals(data) {
  const container = $('signals');
  container.replaceChildren();
  [['behavior', 'Behavior Checks'], ['metadata', 'Platform Metadata']].forEach(([group, title]) => {
    container.append(node('h3', title, 'signal-group-title'));
    data.signals.filter(signal => signal.group === group).forEach(signal => {
      const detail = node('details', null, 'signal');
      detail.dataset.signal = signal.id;
      const summary = node('summary');
      summary.append(node('span', signal.name, 'signal-name'), badge(statusNames[signal.status], signal.status));
      detail.append(summary, node('p', signal.observed, 'observed'));
      const rule = node('p');
      rule.append(node('strong', 'Threshold: '), document.createTextNode(signal.rule));
      const caveat = node('p');
      caveat.append(node('strong', 'Other explanations: '), document.createTextNode(signal.caveat));
      detail.append(rule, caveat);
      if (signal.evidenceIds.length) {
        const button = node('button', `Show matching posts (${number(signal.evidenceIds.length)})`, 'button secondary');
        button.type = 'button';
        button.addEventListener('click', () => {
          activeSignal = signal;
          $('post-filter').value = 'all';
          $('post-search').value = '';
          visiblePosts = 50;
          drawPosts();
          $('posts-title').focus();
          $('posts-title').scrollIntoView({ behavior: 'instant', block: 'start' });
        });
        detail.append(button);
      }
      container.append(detail);
    });
  });
}

function svgNode(tag, attributes) {
  const value = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(attributes).forEach(([name, content]) => value.setAttribute(name, content));
  return value;
}

function renderActivity(data) {
  const counts = data.summary.hourCounts;
  const max = Math.max(1, ...counts);
  const svg = svgNode('svg', { viewBox: '0 0 600 190', role: 'img', 'aria-label': `Original posts by UTC hour. Busiest hour has ${max === 1 && !counts.some(Boolean) ? 0 : max} posts. Exact counts are available in the table below.`, class: 'chart' });
  svg.append(svgNode('line', { x1: 10, x2: 590, y1: 155, y2: 155 }));
  counts.forEach((count, hour) => {
    const height = count / max * 125;
    const bar = svgNode('rect', { x: 12 + hour * 24, y: 155 - height, width: 17, height });
    const title = svgNode('title', {});
    title.textContent = `${String(hour).padStart(2, '0')}:00 UTC — ${count} posts`;
    bar.append(title);
    svg.append(bar);
    if (hour % 3 === 0) {
      const label = svgNode('text', { x: 12 + hour * 24, y: 178 });
      label.textContent = String(hour).padStart(2, '0');
      svg.append(label);
    }
  });
  const table = node('table');
  table.append(node('caption', 'Original posts by UTC hour'));
  const header = node('tr');
  ['Hour (UTC)', 'Posts'].forEach(label => { const cell = node('th', label); cell.scope = 'col'; header.append(cell); });
  const thead = node('thead');
  thead.append(header);
  const tbody = node('tbody');
  counts.forEach((count, hour) => { const row = node('tr'); row.append(node('td', `${String(hour).padStart(2, '0')}:00`), node('td', number(count))); tbody.append(row); });
  table.append(thead, tbody);
  const details = node('details');
  details.append(node('summary', 'Read exact hourly counts'), table);
  $('activity').replaceChildren(svg, node('p', 'Aggregated across the sample. The account’s local time zone is unknown; this chart does not determine whether someone sleeps.', 'chart-note'), details);
}

function duration(ms) {
  if (ms == null) return 'Unknown';
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)} seconds`;
  if (ms < 3_600_000) return `${(ms / 60_000).toFixed(1)} minutes`;
  if (ms < 86_400_000) return `${(ms / 3_600_000).toFixed(1)} hours`;
  return `${(ms / 86_400_000).toFixed(1)} days`;
}

function renderMix(data) {
  const c = data.coverage;
  const total = data.posts.length;
  const values = [['Top-level originals', c.ownPosts - c.replies], ['Replies to other accounts', c.otherReplies], ['Other replies', c.replies - c.otherReplies], ['Boosts and reposts', c.boosts]];
  const rows = values.map(([label, count]) => {
    const row = node('div', null, 'mix-row');
    const meter = node('meter');
    meter.min = 0;
    meter.max = Math.max(total, 1);
    meter.value = count;
    meter.setAttribute('aria-label', `${label}: ${count} of ${total} scanned activities`);
    row.append(node('span', label), node('span', number(count)), meter);
    return row;
  });
  rows.push(node('p', `Median unprompted reply delay: ${duration(data.summary.medianReplyMs)}.`, 'chart-note'));
  const applications = [...new Set(data.posts.map(post => post.application).filter(Boolean))];
  if (applications.length) rows.push(node('p', `Clients reported by the server: ${applications.join(', ')}. A client name is context and is not scored.`, 'chart-note'));
  $('post-mix').replaceChildren(...rows);
}

function renderExamples(data) {
  const examples = data.posts.filter(post => post.observedSignals.length)
    .sort((a, b) => b.observedSignals.length - a.observedSignals.length).slice(0, 5);
  if (!examples.length) {
    $('examples').replaceChildren(node('p', 'No individual posts were linked to a triggered check. Activity-wide checks may still have triggered.'));
    return;
  }
  $('examples').replaceChildren(...examples.map(post => {
    const example = node('article', null, 'example');
    const excerpt = post.contentWarning ? `[Content warning: ${post.contentWarning}]` : post.text || '[Post without text]';
    example.append(link(excerpt.length > 170 ? excerpt.slice(0, 170) + '…' : excerpt, post.url), node('p', post.observedSignals.join(' · ')), node('small', date(post.time)));
    return example;
  }));
}

function renderPost(post) {
  const item = node('li');
  const article = node('article', null, 'post');
  const meta = node('div', null, 'post-meta');
  const time = node('time', date(post.time));
  if (post.time != null) time.dateTime = new Date(post.time).toISOString();
  meta.append(time, node('span', post.isBoost ? 'Boost / repost' : post.isReply ? 'Reply' : 'Top-level post'), link('Open original ↗', post.url));
  article.append(meta);
  const text = node('p', post.text || '[No text in this post]', 'post-text');
  if (post.contentWarning) {
    const warning = node('details');
    warning.append(node('summary', `Content warning: ${post.contentWarning}`), text);
    article.append(warning);
  } else article.append(text);
  const tags = node('div', null, 'post-tags');
  post.observedSignals.forEach(name => tags.append(badge(name, 'flag')));
  if (post.delayMs != null) tags.append(badge(`Reply delay: ${duration(post.delayMs)} · ${post.delaySource}`));
  if (post.edited) tags.append(badge('Edited post; excluded from reply timing'));
  article.append(tags);
  if (post.parent) {
    const parent = node('details', null, 'parent');
    parent.append(node('summary', `Parent post${post.parent.handle ? ` · ${post.parent.handle}` : ''}`), node('p', post.parent.text || '[No text]', 'post-text'), link('Open parent ↗', post.parent.url));
    article.append(parent);
  }
  item.append(article);
  return item;
}

function drawPosts() {
  if (!report) return;
  const filter = $('post-filter').value;
  const search = $('post-search').value.trim().toLocaleLowerCase();
  const ids = activeSignal ? new Set(activeSignal.evidenceIds) : null;
  const posts = report.posts.filter(post => {
    if (ids && !ids.has(post.id)) return false;
    if (filter === 'replies' && !post.isReply) return false;
    if (filter === 'original' && (post.isReply || post.isBoost)) return false;
    if (filter === 'boosts' && !post.isBoost) return false;
    if (filter === 'flagged' && !post.observedSignals.length) return false;
    return !search || post.text.toLocaleLowerCase().includes(search);
  });
  $('posts').replaceChildren(...posts.slice(0, visiblePosts).map(renderPost));
  if (!posts.length) $('posts').append(node('li', 'No scanned posts match these filters.', 'panel-body'));
  $('posts-count').textContent = `${number(Math.min(visiblePosts, posts.length))} of ${number(posts.length)} shown`;
  $('more-posts').hidden = visiblePosts >= posts.length;
  $('clear-post-filter').hidden = !activeSignal;
  $('active-filter').hidden = !activeSignal;
  $('active-filter').textContent = activeSignal ? `Matching posts: ${activeSignal.name}` : '';
}

function reportUrl() {
  const url = new URL(location.href);
  url.search = '';
  url.hash = '';
  url.searchParams.set('platform', report.provider);
  url.searchParams.set('user', report.profile.handle);
  url.searchParams.set('limit', String(report.coverage.limit));
  return url.href;
}

async function run(event) {
  event.preventDefault();
  if (controller) return;
  const provider = providers.get($('platform').value);
  const input = $('account').value;
  resetReport();
  let target;
  try { target = provider.parse(input); }
  catch (error) { setStatus(error.message, 'error'); $('account').focus(); return; }
  controller = new AbortController();
  const signal = controller.signal;
  const client = createClient(signal);
  setBusy(true);
  try {
    const scan = await provider.scan(target, {
      client, signal, limit: Number($('scan-limit').value), progress: message => setStatus(message, 'loading'),
    });
    signal.throwIfAborted();
    scan.coverage.requests = client.requests;
    report = analyze(scan, provider.id);
    renderOverview(report, provider);
    renderAssessment(report);
    renderCoverage(report, provider);
    renderSignals(report);
    renderActivity(report);
    renderMix(report);
    renderExamples(report);
    visiblePosts = 50;
    drawPosts();
    $('results').hidden = false;
    $('empty-state').hidden = true;
    $('report-link').value = reportUrl();
    history.replaceState(null, '', reportUrl());
    setStatus(`Checked ${report.profile.handle} on ${provider.label}. ${number(report.coverage.ownPosts)} original posts scanned${report.coverage.warnings.length ? '; some data is incomplete' : ''}.`);
  } catch (error) {
    resetReport();
    setStatus(signal.aborted ? 'Check canceled. Enter an account to start again.' : error.message || 'The check could not be completed.', signal.aborted ? 'ready' : 'error');
  } finally {
    controller = null;
    setBusy(false);
  }
}

const query = new URLSearchParams(location.search);
$('platform').replaceChildren(...[...providers.values()].map(provider => {
  const option = node('option', provider.label);
  option.value = provider.id;
  return option;
}));
if (providers.has(query.get('platform'))) $('platform').value = query.get('platform');
if (['100', '500', '1000'].includes(query.get('limit'))) $('scan-limit').value = query.get('limit');
updateProvider();

$('platform').addEventListener('change', () => {
  $('account').value = '';
  updateProvider();
  resetReport();
  setStatus(`Ready to check a ${providers.get($('platform').value).label} account.`);
});
$('check-form').addEventListener('submit', run);
$('example-button').addEventListener('click', () => {
  $('account').value = providers.get($('platform').value).example;
  $('account').focus();
});
$('cancel-button').addEventListener('click', () => controller?.abort());
$('post-filter').addEventListener('change', () => { visiblePosts = 50; drawPosts(); });
$('post-search').addEventListener('input', () => { visiblePosts = 50; drawPosts(); });
$('clear-post-filter').addEventListener('click', () => { activeSignal = null; visiblePosts = 50; drawPosts(); });
$('more-posts').addEventListener('click', () => { visiblePosts += 50; drawPosts(); });
$('copy-link').addEventListener('click', async () => {
  if (!report) return;
  const url = reportUrl();
  try {
    await navigator.clipboard.writeText(url);
    setStatus('Account check link copied. Opening it runs a fresh check.');
  } catch {
    $('report-link-field').hidden = false;
    $('report-link').value = url;
    $('report-link').focus();
    $('report-link').select();
    setStatus('Copy the selected link. Opening it runs a fresh check.');
  }
});
$('download-report').addEventListener('click', () => {
  if (!report) return;
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const download = node('a');
  download.href = url;
  download.download = `social-bot-check-${report.provider}-${report.profile.handle.replace(/[^a-z0-9.-]/gi, '_')}.json`;
  document.body.append(download);
  download.click();
  download.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
  setStatus('JSON report downloaded with the current sample, thresholds, and linked evidence.');
});

if (query.get('user')) {
  $('account').value = query.get('user').slice(0, 300);
  $('check-form').requestSubmit();
}
