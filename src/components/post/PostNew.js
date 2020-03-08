import React from 'react';
import SidebarLayout from "../common/SidebarLayout";
import TitleEditPanel from "./TitleEditPanel";
import SummaryEditPanel from "./SummaryEditPanel";
import TagEditPanel from "./TagEditPanel";
import ContentEditPanel from "./ContentEditPanel";
import {emitter, showError, storage} from "../../config";
import NameEditPanel from "./NameEditPanel";
import {checkPostFormOrSetState, createPost, FETCH_USER_EVENT} from "../../actions";
import {pushForcibly} from "../../util/history";
import ErrorPanel from "../common/ErrorPanel";
import HeaderLayout from "../common/HeaderLayout";
import UserProvider from "../provider/UserProvider";

export default class PostNew extends React.Component {
    constructor(props) {
        super(props);
        let {title, style, name, published, summary, currentTags, content} = storage.getPostNewDraft();
        this.state = {title, style, name, published, summary, currentTags, content, tags: []};
        this.fetchUserEventEmitter = emitter.addListener(FETCH_USER_EVENT, (user) => {
            let {tags} = user;
            tags = tags.map(tag => tag.name);
            this.setState({tags})
        });
    }

    componentWillUnmount() {
        emitter.removeListener(FETCH_USER_EVENT, this.fetchUserEventEmitter);
    }

    pageOnSubmit() {
        /// client check
        let {title, style, name, published, summary, currentTags, content} = this.state;
        if (!checkPostFormOrSetState(this)) return;

        createPost({title, style, name, published, summary, tags: currentTags, content}).then(res => {
            if (res.data.success) {
                storage.removePostNewDraft();
                pushForcibly(`/post/${name}`);
            } else {
                showError(res.data.message);
            }
        }, err => {
            showError();
        });
    }

    render() {
        let {title, style, name, published, summary, tags, content, currentTags} = this.state;
        return (
            <div className="row">
                <HeaderLayout/>
                <SidebarLayout/>
                <div className="col-md-9 ml-sm-auto col-lg-10 px-4 mt-5">
                    <div className="card mt-3">
                        <div className="card-body">
                            <ErrorPanel error={this.state.error} setError={error => {
                                this.setState({error: error})
                            }}/>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <div className="form-inline">
                                        <div className="h4 flex-fill">Create a new post</div>
                                        <button className="btn btn-info ml-2 mr-0"
                                                onClick={e => this.pageOnSubmit()}>
                                            Publish&nbsp;&nbsp;&nbsp;
                                        </button>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <TitleEditPanel
                                        title={title}
                                        style={style}
                                        setTitle={value => {
                                            this.setState({title: value});
                                            const draft = storage.getPostNewDraft();
                                            draft.title = value;
                                            storage.setPostNewDraft(draft);
                                        }}
                                        setStyle={value => {
                                            this.setState({style: value});
                                            const draft = storage.getPostNewDraft();
                                            draft.style = value;
                                            storage.setPostNewDraft(draft);
                                        }}
                                    />
                                </li>
                                <li className="list-group-item">
                                    <NameEditPanel
                                        name={name}
                                        published={published}
                                        setName={value => {
                                            this.setState({name: value});
                                            const draft = storage.getPostNewDraft();
                                            draft.name = value;
                                            storage.setPostNewDraft(draft);
                                        }}
                                        setPublished={value => {
                                            this.setState({published: value});
                                            const draft = storage.getPostNewDraft();
                                            draft.published = value;
                                            storage.setPostNewDraft(draft);
                                        }}
                                    />
                                </li>

                                <li className="list-group-item">
                                    <SummaryEditPanel
                                        summary={summary}
                                        setSummary={value => {
                                            this.setState({summary: value});
                                            const draft = storage.getPostNewDraft();
                                            draft.summary = value;
                                            storage.setPostNewDraft(draft);
                                        }}/>
                                </li>
                                <li className="list-group-item">
                                    <TagEditPanel
                                        currentTags={currentTags}
                                        setCurrentTags={value => {
                                            this.setState({currentTags: value});
                                            const draft = storage.getPostNewDraft();
                                            draft.currentTags = value;
                                            storage.setPostNewDraft(draft);
                                        }} tags={tags}/>
                                </li>
                                <li className="list-group-item">
                                    <ContentEditPanel
                                        content={content}
                                        setContent={value => {
                                            this.setState({content: value});
                                            const draft = storage.getPostNewDraft();
                                            draft.content = value;
                                            storage.setPostNewDraft(draft);
                                        }}/>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <UserProvider/>
            </div>
        );
    }
}
