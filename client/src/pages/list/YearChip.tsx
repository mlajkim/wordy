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
import IconButton from '@material-ui/core/IconButton';
// Icons
import DoneIcon from '@material-ui/icons/Done';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// Translation
import tr from './year_chip.tr.json';
// Redux
import store from '../../redux/store';
import {useSelector} from 'react-redux';
import {getWords} from '../../redux/actions/wordsAction';

type SpecialTag = '' | 'all' | 'favorite' | 'today' | 'fourDays' | 'yesterday' | 'weekAgo' | 'twoWeeksAgo' | 'monthAgo';
const ADDING_MORE_WORDS_AMOUNT = 100;
const DEFAULT_MORE_WORDS_AMOUNT = 100;
// @ MAIN
const YearChip = () => {
  // Redux states
  const {language, support, words} = useSelector((state: State) => state);
  const ln = language;
  // Component state
  const [selectedSem, setSelectedSem] = useState<number>(0);
  const [selectedNormalTags, setSelectedNormalTags] = useState<string[]>([]);
  const [normalTags, setNormalTags] = useState<string[]>([]);
  const [downloadedSems, setDownloadedSems] = useState<number[]>([]);
  const [selectedSpecialTag, setSelectedSpecialTag] = useState<SpecialTag>();
  const [wordCardsMax, setWordCardsMax] = useState<number>(DEFAULT_MORE_WORDS_AMOUNT);
  // Effect
  useEffect(() => {
    if (support.sems.findIndex(sem => sem === selectedSem) === -1)
      setSelectedSem(0);
  }, [support.sems, selectedSem]);
  // Method
  const reset = () => {
    setSelectedSpecialTag('all'); // all by default.
    setSelectedNormalTags([]);
  };
  // ..Method
  const handleSemChipClick = (sem: number) => {
    setWordCardsMax(DEFAULT_MORE_WORDS_AMOUNT); // Because if you click it, it just has to do it.
    reset();
    setNormalTags([]);
    if (selectedSem === sem) {
      setSelectedSem(0);
      return;
    };
    setSelectedSem(sem); 
    let found: boolean = false;
    if(words.length !== 0) 
      found = typeof words.find((datum: WordsChunk) => datum[0].sem === sem) !== "undefined" ? true : false;
    // Not Found? Start Downloading.
    if(found === false) {
      // handle ownloading the data
      store.dispatch(getWords(sem));
      setDownloadedSems([...downloadedSems, sem]);
    }
  };
  
  // ..method
  const handleSpecialTags = (tag: SpecialTag) => {
    setSelectedSpecialTag(tag);
  }

  // ..method
  const handleNormalTags = (tag: string) => {
    const hasFound = selectedNormalTags.find((selectedTag => selectedTag === tag));
    if (typeof hasFound === "undefined") {
      setSelectedNormalTags([...selectedNormalTags, tag]);
    }
    else {
      setSelectedNormalTags(selectedNormalTags.filter(elem => elem !== hasFound));
    }
  };

  // Filtering Algorithm
  const filterTargetWords = words.find((datus: WordsChunk) => datus[0].sem === selectedSem);
  const filteredWordsList = typeof filterTargetWords !== "undefined" && filterTargetWords
      .filter(word => selectedSpecialTag === 'favorite' ? word.isFavorite : true)
      .filter(word => selectedSpecialTag === 'today' ? checkIfToday(word.dateAdded) : true)
      .filter(word => selectedSpecialTag === 'yesterday' ? checkIfThisDay(word.dateAdded, 1) : true)
      .filter(word => selectedSpecialTag === 'fourDays' ? checkIfThisDay(word.dateAdded, 4) : true)
      .filter(word => selectedSpecialTag === 'weekAgo' ? checkIfThisDay(word.dateAdded, 7) : true)
      .filter(word => selectedSpecialTag === 'twoWeeksAgo' ? checkIfThisDay(word.dateAdded, 14) : true)
      .filter(word => selectedSpecialTag === 'monthAgo' ? checkIfThisDay(word.dateAdded, 30) : true)
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
  if(typeof hasFound !== "undefined") {
    hasFound.forEach(word => {
      const {language, tag} = word;
      const convertedLanguage = "#" + countryCodeIntoLanguage(language);
      if (normalTags.findIndex(elem => elem === convertedLanguage) === -1) setNormalTags([...normalTags, convertedLanguage])
      tag.forEach(tag => {
        if (typeof normalTags.find(elem => elem === `#${tag}`) === "undefined")  // 여기서 elem은 이미 # 태그가 붙어있음.
          setNormalTags([...normalTags, `#${tag}`]);
      })
    })
  }
  // Special Tag Rendering
  const specialTagsList: SpecialTag[] = ['all', 'favorite' , 'today', 'yesterday', 'fourDays', 'weekAgo', 'twoWeeksAgo', 'monthAgo' ];
  const totalWordsCount = typeof hasFound === 'undefined' ? '' : ` (${hasFound?.length})`; // Shows nothing when loading, else show the number of counts.
  const renderSpecialTags = specialTagsList.map(specialTag => {
    // if special tag is all, then I would like to add a number of words
    return (
      <Chip
        key={specialTag} 
        clickable
        label={specialTag === 'all' ? `${tr[specialTag][ln]}${totalWordsCount}` : tr[specialTag][ln]} 
        onClick={() => handleSpecialTags(specialTag)}
        color={selectedSpecialTag === specialTag ? 'primary' : 'default'}
      />
    )
  });

  const handleMoreClick = () => {
    setWordCardsMax(wordCardsMax + ADDING_MORE_WORDS_AMOUNT);
  };

  const renderMoreButton = (
    <IconButton className={"ShowMoreButton"} color="inherit" aria-label="more" onClick={() => handleMoreClick()}>
      <ExpandMoreIcon fontSize="small" />
    </IconButton>
  );

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
                onDelete={downloadedSems.find(datus => datus === sem) ? () => handleSemChipClick(sem) : undefined}
                deleteIcon={<DoneIcon style={{ fontSize: 16 }}/>} 
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
              { renderSpecialTags }
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
          : filteredWordsList.slice(0, wordCardsMax).map((datus, idx) => {
            if (support.wordDisplayPref === 'wordcard') return <WordCard key={datus._id} word={datus} />
            else if (support.wordDisplayPref === 'list') return <WordList key={datus._id} word={datus} idx={idx + 1} />
            else return null;
          })
        }
      </Grid>
      { selectedSem !== 0 && typeof filteredWordsList !== "boolean" && wordCardsMax < filteredWordsList.length! && renderMoreButton }
    </Fragment>
  );
}

export default YearChip;