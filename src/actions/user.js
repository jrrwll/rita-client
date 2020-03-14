import {ajax, emitter, showError, showErrorAndGoToLogin, storage} from "../config";
import {FETCH_USER_EVENT} from ".";
import {FETCH_AVATAR_EVENT} from "./constants";

export function fetchUser() {
    return ajax.get({
        url: '/user',
    });
}

export function updateUser({gender, style, birthday, email, username, firstName, lastName}) {
    return ajax.put({
        url: '/user',
        data: {gender, style, birthday, email, username, firstName, lastName}
    });
}

export function getUsernameValidity(username) {
    return ajax.get({
        url: `/user/validity/username/${username}`,
    });
}

export function getEmailValidity(email) {
    return ajax.get({
        url: `/user/validity/email/${email}`,
    });
}

export function fetchAvatar() {
    return ajax.get({
        url: "/user/avatar",
    })
}

export function updateAvatar(avatar) {
    return ajax.post({
        url: "/user/avatar",
        data: {avatar}
    })
}

//// //// ////    //// //// ////    //// //// ////    //// //// ////    //// //// ////


export function requireFetchUser() {
    const user = storage.getUser();
    if (user) {
        emitter.emit(FETCH_USER_EVENT, user);
        return;
    }
    fetchUser().then(res => {
        if (res.data.success) {
            const user = res.data.data;
            storage.setUser(user);
            emitter.emit(FETCH_USER_EVENT, user);
        } else {
            showErrorAndGoToLogin(res.data.message);
        }
    }, err => {
        if (ajax.isCancel(err)) {
            console.error("Duplicated request for fetching user, it's a unexpected error!");
            return;
        }
        console.error("I failed to fetch your user information, " +
            " It could be a server-end issue, it's my mistake!");
        console.error(err);
    });
}

export function requireFetchAvatar() {
    const avatar = storage.getAvatar();
    if (avatar) {
        emitter.emit(FETCH_AVATAR_EVENT, avatar);
        return;
    }
    fetchAvatar().then(res => {
        if (res.data.success) {
            const avatar = res.data.data;
            storage.setAvatar(avatar);
            emitter.emit(FETCH_AVATAR_EVENT, avatar);
        } else {
            showError(res.data.message);
        }
    }, err => {
        if (ajax.isCancel(err)) {
            console.error("Duplicated request for fetching user, it's a unexpected error!");
            return;
        }
        console.error("I failed to fetch your avatar, " +
            " It could be a server-end issue, it's my mistake!");
        console.error(err);
    });
}
