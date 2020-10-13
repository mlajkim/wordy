import React, {Fragment, useState} from 'react';
import {convertSem, countryCodeIntoLanguage} from '../../utils';
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
import {getWords} from '../../redux/actions/wordsAction';
import {useSelector} from 'react-redux';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(0.5),
      }
    },
  }),
);



// @ MAIN
const YearChip = () => {
  const classes = useStyles();
  // Component state
  const [selectedSem, setSelectedSem] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  // Redux states
  const {language, support, words} = useSelector((state: State) => state);
  const ln = language;
  const propriateWordsChunk = words.find((datus: WordsChunk) => datus[0].sem === selectedSem);
  const handleChipClick = (sem: number) => {
    setTags([]);
    setSelectedTags([]); // by defalt
    if (selectedSem === sem) {
      setSelectedSem(0);
      return;
    };
    
    setSelectedSem(sem); 
    let found: boolean = false;
    if(words.length !== 0) 
      found = words.find((datum: WordsChunk) => datum[0].sem === sem) !== undefined ? true : false;
    // Not Found? Start Downloading.
    if(found === false) {
      // handle ownloading the data
      store.dispatch(getWords(sem));
    }
  };

  const handleClickTag = (tag: string) => {
    
    const hasFound = selectedTags.find((selectedTag => selectedTag === tag));
    if (hasFound === undefined) {
      setSelectedTags([...selectedTags, tag]);
    }
    else {
      setSelectedTags(selectedTags.filter(elem => elem !== hasFound));
    }
  }

  const hasFound = words.find((datum: WordsChunk) => datum[0].sem === selectedSem)
  if(hasFound !== undefined) {
    hasFound.forEach(word => {
      const {language, tag} = word;
      const convertedLanguage = countryCodeIntoLanguage(language);
      if (tags.findIndex(elem => elem === convertedLanguage) === -1) setTags([...tags, convertedLanguage])
    })
  }

  const handleClickAll = (tag: string) => {
    setSelectedTags([tag]);
  }
      

  return (
    <Fragment>
      <Grid style={{textAlign: 'center'}}>
        {support.sems.length === 0 
          ? null
          : (
            support.sems.map((sem: number) => (
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
      <Grid style={{textAlign: 'center', margin: 8}}>
        {selectedSem === 0 
          ? null
          : <Fragment>
              <Chip 
                clickable
                label={tr.all[ln]} 
                onClick={() => handleClickAll(tr.all[ln])}
                color={selectedTags.findIndex(selectedTag => selectedTag === tr.all[ln]) !== -1 ? 'primary' : 'default'}
              />
              <Chip 
                clickable
                label={tr.favorite[ln]} 
                onClick={() => handleClickTag(tr.favorite[ln])}
                color={selectedTags.findIndex(selectedTag => selectedTag === tr.favorite[ln]) !== -1 ? 'primary' : 'default'}
              />
              <Chip 
                clickable
                label={tr.today[ln]} 
                onClick={() => handleClickTag(tr.today[ln])}
                color={selectedTags.findIndex(selectedTag => selectedTag === tr.today[ln]) !== -1 ? 'primary' : 'default'}
              />
              {
                tags.map((tag: string) => (
                  <Chip 
                    key={tag} 
                    clickable
                    label={tag} 
                    onClick={() => handleClickTag(tag)}
                    color={selectedTags.findIndex(selectedTag => selectedTag === tag) !== -1 ? 'primary' : 'default'}
                  />
                ))
              }
            </Fragment>
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