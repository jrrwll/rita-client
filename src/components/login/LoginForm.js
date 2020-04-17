import React, {useEffect, useState} from "react";
import {useForm} from 'react-hook-form';

import {PATTERN_IMAGE_CODE, PATTERN_PASSWORD, PATTERN_USERNAME, showError, toastError} from "../../config";
import {obtainImageCode, submitLogin} from "../../actions";
import {getSearchValue} from "../../util/url";
import {pushForcibly} from "../../util/history";
import {FormattedMessage} from "react-intl";

export default function LoginForm(props) {
    const [hiddenImage, setHiddenImage] = useState(true);
    const [imageCode, setImageCode] = useState({});
    const {register, watch, handleSubmit, errors} = useForm({
        mode: "onChange",
    });
    // {moreDetail && <div>put some stuff here</div>}
    // eslint-disable-next-line no-unused-vars
    const moreDetail = watch("moreDetail");

    // componentDidMount
    useEffect(() => {
        const username = getSearchValue("username", "");
        const input = document.querySelector("input[name=username]");
        if (input) {
            input.value = username;
        }
    }, []);

    const formOnSubmit = data => {
        if (!PATTERN_USERNAME.test(data.username)) return;
        if (!PATTERN_PASSWORD.test(data.password)) return;
        if (!PATTERN_IMAGE_CODE.test(data.imageCode)) return;

        submitLogin({
            ...data,
            timestamp: imageCode.timestamp,
            proof: data.username,
            nonce: imageCode.nonce
        }).then(res => {
            if (res.data.code === 0) {
                console.log(res);
                console.dir(res);
                // if success to login, go to the main page
                pushForcibly(`/overview`);
            } else {
                // or show error message in login page
                let msg = res.data.msg;
                if (msg) {
                    toastError(<FormattedMessage id={msg} defaultMessage={msg}/>)
                } else {
                    toastError(<FormattedMessage id="Failed to login" defaultMessage="Failed to login"/>);
                }
            }
        }, err => {
            console.error(err);
            showError();
        })
    };

    const imageCodeOnObtain = () => {
        const input = document.querySelector("input[name=username]");
        if (!input) return;
        let value = input.value;
        if (!PATTERN_USERNAME.test(value)) return;

        obtainImageCode({proof: value, width: 100, height: 50}).then(res => {
            if (res.data.code === 0) {
                setHiddenImage(v => false);
                setImageCode(v => res.data.data);
            } else {
                // or show error message
                showError(<FormattedMessage id="Fail to obtain image code from server end"/>)
            }
        });
    };

    const imageCodeOnKeyUp = (e) => {
        if (e.key !== "Enter") return;
        handleSubmit(formOnSubmit);
    };

    return (
        <form className="needs-validation" noValidate>
            <div className="form-row mt-4">
                <div className="col-4 offset-4">
                    <label><FormattedMessage id="Username"/></label>
                    <input
                        type="text" name="username"
                        className={"form-control form-control-lg" + (errors.username ? " is-invalid" : "")}
                        ref={register({
                            // required: true,
                            pattern: PATTERN_USERNAME
                        })}
                        required/>
                    <div className="invalid-feedback">
                        {errors.username && "Invalid username"}
                    </div>
                </div>
            </div>

            <div className="form-row mt-4">
                <div className="col-4 offset-4">
                    <label><FormattedMessage id="Password"/></label>
                    <input type="text" name="password"
                           className={"form-control form-control-lg" + (errors.password ? " is-invalid" : "")}
                           ref={register({
                               pattern: PATTERN_PASSWORD
                           })}
                           required
                        // onKeyUp={e => this.passwordOnKeyUp(e)}
                    />
                    <div className="invalid-feedback">
                        {errors.password && "Invalid password"}
                    </div>
                </div>
            </div>

            <div className="form-row mt-4">
                <div className="col-4 offset-4">
                    <label><FormattedMessage id="Image code"/></label>
                    <input type="text" name="imageCode"
                           className={"form-control form-control-lg" + (errors.imageCode ? " is-invalid" : "")}
                           ref={register({
                               pattern: PATTERN_IMAGE_CODE
                           })}
                           required
                           onFocus={imageCodeOnObtain}
                           onKeyUp={imageCodeOnKeyUp}/>
                    <div className="invalid-feedback">
                        {errors.imageCode && "Invalid image code"}
                    </div>

                    <div className="form-row mt-4">
                        <button className="btn btn-primary btn-block" type="button"
                                onClick={handleSubmit(formOnSubmit)}
                        >
                            <FormattedMessage id="Submit"/>
                        </button>
                        <p className="mt-4 mb-3">
                            <a href="/password-reset" className="link-primary">
                                <FormattedMessage id="Reset password?"/>
                            </a>
                            &nbsp;<FormattedMessage id="Or click here to"/>&nbsp;
                            <a href="/register" className="link-info">
                                <FormattedMessage id="Sign up"/>
                                </a></p>
                    </div>
                </div>
                {!hiddenImage && (
                    <div className="col-3" style={{
                        display: "flex",
                    }}>
                        <img src={imageCode.source} alt="" className="mb-2 mx-2 w-100"/>
                    </div>
                )
                }
            </div>
        </form>
    );
}
