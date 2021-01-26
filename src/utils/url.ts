import { Record, Static, String } from "runtypes";
import { EditorSettings } from "../settings";

export const HashPayload = Record({
    code: String,
    settings: EditorSettings
});

export type HashPayload = Static<typeof HashPayload>;

export function encodeToHash(payload: HashPayload) {
    return `#` + encodeURIComponent(JSON.stringify(payload));
}

export function decodeFromHash(hash = window.location.hash) {
    const encoded = hash.slice(1);
    if (!encoded) return null;
    try {
        const parsed = JSON.parse(decodeURIComponent(encoded));
        return HashPayload.check(parsed);
    } catch (e) {
        console.error(e);
        return null;
    }
}

export function extractHash() {
    const decoded = decodeFromHash();
    // We remove the hash because keeping the hash in sync is expensive
    // and keeping an out of date hash in url is misleading
    window.location.hash = "";
    return decoded;
}

export function getPermalink(payload: HashPayload) {
    return window.location.href.replace(/(#.*)$/, '') + encodeToHash(payload)
}
