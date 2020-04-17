import React from 'react';
import {showError, showSuccess} from "../../config";
import SidebarLayout, {SIDEBAR_ITEMS} from "../common/SidebarLayout";
import HeaderLayout from "../common/HeaderLayout";
import {getTag, removePostFromTag} from "../../actions";
import {refresh} from "../../util/history";
import feather from "feather-icons";
import PaginationPanel from "../common/PaginationPanel";
import {getSearchValue} from "../../util/url";
import UserProvider from "../provider/UserProvider";
import TagViewEditPanel from "./TagViewEditPanel";
import TagViewCorePanel from "./TagViewCorePanel";

export default class TagView extends React.Component {
    constructor(props) {
        super(props);
        const id = this.props.match.params.id;
        const page = getSearchValue('page', 1);
        this.state = {
            id,
            name: "",
            favorite: false,
            count: 0,
            posts: [],
            ctime: 0,
            mtime: 0,
            nameError: "",
            nameCheck: "",
            total: 0,
            size: 20,
            page: page,
            hiddenTagEdit: true,
        };
    }

    componentDidMount() {
        const {id, page, size} = this.state;
        getTag(id, page, size).then(res => {
            if (res.data.code === 0) {
                const {name, favorite, ctime, mtime, count, posts} = res.data.data;
                this.setState({
                    name, favorite, ctime, mtime, count,
                    posts: posts.items, total: posts.total
                });
            }
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        feather.replace();
    }

    deletePostButtonOnClick(e) {
        const postId = e.target.children[0].innerText;
        this.setState({postId});
    }

    deletePostConfirmOnClick(e) {
        const {postId, id} = this.state;
        if (!postId) {
            showError("system internal error!!!")
        }
        removePostFromTag({tagId: id, postId}).then(res => {
            if (res.data.code === 0) {
                showSuccess();
                setTimeout(() => refresh(), 3000);
            } else {
                showError(res.data.message);
            }
        }, err => {
            showError();
        })
    }


    render() {
        const {id, name, ctime, mtime, count, posts, favorite, hiddenTagEdit} = this.state;
        return (
            <div className="row">
                <HeaderLayout/>
                <SidebarLayout activeItem={SIDEBAR_ITEMS.NONE}/>
                <div className=" col-md-9 ml-sm-auto col-lg-10 px-4 mt-5">
                    <div className="card mt-3">
                        <div className="card-body">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    {hiddenTagEdit ?
                                        <TagViewCorePanel
                                            id={id}
                                            name={name}
                                            favorite={favorite}
                                            ctime={ctime}
                                            mtime={mtime}
                                            count={count}
                                            setHiddenTagEdit={hiddenTagEdit => {
                                                this.setState({hiddenTagEdit})
                                            }}/> :
                                        <TagViewEditPanel
                                            id={id}
                                            name={name}
                                            favorite={favorite}
                                            setHiddenTagEdit={hiddenTagEdit => {
                                                this.setState({hiddenTagEdit})
                                            }}/>
                                    }
                                </li>
                                <li className="list-group-item">
                                    {posts.map((item, index) => (
                                        <div className="row my-2" key={index}>
                                            <a className="post-title no-underline word-break"
                                               href={`/post/${item.id}`}>{item.title}</a>
                                            <div className="ml-auto mr-0">
                                                {item.favorite ?
                                                    <i className="fa fa-star mr-1"/> :
                                                    <i className="fa fa-star-o mr-1"/>
                                                }
                                                {item.published ?
                                                    <i className="fa fa-eye"/> :
                                                    <i className="fa fa-eye-slash"/>
                                                }
                                                <button className="btn btn-outline-danger btn-sm ml-2"
                                                        data-toggle="modal"
                                                        data-target="#view-delete-post-confirm-modal"
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
                                pattern="/tags?page=%d"
                                size={this.state.size}
                                page={this.state.page}
                                total={this.state.total}/>
                        </div>
                    </div>
                </div>

                {/* modal delete post from tag*/}
                <div className="modal fade" id="view-delete-post-confirm-modal" tabIndex="-1" role="dialog"
                     aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Are you sure to delete this post from the tag?
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
                                        onClick={e => this.deletePostConfirmOnClick(e)}>Confirm
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
