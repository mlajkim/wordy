// Import the basics
import React from 'react';

// Import Bootstrap
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function LoadingAnimationStyle () {
  const classes = useStyles();

  return(
    <Backdrop className={classes.backdrop} open="true">
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}

export default LoadingAnimationStyle;