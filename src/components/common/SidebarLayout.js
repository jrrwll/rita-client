import React from "react";
import PropTypes from 'prop-types';
import feather from "feather-icons";
import {emitter} from "../../config";
import {FETCH_TAGS_EVENT} from "../../actions";
import {FormattedMessage} from "react-intl";

export default class SidebarLayout extends React.Component {
    static propTypes = {
        activeItem: PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.state = {
            favoriteTags: [],
        };
        this.fetchTagsEventEmitter = emitter.addListener(FETCH_TAGS_EVENT, (tags) => {
            this.setState({favoriteTags: tags.filter(it => !!it.favorite)});
        });
    }

    componentWillUnmount() {
        emitter.removeListener(FETCH_TAGS_EVENT, this.fetchTagsEventEmitter);
    }

    componentDidMount() {
        // active item
        const li = document.querySelector("nav div ul").children[this.props.activeItem];
        if (li) {
            li.querySelector("a").setAttribute("class", "nav-link active")
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let {favoriteTags} = this.state;
        // it only works when React updated this state in first time;
        if (prevState.favoriteTags.length === 0 && favoriteTags.length !== 0) {
            if (RegExp(`${window.location.host}/tag/(.+)`).test(window.location.href)) {
                const tid = RegExp.$1;
                const index = favoriteTags.map(it => it.id + "").indexOf(tid);
                if (index !== -1) {
                    const li = document.querySelector("nav div").children[2].children[index];
                    if (li) {
                        li.querySelector("a").setAttribute("class", "nav-link active");
                        li.scrollIntoView();
                    }
                }
            }
        }

        // icon
        feather.replace();
    }

    render() {
        let {favoriteTags} = this.state;
        return (
            <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                <div className="sidebar-sticky">
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <a className="nav-link" aria-current="page" href="/overview">
                                <span data-feather="home"/>
                                <FormattedMessage id="Overview"/>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/posts">
                                <span data-feather="file"/>
                                <FormattedMessage id="Posts"/>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/tags">
                                <span data-feather="at-sign"/>
                                <FormattedMessage id="Tags"/>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/trash">
                                <span data-feather="trash-2"/>
                                <FormattedMessage id="Trash"/>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/favorites">
                                <span data-feather="book"/>
                                <FormattedMessage id="Favorites"/>
                            </a>
                        </li>
                    </ul>

                    <h6 className="d-flex px-3 mt-4 mb-1 text-muted" style={{
                        textTransform: "capitalize"
                    }}><FormattedMessage id="Favorite tags"/></h6>

                    <ul className="nav flex-column mb-2">
                        {favoriteTags.map((tag, i) => (
                            <li className="nav-item" key={i}>
                                <a className="nav-link" href={`/tag/${tag.id}`}>
                                    <span data-feather="bookmark"/>
                                    <span style={{
                                        wordBreak: "break-word",
                                        lineHeight: 1.5,
                                    }}>{tag.name}</span>
                                    <span className="badge bg-light">&nbsp;({tag.count})</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        );
    }
}

export const SIDEBAR_ITEMS = {
    NONE: -1,
    OVERVIEW: 0,
    POST_LIST: 1,
    TAG_LIST: 2,
    TRASH: 3,
    FAVORITES: 4,
};

//
