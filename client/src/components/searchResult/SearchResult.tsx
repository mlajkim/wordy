import React, { Fragment, useEffect, useState } from 'react';
import { State, Word } from '../../types';
// Translation
// Theme
import { listDark, listLight } from '../../theme';
// Redux
// import store from '../../redux/store';
import { useSelector } from 'react-redux';
// Material UI
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import LoadingFbStyle from '../loading_fbstyle/LoadingFbStyle';
// Components
import WordCard from '../word_card/WordCard';

const enableWordSearch = true;
const enableMeaningSearch = true;
const enableExamplesearch = true;

const SearchResult: React.FC = () => {
  // Redux states
  const { support, words } = useSelector((state: State) => state);
  const [ isSearching, setSeraching ] = useState<boolean>(true); 
  const [ matchingWord, setMatchingWord ] = useState<Word[]>([]);

  // Search type

  // Search Algorithm (Forntend)
  useEffect(() => {
    const searchedWord: Word[] = [];
    const regex = new RegExp(`.*${support.searchData}.*`);

    const foundData = words.forEach(wordChunk => {
      for (const word of wordChunk) {
        let found = false;
        if (!found && enableWordSearch && regex.exec(word.word) !== null) found = true;
        if (!found && enableMeaningSearch && regex.exec(word.meaning) !== null) found = true;
        if (!found && enableExamplesearch && regex.exec(word.example) !== null) found = true;
        if (found) searchedWord.push(word);
      };
    });

    setMatchingWord(searchedWord);

    // Finally turn off
    setSeraching(false);
    
  }, [words, support.searchData]);


  const RenderSerachResult = matchingWord.length > 0
  ? (
    <Fragment>
      <Typography>
        "{support.searchData}" results (found {matchingWord.length})
      </Typography>
      { matchingWord.map(word => <WordCard word={word} key={word._id} />) }
    </Fragment>
  )
  : (
    <Typography component="div" style={{ backgroundColor: support.isDarkMode ? listDark : listLight, minHeight: '30vh' }}>
      "{support.searchData}" does not exist ...
    </Typography>
  );
  
  return (
    <Fragment>
      { isSearching === true && <LoadingFbStyle />}
      { isSearching === false && RenderSerachResult }
    </Fragment>
  )
};

export default SearchResult;