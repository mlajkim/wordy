/**
 * 
 * 오직 Encrpyted된 단어카드만 사진을 갖고있을 수 있음.
 */
import { FC, useState, Fragment } from 'react'
import Highlighter from "react-highlight-words"
import './wc.css'
// Type
import { State } from '../../types'
import { LegacyPureWord } from '../../type/legacyType'
import { convertSem } from '../../utils'
import { languageCodeIntoUserFriendlyFormat } from '../../type/sharedWambda'
import { fontDark, fontLight, wordCardDark, wordCardLight } from '../../theme'
// import { encryptedButtonLight, encryptedButtonDark, unencryptedButtonDark, unencryptedButtonLight } from '../../theme'} // used for encryption and decrpytion
// import tr from './encrypted_word_card.tr.json' // used for encryption and decrpytion
import trEncrpytionProgress from './encryptionProgress.tr.json'
import { WordEditWordsInput } from '../../type/payloadType'
// import { WordsEncryptWordsInput, WordsEncryptWordsPayload } from '../../type/payloadType'
// Lambda
import { convertLegacyWordIntoPureWord, throwEvent } from '../../frontendWambda'
// MUI
// import Tooltip from '@mui/material/Tooltip' // used for encryption and decrpytion
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Chip from '@material-ui/core/Chip'
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress'
// Icons
// import EncryptedIcon from '@mui/icons-material/Check' // used for encryption and decryption
// import LockOpenIcon from '@mui/icons-material/LockOpen' // used for encryption and decryption
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import FavoriteTwoToneIcon from '@material-ui/icons/FavoriteTwoTone'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import StatIcon from '@material-ui/icons/Equalizer'
import StarReviewIocn from '@material-ui/icons/PlayArrow'
// Redux
import store from '../../redux/store'
import { useSelector } from 'react-redux'
// Redux Actions
import { setDialog } from '../../redux/actions'
import { newlyModifyWords } from '../../redux/actions/wordsAction'
const isEncrypting = false

type Props = { word: LegacyPureWord, highlighted?: string };
// @ MAIN
const EncryptedWordCard: FC<Props> = ({ word, highlighted }) => {
  const { support, language } = useSelector((state: State) => state)
  const ln = language
  const [ open, setOpen ] = useState(false)

  const tools = [
  // the disabled button is only temporary and will be deleted.
  { type: 'edit', icon: <EditIcon style={{ color: support.isDarkMode ? fontDark : fontLight }}/>, disabled: false},
  { type: 'delete', icon: <DeleteIcon style={{ color: support.isDarkMode ? fontDark : fontLight }} />, disabled: false},
  { type: 'stat', icon: <StatIcon />, disabled: true},
  { type: 'reviewStart', icon: <StarReviewIocn />, disabled: true}
];
  
  // temporary

  type Type = 'like' | 'edit' | 'delete' | 'stat' | 'reviewStart'

  const handleToolClick = (type: Type) => {
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

      // ! 1) Modify Front First for the speed!
      store.dispatch(newlyModifyWords({
        type: "update", data: input
      })) 

      // ! 2) Change the backend too!
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

  // Render Tags
  const tags = word.tag.length === 0
    ? null
    : word.tag.map(tag => (
      <Chip key={tag} label={`#${tag}`} variant="outlined" size="small" />
    ));

  const RenderEncryptingStatus = (
    <div style={{ display: 'flex', justifyContent: 'center' }} >
      <Box sx={{ width: '80%', minHeight: 100 }}>
        <Typography style={{ marginTop: 24, marginBottom: 14 }}>
          {trEncrpytionProgress.encrypting[ln]}...
        </Typography>
        <LinearProgress />
      </Box>
    </div>
  )
  const RenderCardContents = (
    <Fragment>
      <CardContent>
        <Typography gutterBottom>
          {`${convertSem(word.sem).year}-${convertSem(word.sem).sem}`}
        </Typography>
        <Typography variant="h5" component="h2">
          <Highlighter 
            textToHighlight={word.word ? word.word : ""} 
            highlightClassName="highlighted"
            searchWords={[targetWord]} autoEscape={true}
          />
        </Typography>
        <Typography >
          {word.pronun}
        </Typography>
        <Typography variant="body2" component="p">
          <Highlighter 
            textToHighlight={word.meaning ? word.meaning : ""} 
            highlightClassName="highlighted"
            searchWords={[targetWord]} autoEscape={true}
          />
        </Typography>
        <Typography variant="body2" component="h4" >
          { word.example && "\"" }
          <Highlighter 
            textToHighlight={word.example ? word.example : ""} 
            highlightClassName="highlighted"
            searchWords={[targetWord]} autoEscape={true}
          />
          { word.example && "\"" }
        </Typography>
      </CardContent>
      <Chip label={`#${languageCodeIntoUserFriendlyFormat(word.language)}`} variant="outlined" size="small" />
      { tags }
      <CardActions>
        <IconButton size="small" onClick={() => handleToolClick('like')} >
          {word.isFavorite
            ? <FavoriteTwoToneIcon style={{color: 'red'}}/>
            : <FavoriteBorderIcon style={{ color: support.isDarkMode ? fontDark : fontLight }}/>
          }
        </IconButton>
        {!open && (
          <IconButton onClick={() => setOpen(!open)}size="small" color="inherit" >
            <ArrowRightIcon />
          </IconButton>
        )}
        { open &&
          tools.map(tool => (
            // the disabled button is only temporary and will be deleted.
            <IconButton disabled={tool.disabled ? true : false} key={tool.type} size="small" color="inherit" onClick={() => handleToolClick(tool.type as Type)}>
              {tool.icon}
            </IconButton>
          ))
        }
      </CardActions>
    </Fragment>
  )

  // Return
  return (
    <Card style={{width: '100%', marginBottom: 10, 
      background: support.isDarkMode ? wordCardDark : wordCardLight, 
      color: support.isDarkMode ? fontDark : fontLight 
    }}>
      { isEncrypting ? RenderEncryptingStatus : RenderCardContents }
    </Card>
  );
}
 
export default EncryptedWordCard
 
 /**
  * 
  * Below code was used in Ocotber, 2021 as to show the end user if the word itself is encrypted or npt
  * Yet was banned due to its slowness.

 {word.isEncrypted
          ? <Tooltip title={tr.thisDataIsEncrypted[ln]} placement="top">  
              <EncryptedIcon style={{ color: support.isDarkMode ? encryptedButtonDark : encryptedButtonLight }}/>
            </Tooltip>
          : <Tooltip title={tr.notEncrypted[ln]} placement="top">
              <IconButton onClick={() => hdlEncryptionBeginHdl()}size="small" color="inherit" >
                <LockOpenIcon style={{ color: support.isDarkMode ? unencryptedButtonDark : unencryptedButtonLight }}/>
              </IconButton>  
            </Tooltip>
        }
  */


/*
  The following function was used for the encrypting method
  const hdlEncryptionBeginHdl = () => {
    setEncrypting(true)
    const input: WordsEncryptWordsInput = { words: [word]}
    throwEvent("word:encryptWords", input)
    .then(FE => {
      if (FE.serverResponse !== "Accepted") { setEncrypting(false); return }

      // The length should be one, for this word card
      const latestFormatWords = FE.payload as WordsEncryptWordsPayload
      if (latestFormatWords.length !== 1) { 
        setEncrypting(false)
        store.dispatch(setSnackbar("FAILED TO ENCRYPT", 'warning')); return
      }

      store.dispatch(newlyEncryptWords(latestFormatWords))
      setEncrypting(false)
    })
  }
*/