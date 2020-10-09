import React, {Fragment} from 'react';
import { Word } from '../../types';
// Material UI
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
// Icons
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import StatIcon from '@material-ui/icons/Equalizer';
import StarReviewIocn from '@material-ui/icons/PlayArrow';

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

const Tools: React.FC = () => {
  return (
    <Fragment>
      <EditIcon />
    </Fragment>
  )
}

type Props = { word: Word };
// @ MAIN
const WordCard: React.FC<Props> = ({word: {
  _id, year, sem, word, pronun, meaning
}}) => {
  const classes = useStyles();
  // Component states
  const [open, setOpen] = React.useState(false);

  const tools = [
    { type: 'edit', icon: <EditIcon />},
    { type: 'delete', icon: <DeleteIcon />},
    { type: 'stat', icon: <StatIcon />},
    { type: 'reviewStart', icon: <StarReviewIocn />}
  ];

  const handleToolClick = (type: string) => {

  }

  return (
    <Card style={{width: '90%', margin: 15}}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {year}-{sem}
        </Typography>
        <Typography variant="h5" component="h2">
          {word}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {pronun}
        </Typography>
        <Typography variant="body2" component="p">
          {meaning}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton disabled size="small" color="inherit" >
          <FavoriteBorderIcon />
        </IconButton>
        <IconButton onClick={() => setOpen(!open)}size="small" color="inherit" >
          {open ? <ArrowLeftIcon /> : <ArrowRightIcon />}
        </IconButton>
        { open &&
          tools.map(tool => (
            <IconButton key={tool.type} size="small" color="inherit" onClick={() => handleToolClick(tool.type)}>
              {tool.icon}
            </IconButton>
          ))
        }
      </CardActions>
    </Card>
  );
}

export default WordCard;
