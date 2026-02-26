//

// Cache the session ID so we don't spam the login endpoint
let cachedSid = null;

export async function fetchPihole(fullUrl, params = {}, token = '', baseUrl = '') {
    // 1. Construct URL
    const url = new URL(fullUrl, window.location.origin);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    // 2. Prepare Headers
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    // Use Cached Session ID if available
    if (cachedSid) {
        headers['X-FTL-SID'] = cachedSid;
    }

    // --- HELPER: DO REQUEST ---
    const doRequest = async () => {
        const res = await fetch(url, { headers });

        // If 401, throw specific error to trigger auto-login
        if (res.status === 401) throw new Error("401");
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

        const text = await res.text();
        return text ? JSON.parse(text) : {};
    };

    // --- MAIN FLOW ---
    try {
        return await doRequest();

    } catch (err) {
        // If Unauthorized (401) AND we have credentials to try logging in
        if (err.message === "401" && token && baseUrl) {
            console.warn("[Pi-hole] Session Invalid. Attempting Login...");

            try {
                // 1. Construct Auth Endpoint
                // If baseUrl is '/pi-api/api', this becomes '/pi-api/api/auth'
                // This maps to https://pihole/api/auth via Nginx
                const authUrl = new URL(`${baseUrl}/auth`, window.location.origin);

                // 2. POST Password to get SID
                const loginRes = await fetch(authUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: token })
                });

                if (!loginRes.ok) throw new Error("Login Failed");

                const loginData = await loginRes.json();

                // 3. Extract SID
                if (loginData.session && loginData.session.sid) {
                    console.log("[Pi-hole] Login Success! Got SID.");

                    // Update Cache & Header
                    cachedSid = loginData.session.sid;
                    headers['X-FTL-SID'] = cachedSid;

                    // 4. Retry Original Request
                    return await doRequest();
                } else {
                    throw new Error("No SID returned");
                }

            } catch (loginErr) {
                console.error("[Pi-hole] Auto-Login Failed:", loginErr);
                // Clear cache just in case
                cachedSid = null;
                throw new Error("Auth Failed");
            }
        }
        throw err;
    }
}

export function formatNumber(num) {
    if (num === undefined || num === null) return '--';
    return new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);
}