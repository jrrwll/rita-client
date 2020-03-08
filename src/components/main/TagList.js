import React from "react";
import {deleteTag, getTagList, isFavoriteTag, updateTag} from "../../actions";
import HeaderLayout from "../common/HeaderLayout";
import SidebarLayout, {SIDEBAR_ITEMS} from "../common/SidebarLayout";
import {yyyyMMdd} from "../../util/time";
import PaginationPanel from "../common/PaginationPanel";
import {getSearchValue} from "../../util/url";
import {showError, showSuccessAndRefresh, showUnexpectedError, storage} from "../../config";
import UserProvider from "../provider/UserProvider";
import {refresh} from "../../util/history";

export default class TagList extends React.Component {
    constructor(props) {
        super(props);
        // handle ?page=xxx
        const page = getSearchValue('page', 1);
        this.state = {
            tagList: [],
            total: 0,
            size: 20,
            page,
        };
    }

    componentDidMount() {
        const {page, size} = this.state;
        getTagList({page, size}).then(res => {
            if (res.data.success) {
                const data = res.data.data;
                this.setState({
                    tagList: data.items,
                    total: data.total,
                })
            }
        });
    }

    deleteButtonOnClick(e) {
        this.setState({
            deleteTagId: e.target.children[0].innerText,
        });
    }

    deleteOnClick(e) {
        const {deleteTagId} = this.state;
        if (!deleteTagId) {
            showUnexpectedError();
            return;
        }

        deleteTag(deleteTagId).then(res => {
            if (res.data.success) {
                showSuccessAndRefresh("Deleted! You can get it back from trash ");
            } else {
                showError("Failed to delete this tag " + deleteTagId);
            }
        })
    }

    changeFavorite(e, id, favorite) {
        updateTag({id, favorite: !favorite}).then(res => {
            if (res.data.success) {
                storage.removeUser();
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
        const {tagList, total} = this.state;
        return (
            <div className="row">
                <HeaderLayout/>
                <SidebarLayout activeItem={SIDEBAR_ITEMS.TAG_LIST}/>
                <div className="col-md-9 ml-sm-auto col-lg-10 px-4 mt-5">
                    <div className="card mt-3">
                        <div className="card-body">
                            <ul className="list-group list-group-flush mb-4">
                                <li className="list-group-item">
                                    <label className="h4">Total {total}</label>
                                </li>
                                <li className="list-group-item">
                                    <div className=" row">
                                        {tagList.map((item, index) => {
                                            const favorite = isFavoriteTag(item.name);
                                            return (
                                                <div className="col-lg-6 col-sm-12 my-2 row" key={index}>
                                                    <div className="mr-3">
                                                        <span data-feather="plus"/>{yyyyMMdd(item.ctime)}&ensp;/&ensp;
                                                        <span data-feather="check"/>{yyyyMMdd(item.mtime)}
                                                    </div>
                                                    <a className="post-title no-underline word-break mx-auto"
                                                       href={`/tag/${item.name}`}>{item.name}</a>
                                                    <div className="mr-4">
                                                        {favorite ?
                                                            <i className="fa fa-star fa-lg mr-1" onMouseEnter={e => {
                                                                e.target.className = "fa fa-star-o fa-lg mr-1"
                                                            }} onMouseLeave={e => {
                                                                e.target.className = "fa fa-star fa-lg mr-1"
                                                            }}
                                                               onClick={e => this.changeFavorite(e, item.id, favorite)}/> :
                                                            <i className="fa fa-star-o fa-lg mr-1" onMouseEnter={e => {
                                                                e.target.className = "fa fa-star fa-lg mr-1"
                                                            }} onMouseLeave={e => {
                                                                e.target.className = "fa fa-star-o fa-lg mr-1"
                                                            }}
                                                               onClick={e => this.changeFavorite(e, item.id, favorite)}/>
                                                        }
                                                        <button className="btn btn-outline-danger btn-sm ml-2"
                                                                data-toggle="modal"
                                                                data-target="#tag-list-delete-tag-confirm-modal"
                                                                onClick={e => this.deleteButtonOnClick(e)}>
                                                            delete<span style={{
                                                            // visibility: "hidden",
                                                            // opacity: 0,
                                                            // position: "absolute", left: "-1000px",
                                                            display: "none",
                                                        }}>{item.id}</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                </li>
                            </ul>
                            <PaginationPanel
                                pattern="/tags?page=%d"
                                size={this.state.size}
                                page={this.state.page}
                                total={this.state.total}/>
                        </div>
                    </div>
                </div>

                {/* modal */}
                <div className="modal fade" id="tag-list-delete-tag-confirm-modal" tabIndex="-1" role="dialog"
                     aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Are you sure to delete this tag?
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
