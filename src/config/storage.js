function set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function get(key) {
    return JSON.parse(localStorage.getItem(key));
}

function remove(key) {
    localStorage.removeItem(key);
}

// dynamic load highlight css
const HIGHLIGHT_STYLE = "HIGHLIGHT_STYLE";
const AUTHORIZATION_TOKEN = "AUTHORIZATION_TOKEN";
const AUTHORIZATION_USER = "AUTHORIZATION_USER";
const AUTHORIZATION_AVATAR = "AUTHORIZATION_AVATAR";
const POST_NEW_DRAFT = "POST_NEW_DRAFT";

const storage = {
    // no json
    getToken() {
        return localStorage.getItem(AUTHORIZATION_TOKEN)
    },
    setToken(token) {
        localStorage.setItem(AUTHORIZATION_TOKEN, token)
    },
    removeToken() {
        localStorage.removeItem(AUTHORIZATION_TOKEN)
    },
    hasToken() {
        return this.getToken() !== null;
    },

    // current user
    getUser() {
        return get(AUTHORIZATION_USER);
    },
    setUser(user) {
        return set(AUTHORIZATION_USER, user);
    },
    removeUser() {
        return remove(AUTHORIZATION_USER);
    },
    getAvatar() {
        return localStorage.getItem(AUTHORIZATION_AVATAR)
    },
    setAvatar(avatar) {
        localStorage.setItem(AUTHORIZATION_AVATAR, avatar)
    },
    removeAvatar() {
        localStorage.removeItem(AUTHORIZATION_AVATAR)
    },

    // code highlight style
    setStyle(value) {
        localStorage.setItem(HIGHLIGHT_STYLE, value);
    },
    getStyle() {
        return localStorage.getItem(HIGHLIGHT_STYLE);
    },
    removeStyle() {
        localStorage.removeItem(HIGHLIGHT_STYLE);
    },

    // post new draft
    setPostNewDraft({title, style, name, published, summary, currentTags, content}) {
        set(POST_NEW_DRAFT, {title, style, name, published, summary, currentTags, content});
    },

    getPostNewDraft() {
        const draft = get(POST_NEW_DRAFT);
        if (draft === null) {
            return {title: "", name: "", style: "", published: true, summary: "", currentTags: [], content: ""}
        } else {
            return draft;
        }
    },
    removePostNewDraft() {
        remove(POST_NEW_DRAFT);
    },

};

export default storage;
