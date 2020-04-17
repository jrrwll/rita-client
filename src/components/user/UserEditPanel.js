import React, {Component} from "react";
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css'
import {emitter, showError, storage} from "../../config";
import StyleChooseModal from "../common/StyleChooseModal";
import {FETCH_USER_EVENT, getEmailValidity, getUsernameValidity, updateUser} from "../../actions";
import {refresh} from "../../util/history";
import PropTypes from "prop-types";
import {validateEmail, validateUsername} from "../../config/validation";
import {FormattedMessage} from "react-intl";

export class UserEditPanel extends Component {
    static propTypes = {
        hidden: PropTypes.bool.isRequired,
    };

    static contextTypes = {
        setHiddenUserEdit: PropTypes.func,
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            firstName: "", lastName: "", email: "", username: "",
            gender: "", birthday: "", style: "", avatar: "",
            usernameError: "", usernameCheck: "", emailError: "", emailCheck: "",
            editedBirthday: "", editedStyle: ""
        };
        this.fetchUserEventEmitter = emitter.addListener(FETCH_USER_EVENT, (user) => {
            const {
                firstName, lastName, email, username,
                gender, birthday, style, avatar
            } = user;
            this.setState({
                firstName, lastName, email, username,
                gender, birthday, style, avatar,
                editedBirthday: birthday, editedStyle: style,
            });
        });
    }

    componentWillUnmount() {
        emitter.removeListener(FETCH_USER_EVENT, this.fetchUserEventEmitter);
    }

    confirmOnClick(e) {
        const style = this.state.editedStyle;
        const birthday = this.state.editedBirthday;
        const username = document.querySelector("#user-edit-username").value;
        const email = document.querySelector("#user-edit-email").value;
        const firstName = document.querySelector("#user-edit-firstName").value;
        const lastName = document.querySelector("#user-edit-lastName").value;
        let gender = document.querySelector("#user-edit-gender");
        gender = gender[gender.selectedIndex].value;
        console.log({gender, style, birthday, email, username, firstName, lastName});

        // no change
        if (style === this.state.style
            && style === this.state.style
            && birthday === this.state.birthday
            && username === this.state.username
            && email === this.state.email
            && firstName === this.state.firstName
            && lastName === this.state.lastName
            && gender === this.state.gender) {
            emitter.emit("userEditClick");
            return;
        }
        updateUser({gender, style, birthday, email, username, firstName, lastName}).then(res => {
            if (res.data.code === 0) {
                storage.removeUser();
                refresh();
            } else {
                showError(res.data.message)
            }
        }, err => {
            showError();
        })
    }

    showUsernameValidity(input, isValid, usernameError, usernameCheck) {
        if (isValid) {
            input.setAttribute("class", "form-control is-valid")
        } else {
            input.setAttribute("class", "form-control is-invalid");
        }
        this.setState({usernameError, usernameCheck});
    }

    showEmailValidity(input, isValid, emailError, emailCheck) {
        if (isValid) {
            input.setAttribute("class", "form-control is-valid")
        } else {
            input.setAttribute("class", "form-control is-invalid");
        }
        this.setState({emailError, emailCheck});
    }

    checkUsername(input) {
        let usernameError = validateUsername(input.value);
        let isValid = !usernameError;
        this.showUsernameValidity(input, isValid, usernameError, "");
        return isValid;
    }

    checkEmail(input) {
        let emailError = validateEmail(input.value);
        let isValid = !emailError;
        this.showEmailValidity(input, isValid, emailError, "");
        return isValid;
    }

    usernameOnBlur(e) {
        const input = e.target;
        if (!this.checkUsername(input)) return;
        const username = input.value;
        if (username === this.state.username) {
            this.showUsernameValidity(input, true, "",
                "Well!😇 It's the original name");
            return;
        }
        getUsernameValidity(username).then(res => {
            if (res.data.success) {
                if (res.data.data) {
                    this.showUsernameValidity(input, true, "",
                        "Congratulations!🤣 The name is available");
                    return;
                }
                this.showUsernameValidity(input, false, "Oops! The name has been taken", "");
            }
        }, err => {
            this.showUsernameValidity(input, false,
                "A error has occurred!😭 Check your network first maybe",
                "");
        });
    }

    emailOnBlur(e) {
        const input = e.target;
        if (!this.checkEmail(input)) return;
        const email = input.value;
        if (email === this.state.email) {
            this.showEmailValidity(input, true, "",
                "Well!😇 It's the original email address");
            return;
        }
        getEmailValidity(email).then(res => {
            if (res.data.success) {
                if (res.data.data) {
                    this.showEmailValidity(input, true, "",
                        "Congratulations!🤣 The name is available");
                    return;
                }
                this.showEmailValidity(input, false, "Oops! The email address has been taken", "");
            }
        }, err => {
            this.showEmailValidity(input, false,
                "A error has occurred!😭 Check your network first maybe",
                "");
        });
    }


    render() {
        const {
            firstName, lastName, email, username, gender, style,
            editedBirthday,
            usernameError, usernameCheck, emailError, emailCheck,
        } = this.state;
        const {hidden} = this.props;
        return (
            <div className="card my-2" style={{
                display: hidden ? "none" : "block"
            }}>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4 my-1">
                            <div className="h5 text-muted"><FormattedMessage id="Username"/></div>
                            <input className="form-control" required
                                   id="user-edit-username"
                                   onChange={e => this.checkUsername(e.target)}
                                   onBlur={e => this.usernameOnBlur(e)}
                                   defaultValue={username}/>
                            <div className="invalid-feedback">
                                {usernameError && <FormattedMessage id={usernameError}/>}
                            </div>
                            <div className="valid-feedback">
                                {usernameCheck && <FormattedMessage id={usernameCheck}/>}
                            </div>
                        </div>
                        <div className="col-md-4 my-1">
                            <div className="h5 text-muted"><FormattedMessage id="Email"/></div>
                            <input className="form-control" required
                                   id="user-edit-email"
                                   onChange={e => this.checkEmail(e.target)}
                                   onBlur={e => this.emailOnBlur(e)}
                                   defaultValue={email}/>
                            <div className="invalid-feedback">
                                {emailError && <FormattedMessage id={emailError}/>}
                            </div>
                            <div className="valid-feedback">
                                {emailCheck && <FormattedMessage id={emailCheck}/>}
                            </div>
                        </div>
                        <div className="col-md-4 my-1">
                            <div className="h5 text-muted"><FormattedMessage id="Style"/></div>
                            <button className="btn btn-outline-success"
                                    data-toggle="modal"
                                    id="user-edit-style-choose-button"
                                    data-target="#user-edit-style-choose-modal"
                            ><FormattedMessage id="Choose"/>
                            </button>
                        </div>


                        <div className="col-md-6 my-1">
                            <form className="was-validated row" noValidate>
                                <div className="col-md-6">
                                    <label className="h5 text-muted"><FormattedMessage id="First name"/></label>
                                    <input className="form-control flex-fill" required
                                           id="user-edit-firstName"
                                           defaultValue={firstName}/>
                                    <div className="invalid-feedback">
                                        <FormattedMessage id="This field is required!"/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="h5 text-muted"><FormattedMessage id="Last name"/></label>
                                    <input className="form-control flex-fill" required
                                           id="user-edit-lastName"
                                           defaultValue={lastName}/>
                                    <div className="invalid-feedback">
                                        <FormattedMessage id="This field is required!"/>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="col-md-6 my-1 row">
                            <div className="col-md-6">
                                <label className="h5 text-muted"><FormattedMessage id="Birthday"/></label>
                                <Datetime dateFormat="YYYY-MM-DD" timeFormat={false}
                                          value={editedBirthday}
                                          onChange={moment => {
                                              if (moment && typeof moment.isValid === 'function') {
                                                  if (moment.isValid()) {
                                                      this.setState({
                                                          editedBirthday: moment.format('YYYY-MM-DD'),
                                                      })
                                                  }
                                              }

                                          }}
                                    // import 'moment/locale/zh-cn'
                                    // locale="zh-cn"
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="h5 text-muted"><FormattedMessage id="Gender"/></label>
                                <select className="form-control form-select" id="user-edit-gender">
                                    <option value="female" defaultChecked={gender === 'female'}>Female</option>
                                    <option value="male" defaultChecked={gender === 'male'}>Male</option>
                                </select>
                            </div>

                        </div>
                    </div>
                    <div className="mt-3">
                        <button type="button" className="btn btn-warning" data-dismiss="modal"
                                onClick={e => this.confirmOnClick(e)}><FormattedMessage id="Confirm"/>
                        </button>
                    </div>
                </div>

                <StyleChooseModal id="user-edit-style-choose-modal"
                                  style={style}
                                  setStyle={style => {
                                      this.setState({editedStyle: style});
                                      document.querySelector("#user-edit-style-choose-button")
                                          .innerText = style;
                                  }}/>
            </div>);
    }
}
