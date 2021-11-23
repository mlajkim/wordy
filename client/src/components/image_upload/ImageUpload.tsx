import { FC, useState, Fragment } from 'react'
// Library
import ImageUploading from 'react-images-uploading'
// MUI Icon
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';

const UPLOADING_ONCE_MAX_NUM = 1
type ImageUploadProps = {
  iconStyle: any
}
const ImageUpload: FC<ImageUploadProps> = ({ iconStyle }) => {
    const [images, setImages] = useState([])

    const onChange = (imageList: any, addUpdateIndex: any) => {
      console.log(imageList)
      setImages(imageList);
    };
    

    return (
      <Fragment>
        <ImageUploading
          multiple
          value={images}
          onChange={onChange}
          maxNumber={UPLOADING_ONCE_MAX_NUM}
          dataURLKey="data_url"
        >
          {({
            imageList,
            onImageUpload,
            onImageRemoveAll,
            onImageUpdate,
            onImageRemove,
            isDragging,
            dragProps,
          }) => (
            // write your building UI
            <div className="upload__image-wrapper">
              <InsertPhotoIcon 
                style={isDragging ? { color: 'red' } : {...iconStyle, size: "small", paddingTop: 5}}
                onClick={onImageUpload}
                {...dragProps}
              >
                Click or Drop here
              </InsertPhotoIcon>
            </div>
          )}
        </ImageUploading>
      </Fragment>
    )

}

export default ImageUpload