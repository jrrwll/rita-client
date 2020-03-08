export const UPPER_CASE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const LOWER_CASE_LETTERS = "abcdefghijklmnopqrstuvwxyz";
export const NUMBERS = "0123456789";
export const NUMBERS_HEX = "0123456789abcdef";

// return [start, end -1]
export function randi2(start, end) {
    return Math.floor(Math.random() * (end - start)) + start;
}

// return [0, n -1]
export function randi(n) {
    return Math.floor(Math.random() * n);
}

export function choose10(size) {
    return choose(size, NUMBERS)
}

export function choose26(size) {
    return choose(size, LOWER_CASE_LETTERS)
}

export function choose36(size) {
    return choose(size, 'abcdefghijklmnopqrstuvwxyz0123456789')
}

export function choose52(size) {
    return choose(size, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
}

export function choose62(size) {
    return choose(size, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
}

export function choose72(size) {
    return choose(size, 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
}

export function choose(size, letters) {
    let chars = [];
    for (let i = 0; i < size; i++) {
        let length = letters.length;
        let index = Math.floor(Math.random() * length);
        index %= length;
        chars.push(letters[index]);
    }
    return chars.join('');
}


