// translate (\y\M\d \h\m\s \S \ \\) to (yMd hms S  \)
export function unBackslash(str, backslash = '\\') {
    if (!str) return "";
    let newStr = [];
    let len = str.length;
    for (let i = 0; i < len; i++) {
        if (str[i] === '\\') {
            if (i === len - 1) {
                console.warn('Found unmatched backslash in the end of your string');
                newStr.push(str[i]);
                break;
            } else {
                newStr.push(str[++i]);
                continue;
            }
        }
        newStr.push(str[i]);
    }
    return newStr.join('');
}
