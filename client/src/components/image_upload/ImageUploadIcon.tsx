import { FC, useState, Fragment } from 'react'
// Type
import { StaticAskPermissionForPostStaticInput, StaticPostStaticInput, StaticPostStaticPayload } from '../../type/payloadType';
import { LegacyPureWord } from '../../type/legacyType'
// Lambda
import { convertLegacyWordIntoPureWord } from '../../type/sharedWambda'
// Library
import ImageUploading, { ImageListType } from 'react-images-uploading'
// MUI Icon
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { throwEvent } from '../../frontendWambda';
import LoadingFbStyle from '../loading_fbstyle/LoadingFbStyle';
// Redux
import store from '../../redux/store'
// Redux Actions
import { newlyModifyWords } from '../../redux/actions/wordsAction'

const UPLOADING_ONCE_MAX_NUM = 1
type ImageUploadProps = {
  iconStyle: any, word: LegacyPureWord
}
const ImageUpload: FC<ImageUploadProps> = ({ iconStyle, word }) => {
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
        objectWrn: word.wrn,
        word: word, 
        fileData: imageList.map(image => image.data_url ? image.data_url : "").filter(data => data !== "")
      }
      throwEvent("static:postStatic", postStaticInput, setLoading)
      .then(RE => {
        if (RE.serverResponse !== "Accepted") return

        const { addedStaticWrns } = RE.payload as StaticPostStaticPayload
        const converted = convertLegacyWordIntoPureWord({
          // Below is changed here.
          imageWrns: [...word.imageWrns, ...addedStaticWrns], sem: word.sem,
          // Below is NOT changed
          tag: word.tag, word: word.word, pronun: word.pronun, meaning: word.meaning, example: word.example, 
          language: word.language, isFavorite: word.isFavorite
        }, word)

        store.dispatch(newlyModifyWords({
          type: "update", data: [converted]
        })) 
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