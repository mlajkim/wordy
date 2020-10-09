import React from 'react';
import { Word } from '../../types';
// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
// Icons
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

const useStyles = makeStyles({
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
  },
});

type Props = { word: Word };
// @ MAIN
const WordCard: React.FC<Props> = ({word: {
  _id, year, sem, word, pronun, meaning
}}) => {
  const classes = useStyles();

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
        
        <Button disabled size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}

export default WordCard;
