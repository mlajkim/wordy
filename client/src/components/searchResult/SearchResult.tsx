import React, { Fragment, useEffect, useState } from 'react';
// Type
import { State, Word } from '../../types';
// Translation
import tr from './search_result.tr.json';
import trYearChip from '../../pages/list/year_chip.tr.json';
// Lambda
import { throwEvent, wordSearchingAlgorithm } from '../../frontendWambda';
// Theme
import { listDark, listLight, buttonLight, buttonDark } from '../../theme';
// Redux
import store from '../../redux/store';
import { useSelector } from 'react-redux';
// Redux Action
import { modifySupport } from '../../redux/actions/supportAction';
// Material UI
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import LoadingFbStyle from '../loading_fbstyle/LoadingFbStyle';
import { Tooltip, IconButton } from '@material-ui/core';
// MUI Icon
import GoUpToTopPageIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// Components
import WordCard from '../word_card/WordCard';
import { WordGetWordInput, WordGetWordPayload } from '../../type/payloadType';

const ADDING_MORE_WORDS_AMOUNT = 50;
const DEFAULT_MORE_WORDS_AMOUNT = 50;
const SEARCH_BEGINS_TERM_IN_SEC = 0.2;
const enableWordSearch = true;
const enableMeaningSearch = true;
const enableExamplesearch = true;
// customizing
const USER_SEARCH_ONLY_THIS_YEAR = [213, 212, 211];

const SearchResult: React.FC = () => {
  // Redux states
  const { support, words, language, user } = useSelector((state: State) => state);
  const ln = language;
  const [ isSearching, setSeraching ] = useState<boolean>(true); 
  const [ matchingWord, setMatchingWord ] = useState<Word[]>([]);
  const [ wordCardsMax, setWordCardsMax ] = useState<number>(DEFAULT_MORE_WORDS_AMOUNT);
  // Searching enabled
  const [ lastSearch , setLastSearch ] = useState<string>("");

  // Search Algorithm (Forntend)
  useEffect(() => {
    // Make sure that certain character is not acceptable
    // not allowing following
    // [, ], \, +, ?, *, -
    // This does not technically like .. tell the user that it should not be provided
    // ideally, if you input such unrequired data, we should put \this kind of escape character for them.
    support.searchData = support.searchData.replace(/[$&+,:;=?[\]@#|{}'<>.^*()%!-/]/g, "");

    // Algorithm
    const searchingAlgorithm = async () => {
      const searchedWord: Word[] = [];
      const alreadyDownloadedSems: number[] = [];

      words.forEach(wordChunk => {
        // push semester of the chunk into it
        alreadyDownloadedSems.push(wordChunk[0].sem);

        // Search and replace
        searchedWord.push(...wordSearchingAlgorithm(support.searchData, wordChunk, {
          enableWordSearch, enableMeaningSearch, enableExamplesearch
        }));
      });

      // Apply found one
      setMatchingWord(searchedWord);

      // get the not downloaded semseters
      const notDownloadedSems: number[] = support.sems.filter(
        sem => !alreadyDownloadedSems.includes(sem) && USER_SEARCH_ONLY_THIS_YEAR.findIndex(el => el === sem) !== -1
      );


      // Download from the semester 
      for (const undownloadeSem of notDownloadedSems) {
        // download the data and get from it
        const input: WordGetWordInput = { sem: undownloadeSem, legacyMongoId: user.ID! }
        await throwEvent("word:getWord", input)
        .then(res => {
          if (res.serverResponse !== "Accepted") return;
          
          const foundWordChunk = res.payload as WordGetWordPayload;

          // converted
          const converted: Word[] = foundWordChunk.map(found => {
            const { dateAdded, objectOrder, isFavorite, sem, language, tag, word, pronun, meaning, example, legacyId, legacyOwnerId } = found;
            return {
              _id: legacyId,
              ownerID: legacyOwnerId,
              order: objectOrder ? objectOrder : 0, 
              dateAdded: dateAdded ? dateAdded : 0, 
              // Shared (the same)
              isFavorite, sem, language, tag, word, pronun, meaning, example,
              // Unused, but defined
              lastReviewed: 0,
              reviewdOn: [0], 
              step: 0,
              seederID: "", 
              packageID: "", 
              isPublic: false,
            }
          });

          searchedWord.push(...wordSearchingAlgorithm(support.searchData, converted, {
            enableWordSearch, enableMeaningSearch, enableExamplesearch
          }));
          
          setMatchingWord(searchedWord);
        }); // end of throwEvent
        
      }; // End of For Loop (const undownloadeSem of notDownloadedSems)

      // Finally turn off
      setSeraching(false);

    }; // end of searchingAlgorithm()


    // Runs the searching, only when it is admited.
    if (support.searchingBegins) {
      setLastSearch(support.searchData);
      store.dispatch(modifySupport({ searchingBegins: false }, true));
      searchingAlgorithm();
    };
  }, [words, support, user.ID]);

  // Searching possible algoriuth 

  useEffect(() => {
    if (lastSearch !== support.searchData && !support.searchingBegins) {
      const interval = setInterval(() => {
        if (!support.searchingBegins) {
          store.dispatch(modifySupport({ searchingBegins: true }, true));
        }
        
      }, SEARCH_BEGINS_TERM_IN_SEC * 1000);
      return () => clearInterval(interval);
    }
  }, [lastSearch, support.searchData, support.searchingBegins]);

  const handleMoreClick = () => {
    setWordCardsMax(wordCardsMax + ADDING_MORE_WORDS_AMOUNT);
  };

  const RenderMoreButton = matchingWord.length > DEFAULT_MORE_WORDS_AMOUNT && (
    <Tooltip title={trYearChip.expandMore[ln]} placement="bottom">
      <IconButton className={"ShowMoreButton"} color="inherit" aria-label="more" onClick={() => handleMoreClick()}>
        <ExpandMoreIcon fontSize="small" style={{ color: support.isDarkMode ? buttonLight : buttonDark }} />
      </IconButton>
    </Tooltip>
  );

  const RenderSerachResult = matchingWord.length > 0
  ? (
    <Fragment>
      <Typography style={{ paddingTop: 10, fontSize: `15px` }}>
        {tr.thisIsTheResultOf[ln]}
        <b>{support.searchData}</b>
        {tr.thatWeFound[ln]}
      </Typography>
      <Typography style={{ paddingTop: 10 }}>
        {`${tr.found[ln]} ${matchingWord.length} ${tr.resultMeasurement[ln]}`}
      </Typography>
      <Grid style={{ margin: 8}}>
        { matchingWord.slice(0, wordCardsMax).map(word => <WordCard word={word} key={word._id} />) }
      </Grid>
      { wordCardsMax < matchingWord.length && RenderMoreButton }
      <Tooltip title={trYearChip.toTopOfPage[ln]} placement="bottom">
        <IconButton className={"GoToTopOfPage"} color="inherit" aria-label="more" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <GoUpToTopPageIcon fontSize="small" style={{ color: support.isDarkMode ? buttonLight : buttonDark }} />
        </IconButton>
      </Tooltip> 
    </Fragment>
  )
  : (
    <Typography component="div" style={{ backgroundColor: support.isDarkMode ? listDark : listLight, minHeight: '30vh' }}>
      {`${tr.yourSearch[ln]}`}<b>{`${support.searchData}`}</b>{`${tr.notFound[ln]}`}
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