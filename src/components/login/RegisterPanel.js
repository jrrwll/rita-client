import React from "react";
import {validateEmail, validateImageCode, validatePassword, validateUsername} from "../../config/validation";
import $ from 'jquery';
import {inputIconLeft} from "../../config";
import TermFooter from "./TermFooter";
import {FormattedMessage} from "react-intl";

export default class RegisterPanel extends React.Component {
    state = {
        usernameError: "",
        passwordError: "",
        emailError: "",
        imageCodeError: "",
        // image code
        hiddenImage: true,
        imageSource: "",
        // backend error message
        error: "",
    };

    componentDidMount() {
        $("#register-page-username").focus();
    }

    checkUsername() {
        const input = $("#register-page-username");
        const usernameError = validateUsername(input.val());
        if (usernameError) {
            input.attr("class", "form-control is-invalid");
        } else {
            input.attr("class", "form-control is-valid");
        }
        this.setState({usernameError: usernameError});
        return !usernameError
    }

    checkPassword() {
        const input = $("#register-page-password");
        const passwordError = validatePassword(input.val());
        if (passwordError) {
            input.attr("class", "form-control is-invalid");
        } else {
            input.attr("class", "form-control is-valid");
        }
        this.setState({passwordError: passwordError});
        return !passwordError
    }

    checkEmail() {
        const input = $("#register-page-email");
        const emailError = validateEmail(input.val());
        if (emailError) {
            input.attr("class", "form-control is-invalid");
        } else {
            input.attr("class", "form-control is-valid");
        }
        this.setState({emailError: emailError});
        return !emailError
    }

    checkImageCode() {
        const input = $("#register-page-image-code");
        const imageCodeError = validateImageCode(input.val());
        if (imageCodeError) {
            input.attr("class", "form-control is-invalid");
        } else {
            input.attr("class", "form-control is-valid");
        }
        this.setState({imageCodeError: imageCodeError});
        return !imageCodeError
    }

    imageCodeOnFocus() {
        this.props.parent.handleObtainImageCode(this)
    }

    imageCodeOnKeyUp(e) {
        if (!this.checkImageCode()) return;
        if (e.key === "Enter") {
            $("#register-page-submit").click();
        }
    }

    formOnSubmit(event) {
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
                            marginTop: 36,
                            marginBottom: 20,
                        }}>
                            <div className="row" style={{marginTop: 25}}>
                                <div className="col-4 offset-4">
                                    <h3 style={{textAlign: "center"}}>
                                        <strong><FormattedMessage id="Sign Up to Lovely Rita"/></strong>
                                    </h3>
                                </div>
                            </div>

                            <form className="needs-validation" noValidate
                                  style={{align: "center",}}>
                                <div className="form-row " style={{marginTop: 15}}>
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
                                        <FormattedMessage id="Username">
                                            {msg => <input type="text" placeholder={msg} className="form-control"
                                                           style={inputIconLeft("solid/user")}
                                                           id="register-page-username" required
                                                           onBlur={e => this.checkUsername()}
                                                           onKeyUp={e => this.checkUsername()}
                                                           aria-describedby="tooltip"
                                            />}
                                        </FormattedMessage>
                                        <div className="invalid-feedback">
                                            {this.state.usernameError && <FormattedMessage id={this.state.usernameError}/>}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row" style={{marginTop: 25}}>
                                    <div className="col-4 offset-4">
                                        <FormattedMessage id="Password">
                                            {msg => <input type="text" className="form-control"
                                                           style={inputIconLeft("solid/lock")}
                                                           id="register-page-password"
                                                           required placeholder={msg}
                                                           onBlur={e => this.checkPassword()}
                                                           onKeyUp={e => this.checkPassword()}/>}
                                        </FormattedMessage>
                                        <div className="invalid-feedback">
                                            {this.state.passwordError && <FormattedMessage id={this.state.passwordError}/>}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row" style={{marginTop: 25}}>
                                    <div className="col-4 offset-4">
                                        <FormattedMessage id="Email address">
                                            {msg => <input type="text" className="form-control"
                                                           style={inputIconLeft("solid/envelope")}
                                                           id="register-page-email"
                                                           required placeholder={msg}
                                                           onBlur={e => this.checkEmail()}
                                                           onKeyUp={e => this.checkEmail()}/>}
                                        </FormattedMessage>

                                        <div className="invalid-feedback">
                                            {this.state.emailError && <FormattedMessage id={this.state.emailError}/>}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row" style={{marginTop: 25}}>
                                    <div className="col-4 offset-4">
                                        <FormattedMessage id="Image code">
                                            {msg => <input type="text" className="form-control"
                                                           style={inputIconLeft("solid/eye")}
                                                           id="register-page-image-code"
                                                           required placeholder={msg}
                                                           onBlur={e => this.checkImageCode()}
                                                           onFocus={e => this.imageCodeOnFocus()}
                                                           onKeyUp={e => this.imageCodeOnKeyUp(e)}/>}
                                        </FormattedMessage>

                                        <div className="invalid-feedback">
                                            {this.state.imageCodeError && <FormattedMessage id={this.state.imageCodeError}/>}
                                        </div>
                                        <div className="form-row" style={{marginTop: 15, marginBottom: 10}}>
                                            <button className="btn btn-primary btn-block" type="button"
                                                    id="register-page-submit"
                                                    onClick={e => this.formOnSubmit(e)}>
                                                <FormattedMessage id="Register"/>
                                            </button>
                                            <div style={{marginTop: 10}}>
                                                <p>
                                                    <FormattedMessage id="Existing a account? "/>
                                                    <a href="/login"><FormattedMessage id="Click here to login"/></a>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        this.state.hiddenImage ? <span/> : (
                                            <div className="col-4" style={{
                                                display: "flex",
                                            }}>
                                                <img alt=""
                                                     style={{maxHeight: 100,}}
                                                     src={this.state.imageSource}/>
                                            </div>
                                        )
                                    }
                                </div>
                            </form>
                        </div>
                    </div>


                    <TermFooter/>

                </div>
            </div>


        );
    }
}
