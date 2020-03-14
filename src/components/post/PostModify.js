import React from 'react';
import SidebarLayout, {SIDEBAR_ITEMS} from "../common/SidebarLayout";
import TitleEditPanel from "./TitleEditPanel";
import SummaryEditPanel from "./SummaryEditPanel";
import TagEditPanel from "./TagEditPanel";
import ContentEditPanel from "./ContentEditPanel";
import {checkPostFormOrSetState, FETCH_USER_EVENT, getPost, updatePost} from "../../actions";
import {pushForcibly} from "../../util/history";
import ErrorPanel from "../common/ErrorPanel";
import NameEditPanel from "./NameEditPanel";
import HeaderLayout from "../common/HeaderLayout";
import UserProvider from "../provider/UserProvider";
import {emitter, getStyle, showError} from "../../config";
import {dateFormat} from "../../util/time";

export default class PostModify extends React.Component {
    constructor(props) {
        super(props);
        const id = this.props.match.params.id;
        this.state = {
            id,
            name: "",
            style: "",
            title: "",
            published: true,
            summary: "",
            content: "",
            currentTags: [],
            ctime: "",
            mtime: "",
            tags: [],
        };
        this.fetchUserEventEmitter = emitter.addListener(FETCH_USER_EVENT, (user) => {
            let {tags} = user;
            tags = tags.map(tag => tag.name);
            this.setState({tags})
        });
    }

    componentDidMount() {
        getPost(this.state.id).then(res => {
            if (res.data.success) {
                let {
                    title, name, published, summary, content,
                    tags, ctime, mtime, style
                } = res.data.data;
                this.setState({
                    title,
                    name,
                    published,
                    summary,
                    content,
                    currentTags: tags.map(it => it.name),
                    style: getStyle(style),
                    ctime: dateFormat(ctime, "yyyy-MM-dd"),
                    mtime: dateFormat(mtime, "yyyy-MM-dd"),
                });
            } else {
                showError(res.data.message);
            }
        }, err => {
            showError();
        });
    }

    componentWillUnmount() {
        emitter.removeListener(FETCH_USER_EVENT, this.fetchUserEventEmitter);
    }

    pageOnSubmit() {
        /// client check
        let {id, title, style, name, published, summary, currentTags, content} = this.state;
        if (!checkPostFormOrSetState(this)) return;

        updatePost(id, {title, style, name, published, summary, tags: currentTags, content}).then(res => {
            if (res.data.success) {
                pushForcibly(`/post/${id}`);
            } else {
                this.setState({error: res.data.message});
            }
        }, err => {
            this.setState({error: "A error has occurred, check your network first maybe "});
        });
    }

    render() {
        let {title, style, name, published, summary, currentTags, content, tags} = this.state;
        return (
            <div className="row">
                <HeaderLayout/>
                <SidebarLayout activeItem={SIDEBAR_ITEMS.NONE}/>
                <div className="col-md-9 ml-sm-auto col-lg-10 px-4 mt-5">
                    <div className="card mt-3">
                        <div className="card-body">
                            <ErrorPanel error={this.state.error} setError={error => {
                                this.setState({error: error})
                            }}/>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <div className="form-inline">
                                        <div className="h4 flex-fill">Modify post</div>
                                        <button className="btn btn-info ml-2 mr-0"
                                                onClick={e => this.pageOnSubmit()}>
                                            Save&nbsp;&nbsp;&nbsp;
                                        </button>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <TitleEditPanel
                                        title={title}
                                        style={style}
                                        setTitle={value => {
                                            this.setState({title: value});
                                        }}
                                        setStyle={value => {
                                            this.setState({style: value});
                                        }}/>
                                </li>
                                <li className="list-group-item">
                                    <NameEditPanel
                                        name={name}
                                        published={published}
                                        setName={value => {
                                            this.setState({name: value});
                                        }}
                                        setPublished={value => {
                                            this.setState({published: value});
                                        }}
                                    />
                                </li>
                                <li className="list-group-item">
                                    <SummaryEditPanel
                                        summary={summary}
                                        setSummary={value => {
                                            this.setState({summary: value});
                                        }}/>
                                </li>
                                <li className="list-group-item">
                                    <TagEditPanel
                                        currentTags={currentTags}
                                        setCurrentTags={value => {
                                            this.setState({currentTags: value});
                                        }} tags={tags}/>
                                </li>
                                <li className="list-group-item">
                                    <ContentEditPanel
                                        content={content}
                                        setContent={value => {
                                            this.setState({content: value});
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
