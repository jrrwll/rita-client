import React from "react";
import {getStyle, md2html} from "../../config/markdown";
import PropTypes from "prop-types";

export default class ContentEditPanel2 extends React.Component {
    static propTypes = {
        content: PropTypes.string.isRequired,
        setContent: PropTypes.func.isRequired,
    };

    state = {
        pos: 0,
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.content || Object.is(prevProps.content, this.props.content)) return;

        const {pos} = this.state;
        const textarea = document.querySelector("#content-edit-textarea");
        textarea.focus();
        textarea.setSelectionRange(pos, pos);
    }

    textOnChange(e) {
        const textarea = e.target;
        const content = textarea.value;
        const pos = textarea.selectionStart;
        this.setState({pos: pos});
        this.props.setContent(content);
    }

    render() {
        const {content} = this.props;
        const style = getStyle();
        return (
            <div>
                {style ?
                    <link rel="stylesheet" type="text/css"
                          href={`/static/css/highlight/${style}.css`}/>
                    : <span/>
                }
                <textarea rows="9" className="form-control"
                          id="content-edit-textarea"
                          placeholder="Paste Markdown or HTML post here"
                          value={content}
                          onChange={e => this.textOnChange(e)}/>
                <hr/>
                <div dangerouslySetInnerHTML={{__html: md2html(content)}}/>
            </div>
        );
    }
}
