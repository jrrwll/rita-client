import React from 'react';
import {emitter, showError, storage} from "../../config";
import {createPost, FETCH_AVATAR_EVENT, FETCH_USER_EVENT} from "../../actions";
import feather from "feather-icons";
import {pushForcibly} from "../../util/history";
import {FormattedMessage} from "react-intl";


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
        console.log(this.fetchUserEventEmitter);
        console.log(this.fetchAvatarEventEmitter);

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

    onUploadFolder(e) {
        // file.webkitRelativePath: chosen_folder/path/to/file
        if (!e.target.files) return;

        let files = e.target.files;
        let len = files.length;
        for (let i=0; i<len; i++){
            let file = files[i];
            let name = file.name;
            if (name[0] === '.') continue;

            let title = name.slice(0, name.lastIndexOf("."));
            let ext = name.slice(name.lastIndexOf(".") + 1);
            let tags = file.webkitRelativePath.split("/");
            tags = tags.slice(0, tags.length  -1);
            name = tags.join("_") + "_" + title;

            let style = storage.getStyle();
            if (!style) style = 'default';

            const fileReader = new FileReader();
            fileReader.onload = e => {
                let content = e.target.result;
                if (ext.toLowerCase() !== 'md'){
                    content = "```" + ext + "\n" + content + "\n```";
                }

                createPost({title, style, name, published: true, favorite: false, tags, content})
                    .then(res => {
                        if (res.data.code !== 0) {
                            showError(res.data.msg)
                        }
                    }, err => {
                        console.error(err);
                    });
            };
            // read as utf-8 string
            fileReader.readAsText(file);
        }
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
                            <FormattedMessage id="Back"/>
                        </button>
                        :
                        <a className="btn btn-outline-light ml-auto" href="/posts/new">
                            <span data-feather="plus"/>
                        </a>
                    }

                    <button className="btn btn-outline-light ml-2"
                            onClick={() => {
                                let inputFolder = document.querySelector("#upload-folder");
                                if (!inputFolder) return;
                                inputFolder.click();
                            }}>
                        <FormattedMessage id="Upload"/>
                    </button>
                    <input type="file" id="upload-folder" style={{display: "none"}}
                           webkitdirectory="" accept="*/*" onChange={this.onUploadFolder}/>
                    <ul className="navbar-nav px-3">
                        <li className="nav-item text-nowrap">
                            <a className="nav-link" href="/login"
                               onClick={e => this.signOut()}
                            ><FormattedMessage id="Sign out"/></a>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }
}
