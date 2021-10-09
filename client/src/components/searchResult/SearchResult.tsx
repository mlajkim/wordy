import { FC, Fragment, useEffect, useState } from 'react'
// Type
import { State, Word } from '../../types'
// Translation
import tr from './search_result.tr.json'
import trYearChip from '../../pages/list/year_chip.tr.json'
// Lambda
import { throwEvent, wordSearchingAlgorithm, convertWordsIntoLegacy } from '../../frontendWambda'
import { convertSem } from '../../utils'
// Theme
import { listDark, listLight, buttonLight, buttonDark } from '../../theme'
// Redux
import store from '../../redux/store'
import { useSelector } from 'react-redux'
// Redux Action
import { setWords } from '../../redux/actions/wordsAction'
import { modifySupport } from '../../redux/actions/supportAction'
// Material UI
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import LoadingFbStyle from '../loading_fbstyle/LoadingFbStyle'
import { Tooltip, IconButton } from '@material-ui/core'
// MUI Icon
import Button from '@mui/material/Button'
import GoUpToTopPageIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
// Components
import WordCard from '../word_card/WordCard'
import EncryptedWordCard from '../secured_wordcard/EncryptedWordCard'
import { WordGetWordInput, WordGetWordPayload } from '../../type/payloadType'

const ADDING_MORE_WORDS_AMOUNT = 50;
const DEFAULT_MORE_WORDS_AMOUNT = 50;
const SEARCH_BEGINS_TERM_IN_SEC = 0.2;
const enableWordSearch = true;
const enableMeaningSearch = true;
const enableExamplesearch = true;
// customizing
const USER_SEARCH_ALLOW_ALL = true;
const USER_SEARCH_ONLY_THIS_YEAR = [213];

const SearchResult: FC = () => {
  // Redux states
  const { support, words, language, user } = useSelector((state: State) => state)
  const ln = language
  const [ matchingWord, setMatchingWord ] = useState<Word[]>([])
  const [ wordCardsMax, setWordCardsMax ] = useState<number>(DEFAULT_MORE_WORDS_AMOUNT)
  // Searching enabled
  const [ lastSearch , setLastSearch ] = useState<string>("")
  const [ downloadingAt, setDownloadingAt ] = useState<number>(0)
  const [ cancelSearch, setCancelSearch ] = useState(false)

  // Search Algorithm (Forntend)
  useEffect(() => {
    // This actually does not change the redux state, but it is used for temporary usage, it seems.
    support.searchData = support.searchData.replace(/[$&+,:;=?[\]@#|{}'<>.^*()%!-/]/g, "");

    // Algorithm
    const searchingAlgorithm = async () => {
      setCancelSearch(false) // reset
      store.dispatch(modifySupport({ searchLoading: true }, true));

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
      

      // if user does not prefer to download all those data, it won't progress.
      if (support.searchOnlyDownloaded) {
        store.dispatch(modifySupport({ searchLoading: false }, true));
        return;
      }

      setDownloadingAt(0) // For reset

      // get the not downloaded semseters
      const notDownloadedSems: number[] = USER_SEARCH_ALLOW_ALL
      ? support.sems.filter(sem => !alreadyDownloadedSems.includes(sem)) // just do all
      : support.sems.filter(
        sem => !alreadyDownloadedSems.includes(sem) && USER_SEARCH_ONLY_THIS_YEAR.findIndex(el => el === sem) !== -1
      );

      // Download from the semester 
      for (const undownloadeSem of notDownloadedSems) {
        if (cancelSearch) {
          setCancelSearch(true)
          break // cancel search
        }
        // download the data and get from it
        setDownloadingAt(undownloadeSem)
        const input: WordGetWordInput = { sem: undownloadeSem, legacyMongoId: user.ID! }
        await throwEvent("word:getWord", input)
        .then(res => {
          if (res.serverResponse !== "Accepted") return;
          
          const foundWordChunk = res.payload as WordGetWordPayload;

          // converted
          const converted: Word[] = convertWordsIntoLegacy(foundWordChunk);

          // Frontend...?
          // ! Not the best code, but it stops to save into word!
          if (words.findIndex(wordChunk => wordChunk[0].sem === converted[0].sem) !== -1) return;
          store.dispatch(setWords(converted));

          searchedWord.push(...wordSearchingAlgorithm(support.searchData, converted, {
            enableWordSearch, enableMeaningSearch, enableExamplesearch
          }));
          
          setMatchingWord(searchedWord);
        }); // end of throwEvent
        
      }; // End of For Loop (const undownloadeSem of notDownloadedSems)

      // Finally turn off
      store.dispatch(modifySupport({ searchLoading: false }, true));
    }; // end of searchingAlgorithm()


    // Runs the searching, only when it is admited.
    if (support.searchingBegins) {
      setLastSearch(support.searchData);
      store.dispatch(modifySupport({ searchingBegins: false }, true));
      searchingAlgorithm();
    };
  }, [words, support, user.ID, cancelSearch]);

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

  const RenderWarningOnlyDownloaded = support.searchOnlyDownloaded && (
    <Typography style={{ fontSize: 11, color: 'gray', paddingTop: 10 }}>
      {support.searchOnlyDownloaded && tr.currentlyShowingOnlyDownloadedSem[ln] }
    </Typography>
  )

  const RenderMoreButton = matchingWord.length > DEFAULT_MORE_WORDS_AMOUNT && (
    <Tooltip title={trYearChip.expandMore[ln]} placement="bottom">
      <IconButton className={"ShowMoreButton"} color="inherit" aria-label="more" onClick={() => handleMoreClick()}>
        <ExpandMoreIcon fontSize="small" style={{ color: support.isDarkMode ? buttonDark : buttonLight}} />
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
      { RenderWarningOnlyDownloaded }
      <Grid style={{ margin: 8}}>
        { matchingWord.slice(0, wordCardsMax)
        .sort((a, b) => b.order - a.order) // Second show by the order number
        .sort((a, b) => b.sem - a.sem) // First show the latest 
        .map(word => word.isEncrypted
          ? <EncryptedWordCard word={word} key={word._id} highlighted={support.searchData} />
          : <WordCard word={word} key={word._id} highlighted={support.searchData}/>
        )
        }
      </Grid>
      { wordCardsMax < matchingWord.length && RenderMoreButton }
      <Tooltip title={trYearChip.toTopOfPage[ln]} placement="bottom">
        <IconButton className={"GoToTopOfPage"} color="inherit" aria-label="more" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <GoUpToTopPageIcon fontSize="small" style={{ color: support.isDarkMode ? buttonDark : buttonLight }} />
        </IconButton>
      </Tooltip> 
    </Fragment>
  )
  : (
    <Fragment>
      <Typography component="div" style={{ backgroundColor: support.isDarkMode ? listDark : listLight, paddingTop: 10 }}>
        {`${tr.yourSearch[ln]}`}<b>{`${support.searchData}`}</b>{`${tr.notFound[ln]}`}
      </Typography>
      { RenderWarningOnlyDownloaded }
    </Fragment>
  );
  
  return (
    <Fragment>
      { support.searchLoading && (
        <Fragment>
          <LoadingFbStyle />
          {downloadingAt !== 0 && 
            tr.searchingAtFront[ln] + `${convertSem(downloadingAt).year}-${convertSem(downloadingAt).sem}` + tr.searchingAtRear[ln]
          }
          <Button 
            size="small" style={{ marginLeft: 4 }}
            variant="outlined" color="error" onClick={() => setCancelSearch(true)}>
            {tr.cancelSearch[ln]}
          </Button>
        </Fragment>
      )}
      { RenderSerachResult }
    </Fragment>
  )
};

export default SearchResult;