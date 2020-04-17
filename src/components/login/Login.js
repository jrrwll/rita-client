import React from 'react';
import {submitLogin} from "../../actions";

import {storage} from '../../config';
import {pushForcibly} from '../../util/history'
import $ from 'jquery';
import LoginForm from "./LoginForm";
import {FormattedMessage} from "react-intl";
import TermFooter from "./TermFooter";

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
                                        <strong><FormattedMessage id="Login to Lovely Rita"/></strong>
                                    </h3>
                                </div>
                            </div>
                            <LoginForm/>
                        </div>
                    </div>
                </div>

                <TermFooter/>
            </div>
        );
    }
}
