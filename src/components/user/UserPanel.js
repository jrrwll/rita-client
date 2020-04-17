import React, {Component} from "react";
import PropTypes from "prop-types";
import {emitter} from "../../config";
import {FETCH_AVATAR_EVENT, FETCH_USER_EVENT} from "../../actions";
import AvatarEditModal from "./AvatarEditModal";
import {FormattedMessage} from "react-intl";

export class UserPanel extends Component {
    static contextTypes = {
        setHiddenUserEdit: PropTypes.func,
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            firstName: "", lastName: "", avatar: "", email: "", username: "", gender: "",
            birthday: "", style: "", postCount: 0, favoritePostCount: 0, edit: true,
        };
        this.userEditClickEventEmitter = emitter.addListener("userEditClick", () => {
            const hiddenEdit = !this.state.edit;
            this.setState({edit: hiddenEdit});
            this.context.setHiddenUserEdit(hiddenEdit);
        });

        this.fetchUserEventEmitter = emitter.addListener(FETCH_USER_EVENT, (user) => {
            const {
                firstName, lastName, email, username, gender,
                birthday, style, postCount, favoritePostCount
            } = user;
            this.setState({
                firstName, lastName, email, username, gender,
                birthday, style, postCount, favoritePostCount
            });
        });
        this.fetchAvatarEventEmitter = emitter.addListener(FETCH_AVATAR_EVENT, (avatar) => {
            this.setState({avatar});
        });
    }

    componentWillUnmount() {
        emitter.removeListener("userEditClick", this.userEditClickEventEmitter);
        emitter.removeListener(FETCH_USER_EVENT, this.fetchUserEventEmitter);
        emitter.removeListener(FETCH_AVATAR_EVENT, this.fetchAvatarEventEmitter);
    }

    editOnClick(e) {
        emitter.emit("userEditClick")
    }

    render() {
        const {
            firstName, lastName, avatar, email, username, gender,
            birthday, style, postCount, favoritePostCount, edit,
        } = this.state;
        const fullName = firstName + " " + lastName;
        return (
            <div>
                <div className="card mt-3">
                    <div className="card-body row">
                        <div className="col-2">
                            <img src={`${avatar}`} className="card-img"
                                 alt="avatar"/>
                            <button className="btn-primary btn-block my-2"
                                    id="avatar-edit-button"
                                    data-toggle="modal"
                                    data-target="#user-change-avatar-modal"><FormattedMessage id="Change"/>
                            </button>
                        </div>
                        <div className="col-10">
                            <div className="row">
                                <div className="col-6">
                                    <label className="h1">{fullName}</label>
                                </div>
                            </div>
                            <div className="h5 text-muted row">
                                <div className="col-6">
                                    <FormattedMessage id="Username"/>:&emsp;
                                    <label className="mr-5 text-underline">{username}</label>
                                </div>
                                <div className="col-6">
                                    <FormattedMessage id="Email"/>:&emsp;
                                    <label className="text-underline">{email}</label>
                                </div>
                            </div>
                            <div className="h5 text-muted row">
                                <div className="col-6">
                                    <FormattedMessage id="Gender"/>:&emsp;
                                    <label className="mr-5 text-underline">{gender}</label>
                                </div>
                                <div className="col-6">
                                    <FormattedMessage id="Birthday"/>:&emsp;
                                    <label className="text-underline">{birthday}</label>
                                </div>
                            </div>
                            <div className="h5 text-muted row">
                                <div className="col-10">
                                    <label className="text-underline text-capitalize">{style}</label>
                                    &nbsp;/&nbsp;<FormattedMessage id="Total"/> <label className="text-underline">{postCount}</label>
                                    &nbsp;/&nbsp;<FormattedMessage id="Favorites"/> <label
                                    className="text-underline">{favoritePostCount}</label>
                                </div>
                                <div className="col-2">
                                    <button className="btn btn-outline-info"
                                            id="user-edit-button"
                                            onClick={e => this.editOnClick(e)}>
                                        {edit ? <FormattedMessage id="Edit"/> : <FormattedMessage id="Cancel"/>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <AvatarEditModal/>
                {/*<AvatarEditPanel/>*/}
            </div>
        );
    }
}
