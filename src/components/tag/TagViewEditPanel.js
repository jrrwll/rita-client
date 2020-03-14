import React, {Component} from "react";
import {getTagNameValidity, updateTag} from "../../actions";
import {refresh} from "../../util/history";
import {showError, storage} from "../../config";
import {validatePostName} from "../../config/validation";
import PropTypes from "prop-types";


export default class TagViewEditPanel extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        favorite: PropTypes.bool.isRequired,
        setHiddenTagEdit: PropTypes.func.isRequired,
    };

    state = {
        nameError: "",
        nameCheck: "",
    };

    saveOnClick() {
        const nameInput = document.querySelector("#tag-view-modify-name");
        if (!this.checkPostName(nameInput)) return;

        const {id} = this.props;
        let name = nameInput.value.trim();
        let favorite = document.querySelector("#tag-view-modify-favorite").checked;

        if (name === this.props.name && favorite === this.props.favorite) {
            this.props.setHiddenTagEdit(true);
            return;
        }

        updateTag(id, {name, favorite}).then(res => {
            if (res.data.success) {
                storage.removeTags();
                refresh();
            } else {
                console.error(res.data.message);
            }
        }, err => {
            showError();
        })
    }

    nameInputOnChange(e) {
        const nameInput = e.target;
        this.checkPostName(nameInput)
    }

    nameInputOnBlur(e) {
        const nameInput = e.target;
        if (!this.checkPostName(nameInput)) return;
        const name = nameInput.value;
        if (name === this.props.name) {
            this.showValidity(nameInput, true, "",
                "Well!😇 It's the original name");
            return;
        }
        getTagNameValidity(name).then(res => {
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

    render() {
        const {name, favorite, setHiddenTagEdit} = this.props;
        const {nameError, nameCheck} = this.state;

        return (
            <div>
                <div className="form-group">
                    <label className="form-text">Name</label>
                    <input className="form-control" id="tag-view-modify-name" defaultValue={name}
                           onChange={e => this.nameInputOnChange(e)}
                           onBlur={e => this.nameInputOnBlur(e)}/>
                    <div className="invalid-feedback">
                        {nameError}
                    </div>
                    <div className="valid-feedback">
                        {nameCheck}
                    </div>
                </div>
                <div className="form-inline">
                    <div className="form-check mt-1">
                        <input className="form-check-input" type="checkbox"
                               id="tag-view-modify-favorite" defaultChecked={favorite}/>
                        <label className="form-check-label">
                            Favorite it
                        </label>
                    </div>
                    <button type="button" className="btn btn-secondary btn-sm ml-auto mr-1"
                            onClick={e => {
                                setHiddenTagEdit(true)
                            }}>
                        Close
                    </button>
                    <button type="button" className="btn btn-info btn-sm"
                            onClick={e => this.saveOnClick()}>Save
                    </button>
                </div>
            </div>
        );
    }
}
