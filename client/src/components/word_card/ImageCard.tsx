import { FC, useState, Fragment, useEffect } from 'react'
// Type 
import { LegacyPureWord } from '../../type/legacyType'
import { State } from '../../types'
import { WordActions } from './WordCard'
import { fontDark, fontLight, wordCardDark, wordCardLight } from '../../theme'
import { WordEditWordsInput } from '../../type/payloadType'
// Lambda
import { convertLegacyWordIntoPureWord, throwEvent } from '../../frontendWambda'
// Library
import Highlighter from "react-highlight-words"
// MUI
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions, IconButton } from '@mui/material';
// MUI Icons
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import FavoriteTwoToneIcon from '@material-ui/icons/FavoriteTwoTone'
// Redux
import store from '../../redux/store'
// import store from '../../redux/store'
import { useSelector } from 'react-redux'
// Redux Actions
import { setDialog } from '../../redux/actions'
import { newlyModifyWords } from '../../redux/actions/wordsAction'

const IMAGE_NOT_FOUND_PATH = "/static/image_not_found.png"

const ImageCard: FC<{ word: LegacyPureWord, highlighted?: string}> = ({
  word, highlighted
}) => {
  const { support, language } = useSelector((state: State) => state)
  const ln = language

  const [imageLinks, setImageLinks] = useState<string[]>([IMAGE_NOT_FOUND_PATH])
  const [imageLinkIdx, setImageLinkIdx] = useState<0>(0)

  const iconStyle = { color: support.isDarkMode ? fontDark : fontLight }
  const tools = [
    // the disabled button is only temporary and will be deleted.
    { type: 'edit', icon: <EditIcon style={iconStyle}/>, disabled: false },
    { type: 'delete', icon: <DeleteIcon style={iconStyle} />, disabled: false },
    { type: 'addImage', icon: <InsertPhotoIcon style={iconStyle} />, disabled: true }
  ];

  const handleToolClick = (type: WordActions) => {
    switch(type) {
      case 'like':
      const input: WordEditWordsInput = [convertLegacyWordIntoPureWord({
        // BELOW is only chnaged
        isFavorite: !word.isFavorite,
        // Below is NOT changed here.
        imageWrns: word.imageWrns, sem: word.sem,
        tag: word.tag, word: word.word, pronun: word.pronun, meaning: word.meaning, 
        example: word.example, language: word.language,
      }, word)]

      store.dispatch(newlyModifyWords({
        type: "update", data: input
      })) 
      throwEvent("word:editWords", input)
      break;

      case 'delete':
        store.dispatch(setDialog('ConfirmDelete', [word]))
        break;

      case 'edit':
        store.dispatch(setDialog('EditWord', word))
        break;
      
      default:
        return
    }
  };

  // get_link
  useEffect(() => {
    if (word.imageWrns.length === 0) {
    }
    // currently only accept one image per word

  }, [setImageLinks])

  const targetWord = highlighted ? support.highlightSearched ? highlighted : "" : ""

  const wordAndPronun = `${word.word}${word.pronun ? ` [${word.pronun}]` : ""}`

  return (
    <Card sx={{ 
      maxWidth: 345,
      marginBottom: 1, 
      background: support.isDarkMode ? wordCardDark : wordCardLight, 
      color: support.isDarkMode ? fontDark : fontLight
    }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={setImageLinks.length > 0 ? imageLinks[imageLinkIdx] : IMAGE_NOT_FOUND_PATH}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            <Highlighter
              textToHighlight={wordAndPronun} 
              highlightClassName="highlighted"
              searchWords={[targetWord]} autoEscape={true}
            />
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <Highlighter
              textToHighlight={word.meaning ? word.meaning : ""} 
              highlightClassName="highlighted"
              searchWords={[targetWord]} autoEscape={true}
            />
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
      <IconButton size="small" onClick={() => handleToolClick('like')} >
        {word.isFavorite
            ? <FavoriteTwoToneIcon style={{color: 'red'}}/>
            : <FavoriteBorderIcon style={{ color: support.isDarkMode ? fontDark : fontLight }}/>
          }
        </IconButton>
        {
          tools.map(tool => (
            // the disabled button is only temporary and will be deleted.
            <IconButton disabled={tool.disabled ? true : false} key={tool.type} size="small" color="inherit" onClick={() => handleToolClick(tool.type as WordActions)}>
              {tool.icon}
            </IconButton>
          ))
        }
      </CardActions>
    </Card>
  )
}

export default ImageCard