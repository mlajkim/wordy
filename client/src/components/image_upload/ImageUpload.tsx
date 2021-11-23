import { FC, useState, Fragment } from 'react'
// Type
import { StaticAskPermissionForPostStaticInput, StaticPostStaticInput } from '../../type/payloadType';
// Library
import ImageUploading, { ImageListType } from 'react-images-uploading'
// MUI Icon
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { throwEvent } from '../../frontendWambda';
import LoadingFbStyle from '../loading_fbstyle/LoadingFbStyle';

const UPLOADING_ONCE_MAX_NUM = 1
type ImageUploadProps = {
  iconStyle: any
}
const ImageUpload: FC<ImageUploadProps> = ({ iconStyle }) => {
    const [images, setImages] = useState<ImageListType>([])
    const [isLoading, setLoading] = useState(false)

    const onChange = (imageList: ImageListType) => {
      const askPermissionForPostStaticInput: StaticAskPermissionForPostStaticInput = {
        totalFileSize: imageList.reduce((total, image) => total + (image.file ? image.file.size : 0), 0),
        numberOfFiles: imageList.length
      }

      throwEvent("static:askPermissionForPostStatic", askPermissionForPostStaticInput, setLoading)
        .then(RE => {
          if (RE.serverResponse !== "Accepted") return;
            console.log(imageList)
            setImages(imageList);
        })

      const postStaticInput: StaticPostStaticInput = {
        ...askPermissionForPostStaticInput,
        // Put data 
        fileData: imageList.map(image => image.dataURL ? image.dataURL : "").filter(data => data !== "")
      }
      throwEvent("static:postStatic", postStaticInput, setLoading)
      .then(RE => {
        if (RE.serverResponse !== "Accepted") return
        
      })

      
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
              {isLoading
                ? <LoadingFbStyle />
                : <InsertPhotoIcon 
                    style={isDragging ? { color: 'red' } : {...iconStyle, size: "small", paddingTop: 5}}
                    onClick={onImageUpload}
                    {...dragProps}
                  />
              }
            </div>
          )}
        </ImageUploading>
      </Fragment>
    )

}

export default ImageUpload