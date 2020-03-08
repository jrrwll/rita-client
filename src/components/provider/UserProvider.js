import React from "react";
import {requireFetchAvatar, requireFetchUser} from "../../actions";

export default class UserProvider extends React.Component {
    componentDidMount() {
        requireFetchUser();
        requireFetchAvatar();
    }

    render() {
        return <div>
            {this.props.children}
        </div>
    }
}
