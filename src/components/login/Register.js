import React from "react";
import $ from "jquery";
import RegisterPanel from "./RegisterPanel";
import {storage} from '../../config';
import {pushForcibly} from '../../util/history';
import {obtainImageCode, submitRegister} from "../../actions";

export default class Register extends React.Component {
    check(child) {
        const usernameInput = $("#register-page-username");
        const passwordInput = $("#register-page-password");
        const emailInput = $("#register-page-email");

        if (!child.checkUsername()) {
            usernameInput.focus();
            return;
        }
        if (!child.checkPassword()) {
            passwordInput.focus();
            return;
        }
        if (!child.checkEmail()) {
            emailInput.focus();
            return;
        }
        return true;
    }

    handleObtainImageCode(child) {
        if (this.check(child) === undefined) return;

        obtainImageCode($("#register-page-email").val(), 300, 100).then(res => {
            if (res.data.success) {
                child.setState({
                    hiddenImage: false,
                    imageSource: res.data.data,
                })
            } else {
                // or show error message
                child.setState({
                    error: res.data.message,
                });
            }
        });
    }

    handleSubmit(child) {
        if (this.check(child) === undefined) return;

        const usernameInput = $("#register-page-username");
        const passwordInput = $("#register-page-password");
        const emailInput = $("#register-page-email");
        const imageCodeInput = $("#register-page-image-code");
        if (!child.checkImageCode()) {
            imageCodeInput.focus();
            return;
        }

        const username = usernameInput.val();
        submitRegister(username, passwordInput.val(),
            emailInput.val(), imageCodeInput.val()).then(res => {
            if (res.data.success) {
                // clear old main cache
                storage.removeUser();
                // if success to login, go to the main page
                pushForcibly("/login?username=" + username);
            } else {
                // or show error message in login page
                child.setState({
                    error: res.data.message,
                });
            }
        });
    };

    render() {
        return (
            <RegisterPanel parent={this}/>
        );
    }
}
