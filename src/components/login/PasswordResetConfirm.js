import React from "react";
import $ from 'jquery';
import {validatePassword, validateUsername} from "../../config/validation";
import {submitPasswordResetConfirm} from "../../actions";
import {pushForcibly} from "../../util/history";
import {getSearchValue} from "../../util/url";
import NotFound from "../main/NotFound";
import {storage} from "../../config";

export default class PasswordResetConfirm extends React.Component {
    constructor(props) {
        super(props);
        const accessToken = getSearchValue("accessToken", "");
        this.state = {
            usernameError: "",
            passwordError: "",
            error: "",
            accessToken,
        };
    }

    componentDidMount() {
        $("#password-reset-confirm-page-username").focus();
    }

    checkUsername() {
        const input = $("#password-reset-confirm-page-username");
        const usernameError = validateUsername(input.val());
        if (usernameError) {
            input.attr("class", "form-control form-control-lg is-invalid");
        } else {
            input.attr("class", "form-control form-control-lg is-valid");
        }
        this.setState({usernameError});
        return !usernameError
    }

    checkPassword() {
        const input = $("#password-reset-confirm-page-password");
        const passwordError = validatePassword(input.val());
        if (passwordError) {
            input.attr("class", "form-control form-control-lg is-invalid");
        } else {
            input.attr("class", "form-control form-control-lg is-valid");
        }
        this.setState({passwordError});
        return !passwordError
    }

    passwordOnKeyUp(e) {
        if (!this.checkPassword()) return;
        if (e.key === "Enter") {
            $("#password-reset-confirm-page-submit").click();
        }
    }

    formOnSubmit() {
        const usernameInput = $("#password-reset-confirm-page-username");
        if (!this.checkUsername()) {
            usernameInput.focus();
            return;
        }

        const passwordInput = $("#password-reset-confirm-page-password");
        if (!this.checkPassword()) {
            passwordInput.focus();
            return;
        }

        const {accessToken} = this.state;
        const username = usernameInput.val().trim();
        submitPasswordResetConfirm({username, newPassword: passwordInput.val(), accessToken}).then(res => {
            if (res.data.code === 0) {
                storage.removeAll();
                // if success to reset password, go to the login page
                pushForcibly(`/login?username=${username}`);
            } else {
                // or show error message in login page
                this.setState({
                    error: res.data.message,
                });
            }
        })
    }

    render() {
        if (!this.state.accessToken) {
            return <NotFound/>
        }

        return (
            <div style={{
                background: "#f6f6f6",
            }}>
                <div className="container-fluid" style={{
                    height: 64,
                    marginLeft: 0,
                    marginRight: 0,
                    background: "#21232a",
                }}>

                </div>

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-8 offset-2" style={{
                            background: "#fff",
                            marginTop: 64,
                            marginBottom: 64,
                        }}>
                            <div className="row" style={{marginTop: 25}}>
                                <div className="col-4 offset-4">
                                    <h3 style={{textAlign: "center"}}>
                                        <strong>Reset password</strong>
                                    </h3>
                                </div>
                            </div>
                            <form className="needs-validation" noValidate style={{
                                align: "center",
                            }}>
                                <div className="form-row" style={{marginTop: 30}}>
                                    <div className="col-4 offset-4">
                                        {this.state.error && (
                                            <div className="alert alert-danger fade show"
                                                 role="alert">
                                                {this.state.error}
                                                <button type="button" className="close" aria-label="Close"
                                                        onClick={e => {
                                                            this.setState({error: ""})
                                                        }}>
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-4 offset-4">
                                        <label>Username</label>
                                        <input type="text" className="form-control form-control-lg"
                                               id="password-reset-confirm-page-username" required placeholder="Username"
                                               onChange={e => this.checkUsername()}/>
                                        <div className="invalid-feedback">
                                            {this.state.usernameError}
                                        </div>
                                    </div>
                                    <div className="col-4 offset-4">
                                        <label>Password</label>
                                        <input type="text" className="form-control form-control-lg"
                                               id="password-reset-confirm-page-password" required placeholder="Password"
                                               onKeyUp={e => this.passwordOnKeyUp(e)}/>
                                        <div className="invalid-feedback">
                                            {this.state.passwordError}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row" style={{marginTop: 30}}>
                                    <div className="col-4 offset-4">
                                        <button className="btn btn-primary btn-block" type="button"
                                                id="password-reset-confirm-page-submit"
                                                style={{marginBottom: 10,}}
                                                onClick={e => this.formOnSubmit(e)}
                                        >Reset
                                        </button>
                                    </div>
                                </div>

                                <div className="form-row" style={{marginBottom: 64}}>
                                    <div className="col-4 offset-4">
                                        <p>
                                            <a href="/login" className="link-primary">Login</a>
                                            &nbsp;Or click here to&nbsp;
                                            <a href="/register" className="link-info">Sign Up</a></p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-4 offset-4" style={{display: "flex"}}>
                    <a href="/site/terms" style={{marginRight: "auto"}}>
                        <small style={{color: "#71767d"}}>Terms</small>
                    </a>
                    <a href="/site/privacy" style={{marginRight: "auto"}}>
                        <small style={{color: "#71767d"}}>Privacy</small>
                    </a>
                    <a href="/site/security" style={{marginRight: "auto"}}>
                        <small style={{color: "#71767d"}}>Security</small>
                    </a>
                    <a href="/site/contact" style={{marginRight: 0}}>
                        <small>Contact us</small>
                    </a>
                </div>
            </div>
        );
    }
}
