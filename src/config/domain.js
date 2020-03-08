import {dateFormat} from "../util/time";

export function getPostLink(ctime, name) {
    ctime = dateFormat(ctime, "yyyy-MM-dd");
    const year = ctime.slice(0, 4);
    const month = ctime.slice(5, 7);
    const day = ctime.slice(8, 10);
    return `/${year}/${month}/${day}/${name}`;
}
