import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const loadingStyle = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));

function LoadingAnimation() {
  const classes = loadingStyle();

  return (
    <div className={classes.root}>
      <CircularProgress />
      <CircularProgress color="inherit" />
    </div>
  );
}


export default function Appbar(props) {
  // Styles
  //
  const classes = useStyles();

  // Navigation for page
  //
  const pages = ['welcome', 'introduce', 'list', 'review'];
  let showPages = pages.map(page => {
    return (
      <Button key={page} color="inherit" onClick={() => props.setPage(page)}>{page}</Button>
    )
  })


  // Loading animation
  //
  let displayLoadingAnimation = props.isDataLoading ? <LoadingAnimation /> : null;


  // Render
  //
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Wordy Project
          </Typography>
          {displayLoadingAnimation}
          {showPages}
          <Avatar alt={`${props.profile.familyName} ${props.profile.givenName}`} 
                  src={props.profile.profileImgUrl}
                  onClick={() => {props.setPage('setting')}}/>
        </Toolbar>
      </AppBar>
    </div>
  );
}