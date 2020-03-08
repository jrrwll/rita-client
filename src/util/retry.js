export function retry(fn, retries, timeout, callback) {
    if (retries < 1) {
        callback(false);
        return;
    }
    if (fn()) {
        callback(true);
        return;
    }
    setTimeout(() => retry(fn, retries - 1, timeout, callback), timeout);
}
