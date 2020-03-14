import {ajax} from "../config";

export function submitRegister({username, password, email, imageCode, redirect}) {
    return ajax.post({
        url: '/auth/register',
        data: {username, password, email, imageCode, redirect},
    });
}

export function submitRegisterConfirm({username, accessToken}) {
    return ajax.post({
        url: '/auth/register/confirm',
        data: {username, accessToken},
    });
}

export function submitLogin({username, password}) {
    return ajax.post({
        url: '/auth/login',
        data: {
            username: username,
            password: password,
        },
    });
}

export function obtainImageCode({email, width, height}) {
    return ajax.post({
        url: '/auth/code/image',
        data: {
            email: email,
            width: width,
            height: height,
        },
    });
}

export function submitPasswordReset({username, newPassword, email, imageCode}) {
    return ajax.post({
        url: '/auth/password-reset',
        data: {username, newPassword, email, imageCode},
    });
}

export function submitPasswordResetConfirm({username, newPassword, accessToken}) {
    return ajax.post({
        url: '/auth/password-reset/confirm',
        data: {username, newPassword, accessToken},
    });
}
