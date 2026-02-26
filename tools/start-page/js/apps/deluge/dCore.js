import { showToast } from "../../ui/toasts.js";

let requestId = 1;

export async function fetchDeluge(url, method, params = [], password = "") {
    // 1. Construct RPC Payload
    const payload = {
        method: method,
        params: params,
        id: requestId++
    };

    const doRequest = async () => {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (data.error) throw new Error(data.error.message || "RPC Error");
        return data.result;
    };

    try {
        // 2. Try Request
        return await doRequest();
    } catch (err) {
        // 3. Handle Auth Failure (Deluge usually returns null result or specific error on auth fail)
        // If we have a password, try to log in and retry ONCE.
        if (password) {
            console.warn("[Deluge] Request failed, attempting login...", err);
            try {
                // Auth Call
                const authPayload = {
                    method: 'auth.login',
                    params: [password],
                    id: requestId++
                };
                const authRes = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(authPayload)
                });
                const authData = await authRes.json();

                if (authData.result === true) {
                    console.log("[Deluge] Login successful. Retrying...");
                    return await doRequest();
                } else {
                    throw new Error("Invalid Password");
                }
            } catch (loginErr) {
                console.error("[Deluge] Auth failed:", loginErr);
                throw loginErr;
            }
        }
        throw err;
    }
}

export function formatBytes(bytes, decimals = 1) {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}