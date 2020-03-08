import React from "react";
import HeaderLayout from "../common/HeaderLayout";
import SidebarLayout, {SIDEBAR_ITEMS} from "../common/SidebarLayout";
import {getPostFavoriteList} from "../../actions";
import {getSearchValue} from "../../util/url";
import FavoritePostPanel from "./FavoritePostPanel";
import {addLineNumber, getStyle} from "../../config";
import PaginationPanel from "../common/PaginationPanel";
import UserProvider from "../provider/UserProvider";

export default class FavoritePostList extends React.Component {
    constructor(props) {
        super(props);
        // handle ?page=xxx
        const page = getSearchValue('page', 1);
        this.state = {
            posts: [],
            total: 0,
            size: 7,
            page: page,
            style: getStyle(),
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.posts.length === 0 && this.state.posts.length > 0) {
            addLineNumber()
        }
    }

    componentDidMount() {
        const {page, size} = this.state;
        getPostFavoriteList({page, size}).then(res => {
            if (res.data.success) {
                const data = res.data.data;
                this.setState({
                    posts: data.items,
                    total: data.total,
                })
            }
        });
    }

    render() {
        return (
            <div className="row">
                {this.state.style ?
                    <link rel="stylesheet" type="text/css"
                          href={`/static/css/highlight/${this.state.style}.css`}/>
                    : <span/>
                }
                <HeaderLayout/>
                <SidebarLayout activeItem={SIDEBAR_ITEMS.FAVORITES}/>
                <div className="col-md-9 ml-sm-auto col-lg-10 px-4 mt-5">
                    <div className="card mt-3">
                        <div className="card-body">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <div className="col-10 offset-1">
                                        <label className="h4">Total {this.state.total}</label>
                                    </div>
                                </li>
                                {this.state.posts.map((post, index) => (
                                    <li className="list-group-item">
                                        <FavoritePostPanel
                                            key={`${index}`}
                                            id={post.id}
                                            name={post.name}
                                            title={post.title}
                                            ctime={post.ctime}
                                            mtime={post.mtime}
                                            tags={post.tags}
                                            summary={post.summary}
                                            published={post.published}
                                        />
                                    </li>
                                ))
                                }


                            </ul>

                            <PaginationPanel
                                pattern="/favorites?page=%d"
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
