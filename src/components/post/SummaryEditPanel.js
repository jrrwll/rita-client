import React from "react";
import {md2html} from "../../config/markdown";
import PropTypes from "prop-types";

export default class SummaryEditPanel extends React.Component {
    static propTypes = {
        summary: PropTypes.string.isRequired,
        setSummary: PropTypes.func.isRequired,
    };

    state = {
        summaryEditing: !this.props.summary,
        pos: 0,
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.summary || Object.is(prevProps.summary, this.props.summary)) return;

        if (this.state.summaryEditing) {
            const {pos} = this.state;
            const textarea = document.querySelector("#summary-edit-textarea");
            textarea.focus();
            textarea.setSelectionRange(pos, pos);
        }
    }

    summaryInputOnChange(e) {
        const textarea = e.target;
        this.setState({pos: textarea.selectionStart});
        this.props.setSummary(textarea.value);
    }

    summaryInputOnBlur(e) {
        if (e.target.value.trim()) {
            this.setState({
                summaryEditing: false,
            })
        }
    }

    setSummaryEditing(summaryEditing) {
        this.setState({
            summaryEditing: summaryEditing,
        });
    }

    render() {
        const {summary} = this.props;
        const {summaryEditing} = this.state;
        return (
            <div>
                <label className="text-muted"
                       data-toggle="collapse" data-target="#collapse-summary">
                    Summary
                </label>
                <div className="collapse show" id="collapse-summary">
                    {summaryEditing ? (
                        <textarea rows="3" className="form-control"
                                  id="summary-edit-textarea"
                                  value={summary}
                                  onChange={e => this.summaryInputOnChange(e)}
                                  onBlur={e => this.summaryInputOnBlur(e)}/>
                    ) : (
                        <div dangerouslySetInnerHTML={{__html: md2html(summary)}}
                             onDoubleClick={e => this.setSummaryEditing(true)}/>
                    )}
                </div>
            </div>
        );
    }
}
