import React from "react";
import {requireFetchAvatar, requireFetchTags, requireFetchUser} from "../../actions";

export default class UserProvider extends React.Component {
    componentDidMount() {
        requireFetchUser();
        requireFetchAvatar();
        requireFetchTags();
    }

    render() {
        return <div>
            {this.props.children}
        </div>
    }
}
