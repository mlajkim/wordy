import React, {Fragment, useState} from 'react';
import {convertSem} from '../../utils';
import { State, WordsChunk } from '../../types';
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
import {syncWords} from '../../redux/actions/words';
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
  const [selectedSem, setSelectedSem] = useState(0);
  // Redux states
  const {language, supports, user, years, words} = useSelector((state: State) => state);
  const ln = language;
  const propriateWordsChunk = words.find((datus: WordsChunk) => datus[0].sem === selectedSem);

  const handleChipClick = (sem: number) => {
    setSelectedSem(sem); 

    let found: boolean = false;
    if(words.length !== 0) 
      found = words.find((datum: WordsChunk) => datum[0].sem === sem) ? true : false;
    // Not Found? Start Downloading.
    if(found === false) {
      // handle ownloading the data
      store.dispatch(syncWords(sem));
    }
  };

  return (
    <Fragment>
      <Grid style={{textAlign: 'center'}}>
        {supports.sem.length === 0 
          ? null
          : (
            supports.sem.map((sem: number) => (
              <Chip 
                key={sem} 
                clickable
                label={`${convertSem(sem).year}${tr.year[ln]} ${convertSem(sem).sem}${tr.sem[ln]}`} 
                onClick={() => handleChipClick(sem)}
                color={(sem === selectedSem) ? 'primary' : 'default'}
              />
            ))
          )
        }
      </Grid>
      {words.length === 0 
      ? null
      : propriateWordsChunk && propriateWordsChunk.map(datus => <WordCard key={datus._id} word={datus} />)
      }
    </Fragment>
  );
}

export default YearChip;