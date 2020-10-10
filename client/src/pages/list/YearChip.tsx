import React, {Fragment, useState} from 'react';
import { State } from '../../types';
import axios from 'axios';
import * as API from '../../API';
// Components
import WordCard from '../../components/word_card/WordCard';
// Material UI
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid'
// Translation
import tr from './year_chip.tr.json';
// Redux
import store from '../../redux/store';
import { } from '../../redux/actions';
import {useSelector} from 'react-redux';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(0.5),
      },
    },
  }),
);

// @ MAIN
const YearChip = () => {
  const classes = useStyles();
  // Component state
  const [selectedYear, setSelectedYear] = useState({year: 0, sem: 0});
  // Redux states
  const {language, user, years, words} = useSelector((state: State) => state);
  const ln = language;

  return (
    <Fragment>
      <Grid style={{textAlign: 'center'}}>
      </Grid>
    </Fragment>
    
  );
}

export default YearChip;