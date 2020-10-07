import React, {useEffect, useState} from 'react';
import { State, WordData } from '../../types';
import axios from 'axios';
import * as API from '../../API';
// Material UI
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
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
  const [selectedYear, setSelectedYear] = useState(null);
  // Redux states
  const {language, user, years, words} = useSelector((state: State) => state);
  const ln = language;

  const handleChipClick = (data: any) => {
    setSelectedYear(data.year); // Select
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
    ? years.map(data => (
        <Chip 
          key={data.year} 
          clickable
          label={`${data.year}${tr.year[ln]} ${data.sem}${tr.sem[ln]}`} 
          onClick={() => handleChipClick(data)}
          color={data.year === selectedYear ? 'primary' : 'default'}
        />
      ))
    : null;

  return (
    <div className={classes.root}>
      {yearChipList}
    </div>
  );
}

export default YearChip;