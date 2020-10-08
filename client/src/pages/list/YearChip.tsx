import React, {Fragment, useState} from 'react';
import { State, WordData } from '../../types';
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
import { addChunkIntoData } from '../../redux/actions';
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

  const handleChipClick = (data: any) => {
    setSelectedYear({year: data.year, sem: data.sem}); // Select
    // Check if the data is already available (else, just return)
    let found: boolean = false;
    if(words.length !== 0) 
      found = words.find((datum: WordData) => datum.year === data.year && datum.sem === data.sem) !== undefined;
    // Not Found? Start Downloading.
    if(!found) {
      axios.get(`/api/v2/mongo/words/section/${user.ID}/${data.year}/${data.sem}`, API.getAuthorization())
        .then(res => store.dispatch(addChunkIntoData({
          year: data.year,
          sem: data.sem,
          data: res.data.payload
        })))
        .catch(err => console.log(err))
    }
  };

  const yearChipList = years.length > 0 
    ? years.map(datum => (
        <Chip 
          key={`${datum.year}${datum.sem}`} 
          clickable
          label={`${datum.year}${tr.year[ln]} ${datum.sem}${tr.sem[ln]}`} 
          onClick={() => handleChipClick(datum)}
          color={(datum.year === selectedYear.year && datum.sem === selectedYear.sem) ? 'primary' : 'default'}
        />
      ))
    : null;

  let wordCards = null;
  if(words.length > 0) {
    const checkIfFound = words.find(datum => datum.year === selectedYear.year && datum.sem === selectedYear.sem)
    if(checkIfFound)
      wordCards =  checkIfFound.data.map(datum => (
        <WordCard key={datum._id} word={datum} />
      ));
    else wordCards = null;
  }
    

  return (
    <Fragment>
      <div className={classes.root}>
        {yearChipList}
      </div>
      <Grid style={{textAlign: 'center'}}>
        {wordCards} 
      </Grid>
    </Fragment>
    
  );
}

export default YearChip;