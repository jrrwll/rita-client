import React from "react";
import PropTypes from "prop-types";
import HeaderLayout from "../common/HeaderLayout";
import SidebarLayout, {SIDEBAR_ITEMS} from "../common/SidebarLayout";
import {UserPanel} from "../user/UserPanel";
import {UserEditPanel} from "../user/UserEditPanel";
import UserProvider from "../provider/UserProvider";

export default class Overview extends React.Component {
    static childContextTypes = {
        setHiddenUserEdit: PropTypes.func,
    };
    state = {
        hiddenUserEdit: true,
    };

    getChildContext() {
        return {
            setHiddenUserEdit: (hidden) => {
                this.setState({
                    hiddenUserEdit: hidden,
                })
            },
        }
    }

    render() {
        const {hiddenUserEdit} = this.state;
        return (
            <div className="row">
                <HeaderLayout/>
                <SidebarLayout activeItem={SIDEBAR_ITEMS.OVERVIEW}/>
                <div className="col-md-9 ml-sm-auto col-lg-10 px-4 mt-5">
                    <UserPanel/>
                    <UserEditPanel hidden={hiddenUserEdit}/>
                </div>
                <UserProvider/>
            </div>
        );
    }
}
