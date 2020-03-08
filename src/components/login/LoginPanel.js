import React, {Component} from "react";
import $ from 'jquery';
import {validatePassword, validateUsername} from "../../config/validation";
import {getSearchValue} from "../../util/url";

export default class LoginPanel extends Component {
    state = {
        usernameError: "",
        passwordError: "",
        errorMessage: "",
    };

    componentDidMount() {
        const usernameInput = $("#login-page-username");
        const username = getSearchValue("username", "");
        if (username){
            usernameInput.val(username);
            $("#login-page-password").focus();
        } else {
            usernameInput.focus();
        }
    }

    checkUsername() {
        const input = $("#login-page-username");
        const usernameError = validateUsername(input.val());
        if (usernameError) {
            input.attr("class", "form-control form-control-lg is-invalid");
        } else {
            input.attr("class", "form-control form-control-lg is-valid");
        }
        this.setState({usernameError: usernameError});
        return !usernameError
    }

    checkPassword() {
        const input = $("#login-page-password");
        const passwordError = validatePassword(input.val());
        if (passwordError) {
            input.attr("class", "form-control form-control-lg is-invalid");
        } else {
            input.attr("class", "form-control form-control-lg is-valid");
        }
        this.setState({passwordError: passwordError});
        return !passwordError
    }

    passwordOnKeyUp(e) {
        if (!this.checkPassword()) return;
        if (e.key === "Enter") {
            $("#login-page-submit").click();
        }
    }

    formOnSubmit() {
        this.props.parent.handleSubmit(this)
    }

    render() {
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
                                        <strong>Login to Lovely Rita</strong>
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
                                        <div className="input-group">
                                            <input type="text" className="form-control form-control-lg"
                                                   id="login-page-username" required placeholder="Username"
                                                   onBlur={e => this.checkUsername()}
                                                   onKeyUp={e => this.checkUsername()}/>
                                        </div>
                                        <div className="invalid-feedback">
                                            {this.state.usernameError}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row" style={{marginTop: 30}}>
                                    <div className="col-4 offset-4">
                                        <label>Password</label>
                                        <input type="text" className="form-control form-control-lg"
                                               id="login-page-password" required placeholder="Password"
                                               onBlur={e => this.checkPassword()}
                                               onKeyUp={e => this.passwordOnKeyUp(e)}/>
                                        <div className="invalid-feedback">
                                            {this.state.passwordError}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row" style={{marginTop: 30}}>
                                    <div className="col-4 offset-4">
                                        <button className="btn btn-primary btn-block" type="button"
                                                id="login-page-submit"
                                                style={{marginBottom: 10,}}
                                                onClick={e => this.formOnSubmit(e)}
                                        >Submit
                                        </button>
                                    </div>
                                </div>

                                <div className="form-row" style={{marginBottom: 64}}>
                                    <div className="col-4 offset-4">
                                        <p>
                                            <a href="/password-reset" className="link-primary">Reset password?</a>
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
