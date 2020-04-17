import React, {createRef} from "react";
import Cropper from "react-cropper";
import 'cropperjs/dist/cropper.css';

import {showError, storage} from "../../config";
import {updateAvatar} from "../../actions";
import {refresh} from "../../util/history";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const IMAGE_MAX_DIAMETER = 256;

export default class AvatarEditModal extends React.Component {
    constructor(props) {
        super(props);
        this.cropperRef = createRef();
        this.state = {
            hiddenCrop: true,
            src: null,
        };
    }

    fileOnChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > MAX_FILE_SIZE) {
            showError("The file is too large than 5MB");
            return
        }
        this.setState({hiddenCrop: false});

        const fileReader = new FileReader();
        fileReader.onload = e => {
            const dataURL = e.target.result;
            this.setState({src: dataURL})
        };
        fileReader.readAsDataURL(file);
    }

    confirmOnClick(e) {
        const cropper = this.cropperRef.current;
        if (!cropper) return;
        const croppedCanvas = cropper.getCroppedCanvas();
        if (!croppedCanvas) return;

        const dataURL = croppedCanvas.toDataURL();
        var canvas = document.createElement('canvas');
        var img = new Image();
        img.src = dataURL;
        img.onload = () => {
            let scale = 1;
            const width = img.width;
            const height = img.height;

            if (width > IMAGE_MAX_DIAMETER) {
                scale = IMAGE_MAX_DIAMETER / width;
            }
            canvas.width = width * scale;
            canvas.height = height * scale;
            const context2D = canvas.getContext("2d");
            context2D.drawImage(img, 0, 0, canvas.width, canvas.height);
            const newDataURL = canvas.toDataURL();
            updateAvatar(newDataURL).then(res => {
                if (res.data.code === 0) {
                    storage.removeAvatar();
                    refresh();
                } else {
                    showError(res.data.message)
                }
            }, err => {
                console.error(err);
                showError()
            });
        };


    }

    render() {
        const {hiddenCrop, src} = this.state;
        return (
            <div className="modal fade" id="user-change-avatar-modal" tabIndex="-1" role="dialog"
                 aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Change your avatar
                            </h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body" style={{textAlign: "center",}}>
                            <div>
                                <label className="btn btn-info btn-file">
                                    Choose a image
                                    <input type="file" style={{display: "none"}}
                                           onChange={e => this.fileOnChange(e)}/>
                                </label>
                            </div>
                            {!hiddenCrop &&
                            <div className="row cropper-container">
                                <Cropper
                                    className="cropper"
                                    src={src}
                                    ref={this.cropperRef}
                                    viewMode={1}
                                    zoomable={false}
                                    aspectRatio={1}
                                    guides={false}
                                />
                            </div>
                            }
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary"
                                    data-dismiss="modal">Close
                            </button>
                            <button type="button" className="btn btn-danger" data-dismiss="modal"
                                    onClick={e => this.confirmOnClick(e)}>Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>)
    }
}
