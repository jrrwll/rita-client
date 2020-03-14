import React, {Component} from 'react';
import PasswordResetPanel from './PasswordResetPanel';
import {submitPasswordReset} from "../../actions";
import $ from "jquery";
import {pushForcibly} from "../../util/history";

export default class PasswordReset extends Component {

    handleSubmit(child, event) {
        const usernameInput = $("#password-reset-page-username");
        if (!child.checkUsername()) {
            usernameInput.focus();
            return;
        }

        const passwordInput = $("#password-reset-page-password");
        if (!child.checkPassword()) {
            passwordInput.focus();
            return;
        }

        const username = usernameInput.val().trim();
        submitPasswordReset(username, passwordInput.val()).then(res => {
            if (res.data.success) {
                // if success to reset password, go to the login page
                pushForcibly(`/login`);
            } else {
                // or show error message in login page
                child.setState({
                    error: res.data.message,
                });
            }
        })
    }

    render() {
        return (
            <PasswordResetPanel parent={this}/>
        );
    }
}
