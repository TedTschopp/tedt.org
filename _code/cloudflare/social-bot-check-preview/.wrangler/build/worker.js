var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../../../tools/social-bot-check/common.js
function httpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}
__name(httpsUrl, "httpsUrl");
function publicOrigin(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error("Enter a valid HTTPS Mastodon server.");
  }
  const host = url.hostname;
  if (!httpsUrl(value) || url.port && url.port !== "443" || !host.includes(".") || host.includes(":") || /^\d+(\.\d+){3}$/.test(host) || /(^|\.)(localhost|local|internal|test|invalid|example)$/.test(host)) {
    throw new Error("Use a public Mastodon domain over HTTPS, such as mastodon.social.");
  }
  return url.origin;
}
__name(publicOrigin, "publicOrigin");

// ../../../tools/social-bot-check/providers/bluesky.js
var actorFromUri = /* @__PURE__ */ __name((uri) => /^at:\/\/([^/]+)\//.exec(uri || "")?.[1] || null, "actorFromUri");
function parseBluesky(raw) {
  let actor = raw.trim();
  if (/^https?:\/\//i.test(actor)) {
    const url = new URL(actor);
    if (url.hostname !== "bsky.app" || url.username || url.password || url.port) {
      throw new Error("Use a bsky.app profile or post URL, a Bluesky handle, or a DID.");
    }
    const match = /^\/profile\/([^/]+)/.exec(url.pathname);
    if (!match) throw new Error("That Bluesky URL does not contain an account.");
    actor = decodeURIComponent(match[1]);
  } else if (actor.startsWith("at://")) {
    actor = actorFromUri(actor) || "";
  }
  actor = actor.replace(/^@/, "");
  if (/^did:(plc:[a-z0-9]+|web:[a-z0-9._:%-]+)$/i.test(actor)) return { actor };
  if (!actor.includes(".")) actor += ".bsky.social";
  if (!/^(?=.{3,253}$)[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(actor)) {
    throw new Error("Enter a Bluesky handle such as tedt.org or name.bsky.social.");
  }
  return { actor: actor.toLowerCase() };
}
__name(parseBluesky, "parseBluesky");

// ../../../tools/social-bot-check/providers/mastodon.js
function parseMastodon(raw) {
  const value = raw.trim();
  let origin;
  let username;
  if (/^https?:\/\//i.test(value)) {
    origin = publicOrigin(value);
    const url = new URL(value);
    const match = /^\/(?:@([^/]+)|users\/([^/]+))(?:\/|$)/.exec(url.pathname);
    if (!match) throw new Error("Use a Mastodon profile URL such as https://mastodon.social/@name.");
    username = decodeURIComponent(match[1] || match[2]);
  } else {
    const match = /^@?([^@\s]+)@([^@\s/]+)$/.exec(value);
    if (!match) throw new Error("Include the Mastodon server: @name@mastodon.social.");
    origin = publicOrigin(`https://${match[2]}`);
    username = match[1];
  }
  if (!/^[a-z0-9_.-]+$/i.test(username)) throw new Error("That Mastodon username is not valid.");
  return { origin, username };
}
__name(parseMastodon, "parseMastodon");

// src/worker.mjs
var PAGE = "https://tedt.org/tools/social-bot-check.html";
var PATH = new URL(PAGE).pathname;
var PROFILE_TIMEOUT = 2e3;
var MAX_PROFILE_BYTES = 262144;
function avatarUrl(value) {
  if (typeof value !== "string") return null;
  try {
    publicOrigin(value);
    const url = new URL(value);
    if (/\/avatars\/(?:original|static)\/missing\.[a-z0-9]+$/i.test(url.pathname)) return null;
    url.hash = "";
    return url.href;
  } catch {
    return null;
  }
}
__name(avatarUrl, "avatarUrl");
function image(avatar, label) {
  return avatar ? {
    image: avatar,
    alt: `${String(label).replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, 180)} profile picture`
  } : null;
}
__name(image, "image");
var previews = /* @__PURE__ */ new Map([
  ["bluesky", {
    parse: parseBluesky,
    endpoint(target) {
      const url = new URL("https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile");
      url.searchParams.set("actor", target.actor);
      return url;
    },
    image(profile) {
      if (typeof profile?.did !== "string" || typeof profile.handle !== "string") return null;
      if (profile.handle.startsWith("did:") || parseBluesky(profile.handle).actor !== profile.handle.toLowerCase()) return null;
      return image(avatarUrl(profile.avatar), `@${profile.handle} on Bluesky`);
    }
  }],
  ["mastodon", {
    parse: parseMastodon,
    endpoint(target) {
      const url = new URL("/api/v1/accounts/lookup", target.origin);
      url.searchParams.set("acct", target.username);
      return url;
    },
    image(profile, target) {
      if (!/^\d+$/.test(profile?.id || "") || typeof profile.acct !== "string") return null;
      const avatar = avatarUrl(profile.avatar_static) || avatarUrl(profile.avatar);
      const handle = profile.acct.includes("@") ? profile.acct : `${profile.acct}@${new URL(target.origin).hostname}`;
      parseMastodon(`@${handle}`);
      return image(avatar, `@${handle} on Mastodon`);
    }
  }]
]);
function accountFromUrl(url) {
  const user = (url.searchParams.get("user") || "").trim();
  const platform = url.searchParams.get("platform") || "bluesky";
  const adapter = previews.get(platform);
  if (!user || user.length > 300 || !adapter) return null;
  try {
    const target = adapter.parse(user);
    const endpoint = adapter.endpoint(target);
    const link = new URL(PAGE);
    link.searchParams.set("platform", platform);
    link.searchParams.set("user", user);
    const limit = url.searchParams.get("limit");
    if (["100", "500", "1000"].includes(limit)) link.searchParams.set("limit", limit);
    return { adapter, target, endpoint, link };
  } catch {
    return null;
  }
}
__name(accountFromUrl, "accountFromUrl");
async function profileJson(response) {
  if (!response.ok || !/\bapplication\/(?:[a-z0-9.+-]*\+)?json\b/i.test(response.headers.get("content-type") || "")) {
    await response.body?.cancel();
    throw new Error("The public profile API did not return JSON.");
  }
  if (Number(response.headers.get("content-length")) > MAX_PROFILE_BYTES) {
    await response.body?.cancel();
    throw new Error("The public profile response is too large.");
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let text = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_PROFILE_BYTES) {
        await reader.cancel();
        throw new Error("The public profile response is too large.");
      }
      text += decoder.decode(value, { stream: true });
    }
    return JSON.parse(text + decoder.decode());
  } finally {
    reader.releaseLock();
  }
}
__name(profileJson, "profileJson");
async function lookupImage(account, ctx) {
  const key = new URL("/__social-bot-check-preview-cache/v1", PAGE);
  key.searchParams.set("profile", account.endpoint.href);
  const cacheKey = new Request(key);
  const cache = caches.default;
  try {
    const cached2 = await cache.match(cacheKey);
    if (cached2) return await cached2.json();
  } catch {
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROFILE_TIMEOUT);
  let preview = null;
  try {
    const response = await fetch(account.endpoint, {
      signal: controller.signal,
      redirect: "manual",
      credentials: "omit",
      headers: { Accept: "application/json" }
    });
    const profile = await profileJson(response);
    preview = account.adapter.image(profile, account.target);
  } catch {
  } finally {
    clearTimeout(timer);
  }
  const cached = Response.json(preview, {
    headers: { "Cache-Control": `public, max-age=${preview ? 600 : 60}` }
  });
  ctx.waitUntil(cache.put(cacheKey, cached).catch(() => {
  }));
  return preview;
}
__name(lookupImage, "lookupImage");
function rewriteMetadata(response, account, preview, versionId) {
  const values = /* @__PURE__ */ new Map([
    ["og:url", account.link.href],
    ["twitter:url", account.link.href]
  ]);
  if (preview) {
    values.set("og:image", preview.image);
    values.set("og:image:secure_url", preview.image);
    values.set("og:image:alt", preview.alt);
    values.set("twitter:image", preview.image);
    values.set("twitter:image:src", preview.image);
    values.set("twitter:image:alt", preview.alt);
    values.set("twitter:card", "summary");
  }
  const rewritten = new HTMLRewriter().on("head meta", {
    element(element) {
      const key = element.getAttribute("property") || element.getAttribute("name");
      if (preview && ["og:image:width", "og:image:height", "og:image:type", "twitter:image:width", "twitter:image:height"].includes(key)) {
        element.remove();
      } else if (values.has(key)) {
        element.setAttribute("content", values.get(key));
      }
    }
  }).transform(response);
  const headers = new Headers(rewritten.headers);
  headers.set("Cache-Control", "private, no-store");
  headers.set("X-Social-Bot-Check-Preview", preview ? "avatar" : "fallback");
  if (versionId) headers.set("X-Social-Bot-Check-Preview-Version", versionId);
  for (const name of ["ETag", "Last-Modified", "Content-Length", "Content-MD5", "Age", "Expires"]) headers.delete(name);
  return new Response(rewritten.body, { status: rewritten.status, statusText: rewritten.statusText, headers });
}
__name(rewriteMetadata, "rewriteMetadata");
var worker_default = {
  async fetch(request, env, ctx) {
    ctx.passThroughOnException();
    const url = new URL(request.url);
    if (request.method !== "GET" || url.origin !== new URL(PAGE).origin || url.pathname !== PATH) return fetch(request);
    const account = accountFromUrl(url);
    if (!account) return fetch(request);
    const headers = new Headers(request.headers);
    for (const name of ["If-None-Match", "If-Modified-Since", "Range", "If-Range"]) headers.delete(name);
    const response = await fetch(new Request(PAGE, { method: "GET", headers, redirect: "manual" }));
    if (response.status !== 200 || !/^text\/html\b/i.test(response.headers.get("content-type") || "")) return response;
    const preview = await lookupImage(account, ctx);
    return rewriteMetadata(response, account, preview, env.CF_VERSION_METADATA?.id);
  }
};
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map
