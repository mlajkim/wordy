import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    minWidth: 400,
  },
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

export default function Wordcard(props) {
  const classes = useStyles();
  const word = props.word;

  let wordInCard, pronunciation, definition, exampleSentence;

  wordInCard = <Typography variant="h5" component="h2">{word.word}</Typography>;
  if(props.pronunciation) {
    pronunciation = <Typography className={classes.pos} color="textSecondary"> {word.pronunciation}</Typography>
  }
  if(props.exampleSentence) {
    exampleSentence = (
      <div>
        <br />
        "{word.exampleSentence}"
      </div>
    );
  }
  if(props.definition) {
    definition = (
      <Typography variant="body2" component="p">
        {word.definition}
        {exampleSentence}
      </Typography>
    )
  }

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {word.semester}th semester of {word.year}
        </Typography>
        {wordInCard}
        {pronunciation}
        {definition}
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}