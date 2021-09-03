import React, { Fragment, useLayoutEffect, useState, useEffect } from 'react';
// Type
import { Language } from '../../types';
// Translation
import tr from './search_bar.tr.json';
// Appbar
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
// MUI
import { alpha, makeStyles, Theme, createStyles } from '@material-ui/core/styles';
// MUI Icons
import SearchIcon from '@material-ui/icons/Search';
// Redux
// import store from '../../redux/store';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: alpha(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      minWidth: '240px',
      maxWidth: '720px',
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    }
  }),
);

const SearchBar: React.FC = () => {
  const classes = useStyles();
  // Redux State
  const language = useSelector((state: {language: Language}) => state.language);
  const ln = language;
  // State
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [searchBarLength, setSearchBarLength] = useState(720);


  // Get window size and apply, so that some of the functions may work!
  // FYI:  it fires synchronously after all DOM mutations, pretty much similar to useEffect
  useLayoutEffect(() => {
    const resize = () => {
      const newLength = window.innerWidth;
      setInnerWidth(newLength);
      
    };
    window.addEventListener('resize', resize);
  }, []);

  useEffect(() => {
    setSearchBarLength(innerWidth + 600);
  }, [innerWidth])

  const hdlSerachInputChange = (input: string) => {
    if (input.trim().length > 0) {

    }
  };

  const hdlClickSearchIcon = () => {};

  return (
    <Fragment>
      {innerWidth > 700
        ? <Fragment>
            <div className={classes.search} style={{ width: searchBarLength }}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder={tr.search[ln]}
                onChange={(e) => hdlSerachInputChange(e.target.value)}
                classes={{
                  root: classes.inputRoot,
                    input: classes.inputInput,
                  }}  
                  inputProps={{ 'aria-label': 'search' }}
                />
            </div>
          </Fragment>
        : <IconButton color="inherit" onClick={() => hdlClickSearchIcon()}>
            <SearchIcon fontSize="small" />
          </IconButton>
      }
    </Fragment>
  );  
};

export default SearchBar;