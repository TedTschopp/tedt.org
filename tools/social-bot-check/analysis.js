import { DAY, HOUR } from './common.js';

const percent = share => `${Math.round(share * 100)}%`;
const mean = values => values.length ? values.reduce((total, value) => total + value, 0) / values.length : 0;
const fraction = (part, total) => total ? part / total : 0;

export function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

export function breakWindows(times) {
  const sorted = [...times].sort((a, b) => a - b);
  if (sorted.length < 2 || sorted.at(-1) - sorted[0] < 3 * DAY) return { total: 0, withBreak: 0 };
  let total = 0;
  let withBreak = 0;
  let left = 0;
  let right = 0;
  // Only complete 24-hour windows inside the observed sample are eligible.
  for (let start = sorted[0]; start + DAY <= sorted.at(-1); start += HOUR) {
    const end = start + DAY;
    while (left < sorted.length && sorted[left] < start) left++;
    right = Math.max(right, left);
    while (right < sorted.length && sorted[right] <= end) right++;
    let previous = start;
    let longest = 0;
    for (let index = left; index < right; index++) {
      longest = Math.max(longest, sorted[index] - previous);
      previous = sorted[index];
    }
    longest = Math.max(longest, end - previous);
    total++;
    if (longest >= 4 * HOUR) withBreak++;
  }
  return { total, withBreak };
}

export function analyze(scan, providerId, now = Date.now()) {
  const { profile, coverage } = scan;
  const posts = [...scan.posts].sort((a, b) => (b.time ?? -Infinity) - (a.time ?? -Infinity));
  const own = posts.filter(post => !post.isBoost && post.authorId === profile.id);
  const boosts = posts.filter(post => post.isBoost);
  const replies = own.filter(post => post.isReply);
  const other = replies.filter(post => post.parentAuthorId && post.parentAuthorId !== profile.id);
  const unknownTargets = replies.filter(post => !post.parentAuthorId);
  const valid = own.filter(post => post.time != null && post.time <= now);
  const times = valid.map(post => post.time);
  const oldest = times.length ? Math.min(...times) : null;
  const newest = times.length ? Math.max(...times) : null;
  const spanDays = oldest != null && newest != null ? (newest - oldest) / DAY : 0;
  const timed = other.filter(post => post.delayMs != null && post.delayMs >= 0 && post.prompted === false);
  const fast = timed.filter(post => post.delayMs < 120_000);
  const counts = new Map();
  const textKey = post => post.text.trim().replace(/\s+/g, ' ');
  const textPosts = own.filter(post => textKey(post).length >= 10);
  textPosts.forEach(post => counts.set(textKey(post), (counts.get(textKey(post)) || 0) + 1));
  const repeated = textPosts.filter(post => counts.get(textKey(post)) > 1);
  const longReplies = other.filter(post => post.length >= 30 && (counts.get(textKey(post)) || 0) <= 1);
  const lengths = longReplies.map(post => post.length);
  const averageLength = mean(lengths);
  const cv = averageLength ? Math.sqrt(mean(lengths.map(value => (value - averageLength) ** 2))) / averageLength : null;
  const hourCounts = Array(24).fill(0);
  valid.forEach(post => hourCounts[new Date(post.time).getUTCHours()]++);
  const breakPosts = other.filter(post => post.time != null && post.time <= now).length >= 100 ? other.filter(post => post.time != null && post.time <= now) : valid;
  const breaks = breakWindows(breakPosts.map(post => post.time));
  const signals = [];
  function add(definition, enough, flagged, evidence = []) {
    const status = definition.status || (enough ? (flagged ? 'flag' : 'clear') : 'insufficient');
    signals.push({ group: 'behavior', ...definition, status,
      evidenceIds: status === 'flag' || status === 'declared' ? evidence.map(post => post.id) : [] });
  }

  add({ id: 'fast', name: 'Fast unprompted replies',
    observed: `${fast.length} of ${timed.length} available unprompted replies arrived in under two minutes (${percent(fraction(fast.length, timed.length))}). Timing is available for ${other.filter(post => post.delayMs != null).length} of ${other.length} replies to other accounts.`,
    rule: 'At least 10 unprompted replies with a known, nonnegative delay; at least 50% arrive in under two minutes. Known mentions and conversation replies are excluded.',
    caveat: 'Live events and someone actively watching a feed can create fast replies. Missing parent posts limit this check. Bluesky may use record creation times when server indexing was delayed.',
  }, timed.length >= 10, fraction(fast.length, timed.length) >= 0.5, fast);

  const rate = spanDays >= 1 ? Math.max(0, valid.length - 1) / spanDays : null;
  add({ id: 'volume', name: 'High posting rate',
    observed: rate != null ? `${rate.toFixed(1)} original posts and replies per day across ${spanDays.toFixed(1)} days.` : 'The sample covers less than one full day, or has no usable dates.',
    rule: 'At least 50 original posts and replies across at least one day; 50 or more posts per day. The rate is the number of intervals between posts divided by the observed duration.',
    caveat: 'Team accounts, news coverage, scheduled posts, and short bursts of live posting can produce high rates. This sample is not a lifetime average.',
  }, valid.length >= 50 && spanDays >= 1, rate >= 50, valid.slice(0, 5));

  add({ id: 'breaks', name: 'Few extended activity breaks',
    observed: `${breaks.withBreak} of ${breaks.total} complete 24-hour windows contain a four-hour break. Uses ${breakPosts.length} ${breakPosts === valid ? 'original posts and replies' : 'replies to other accounts'}.`,
    rule: 'At least 100 dated posts across three days. Move a complete 24-hour window forward one hour at a time. Trigger when fewer than half of those windows contain a gap of at least four hours.',
    caveat: 'Shared accounts, shift work, and scheduled posts can fill gaps. This measures visible posting activity; it cannot determine whether someone sleeps.',
  }, breakPosts.length >= 100 && breaks.total > 0, fraction(breaks.withBreak, breaks.total) < 0.5);

  add({ id: 'repeated', name: 'Repeated post text',
    observed: `${repeated.length} of ${textPosts.length} text posts repeat another post in the sample (${percent(fraction(repeated.length, textPosts.length))}).`,
    rule: 'At least 20 original text posts of 10 or more characters; at least 20% repeat text after whitespace is normalized. Case, punctuation, and URLs are preserved.',
    caveat: 'Announcements, recurring reminders, accessibility templates, and manually pasted responses can repeat. Repetition does not establish who wrote a post.',
  }, textPosts.length >= 20, fraction(repeated.length, textPosts.length) >= 0.2, repeated);

  add({ id: 'lengths', name: 'Uniform reply lengths',
    observed: cv != null ? `${longReplies.length} distinct replies of 30+ characters have length variation ${cv.toFixed(2)} (average ${Math.round(averageLength)} characters).` : 'No eligible distinct replies of 30+ characters.',
    rule: 'At least 20 distinct replies to other accounts, each at least 30 characters excluding links. Trigger when the standard deviation of length divided by average length is below 0.35.',
    caveat: 'Character limits and a consistent writing style can produce similar lengths. Exact repeated text and short acknowledgments are excluded.',
  }, longReplies.length >= 20, cv != null && cv < 0.35, longReplies.slice(0, 5));

  const replyShare = fraction(other.length, own.length);
  const couldChange = fraction(other.length + unknownTargets.length, own.length) >= 0.9;
  add({ id: 'reply-focus', name: 'Mostly replies to other accounts',
    observed: `${other.length} of ${own.length} original posts reply to another account (${percent(replyShare)}); ${unknownTargets.length} replies have an unknown target.`,
    rule: 'At least 50 original posts and replies; at least 90% are replies to other accounts. Boosts and replies to the account’s own posts are excluded.',
    caveat: 'Some people mainly use social media for conversations. Unknown targets can prevent a reliable result.',
  }, own.length >= 50 && !(replyShare < 0.9 && couldChange), replyShare >= 0.9, other.slice(0, 5));

  const distinctTargets = new Set(other.map(post => post.parentAuthorId)).size;
  add({ id: 'targets', name: 'Many different reply targets',
    observed: `${other.length} replies went to ${distinctTargets} different known accounts (${percent(fraction(distinctTargets, other.length))}).`,
    rule: 'At least 20 replies with known targets; the number of distinct targets is at least 90% of the number of replies.',
    caveat: 'Public discussions, community support, and broad social networks can involve many different people. This check only covers known targets.',
  }, other.length >= 20, fraction(distinctTargets, other.length) >= 0.9, other.slice(0, 5));

  const questions = other.filter(post => post.hasQuestion);
  add({ id: 'questions', name: 'Replies often contain questions',
    observed: `${questions.length} of ${other.length} replies include a question mark (${percent(fraction(questions.length, other.length))}).`,
    rule: 'At least 20 replies to other accounts; at least 70% contain a question mark. This is a punctuation check, not an interpretation of the text.',
    caveat: 'Interviewing, curiosity, and troubleshooting naturally involve questions. A question mark in a quoted passage also counts.',
  }, other.length >= 20, fraction(questions.length, other.length) >= 0.7, questions);

  const varied = own.filter(post => post.hasMedia || post.hasQuote).length + boosts.length;
  add({ id: 'variety', name: 'No media, quotes, or boosts observed',
    observed: `${own.filter(post => post.hasMedia).length} posts with images or video, ${own.filter(post => post.hasQuote).length} quote posts, and ${boosts.length} boosts or reposts in the scanned feed.`,
    rule: 'At least 50 original posts and replies; no images, videos, quote posts, boosts, or reposts occur in the scanned feed.',
    caveat: 'Text-only users and assistive clients can show this pattern. Link preview thumbnails do not count as uploaded media. Feed truncation limits the observation.',
  }, own.length >= 50, varied === 0);

  const odd = other.filter(post => post.timestampStandard === false);
  const noLanguage = other.filter(post => !post.hasLanguage);
  add({ id: 'record-metadata', name: 'Bluesky record metadata', group: 'metadata',
    ...(providerId !== 'bluesky' ? { status: 'unavailable' } : {}),
    observed: providerId === 'bluesky' ? `${odd.length} of ${other.length} replies use a timestamp other than UTC with three decimal places; ${noLanguage.length} lack language tags.` : 'This check requires Bluesky post records and is unavailable on this platform.',
    rule: 'At least 10 replies to other accounts; at least 50% have a different timestamp format, or at least 80% lack language tags.',
    caveat: 'This describes client formatting. Third-party apps, bridges, and cross-posting tools can produce it. It does not prove automation or AI authorship.',
  }, other.length >= 10, fraction(odd.length, other.length) >= 0.5 || fraction(noLanguage.length, other.length) >= 0.8,
  other.filter(post => post.timestampStandard === false || !post.hasLanguage));

  add({ id: 'declared-bot', name: 'Mastodon bot declaration', group: 'metadata',
    status: providerId !== 'mastodon' || profile.declaredBot == null ? 'unavailable' : profile.declaredBot ? 'declared' : 'clear',
    observed: providerId !== 'mastodon' ? 'This check requires the Mastodon profile bot declaration field.' : profile.declaredBot == null ? 'This server did not return the bot declaration field.' : profile.declaredBot ? 'The profile’s bot field is true: this account identifies itself as automated.' : 'The profile’s bot field is false: this account does not identify itself as automated.',
    rule: 'Read the account’s public bot field. This is a self-declaration and is reported separately from behavior checks.',
    caveat: 'The setting is controlled by the account owner. A false value does not establish that a person writes the posts, and a true value does not imply AI-generated text.',
  }, true, false);

  const flagged = signals.filter(signal => signal.group === 'behavior' && signal.status === 'flag');
  const checked = signals.filter(signal => signal.group === 'behavior' && ['flag', 'clear'].includes(signal.status));
  const byPost = new Map();
  signals.forEach(signal => signal.evidenceIds.forEach(id => {
    if (!byPost.has(id)) byPost.set(id, []);
    byPost.get(id).push(signal.name);
  }));
  const warnings = [...coverage.warnings];
  const invalidDates = own.length - valid.length;
  if (invalidDates) warnings.push(`${invalidDates} posts with missing, invalid, or future dates were excluded from activity calculations.`);
  return {
    schemaVersion: 1, provider: providerId, checkedAt: new Date(now).toISOString(), profile,
    posts: posts.map(post => ({ ...post, observedSignals: byPost.get(post.id) || [] })),
    signals, coverage: { ...coverage, warnings, ownPosts: own.length, boosts: boosts.length,
      replies: replies.length, otherReplies: other.length, timedReplies: other.filter(post => post.delayMs != null).length,
      oldest, newest, spanDays, invalidDates },
    summary: { flagged: flagged.length, checked: checked.length, total: signals.filter(signal => signal.group === 'behavior').length,
      smallSample: own.length < 20, hourCounts, breaks, medianReplyMs: median(timed.map(post => post.delayMs)) },
  };
}
