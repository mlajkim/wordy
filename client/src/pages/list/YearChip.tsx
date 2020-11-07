// Main & Types
import React, {Fragment, useState, useEffect} from 'react';
import {convertSem, countryCodeIntoLanguage, checkIfToday, checkIfThisDay} from '../../utils';
import { State, WordsChunk } from '../../types';
// Components
import WordCard from '../../components/word_card/WordCard';
import ListSetting from './ListSetting';
import WordList from '../../components/word_list/WordList';
// Material UI
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress';
// Translation
import tr from './year_chip.tr.json';
// Redux
import store from '../../redux/store';
import {useSelector} from 'react-redux';
import {getWords} from '../../redux/actions/wordsAction';

// @ MAIN
const YearChip = () => {
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
  const [yesterdayTag, setYesterdayTag] = useState<boolean>(false);
  const [weekBeforeTag, setWeekBeforeTag] = useState<boolean>(false);
  const [twoWeeks, setTwoWeeks] = useState<boolean>(false);
  const [monthBeforeTag, setMonthBeforeTag] = useState<boolean>(false);

  // Effect
  useEffect(() => {
    if (support.sems.findIndex(sem => sem === selectedSem) === -1)
      setSelectedSem(0);
  }, [support.sems, selectedSem]);
  // ..Effect
  useEffect(() => {
    if(selectedNormalTags.length === 0 && !favoriteTag && !nowTag)
      setAllTag(true);
  }, [selectedNormalTags, favoriteTag, nowTag])
  // Method
  const reset = () => {
    setAllTag(true)
    setSelectedNormalTags([]);
    setFavoriteTag(false); // Special Tags
    setNowTag(false); // Special Tags
    setYesterdayTag(false); //  Special Tags
    setWeekBeforeTag(false);  //  Special Tags
    setTwoWeeks(false);
    setMonthBeforeTag(false);// Special Tags (Add below if new special tag implemented)
  }
  // ..Method
  const handleAllTag = () => {
    if (allTag === true) {
      setAllTag(false)
      setSelectedNormalTags([]);
    }
    else reset();
  };
  // ..Method
  const handleSemChipClick = (sem: number) => {
    reset();
    setNormalTags([]);
    setSelectedNormalTags([]); // Reset
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
  // ..method
  const specialNormalShared = (tagsSelected: string[]) => {
    if (allTag) {
      setAllTag(false);
      return [];
    }
    return tagsSelected;
  }
  // ..method
  const handleSpecialTags = (tag: string) => {
    specialNormalShared(selectedNormalTags);
    // Special Tags
    if(tag === tr.favorite[ln]) setFavoriteTag(!favoriteTag);
    else if(tag === tr.today[ln]) setNowTag(!nowTag);
    else if(tag === tr.yesterday[ln]) setYesterdayTag(!yesterdayTag); 
    else if(tag === tr.weekAgo[ln]) setWeekBeforeTag(!weekBeforeTag);
    else if(tag === tr.twoWeeksAgo[ln]) setTwoWeeks(!twoWeeks);  
    else if(tag === tr.monthAgo[ln]) setMonthBeforeTag(!monthBeforeTag); // Add the new special tag below
  }

  // ..method
  const handleNormalTags = (tag: string) => {
    let prevSelectedTags = specialNormalShared(selectedNormalTags);
    const hasFound = prevSelectedTags.find((selectedTag => selectedTag === tag));
    if (hasFound === undefined) {
      setSelectedNormalTags([...prevSelectedTags, tag]);
    }
    else {
      setSelectedNormalTags(prevSelectedTags.filter(elem => elem !== hasFound));
    }
  };

  // Filtering Algorithm
  const filterTargetWords = words.find((datus: WordsChunk) => datus[0].sem === selectedSem);
  const filteredWordsList = filterTargetWords !== undefined && filterTargetWords
      .filter(word => favoriteTag ? word.isFavorite : true)
      .filter(word => nowTag ? checkIfToday(word.dateAdded) : true)
      .filter(word => yesterdayTag ? checkIfThisDay(word.dateAdded, 1) : true)
      .filter(word => weekBeforeTag ? checkIfThisDay(word.dateAdded, 7) : true)
      .filter(word => twoWeeks ? checkIfThisDay(word.dateAdded, 14) : true)
      .filter(word => monthBeforeTag ? checkIfThisDay(word.dateAdded, 30) : true)
      .filter(word => {
        if (selectedNormalTags.length !== 0) { // languages & tags filter
          let flag = false;
          selectedNormalTags.forEach(tag => {
            if(!flag) flag = countryCodeIntoLanguage(word.language) === tag.substring(1)
            if(!flag) flag = word.tag.find(wordTag => wordTag === tag.substring(1)) !== undefined
          })
          return flag;
        } 
        return true;
      })
      .sort((a, b) => support.wordOrderPref === 'desc' ? b.order - a.order : a.order - b.order)

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

  // Return
  return (
    <Fragment>
      <ListSetting selectedSem={selectedSem} />
      <Grid style={{textAlign: 'center', paddingTop: 50}}>
        {support.sems.length === 0 
          ? null
          : (
            support.sems
            .sort((a, b) => support.yearOrderPref === 'desc' ? b - a : a - b)
            .map((sem: number) => (
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
                label={tr.all[ln] + ` (${filterTargetWords === undefined ? 'Wait..' : filterTargetWords.length})`} 
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
              <Chip 
                clickable
                label={tr.yesterday[ln]} 
                onClick={() => handleSpecialTags(tr.yesterday[ln])}
                color={yesterdayTag ? 'primary' : 'default'}
              />
              <Chip 
                clickable
                label={tr.weekAgo[ln]} 
                onClick={() => handleSpecialTags(tr.weekAgo[ln])}
                color={weekBeforeTag ? 'primary' : 'default'}
              />
              <Chip 
                clickable
                label={tr.twoWeeksAgo[ln]} 
                onClick={() => handleSpecialTags(tr.twoWeeksAgo[ln])}
                color={twoWeeks ? 'primary' : 'default'}
              />
              <Chip 
                clickable
                label={tr.monthAgo[ln]} 
                onClick={() => handleSpecialTags(tr.monthAgo[ln])}
                color={monthBeforeTag ? 'primary' : 'default'}
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
      <Grid style={{ margin: 8}}>
        {selectedSem === 0
        ? <h3>{tr.chooseSem[ln]}</h3>
        : !filteredWordsList 
          ? <CircularProgress />
          : filteredWordsList.map((datus, idx) => {
            if (support.wordDisplayPref === 'wordcard') return <WordCard key={datus._id} word={datus} />
            else if (support.wordDisplayPref === 'list') return <WordList key={datus._id} word={datus} idx={idx + 1} />
            else return null;
          })
        }
      </Grid>
    </Fragment>
  );
}

export default YearChip;