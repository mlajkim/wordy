import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import VERSION from '../../app/Version';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

export default function PromoteBox(props) {
  const price = props.type === 'free' ? 'FREE' : VERSION.price[props.type]
  const classes = useStyles();

  let explain = {
    free: `You can join our wordy community for free, forever.`,
    monthly: `You have an access to more features!`,
    yearly: `SAVE ${VERSION.price.saving}! You have an access to more features, with the cheaper price!`,
  }

  const handleClick = async () => {
    props.setModal('')
    
    // handle when it is free.
    if(props.type === 'free') {
      // Just put that they have been promoted.
      await fetch(`/api/user/${props.profile.UNIQUE_ID}/one/promotedDate`, {
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          value: Date.now()
        })
      });
    }

    // handle when it is monthly.
    else if(props.type === 'monthly') {
      
    }

    // handle when it is yearly.
    else if(props.type === 'yearly') {
      
    }

    else {
      // bug 
      console.log("WARNING: LOGICAL INACCURACY.");
    }

    // finally

    console.log("clicked! (delete later)")
  }

  // Handle body (Only visible whne Unique ID is available)
  let body;
  if(!props.profile.isSignedIn) {
    body = null;
  }else {
    body = (
    <Card className={classes.root} >
      <CardActionArea onClick={() => handleClick()}>
        <CardMedia
          className={classes.media}
          image={require(`./${props.type}.jpg`)}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {price} {price === 'FREE' ? null : props.type}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {explain[props.type]}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Select!
        </Button>
      </CardActions>
    </Card>)
  }

  return (
    <div>
      {body}
    </div>
  );
}
