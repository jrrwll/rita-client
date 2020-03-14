import React from "react";
import {validatePostName} from "../../config/validation";
import {getPostNameValidity} from "../../actions";
import PropTypes from "prop-types";

export default class NameEditPanel extends React.Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        setName: PropTypes.func.isRequired,
        published: PropTypes.bool,
        setPublished: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            nameError: "",
            nameCheck: "",
            originalName: "",
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.name && this.props.name) {
            this.setState({originalName: this.props.name})
        }
    }

    showValidity(nameInput, isValid, nameError, nameCheck) {
        if (isValid) {
            nameInput.setAttribute("class", "form-control is-valid")
        } else {
            nameInput.setAttribute("class", "form-control is-invalid");
        }
        this.setState({nameError: nameError, nameCheck: nameCheck});
    }

    checkPostName(nameInput) {
        let nameError = validatePostName(nameInput.value);
        let isValid = !nameError;
        this.showValidity(nameInput, isValid, nameError, "");
        return isValid;
    }

    setPublished(e, published) {
        this.props.setPublished(published);
    }

    nameInputOnChange(e) {
        const nameInput = e.target;
        this.checkPostName(nameInput);
        this.props.setName(nameInput.value);
    }

    nameInputOnBlur(e) {
        const nameInput = e.target;
        if (!this.checkPostName(nameInput)) return;
        const name = nameInput.value;
        if (name === this.state.originalName) {
            this.showValidity(nameInput, true, "",
                "Well!😇 It's the original name");
            return;
        }
        getPostNameValidity(name).then(res => {
            if (res.data.success) {
                if (res.data.data) {
                    this.showValidity(nameInput, true, "",
                        "Congratulations!🤣 The name is available");
                    return;
                }
                this.showValidity(nameInput, false, "Oops! The name has been taken", "");
            }
        }, err => {
            this.showValidity(nameInput, false,
                "A error has occurred!😭 Check your network first maybe",
                "");
        });
    }

    nameInputOnKeyDownEnter(e) {
        if (e.key === 'Enter') {
            e.target.blur();
        }
    }

    render() {
        const {name, published} = this.props;
        const {nameError, nameCheck} = this.state;
        return (
            <div>
                <label className="text-muted"
                       data-toggle="collapse" data-target="#collapse-name">
                    Unique name
                </label>
                <div className="collapse show" id="collapse-name">
                    <div className="form-inline">
                        <div className="input-group flex-fill">
                            <input className="form-control"
                                   id="name-edit-input"
                                   value={name}
                                   onChange={e => this.nameInputOnChange(e)}
                                   onKeyDown={e => this.nameInputOnKeyDownEnter(e)}
                                   onBlur={e => this.nameInputOnBlur(e)}/>

                            {published ?
                                <button className="btn btn-light ml-2 mr-0"
                                        onClick={e => this.setPublished(e, false)}>
                                    Published&emsp;&nbsp;
                                </button>
                                :
                                <button className="btn btn-warning ml-2 mr-0"
                                        onClick={e => this.setPublished(e, true)}>
                                    Unpublished
                                </button>
                            }
                            <div className="invalid-feedback">
                                {nameError}
                            </div>
                            <div className="valid-feedback">
                                {nameCheck}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
