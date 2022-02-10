import React from "react";
import { useDispatch, useSelector } from 'react-redux';

import {Button} from "../elements/Index2";
import { actionCreators as imageActions } from '../redux/modules/image';

const Upload = (props) => {
    const dispatch = useDispatch();
    const is_uploading = useSelector(state => state.image.uploading);
    const fileInput = React.useRef();

    const selectFile = (e) => {
        const reader = new FileReader();
        const file = fileInput.current.files[0];

        reader.readAsDataURL(file);

        reader.onloadend = () => {
            console.log(reader.result);
            dispatch(imageActions.setPreview(reader.result));
        }
    }

    const uploadFB = () => {
        let image = fileInput.current.files[0];
        dispatch(imageActions.uploadImageFB(image));
    }

    return (
        <React.Fragment>
            <input type="file" onChange={selectFile} ref={fileInput} disabled={is_uploading}/>
            <Button _onClick={uploadFB}>업로드하기</Button>
        </React.Fragment>
    )
}

export default Upload;