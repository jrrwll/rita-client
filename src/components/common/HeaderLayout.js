import React from 'react';
import {emitter, storage} from "../../config";
import {FETCH_AVATAR_EVENT, FETCH_USER_EVENT} from "../../actions";
import feather from "feather-icons";
import {pushForcibly} from "../../util/history";


export default class HeaderLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            avatar: "",
            isNewPostPage: window.location.pathname === "/posts/new",
        };
        this.fetchUserEventEmitter = emitter.addListener(FETCH_USER_EVENT, (user) => {
            const {firstName, lastName} = user;
            this.setState({firstName, lastName})
        });
        this.fetchAvatarEventEmitter = emitter.addListener(FETCH_AVATAR_EVENT, (avatar) => {
            this.setState({avatar});
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        feather.replace();
    }

    componentWillUnmount() {
        emitter.removeListener(FETCH_USER_EVENT, this.fetchUserEventEmitter);
        emitter.removeListener(FETCH_AVATAR_EVENT, this.fetchAvatarEventEmitter);
    }

    goBack() {
        let referrer = document.referrer;
        const origin = window.location.origin;
        if (!referrer || !referrer.startsWith(origin)) {
            referrer = "/overview";
        }
        referrer = referrer.slice(origin.length);
        console.log(referrer);
        pushForcibly(referrer);
    }

    signOut() {
        storage.removeToken();
        storage.removeUser();
        storage.removeAvatar();
    }


    render() {
        const {firstName, lastName, avatar, isNewPostPage} = this.state;
        const fullName = firstName + " " + lastName;
        return (
            <div>
                <nav className="navbar navbar-dark bg-dark fixed-top flex-md-nowrap p-0 shadow">
                    <a className="navbar-brand col-sm-3 col-md-2 mr-0 pt-2 pb-2" style={{
                        fontSize: "1rem",
                        background: "rgba(0, 0, 0, .25)",
                        boxShadow: "inset -1px 0 0 rgba(0, 0, 0, .25)"
                    }} href="/overview">
                        <img src={`${avatar}`}
                             alt="avatar" style={{
                            height: "2rem",
                        }}/>
                        <strong className="ml-1">{fullName}</strong>
                    </a>

                    {isNewPostPage ?
                        <button className="btn btn-outline-light ml-auto"
                                onClick={this.goBack}>
                            Back
                        </button>
                        :
                        <a className="btn btn-outline-light ml-auto" href="/posts/new">
                            <span data-feather="plus"/>
                        </a>
                    }

                    <ul className="navbar-nav px-3">
                        <li className="nav-item text-nowrap">
                            <a className="nav-link" href="/login"
                               onClick={e => this.signOut()}
                            >Sign out</a>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }
}
