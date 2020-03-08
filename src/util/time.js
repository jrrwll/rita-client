import {unBackslash} from './text'

const nf = v => `${v < 10 ? "0" + v : v}`;
const nf2 = v => `${v < 10 ? "00" + v : (v < 100 ? "0" + v : v)}`;
const monthF = v => ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][v - 1];
const monthF2 = v => ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"][v - 1];
const quarterF = v => ["Spring", "Summer", "Autumn", "Winter"][v - 1];
const dayF = v => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][v];
const dayF2 = v => ["Monday", "Tuesday", "Wednesday", "Thursday",
    "Friday", "Saturday", "Sunday"][v];

/**
 *
 * @param date, Date object/unix millisecond
 * @param fmt
 * @returns {string}
 */
export function dateFormat(date, fmt) {
    fmt = unBackslash(fmt);
    if (!fmt) return "";

    if (typeof date === 'number') {
        date = new Date(Date(date));
    } else if (typeof date === 'string') {
        date = new Date(date);
    }

    const o = [
        ["yyyy", date.getFullYear()],
        ["yy", date.getFullYear() % 100],
        ["y", date.getFullYear() % 100],
        ["MMMM", date.getMonth() + 1, monthF2],
        ["MMM", date.getMonth() + 1, monthF],
        ["MM", date.getMonth() + 1, nf],
        ["M", date.getMonth() + 1],
        ["dd", date.getDate(), nf],
        ["d", date.getDate()],
        ["hh", date.getHours(), nf],
        ["h", date.getHours()],
        ["mm", date.getMinutes(), nf],
        ["m", date.getMinutes()],
        ["ss", date.getSeconds(), nf],
        ["s", date.getSeconds()],
        ["SSS", date.getMilliseconds(), nf2],
        ["SS", date.getMilliseconds()],
        ["S", date.getMilliseconds()],
        ["Q", Math.floor((date.getMonth() + 3) / 3), quarterF],
        ["q", Math.floor((date.getMonth() + 3) / 3)],
        ["w", date.getDay()],
        ["W", date.getDay(), dayF],
        ["WW", date.getDay(), dayF2],
    ];

    for (let i in o) {
        let k = o[i][0];
        let v = o[i][1];
        let f = o[i][2];
        if (f) v = f(v);
        while (
            new RegExp("(" + k + ")").test(fmt)
            ) {
            fmt = fmt.replace(RegExp.$1, `${v}`);
        }
    }
    return fmt;
}


export function yyMMdd(date) {
    return dateFormat(date, "yy.MM.dd");
}

export function yyyyMMdd(date) {
    return dateFormat(date, "yyyy-MM-dd");
}

export function yyyyMMddhhmm(date) {
    return dateFormat(date, "yyyy-MM-dd hh:mm");
}
