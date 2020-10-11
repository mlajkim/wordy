import React from 'react';
import { Word } from '../../types';
// Material UI
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
// Icons
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import StatIcon from '@material-ui/icons/Equalizer';
import StarReviewIocn from '@material-ui/icons/PlayArrow';
// Redux
import store from '../../redux/store';
import {setDialog} from '../../redux/actions';

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    }
  })
);

type Props = { word: Word };
// @ MAIN
const WordCard: React.FC<Props> = ({word}) => {
  const classes = useStyles();
  // Component states
  const [open, setOpen] = React.useState(false);

  const tools = [
    // the disabled button is only temporary and will be deleted.
    { type: 'edit', icon: <EditIcon />, disabled: true},
    { type: 'delete', icon: <DeleteIcon />, disabled: false},
    { type: 'stat', icon: <StatIcon />, disabled: true},
    { type: 'reviewStart', icon: <StarReviewIocn />, disabled: true}
  ];
  
  // temporary

  type Type = 'like' | 'edit' | 'delete' | 'stat' | 'reviewStart';

  const handleToolClick = (type: Type) => {
    switch(type) {
      case 'delete':
        store.dispatch(setDialog('ConfirmDelete', {word}));
        break;
      
      default:
        return
    }
  }

  return (
    <Card style={{width: '90%', margin: 15}}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {Math.floor(word.sem / 10)}-{word.sem % 10}
        </Typography>
        <Typography variant="h5" component="h2">
          {word.word}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {word.pronun}
        </Typography>
        <Typography variant="body2" component="p">
          {word.meaning}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton disabled size="small" color="inherit" onClick={() => handleToolClick('like')} >
          <FavoriteBorderIcon />
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
