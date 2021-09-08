import React, { Fragment, useLayoutEffect, useState } from 'react';
// Type
import { State } from '../../types';
// Translation
import tr from './search_bar.tr.json';
// Appbar
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
// MUI
import { alpha, makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
// MUI Icons
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
// Theme
import { buttonColorNonHover, buttonColorHover } from '../../theme';
// Redux
import store from '../../redux/store';
import { useSelector } from 'react-redux';
// Redux Action
import { modifySupport } from '../../redux/actions/supportAction';

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
    cancelIcon: {
      textAlign: 'right',
      marginTop: 0,
      marginRight: 4,
      color: buttonColorNonHover,
      '&:hover': {
        color: buttonColorHover,
      }
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
        width: '40ch',
      },
    }
  }),
);

const SearchBar: React.FC = () => {
  const classes = useStyles();
  // Redux State
  const { language, support } = useSelector((state: State) => state);
  const ln = language;
  // State
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [isCancelSearchVisible, setCancelSearchVisibility] = useState(false);

  // Get window size and apply, so that some of the functions may work!
  // FYI:  it fires synchronously after all DOM mutations, pretty much similar to useEffect
  useLayoutEffect(() => {
    const resize = () => {
      const newLength = window.innerWidth;
      setInnerWidth(newLength);
      
    };
    window.addEventListener('resize', resize);
  }, []);

  const hdlSerachInputChange = (input: string) => {
    const trimmedInput = input
    if (trimmedInput.length > 0) {
      store.dispatch(modifySupport({ searchData: trimmedInput }, true));
      setCancelSearchVisibility(true);
    } else {
      store.dispatch(modifySupport({ searchData: "" }, true));
      if (!support.extendedSearchBar) setCancelSearchVisibility(false);
    }

    // unextend if data is empty
    if (!support.extendedSearchBar && trimmedInput === "") {
      store.dispatch(modifySupport({ extendedSearchBar: false }, true));
    }
  };

  const hdlClickSearchIcon = () => {
    setCancelSearchVisibility(true);
    store.dispatch(modifySupport({ extendedSearchBar: true }, true));
  };

  const hdlCancelSearchIcon = () => {
    store.dispatch(modifySupport({ searchData: "" }, true));
    store.dispatch(modifySupport({ extendedSearchBar: false }, true));
    setCancelSearchVisibility(false);
  };

  return (
    <Fragment>
      {support.extendedSearchBar || innerWidth > 700
        ? <Fragment>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder={tr.search[ln]}
                onChange={(e) => hdlSerachInputChange(e.target.value)}
                value={support.searchData}
                classes={{
                  root: classes.inputRoot,
                    input: classes.inputInput,
                  }}  
                inputProps={{ 'aria-label': 'search' }}
                endAdornment={ isCancelSearchVisible &&
                  <InputAdornment position="end">
                    <IconButton className={classes.cancelIcon} size="small" onClick={() => hdlCancelSearchIcon()}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                }
      
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