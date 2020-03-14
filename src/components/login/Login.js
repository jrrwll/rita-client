import React from 'react';
import {submitLogin} from "../../actions";
import LoginPanel from "./LoginPanel";

import {storage} from '../../config';
import {pushForcibly} from '../../util/history'
import $ from 'jquery';

export default class Login extends React.Component {
    componentDidMount() {
        // redirect if has a token in localStorage
        // check its validity in next page
        if (storage.hasToken()) {
            pushForcibly('/overview');
        } else {
            // clear old main cache
            storage.removeUser();
        }
    }

    handleSubmit(child, event) {
        const usernameInput = $("#login-page-username");
        if (!child.checkUsername()) {
            usernameInput.focus();
            return;
        }

        const passwordInput = $("#login-page-password");
        if (!child.checkPassword()) {
            passwordInput.focus();
            return;
        }

        const username = usernameInput.val().trim();
        submitLogin({username, password: passwordInput.val()}).then(res => {
            if (res.data.success) {
                // if success to login, go to the main page
                pushForcibly(`/overview`);
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
            <LoginPanel parent={this}/>
        );
    }
}
