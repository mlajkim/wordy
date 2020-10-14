import React, {Fragment, useState, useEffect} from 'react';
import {convertSem, countryCodeIntoLanguage, checkIfToday} from '../../utils';
import { State, WordsChunk } from '../../types';
import {Moment} from 'moment';
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
  // Redux states
  const {language, support, words} = useSelector((state: State) => state);
  const ln = language;
  // Component state
  const [allTag, setAllTag] = useState(true);
  const [selectedSem, setSelectedSem] = useState<number>(0);
  const [selectedNormalTags, setSelectedNormalTags] = useState<string[]>([]);
  const [normalTags, setNormalTags] = useState<string[]>([]);
  // Declare Special Tags
  const [favoriteTag, setFavoriteTag] = useState<boolean>(false);
  const [nowTag, setNowTag] = useState<boolean>(false);

  const handleSemChipClick = (sem: number) => {
    setNormalTags([]);
    setAllTag(true);
    // setSelectedNormalTags([tr.all[ln]]);
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

  useEffect(() => {
    if (support.sems.findIndex(sem => sem === selectedSem) === -1)
      setSelectedSem(0);
    
  }, [support.sems]);

  const handleAllTag = () => {
    if (allTag === true) {
      setAllTag(false)
      setSelectedNormalTags([]);
    }
    else {
      setAllTag(true)
      setSelectedNormalTags([]);
      setFavoriteTag(false); // Special Tags
      setNowTag(false); // Special Tags (Add below if new special tag implemented)
    }
  };

  const specialNormalShared = (tagsSelected: string[]) => {
    if (allTag) {
      setAllTag(false);
      return [];
    }
    return tagsSelected;
  }

  const handleSpecialTags = (tag: string) => {
    specialNormalShared(selectedNormalTags);
    // handleSpecialTags
    if(tag === tr.favorite[ln]) setFavoriteTag(!favoriteTag);
    else if(tag === tr.today[ln]) setNowTag(!nowTag);
  }

  const handleNormalTags = (tag: string) => {
    let prevSelectedTags = specialNormalShared(selectedNormalTags);
    // handleSpecialTags
    if(tag === tr.favorite[ln]) setFavoriteTag(!favoriteTag);
    else if(tag === tr.today[ln]) setNowTag(!nowTag);

    const hasFound = prevSelectedTags.find((selectedTag => selectedTag === tag));
    if (hasFound === undefined) {
      setSelectedNormalTags([...prevSelectedTags, tag]);
    }
    else {
      setSelectedNormalTags(prevSelectedTags.filter(elem => elem !== hasFound));
    }
  };

  // Filtering Algorithm
  const filteredWordsList = allTag
    ? words.find((datus: WordsChunk) => datus[0].sem === selectedSem)
    : words.find((datus: WordsChunk) => datus[0].sem === selectedSem)!
      .filter(word => favoriteTag ? word.isFavorite : true)
      .filter(word => nowTag ? checkIfToday(word.dateAdded) : true)
      .filter(word => {
        // languages & tags filter
        if (selectedNormalTags.length !== 0) {
          let flag = false;
          selectedNormalTags.forEach(tag => {
            if(!flag) flag = countryCodeIntoLanguage(word.language) === tag.substring(1)
            if(!flag) flag = word.tag.find(wordTag => wordTag === tag.substring(1)) !== undefined
          })
          return flag;
        } 

        return true;
      });

  
  // # Language & Tags Creating
  const hasFound = words.find((datum: WordsChunk) => datum[0].sem === selectedSem)
  if(hasFound !== undefined) {
    hasFound.forEach(word => {
      const {language, tag} = word;
      const convertedLanguage = "#" + countryCodeIntoLanguage(language);
      if (normalTags.findIndex(elem => elem === convertedLanguage) === -1) setNormalTags([...normalTags, convertedLanguage])
      tag.forEach(tag => {
        if (normalTags.find(elem => elem === `#${tag}`) === undefined)  // 여기서 elem은 이미 # 태그가 붙어있음.
          setNormalTags([...normalTags, `#${tag}`]);
      })
    })
  }

  
  return (
    <Fragment>
      {console.log(selectedNormalTags)}
      <Grid style={{textAlign: 'center'}}>
        {support.sems.length === 0 
          ? null
          : (
            support.sems.map((sem: number) => (
              <Chip 
                key={sem} 
                clickable
                label={`${convertSem(sem).year}${tr.year[ln]} ${convertSem(sem).sem}${tr.sem[ln]}`} 
                onClick={() => handleSemChipClick(sem)}
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
                onClick={() => handleAllTag()}
                color={allTag ? 'primary' : 'default'}
              />
              <Chip 
                clickable
                label={tr.favorite[ln]} 
                onClick={() => handleSpecialTags(tr.favorite[ln])}
                color={favoriteTag ? 'primary' : 'default'}
              />
              <Chip 
                clickable
                label={tr.today[ln]} 
                onClick={() => handleSpecialTags(tr.today[ln])}
                color={nowTag ? 'primary' : 'default'}
              />
              {
                normalTags.map((tag: string) => (
                  <Chip 
                    key={tag} 
                    clickable
                    label={tag} 
                    onClick={() => handleNormalTags(tag)}
                    color={selectedNormalTags.findIndex(selectedTag => selectedTag === tag) !== -1 ? 'primary' : 'default'}
                  />
                ))
              }
            </Fragment>
        }
      </Grid>
      {selectedSem === 0
      ? <h3>{tr.chooseSem[ln]}</h3>
      : !filteredWordsList 
        ? <h3>{tr.waiting[ln]}</h3>
        : filteredWordsList.map(datus => <WordCard key={datus._id} word={datus} />)
      }
    </Fragment>
  );
}

export default YearChip;