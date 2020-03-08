import React from "react";

export const usernameContent = (
    <div style={{
        color: "rgba(12, 12, 12, 0.5)",
    }}>
        <p>Including 4-32 characters,</p>
        <p>Only numbers, alphabets and <strong>_-.</strong> are allowed</p>
        <p>It cannot be modified after setting</p>
    </div>
);

export const passwordContent = (
    <div style={{
        color: "rgba(12, 12, 12, 0.5)",
    }}>
        <p>Including 4-20 characters</p>
        <p>Only numbers,alphabets and punctuations</p>
        <p>except backspace are allowed</p>
    </div>
);

export function validateUsername(value) {
    if (value.length === 0) {
        return "Require username";
    } else if (
        !/^[a-zA-Z][a-zA-Z0-9_-]{3,31}$/.test(value)
    ) {
        return "Invalid username";
    } else {
        return ""
    }
}

export function validatePassword(value) {
    if (value.length === 0) {
        return "Require password";
    } else if (
        !/^[a-zA-Z0-9!@#$%^&*-_+=/\\|:;"',.?]{4,20}$/.test(value)
    ) {
        return "Invalid password";
    } else {
        return ""
    }
}

export function validateEmail(value) {
    if (value.length === 0) {
        return "Require email address"
    } else if (
        !/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(value)
    ) {
        return "Invalid email address";
    } else {
        return ""
    }
}

export function validateImageCode(value) {
    if (value.length === 0) {
        return "Require image code"
    } else if (
        !/^[A-Za-z0-9]{4,8}$/.test(value)
    ) {
        return "Invalid image code";
    } else {
        return ""
    }
}

export function validatePostName(value) {
    if (!value || value.length === 0) {
        return "Require name field"
    } else if (value.length < 4 || value.length > 128) {
        return "Invalid name field";
    } else {
        return ""
    }
}
