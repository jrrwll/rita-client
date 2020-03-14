import React from 'react';
import PropTypes from 'prop-types';
import {yyyyMMdd} from "../../util/time";
import TagPanel from "../common/TagPanel";
import {md2html} from "../../config";

export default class FavoritePostPanel extends React.Component {
    static propTypes = {
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        ctime: PropTypes.number.isRequired,
        mtime: PropTypes.number.isRequired,
        published: PropTypes.bool.isRequired,
        tags: PropTypes.array.isRequired,
        summary: PropTypes.string.isRequired,
    };

    render() {
        const ctime = yyyyMMdd(this.props.ctime);
        const mtime = yyyyMMdd(this.props.mtime);
        const link = `/post/${this.props.name}`;
        return (
            <div className="col-12" style={{
                marginBottom: 10,
                marginTop: 10,
            }}>
                <div className="row" style={{
                    marginLeft: 5,
                    marginBottom: 0,

                }}>
                    <a href={link} className="post-title no-underline" style={{
                        marginTop: 5,
                    }}>
                        <label className="h2 word-break">
                            {this.props.title}&nbsp;
                            {this.props.published ?
                                <span/> :
                                <span>&nbsp;<i className="fa fa-eye-slash"/></span>
                            }
                        </label>
                    </a>
                </div>

                <div className="row" style={{
                    marginLeft: 5,
                    marginBottom: 10,
                }}>
                    <div className="mb-1 mt-2 ">{ctime}&ensp;/&ensp;</div>
                    <div className="mb-1 mt-2 ">{mtime}&ensp;/&ensp;</div>
                    {
                        this.props.tags.map((tag, index) =>
                            <TagPanel tag={tag} key={`${index}`}/>)
                    }
                </div>

                <div style={{
                    marginLeft: 5,
                    wordBreak: "break-word",
                    // opacity: "0.382",
                }} dangerouslySetInnerHTML={{__html: md2html(this.props.summary)}}>
                </div>
            </div>
        );
    }
}
