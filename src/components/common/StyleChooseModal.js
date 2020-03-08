import React, {Component} from "react";
import PropTypes from "prop-types";
import {HIGHLIGHT_STYLE_LIST} from "../../config";

export default class StyleChooseModal extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        style: PropTypes.string.isRequired,
        setStyle: PropTypes.func.isRequired,
    };

    render() {
        const {id, style, setStyle} = this.props;
        return (
            <div className="modal fade" id={id} tabIndex="-1" role="dialog"
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
                                {HIGHLIGHT_STYLE_LIST.map((item, i) => {
                                    let s = item === "default" ? "btn-outline-info"
                                        : (item === style ? "btn-info"
                                            : "btn-light");
                                    return <div className="col-lg-3 col-md-4 col-sm-6 mb-1" key={i}>
                                        <button className={`btn ${s}`} data-dismiss="modal"
                                                onClick={e => setStyle(e.target.innerText)}
                                                style={{color: "#258",}}>{item}</button>
                                    </div>
                                })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
