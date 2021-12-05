import { FC, useState, useEffect } from 'react'
// Type 
import { LegacyPureWord } from '../../type/legacyType'
import { State } from '../../types'
import { WordActions } from './WordCard'
import { fontDark, fontLight, wordCardDark, wordCardLight } from '../../theme'
import { StaticGetStaticInput, StaticGetStaticPayload, WordEditWordsInput } from '../../type/payloadType'
// Lambda
import { convertLegacyWordIntoPureWord, throwEvent } from '../../frontendWambda'
// Library
import Highlighter from "react-highlight-words"
// MUI
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { CardActionArea, CardActions, IconButton } from '@mui/material'
// MUI Icons
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone'
// Redux
import store from '../../redux/store'
// import store from '../../redux/store'
import { useSelector } from 'react-redux'
// Redux Actions
import { setDialog } from '../../redux/actions'
import { newlyModifyWords } from '../../redux/actions/wordsAction'
import LoadingFbStyle from '../loading_fbstyle/LoadingFbStyle'

const IMAGE_NOT_FOUND_PATH = "/static/image_not_found.png"

const ImageCard: FC<{ word: LegacyPureWord, highlighted?: string}> = ({
  word, highlighted
}) => {
  const { support } = useSelector((state: State) => state)

  const [imageLinks, setImageLinks] = useState<string[]>([IMAGE_NOT_FOUND_PATH])
  const [isLoading, setLoading] = useState<boolean>(true)
  const imageLinkIdx = 0 

  // get_link
  useEffect(() => {
    if (word.imageWrns.length === 0) return

    // currently only accept one image per word
    const requesterInput: StaticGetStaticInput = {
      objectWrn: word.wrn,
      staticWrns: word.imageWrns
    }
    throwEvent("static:getStatic", requesterInput)
    .then(RE => {
      if (RE.serverResponse !== "Accepted") return

      const { urls } = RE.payload as StaticGetStaticPayload
      setImageLinks(urls)
    })
    .finally(() => setLoading(false))

  }, [word.wrn, word.imageWrns])

  const iconStyle = { color: support.isDarkMode ? fontDark : fontLight }
  const tools = [
    // the disabled button is only temporary and will be deleted.
    { type: 'edit', icon: <EditIcon style={iconStyle}/>, disabled: false },
    { type: 'delete', icon: <DeleteIcon />, disabled: true },
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

  const targetWord = highlighted ? support.highlightSearched ? highlighted : "" : ""
  // Joins word and pronun, handles even when pronun does not exist.
  const wordAndPronun = `${word.word}${word.pronun ? ` [${word.pronun}]` : ""}`

  return (
    <Card sx={{ 
      minWidth: 345,
      marginBottom: 1, 
      background: support.isDarkMode ? wordCardDark : wordCardLight, 
      color: support.isDarkMode ? fontDark : fontLight
    }}>
      <CardActionArea>
        {
          isLoading
            ? <LoadingFbStyle />
            : <CardMedia
                component="img"
                height="170"
                image={imageLinks.length > 0 ? imageLinks[imageLinkIdx] : IMAGE_NOT_FOUND_PATH}
                alt={word.word}
              />
        }
      </CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            <Highlighter
              textToHighlight={wordAndPronun} 
              highlightClassName="highlighted"
              searchWords={[targetWord]} autoEscape={true}
            />
          </Typography>
          <Typography variant="body2" color={support.isDarkMode ? fontDark : fontLight}>
            <Highlighter
              textToHighlight={word.meaning ? word.meaning : ""} 
              highlightClassName="highlighted"
              searchWords={[targetWord]} autoEscape={true}
            />
          </Typography>
        </CardContent>
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