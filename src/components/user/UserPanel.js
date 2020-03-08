import React, {Component} from "react";
import PropTypes from "prop-types";
import {emitter} from "../../config";
import {FETCH_AVATAR_EVENT, FETCH_USER_EVENT} from "../../actions";
import AvatarEditModal from "./AvatarEditModal";

export class UserPanel extends Component {
    static contextTypes = {
        setHiddenUserEdit: PropTypes.func,
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            firstName: "", lastName: "", avatar: "", email: "", username: "", gender: "",
            birthday: "", style: "", postCount: 0, favoritePostCount: 0,
        };
        this.userEditClickEventEmitter = emitter.addListener("userEditClick", () => {
            const btn = document.querySelector("#user-edit-button");
            const text = btn.innerText;
            if (text === 'Edit') {
                btn.innerText = "Cancel";
                this.context.setHiddenUserEdit(false);
            } else {
                btn.innerText = "Edit";
                this.context.setHiddenUserEdit(true);
            }
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
            birthday, style, postCount, favoritePostCount
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
                                    data-target="#user-change-avatar-modal">Change
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
                                    Username:&emsp;
                                    <label className="mr-5 text-underline">{username}</label>
                                </div>
                                <div className="col-6">
                                    Email:&emsp;
                                    <label className="text-underline">{email}</label>
                                </div>
                            </div>
                            <div className="h5 text-muted row">
                                <div className="col-6">
                                    Gender:&emsp;
                                    <label className="mr-5 text-underline">{gender}</label>
                                </div>
                                <div className="col-6">
                                    Birthday:&emsp;
                                    <label className="text-underline">{birthday}</label>
                                </div>
                            </div>
                            <div className="h5 text-muted row">
                                <div className="col-10">
                                    <label className="text-underline text-capitalize">{style}</label>
                                    &nbsp;/&nbsp;Posts <label className="text-underline">{postCount}</label>
                                    &nbsp;/&nbsp;Favorite posts <label
                                    className="text-underline">{favoritePostCount}</label>
                                </div>
                                <div className="col-2">
                                    <button className="btn btn-outline-info"
                                            id="user-edit-button"
                                            onClick={e => this.editOnClick(e)}>Edit
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
