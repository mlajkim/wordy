/**
 * 
 * 오직 Encrpyted된 단어카드만 사진을 갖고있을 수 있음.
 */
 import { FC, useState } from 'react'
 import Highlighter from "react-highlight-words"
 import './wc.css'
 // Type
 import { State } from '../../types'
 import { LegacyPureWord } from '../../type/legacyType'
 import { convertSem } from '../../utils'
 import { languageCodeIntoUserFriendlyFormat } from '../../type/sharedWambda'
 import { 
   fontDark, fontLight, wordCardDark, wordCardLight, encryptedButtonLight, encryptedButtonDark,
   unencryptedButtonDark, unencryptedButtonLight } from '../../theme'
 import tr from './encrypted_word_card.tr.json'
 import { WordEditWordsInput } from '../../type/payloadType'
 // Lambda
 import { convertLegacyWordIntoPureWord, throwEvent } from '../../frontendWambda'
 // Material UI
 import Tooltip from '@mui/material/Tooltip'
 import Card from '@material-ui/core/Card'
 import CardActions from '@material-ui/core/CardActions'
 import CardContent from '@material-ui/core/CardContent'
 import Typography from '@material-ui/core/Typography'
 import IconButton from '@material-ui/core/IconButton'
 import Chip from '@material-ui/core/Chip'
 // Icons
 import EncryptedIcon from '@mui/icons-material/Check'
 import LockOpenIcon from '@mui/icons-material/LockOpen'
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
          imageWrn: word.imageWrn, sem: word.sem,
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
 
   // Return
   return (
     <Card style={{width: '100%', marginBottom: 10, 
       background: support.isDarkMode ? wordCardDark : wordCardLight, 
       color: support.isDarkMode ? fontDark : fontLight 
     }}>
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
        {word.isEncrypted
          ? <Tooltip title={tr.thisDataIsEncrypted[ln]} placement="top">  
              <EncryptedIcon style={{ color: support.isDarkMode ? encryptedButtonDark : encryptedButtonLight }}/>
            </Tooltip>
          : <Tooltip title={tr.notEncrypted[ln]} placement="top">  
              <LockOpenIcon style={{ color: support.isDarkMode ? unencryptedButtonDark : unencryptedButtonLight }}/>
            </Tooltip>
        }
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
     </Card>
   );
 }
 
 export default EncryptedWordCard;
 