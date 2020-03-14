import React from "react";
import {deletePost, getPostList, updatePost} from "../../actions";
import HeaderLayout from "../common/HeaderLayout";
import SidebarLayout, {SIDEBAR_ITEMS} from "../common/SidebarLayout";
import PaginationPanel from "../common/PaginationPanel";
import {getSearchValue} from "../../util/url";
import {showError, showUnexpectedError} from "../../config";
import UserProvider from "../provider/UserProvider";
import {refresh} from "../../util/history";

export default class PostList extends React.Component {
    constructor(props) {
        super(props);
        // handle ?page=xxx
        const page = getSearchValue('page', 1);
        this.state = {
            postList: [],
            total: 0,
            size: 20,
            page: page,
        };
    }

    componentDidMount() {
        const {page, size} = this.state;
        getPostList(page, size).then(res => {
            if (res.data.success) {
                const data = res.data.data;
                this.setState({
                    postList: data.items,
                    total: data.total,
                })
            }
        });
    }

    deletePostButtonOnClick(e) {
        this.setState({
            deletePostId: e.target.children[0].innerText,
        });
    }

    deleteOnClick(e) {
        const {deletePostId} = this.state;
        if (!deletePostId) {
            showUnexpectedError();
            return;
        }

        deletePost(deletePostId).then(res => {
            if (res.data.success) {
                refresh();
            }
        })
    }

    changeFavorite(e, post) {
        let {id, title, style, name, published, favorite, summary, content} = post;
        favorite = !favorite;
        updatePost(id, {title, style, name, published, favorite, summary, content}).then(res => {
            if (res.data.success) {
                refresh();
            } else {
                showError(res.data.message);
            }
        }, err => {
            console.error(err);
            showError()
        })
    }

    changePublished(e, post) {
        let {id, title, style, name, published, favorite, summary, content} = post;
        published = !published;
        updatePost(id, {title, style, name, published, favorite, summary, content}).then(res => {
            if (res.data.success) {
                refresh();
            } else {
                showError(res.data.message);
            }
        }, err => {
            console.error(err);
            showError()
        })
    }

    render() {
        const {postList, total} = this.state;
        return (
            <div className="row">
                <HeaderLayout/>
                <SidebarLayout activeItem={SIDEBAR_ITEMS.POST_LIST}/>
                <div className="col-md-9 ml-sm-auto col-lg-10 px-4 mt-5">
                    <div className="card mt-3">
                        <div className="card-body">
                            <ul className="list-group list-group-flush mb-4">
                                <li className="list-group-item">
                                    <label className="h4">Total {total}</label>
                                </li>
                                <li className="list-group-item">
                                    {postList.map((item, index) => (
                                        <div className="row my-2" key={index}>
                                            <a className="post-title no-underline word-break"
                                               href={`/post/${item.id}`}>{item.title}</a>
                                            {/*<div className="mr-3 ml-auto">*/}
                                            {/*    Created on {yyyyMMdd(item.ctime)}&ensp;/&ensp;*/}
                                            {/*    Modified on {yyyyMMdd(item.mtime)}*/}
                                            {/*</div>*/}
                                            <div className="ml-auto">
                                                {item.favorite ?
                                                    <i className="fa fa-star fa-lg mr-1" onMouseEnter={e => {
                                                        e.target.className = "fa fa-star-o fa-lg mr-1"
                                                    }} onMouseLeave={e => {
                                                        e.target.className = "fa fa-star fa-lg mr-1"
                                                    }} onClick={e => this.changeFavorite(e, item)}/> :
                                                    <i className="fa fa-star-o fa-lg mr-1" onMouseEnter={e => {
                                                        e.target.className = "fa fa-star fa-lg mr-1"
                                                    }} onMouseLeave={e => {
                                                        e.target.className = "fa fa-star-o fa-lg mr-1"
                                                    }} onClick={e => this.changeFavorite(e, item)}/>
                                                }
                                                {item.published ?
                                                    <i className="fa fa-eye fa-lg" onMouseEnter={e => {
                                                        e.target.className = "fa fa-eye-slash fa-lg"
                                                    }} onMouseLeave={e => {
                                                        e.target.className = "fa fa-eye fa-lg"
                                                    }}
                                                       onClick={e => this.changePublished(e, item)}/> :
                                                    <i className="fa fa-eye-slash fa-lg" onMouseEnter={e => {
                                                        e.target.className = "fa fa-eye fa-lg"
                                                    }} onMouseLeave={e => {
                                                        e.target.className = "fa fa-eye-slash fa-lg"
                                                    }}
                                                       onClick={e => this.changePublished(e, item)}/>
                                                }
                                                <a className="btn btn-outline-info btn-sm ml-2"
                                                   href={`/post/${item.id}/modify`}>
                                                    modify
                                                </a>
                                                <button className="btn btn-outline-danger btn-sm ml-1"
                                                        data-toggle="modal"
                                                        data-target="#post-list-delete-post-confirm-modal"
                                                        onClick={e => this.deletePostButtonOnClick(e)}>
                                                    delete<span style={{
                                                    // visibility: "hidden",
                                                    // opacity: 0,
                                                    // position: "absolute", left: "-1000px",
                                                    display: "none",
                                                }}>{item.id}</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </li>
                            </ul>
                            <PaginationPanel
                                pattern="/posts?page=%d"
                                size={this.state.size}
                                page={this.state.page}
                                total={this.state.total}/>
                        </div>
                    </div>
                </div>

                {/* modal */}
                <div className="modal fade" id="post-list-delete-post-confirm-modal" tabIndex="-1" role="dialog"
                     aria-hidden="true">
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
                                <button type="button" className="btn btn-secondary"
                                        data-dismiss="modal">Close
                                </button>
                                <button type="button" className="btn btn-danger" data-dismiss="modal"
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
