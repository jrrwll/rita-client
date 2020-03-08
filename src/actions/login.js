import {ajax} from "../config";

export function submitRegister(username, password, email, imageCode) {
    return ajax.post({
        url: '/auth/register',
        data: {
            username: username,
            password: password,
            email: email,
            imageCode: imageCode,
        },
    });
}

export function submitLogin(username, password) {
    return ajax.post({
        url: '/auth/login',
        data: {
            username: username,
            password: password,
        },
    });
}

export function obtainImageCode(email, width, height) {
    return ajax.post({
        url: '/auth/code/image',
        data: {
            email: email,
            width: width,
            height: height,
        },
    });
}

export function sendEmailCode(email, imageCode) {
    return ajax.post({
        url: '/auth/code/email',
        data: {
            email: email,
            imageCode: imageCode
        },
    });
}

export function submitPasswordReset(username, newPassword) {
    return ajax.post({
        url: '/auth/password-reset',
        data: {
            username: username,
            newPassword: newPassword,
        },
    });
}

export function submitPasswordResetConfirm(newPassword, accessToken, timestamp) {
    return ajax.post({
        url: '/auth/password-reset/confirm',
        data: {newPassword, accessToken, timestamp},
    });
}
