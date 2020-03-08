import React from "react";
import PropTypes from "prop-types";

export default class TagEditPanel extends React.Component {
    static propTypes = {
        currentTags: PropTypes.array.isRequired,
        setCurrentTags: PropTypes.func.isRequired,
        tags: PropTypes.array.isRequired,
    };

    state = {
        tagError: "",
        tagCheck: "",
    };

    showValidity(tagInput, isValid, tagError, tagCheck) {
        if (isValid === undefined) {
            tagInput.setAttribute("class", "form-control col-md-6 col-3");
            return;
        }
        if (isValid) {
            tagInput.setAttribute("class", "form-control col-md-6 col-3 is-valid")
        } else {
            tagInput.setAttribute("class", "form-control col-md-6 col-3 is-invalid");
        }
        this.setState({tagError, tagCheck});
    }

    checkTagInput(input) {
        let tag = input.value;

        if (!tag) {
            this.showValidity(input);
            return false;
        }

        if (/[a-z0-9.-_@#$%&*^<>?;:|/\\!]{2,32}/i.test(tag)) {
            if (this.props.currentTags.indexOf(tag) !== -1) {
                this.showValidity(input, false, "The tag already exists", "");
                return false;
            } else {
                this.showValidity(input, true, "", "The tag is available");
                return true;
            }
        } else {
            this.showValidity(input, false, "Invalid tag", "");
            return false;
        }
    }

    addToTags(tag) {
        const {currentTags} = this.props;
        if (currentTags.indexOf(tag) !== -1) {
            console.warn("You're adding a redundant tag, so I will ignore it.");
            return;
        }
        currentTags.push(tag);
        // add a tag
        this.props.setCurrentTags(currentTags);
    }

    tagCloseOnClick(e) {
        let tag = e.target.parentNode.querySelector(".btn").innerText;
        const {currentTags} = this.props;
        const index = currentTags.indexOf(tag);
        if (index !== -1) {
            currentTags.splice(index, 1);
        }
        // remove a tag
        this.props.setCurrentTags(currentTags);
    }

    tagAddOnClick() {
        let input = document.querySelector("#tag-editor-input");
        if (!this.checkTagInput(input)) return;
        this.addToTags(input.value);
    }

    tagInputOnKeyDownEnter(e) {
        if (e.key === 'Enter') {
            document.querySelector("#tag-editor-add").click();
        }
    }

    tagInputOnChange(e) {
        this.checkTagInput(e.target);
    }

    tagOnChosen(e) {
        this.addToTags(e.target.innerText);
    }

    render() {
        const {currentTags, tags} = this.props;
        const {tagError, tagCheck} = this.state;
        return (
            <div>
                <label className="text-muted"
                       data-toggle="collapse" data-target="#collapse-tag">
                    Add some tags for your post
                </label>
                <div className="collapse show" id="collapse-tag">
                    <div className="form-inline">
                        <div className="input-group flex-fill">
                            <input className="form-control col-md-6 col-3"
                                   id="tag-editor-input"
                                   onKeyDown={e => this.tagInputOnKeyDownEnter(e)}
                                   onChange={e => this.tagInputOnChange(e)}/>
                            <div>
                                <button type="button" className="btn btn-outline-secondary ml-2"
                                        id="tag-editor-add"
                                        onClick={e => this.tagAddOnClick()}>
                                    Add
                                </button>
                                <button type="button" className="btn btn-outline-secondary ml-2"
                                        data-toggle="modal" data-target="#tag-edit-choose-modal">
                                    Choose
                                </button>
                            </div>
                            <div className="invalid-feedback">
                                {tagError}
                            </div>
                            <div className="valid-feedback">
                                {tagCheck}
                            </div>
                        </div>
                    </div>
                    <hr/>
                    <div className="container-fluid">
                        <div className="row">
                            {currentTags.map((item, i) => (
                                <div className="btn btn-light mr-2" key={i}
                                     onClick={e => this.tagCloseOnClick(e)}>
                                    <a className="btn" style={{
                                        color: "#258",
                                    }} href={`/tag/${item}`}>
                                        {item}
                                    </a>
                                    <span className="btn">&times;</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* modal */}
                <div className="modal fade" id="tag-edit-choose-modal" tabIndex="-1" role="dialog"
                     aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Add tag by you tags list
                                </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    {tags.map((tag, i) =>
                                        <div className="col-md-3 col-sm-6" key={i}>
                                            <button className="btn btn-light" data-dismiss="modal"
                                                    onClick={e => this.tagOnChosen(e)}
                                                    style={{color: "#258",}}>{tag}</button>
                                        </div>)
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
