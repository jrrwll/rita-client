import React, {Component} from "react";
import PropTypes from "prop-types";
import {dateFormat} from "../../util/time";
import {deleteTag, updateTag} from "../../actions";
import {pushForcibly, refresh} from "../../util/history";
import {showError, storage} from "../../config";


export default class TagViewCorePanel extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        favorite: PropTypes.bool.isRequired,
        ctime: PropTypes.number.isRequired,
        mtime: PropTypes.number.isRequired,
        count: PropTypes.number.isRequired,
        setHiddenTagEdit: PropTypes.func.isRequired,
    };

    deleteOnClick() {
        const {id} = this.props;
        deleteTag(id).then(res => {
            if (res.data.success) {
                pushForcibly("/tags")
            } else {
                showError(res.data.message);
            }
        }, err => {
            showError();
        })
    }

    changeFavorite() {
        let {id, name, favorite} = this.props;
        favorite = !favorite;
        updateTag(id, {name, favorite}).then(res => {
            if (res.data.success) {
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
        const {name, favorite, ctime, mtime, count, setHiddenTagEdit} = this.props;
        return (
            <div>
                <div className="text-center h3" style={{
                    wordBreak: "break-word",
                    textShadow: "1px 1px 1px #ccc",
                    lineHeight: 1.5,
                }}>{name}</div>
                <div className="mt-1 row">
                    <div className=" my-1">
                        <label className="ml-auto">Created on&nbsp;</label>
                        <label className="font-italic">{dateFormat(ctime, "yyyy-MM-dd")}</label>
                        <label>&ensp;/&ensp;Modified on&nbsp;</label>
                        <label className="font-italic">{dateFormat(mtime, "yyyy-MM-dd")}</label>
                        <label>&ensp;/&ensp;{count}&ensp;/&ensp;</label>

                        {favorite ?
                            <i className="fa fa-star fa-lg mr-1" onMouseEnter={e => {
                                e.target.className = "fa fa-star-o fa-lg mr-1"
                            }} onMouseLeave={e => {
                                e.target.className = "fa fa-star fa-lg mr-1"
                            }}
                               onClick={e => this.changeFavorite()}/> :
                            <i className="fa fa-star-o fa-lg mr-1" onMouseEnter={e => {
                                e.target.className = "fa fa-star fa-lg mr-1"
                            }} onMouseLeave={e => {
                                e.target.className = "fa fa-star-o fa-lg mr-1"
                            }}
                               onClick={e => this.changeFavorite()}/>
                        }
                    </div>
                    <div className="ml-auto">
                        <button className="btn btn-outline-info btn-sm my-1"
                                onClick={e => {
                                    setHiddenTagEdit(false)
                                }}>
                            modify
                        </button>
                        <button className="btn btn-outline-danger btn-sm ml-2 my-1"
                                data-toggle="modal"
                                data-target="#view-delete-confirm-modal">
                            delete
                        </button>
                    </div>
                </div>
                {/* modal delete*/}
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
                                    Are you sure to delete this tag?
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
            </div>
        );
    }
}
