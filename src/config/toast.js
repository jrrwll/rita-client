import {toast} from "react-toastify";
import {pushForcibly, refresh} from "../util/history";
import {storage} from ".";

export const toastError = (msg, autoClose=1000) => {
    toast.error(msg, {
        position: "top-center",
        closeOnClick: true,
        autoClose,
    });
};

export const showError = (message) => {
    if (!message) {
        message = "😭 Oops! A error just occurred, maybe your network promble";
    }
    toast.error(message, {
        position: "top-center",
        closeOnClick: true,
        autoClose: 3000,
    });
};

export const showUnexpectedError = () => {
    showError("😭 Oops! A unexpected error just occurred")
};

export const showErrorAndGoTo = (path, message, timeout = 3000) => {
    showError(message);
    setTimeout(() => pushForcibly(path), timeout)
};

export const showErrorAndGoToLogin = (message, timeout = 3000) => {
    storage.removeToken();
    showErrorAndGoTo("/login", message, timeout)
};

export const showSuccessAndRefresh = (message, timeout = 3000) => {
    showSuccess(message);
    setTimeout(() => {
        refresh()
    }, timeout)
};

export const showSuccess = (message) => {
    if (!message) {
        message = "🤣 Woo! Your request has been preformed successfully";
    }
    toast.success(message, {
        position: "top-center",
        closeOnClick: true,
        autoClose: 3000,
    });
};
