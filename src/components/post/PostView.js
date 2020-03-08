import React from 'react';

import {addLineNumber, getStyle, md2html, showError} from "../../config";
import SidebarLayout, {SIDEBAR_ITEMS} from "../common/SidebarLayout";
import TagPanel from "../common/TagPanel";
import {deletePost, getPost} from "../../actions";
import HeaderLayout from "../common/HeaderLayout";
import {pushForcibly} from "../../util/history";
import UserProvider from "../provider/UserProvider";
import {dateFormat} from "../../util/time";

export default class PostView extends React.Component {
    constructor(props) {
        super(props);
        const name = this.props.match.params.name;
        this.state = {
            name: name,
            style: getStyle(),
            title: "",
            published: true,
            summary: "",
            content: "",
            tags: [],
            ctime: "",
            mtime: "",
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevState.content && this.state.content) {
            addLineNumber()
        }
    }

    componentDidMount() {
        getPost({name: this.state.name}).then(res => {
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
                    tags,
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

    deleteOnClick() {
        const {id} = this.state;
        deletePost(id).then(res => {
            if (res.data.success) {
                pushForcibly("/posts")
            } else {
                console.error(res.data.message);
            }
        }, err => {
            showError();
        })
    }

    render() {
        const {title, name, ctime, mtime, tags, summary, content, published, favorite, style} = this.state;
        return (
            <div className="row">
                {this.state.style ?
                    <link rel="stylesheet" type="text/css"
                          href={`/static/css/highlight/${this.state.style}.css`}/>
                    : <span/>
                }
                <HeaderLayout/>
                <SidebarLayout activeItem={SIDEBAR_ITEMS.NONE}/>
                <div className=" col-md-9 ml-sm-auto col-lg-10 px-4 mt-5">
                    <div className="card mt-3">
                        <div className="card-body">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <div className="text-center mt-5">
                                        <p className="h2">{title}</p>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="h5 text-center font-weight-bolder font-italic" style={{
                                        textShadow: "1px 1px 1px #000",
                                    }}>Detail
                                    </div>
                                    <div className="d-flex">
                                        <p className="text-muted" style={{
                                            wordBreak: "break-word",
                                            // textShadow: "1px 1px 1px #ccc",
                                            lineHeight: 1.5,
                                        }}>{name}</p>
                                        <button className="btn btn-outline-info btn-sm ml-auto mr-2">
                                            <a href={`/post/${name}/modify`} className="no-underline">
                                                modify
                                            </a>
                                        </button>
                                        <button className="btn btn-outline-danger btn-sm ml-1"
                                                data-toggle="modal" data-target="#view-delete-confirm-modal">
                                            delete
                                        </button>
                                    </div>

                                    <div className="d-flex text-muted">
                                        <label>Posted on&nbsp;</label>
                                        <label className="font-italic">{ctime}</label>
                                        <label>&ensp;/&ensp;Modified on&nbsp;</label>
                                        <label className="font-italic">{mtime}</label>
                                        <label>&ensp;/&ensp;{published ? "published" : "unpublished"}</label>
                                        <label>&ensp;/&ensp;{favorite ? "favorite" : "no favorite"}</label>
                                        <label>&ensp;/&ensp;{style ? style : "default"} highlight</label>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="h5 text-center font-weight-bolder font-italic" style={{
                                        textShadow: "1px 1px 1px #000",
                                    }}>Tags
                                    </div>
                                    <div className="row">
                                        {
                                            tags.map((tag, index) =>
                                                <TagPanel tag={tag} key={`${index}`}/>)
                                        }
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="h5 text-center font-weight-bolder font-italic" style={{
                                        textShadow: "1px 1px 1px #000",
                                    }}>Summary
                                    </div>
                                    <div style={{
                                        marginTop: 30,
                                    }} dangerouslySetInnerHTML={{__html: md2html(summary)}}>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="h5 text-center font-weight-bolder font-italic" style={{
                                        textShadow: "1px 1px 1px #000",
                                    }}>Post content
                                    </div>
                                    <div style={{
                                        marginTop: 30,
                                    }} dangerouslySetInnerHTML={{__html: md2html(content)}}>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* modal */}
                <div className="modal fade" id="view-delete-confirm-modal" tabIndex="-1" role="dialog"
                     aria-hidden="true" onKeyDown={e => {
                    if (e.key === 'Enter') {
                        document.querySelector("#view-delete-confirm-modal-confirm").click();
                    } else {
                        document.querySelector("#view-delete-confirm-modal-close").click()
                    }
                }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Are you sure to delete this post?
                                </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal"
                                        id="view-delete-confirm-modal-close">Close
                                </button>
                                <button type="button" className="btn btn-danger" data-dismiss="modal"
                                        id="view-delete-confirm-modal-confirm"
                                        onClick={e => this.deleteOnClick(e)}>Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <UserProvider/>
            </div>
        );
    }
}
