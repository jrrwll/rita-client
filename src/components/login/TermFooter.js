import {FormattedMessage} from "react-intl";
import React from "react";


export default function TermFooter() {
    return (
        <div className="row">
            <div className="col-4 offset-4 mb-5" style={{display: "flex"}}>
                <a href="/site/terms" style={{marginRight: "auto"}}>
                    <small style={{color: "#71767d"}}><FormattedMessage id="Terms"/></small>
                </a>
                <a href="/site/privacy" style={{marginRight: "auto"}}>
                    <small style={{color: "#71767d"}}><FormattedMessage id="Privacy"/></small>
                </a>
                <a href="/site/security" style={{marginRight: "auto"}}>
                    <small style={{color: "#71767d"}}><FormattedMessage id="Security"/></small>
                </a>
                <a href="/site/contact" style={{marginRight: 0}}>
                    <small><FormattedMessage id="Contact us"/></small>
                </a>
            </div>
        </div>
    );
}
