import React from 'react';
// Type
import { State, Word } from '../../types';
import { convertSem } from '../../utils';
import { languageCodeIntoUserFriendlyFormat } from '../../type/sharedWambda';
import { fontDark, fontLight, wordCardDark, wordCardLight } from '../../theme';
// Material UI
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
// Icons
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteTwoToneIcon from '@material-ui/icons/FavoriteTwoTone';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import StatIcon from '@material-ui/icons/Equalizer';
import StarReviewIocn from '@material-ui/icons/PlayArrow';
// Redux
import store from '../../redux/store';
import { useSelector } from 'react-redux';
// Redux Actions
import { modifySupport } from '../../redux/actions/supportAction';
import { setDialog } from '../../redux/actions';
import { modifyWords } from '../../redux/actions/wordsAction';

type Props = { word: Word, highlighted?: string };
// @ MAIN
const WordCard: React.FC<Props> = ({ word, highlighted }) => {
  const { support } = useSelector((state: State) => state);
  // Component states
  const [open, setOpen] = React.useState(false);

  const tools = [
    // the disabled button is only temporary and will be deleted.
    { type: 'edit', icon: <EditIcon />, disabled: false},
    { type: 'delete', icon: <DeleteIcon />, disabled: false},
    { type: 'stat', icon: <StatIcon />, disabled: true},
    { type: 'reviewStart', icon: <StarReviewIocn />, disabled: true}
  ];
  
  // temporary

  type Type = 'like' | 'edit' | 'delete' | 'stat' | 'reviewStart';

  const handleToolClick = (type: Type) => {
    switch(type) {
      case 'like':
        store.dispatch(modifySupport({ searchingBegins: true }, true));
        store.dispatch(modifyWords(word.sem, [{wordID: word._id, payload: {isFavorite: !word.isFavorite}}]));
        break;

      case 'delete':
        store.dispatch(setDialog('ConfirmDelete', {sem: word.sem ,IDs: [{ID: word._id}]}));
        break;

      case 'edit':
        store.dispatch(setDialog('EditWord', {prevWord: word, sem: word.sem ,IDs: [{ID: word._id}]}));
        break;
      
      default:
        return
    }
  };

  const highlighter = support.highlightSearched ? highlighted ? highlighted : false : false
  const wordSplited = highlighter && word.word ? word.word.indexOf(highlighter) !== -1 ? word.word.split(highlighter) : false : false
  const meaningSplited = highlighter && word.meaning ? word.meaning.indexOf(highlighter) !== -1 ? word.meaning.split(highlighter) : false : false
  const exampleSplited = highlighter && word.example ? word.example.indexOf(highlighter) !== -1 ? word.example.split(highlighter) : false : false

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
          {!wordSplited && word.word}
          {wordSplited && wordSplited[0]}
          {wordSplited && <span style={{ backgroundColor: "yellow", color: fontLight }}>{highlighted}</span>}
          {wordSplited && wordSplited[1]}
        </Typography>
        <Typography >
          {word.pronun}
        </Typography>
        <Typography variant="body2" component="p">
          {!meaningSplited && word.meaning}
          {meaningSplited && meaningSplited[0]}
          {meaningSplited && <span style={{ backgroundColor: "yellow", color: fontLight }}>{highlighted}</span>}
          {meaningSplited && meaningSplited[1]}
        </Typography>
        <Typography variant="body2" component="h4" >
          {!exampleSplited && word.example}
          {exampleSplited && exampleSplited[0]}
          {exampleSplited && <span style={{ backgroundColor: "yellow", color: fontLight }}>{highlighted}</span>}
          {exampleSplited && exampleSplited[1]}
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
    </Card>
  );
}

export default WordCard;
