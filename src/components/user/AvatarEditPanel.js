import React from "react";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import {showError, storage} from "../../config";
import {updateAvatar} from "../../actions";
import {refresh} from "../../util/history";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const IMAGE_MAX_DIAMETER = 256;

export default class AvatarEditPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hiddenCrop: true,
            src: null,
            crop: {
                unit: "%",
                width: 100,
                height: 100,
                aspect: 1,
                minWidth: 16,
            },
            image: null,
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
        const {crop, image} = this.state;
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.clientWidth;
        const scaleY = image.naturalHeight / image.clientWidth;

        let scale = 1;
        if (crop.width > IMAGE_MAX_DIAMETER) {
            scale = IMAGE_MAX_DIAMETER / crop.width;
        }
        canvas.width = crop.width * scale;
        canvas.height = crop.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height,
        );

        const dataURL = canvas.toDataURL();
        updateAvatar(dataURL).then(res => {
            if (res.data.success) {
                storage.removeAvatar();
                refresh();
            } else {
                showError(res.data.message)
            }
        }, err => {
            console.error(err);
            showError()
        });
    }

    render() {
        const {hiddenCrop, src, crop} = this.state;
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
                            <ReactCrop
                                src={src}
                                crop={crop}
                                onChange={newCrop => this.setState({crop: newCrop})}
                                onImageLoaded={image => this.setState({image})}
                            />
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
