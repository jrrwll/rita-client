import React from "react";
import {getPostDeletedList, restorePost} from "../../actions";
import HeaderLayout from "../common/HeaderLayout";
import SidebarLayout, {SIDEBAR_ITEMS} from "../common/SidebarLayout";
import {yyyyMMdd} from "../../util/time";
import PaginationPanel from "../common/PaginationPanel";
import {getSearchValue} from "../../util/url";
import {showSuccessAndRefresh} from "../../config";
import UserProvider from "../provider/UserProvider";

export default class Trash extends React.Component {
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
        getPostDeletedList({page, size}).then(res => {
            if (res.data.success) {
                const data = res.data.data;
                this.setState({
                    postList: data.items,
                    total: data.total,
                })
            }
        });
    }

    restoreOnClick(e) {
        const restorePostId = e.target.children[0].innerText;

        restorePost(restorePostId).then(res => {
            if (res.data.success) {
                showSuccessAndRefresh();
            }
        })
    }

    render() {
        const {postList, total} = this.state;
        return (
            <div className="row">
                <HeaderLayout/>
                <SidebarLayout activeItem={SIDEBAR_ITEMS.TRASH}/>
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
                                            <div className="mr-3">
                                                <span data-feather="plus"/>{yyyyMMdd(item.ctime)}&ensp;/&ensp;
                                                <span data-feather="check"/>{yyyyMMdd(item.mtime)}
                                            </div>
                                            <a className="post-title no-underline word-break"
                                               href={`/post/${item.name}`}>{item.title}</a>
                                            <div className="ml-auto mr-0">
                                                {item.favorite ?
                                                    <span data-feather="star" className="mr-1"/> :
                                                    <span/>}
                                                {item.published ? <span data-feather="eye"/> :
                                                    <span data-feather="eye-off"/>}
                                                <button className="btn btn-outline-danger btn-sm ml-2"
                                                        onClick={e => this.restoreOnClick(e)}>
                                                    restore<span style={{
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
                                pattern="/trash?page=%d"
                                size={this.state.size}
                                page={this.state.page}
                                total={this.state.total}/>
                        </div>
                    </div>
                </div>
                <UserProvider/>
            </div>
        );
    }
}
