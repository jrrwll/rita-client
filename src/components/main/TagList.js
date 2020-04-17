import React from "react";
import {deleteTag, FETCH_TAGS_EVENT, updateTag} from "../../actions";
import HeaderLayout from "../common/HeaderLayout";
import SidebarLayout, {SIDEBAR_ITEMS} from "../common/SidebarLayout";
import {emitter, showError, showUnexpectedError, storage} from "../../config";
import UserProvider from "../provider/UserProvider";
import {refresh} from "../../util/history";
import {FormattedMessage} from "react-intl";

export default class TagList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tagList: [],
            total: 0,
        };
        this.fetchTagsEventEmitter = emitter.addListener(FETCH_TAGS_EVENT, (tags) => {
            this.setState({tagList: tags, total: tags.length});
        });
    }

    componentWillUnmount() {
        emitter.removeListener(FETCH_TAGS_EVENT, this.fetchTagsEventEmitter);
    }

    deleteButtonOnClick(e) {
        this.setState({
            deleteTagId: e.target.children[0].innerText,
        });
    }

    deleteOnClick() {
        const {deleteTagId} = this.state;
        if (!deleteTagId) {
            showUnexpectedError();
            return;
        }

        deleteTag(deleteTagId).then(res => {
            if (res.data.code === 0) {
                refresh();
            } else {
                showError("Failed to delete this tag " + deleteTagId);
            }
        })
    }

    changeFavorite(e, tag) {
        let {id, name, favorite} = tag;
        favorite = !favorite;
        updateTag(id, {name, favorite}).then(res => {
            if (res.data.code === 0) {
                storage.removeTags();
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
                                    <label className="h4"><FormattedMessage id="Total"/> {total}</label>
                                </li>
                                <li className="list-group-item">
                                    <div className=" row">
                                        {tagList.map((item, index) => {
                                            return (
                                                <div className="col-lg-3 col-md-4 col-sm-12 my-2 row" key={index}>
                                                    <a className="post-title no-underline word-break mx-auto"
                                                       href={`/tag/${item.id}`}>{item.name}&nbsp;({item.count})</a>
                                                    <div className="mr-4">
                                                        {item.favorite ?
                                                            <i className="fa fa-star fa-lg mr-1" onMouseEnter={e => {
                                                                e.target.className = "fa fa-star-o fa-lg mr-1"
                                                            }} onMouseLeave={e => {
                                                                e.target.className = "fa fa-star fa-lg mr-1"
                                                            }}
                                                               onClick={e => this.changeFavorite(e, item)}/> :
                                                            <i className="fa fa-star-o fa-lg mr-1" onMouseEnter={e => {
                                                                e.target.className = "fa fa-star fa-lg mr-1"
                                                            }} onMouseLeave={e => {
                                                                e.target.className = "fa fa-star-o fa-lg mr-1"
                                                            }}
                                                               onClick={e => this.changeFavorite(e, item)}/>
                                                        }
                                                        <button className="btn btn-outline-danger btn-sm ml-2"
                                                                data-toggle="modal"
                                                                data-target="#tag-list-delete-tag-confirm-modal"
                                                                onClick={e => this.deleteButtonOnClick(e)}>
                                                            <FormattedMessage id="Delete"/><span style={{
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
                        </div>
                    </div>
                </div>

                {/* modal */}
                <div className="modal fade" id="tag-list-delete-tag-confirm-modal" tabIndex="-1" role="dialog"
                     aria-hidden="true" onKeyUp={e => {
                    if (e.key === 'Enter') {
                        this.deleteOnClick();
                    } else {
                        document.querySelector("#tag-list-delete-tag-confirm-modal-close-button").click();
                    }
                }}>
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
                                        id="tag-list-delete-tag-confirm-modal-close-button"
                                        data-dismiss="modal">Close
                                </button>
                                <button type="button" className="btn btn-danger" data-dismiss="modal"
                                        onClick={e => this.deleteOnClick()}>Confirm
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
