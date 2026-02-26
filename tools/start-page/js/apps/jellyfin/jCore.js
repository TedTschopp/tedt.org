export async function fetchJellyfin(baseUrl, endpoint, params = {}, apiKey = "") {
    // Clean URL
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    // FIX: Add 'window.location.origin' as the base.
    // This allows relative paths (e.g. "/jellyfin-api") to work correctly.
    // If 'cleanBase' is already absolute (http://...), the base argument is ignored.
    const url = new URL(cleanBase + endpoint, window.location.origin);

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const headers = {
        'Accept': 'application/json'
    };

    // Jellyfin Auth Header
    if (apiKey) headers['X-Emby-Token'] = apiKey;

    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
}

export function getJellyfinImage(baseUrl, itemId, type = "Backdrop") {
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    return `${cleanBase}/Items/${itemId}/Images/${type}/0?quality=90`;
}