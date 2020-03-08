import React from "react";
import {HIGHLIGHT_STYLE_LIST} from '../../config'
import PropTypes from "prop-types";

export default class TitleEditPanel extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        setTitle: PropTypes.func.isRequired,
        style: PropTypes.string.isRequired,
        setStyle: PropTypes.func.isRequired,
    };

    state = {
        titleEditing: !this.props.title,
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.title || Object.is(prevProps.title, this.props.title)) return;

        if (this.state.titleEditing) {
            document.querySelector("#title-edit-input").focus();
        }
    }

    titleInputOnChange(e) {
        this.props.setTitle(e.target.value);
    }

    titleInputOnBlur(e) {
        if (e.target.value.trim()) {
            this.setState({
                titleEditing: false,
            })
        }
    }

    titleInputOnKeyDownEnter(e) {
        if (e.key === 'Enter') {
            e.target.blur();
        }
    }

    setTitleEditing(titleEditing) {
        this.setState({
            titleEditing: titleEditing,
        });
    }

    styleOnChosen(e) {
        const style = e.target.innerText;
        const styleButton = document.querySelector("#title-edit-style");
        styleButton.innerText = style;
        styleButton.blur();
        this.props.setStyle(style);
    }

    render() {
        const {title, style} = this.props;
        const {titleEditing} = this.state;
        return (
            <div>
                <label className="text-muted">Double click to edit the title</label>
                <div className="form-inline">
                    {titleEditing ? (
                        <input className="form-control flex-fill"
                               id="title-edit-input"
                               value={title}
                               onChange={e => this.titleInputOnChange(e)}
                               onKeyDown={e => this.titleInputOnKeyDownEnter(e)}
                               onBlur={e => this.titleInputOnBlur(e)}/>
                    ) : (
                        <div className="h4 flex-fill"
                             onDoubleClick={e => this.setTitleEditing(true)}>{title}</div>
                    )}
                    <button type="button" className="btn btn-outline-secondary ml-2"
                            data-toggle="modal"
                            id="title-edit-style"
                            data-target="#title-edit-style-choose-modal">
                        {style ? style : "default"}
                    </button>
                </div>

                {/* modal */}
                <div className="modal fade" id="title-edit-style-choose-modal" tabIndex="-1" role="dialog"
                     aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Highlight style for codes
                                </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    {HIGHLIGHT_STYLE_LIST.map((style, i) => {
                                        let s = style === "default" ? "btn-outline-info" : "btn-light";
                                        return <div className="col-lg-3 col-md-4 col-sm-6 mb-1" key={i}>
                                            <button className={`btn ${s}`} data-dismiss="modal"
                                                    onClick={e => this.styleOnChosen(e)}
                                                    style={{color: "#258",}}>{style}</button>
                                        </div>
                                    })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
