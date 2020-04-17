import React from 'react';

import {addLineNumber, getStyle, md2html, showError} from "../../config";
import SidebarLayout, {SIDEBAR_ITEMS} from "../common/SidebarLayout";
import TagPanel from "../common/TagPanel";
import {deletePost, getPost} from "../../actions";
import HeaderLayout from "../common/HeaderLayout";
import {pushForcibly} from "../../util/history";
import UserProvider from "../provider/UserProvider";
import {yyyyMMdd} from "../../util/time";
import {FormattedMessage} from "react-intl";

export default class PostView extends React.Component {
    constructor(props) {
        super(props);
        const id = this.props.match.params.id;
        this.state = {
            id,
            name: "",
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
        getPost(this.state.id).then(res => {
            if (res.data.code === 0) {
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
                    tags: tags ? tags : [],
                    style: getStyle(style),
                    ctime: yyyyMMdd(ctime),
                    mtime: yyyyMMdd(mtime),
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
            if (res.data.code === 0) {
                pushForcibly("/posts")
            } else {
                console.error(res.data.message);
            }
        }, err => {
            showError();
        })
    }

    render() {
        const {id, title, name, ctime, mtime, tags, summary, content, published, favorite, style} = this.state;
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
                                    <div className="text-center mt-5 ">
                                        <p className="h2 font-weight-bolder font-italic" style={{
                                            textShadow: "1px 1px 1px #000",
                                        }}>{title}</p>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="row">
                                        <p className="text-muted" style={{
                                            wordBreak: "break-word",
                                            // textShadow: "1px 1px 1px #ccc",
                                            lineHeight: 1.5,
                                        }}>{name}</p>
                                        <button className="btn btn-outline-info btn-sm ml-auto mr-2">
                                            <a href={`/post/${id}/modify`} className="no-underline">
                                                modify
                                            </a>
                                        </button>
                                        <button className="btn btn-outline-danger btn-sm ml-1"
                                                data-toggle="modal" data-target="#view-delete-confirm-modal">
                                            delete
                                        </button>
                                    </div>

                                    <div className="row text-muted">
                                        <label>Posted on&nbsp;</label>
                                        <label className="font-italic">{ctime}</label>
                                        <label>&ensp;/&ensp;Modified on&nbsp;</label>
                                        <label className="font-italic">{mtime}</label>
                                        <label>&ensp;/&ensp;{published ? "published" : "unpublished"}</label>
                                        <label>&ensp;/&ensp;{favorite ? "loved" : "unloved"}</label>
                                        <label>&ensp;/&ensp;{style ? style : "default"} highlight</label>
                                    </div>
                                    <div className="row">
                                        {
                                            tags.map((item, index) =>
                                                <TagPanel tag={item} key={`${index}`}/>)
                                        }
                                    </div>
                                    <div className="row" style={{
                                        marginTop: 30,
                                        wordBreak: "break-all"
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
