import { Fragment, useState, useEffect, FC } from 'react'
// Type
import {convertSem, checkIfToday, checkIfThisDay} from '../../utils'
import { languageCodeIntoUserFriendlyFormat } from '../../type/sharedWambda'
import { State, WordsChunk, SpecialTag, Word } from '../../types'
import { buttonLight, buttonDark } from '../../theme'
import { WordGetWordInput, WordGetWordPayload } from '../../type/payloadType'
import { convertWordsIntoLegacy } from '../../type/sharedWambda'
// Library
import { filteredSpecialTag, onlyBiggestThree } from '../../frontendWambda'
// Translation
import tr from './year_chip.tr.json'
// Components
import ImageCard from '../../components/word_card/ImageCard'
import EncryptedWordCard from '../../components/word_card/WordCard'
import ListSetting from './ListSetting'
import WordList from '../../components/word_list/WordList'
import SearchResult from '../../components/searchResult/SearchResult'
// Lambda
import { throwEvent } from '../../frontendWambda'
// MUI
import Tooltip from '@material-ui/core/Tooltip'
import Chip from '@material-ui/core/Chip'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
// MUI Icons
import DoneIcon from '@material-ui/icons/Done'
import GoUpToTopPageIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
// Redux
import store from '../../redux/store'
// Redux action
import { useSelector } from 'react-redux'
import { setWords } from '../../redux/actions/wordsAction'

const ADDING_MORE_WORDS_AMOUNT = 50;
const DEFAULT_MORE_WORDS_AMOUNT = 50;
const RENDERING_YEAR_CHIP_LIMIT = 3
// @ MAIN
const YearChip: FC = () => {
  // Redux states
  const { language, support, words, user } = useSelector((state: State) => state);
  const ln = language;
  // Component state
  const [selectedSem, setSelectedSem] = useState<number>(0)
  const [selectedSpecialTag, setSelectedSpecialTag] = useState<SpecialTag>()
  const [selectedNormalTags, setSelectedNormalTags] = useState<string[]>([])
  const [normalTags, setNormalTags] = useState<string[]>([])
  const [downloadedSems, setDownloadedSems] = useState<number[]>([])
  const [wordCardsMax, setWordCardsMax] = useState<number>(DEFAULT_MORE_WORDS_AMOUNT)
  const [expandedYearChip, expandYearChip] = useState(false)
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
  const handleSemChipClick = async (sem: number) => {
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

    // Found? Do not download ...
    if (found) return

    // ! Start downloading here ...
    await throwEvent("word:getWord", { sem, legacyMongoId: user.ID! } as WordGetWordInput)
      .then(res => {
        if (res.serverResponse !== "Accepted") return;
        
        // ! 1) Convert into legacy format
        const foundWordChunk = res.payload as WordGetWordPayload;
        const converted: Word[] = convertWordsIntoLegacy(foundWordChunk);

        // ! 2) Apply frontend
        store.dispatch(setWords(converted));
        setDownloadedSems([...downloadedSems, sem]);
      })
  }
  
  // ..method
  const handleSpecialTags = (tag: SpecialTag) => {
    // If the same sepcial tag (All, favoirte, Today and so on) is clicked, it resets the normal tag
    if (selectedSpecialTag === tag) {
      setSelectedNormalTags([]);
    };

    // Finally change the special tag to given tag
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
  const filterTargetWords = words.find((datum: WordsChunk) => datum[0].sem === selectedSem);
  const filteredWordsList = typeof filterTargetWords !== "undefined" && filterTargetWords
      .filter(word => selectedSpecialTag === 'favorite' ? word.isFavorite : true)
      .filter(word => selectedSpecialTag === 'today' ? checkIfToday(word.dateAdded) : true)
      .filter(word => selectedSpecialTag === 'yesterday' ? checkIfThisDay(word.dateAdded, 1) : true)
      .filter(word => selectedSpecialTag === 'fourDays' ? checkIfThisDay(word.dateAdded, 4) : true)
      .filter(word => selectedSpecialTag === 'weekAgo' ? checkIfThisDay(word.dateAdded, 7) : true)
      .filter(word => selectedSpecialTag === 'twoWeeksAgo' ? checkIfThisDay(word.dateAdded, 14) : true)
      .filter(word => selectedSpecialTag === 'threeWeeksAgo' ? checkIfThisDay(word.dateAdded, 21) : true)
      .filter(word => selectedSpecialTag === 'monthAgo' ? checkIfThisDay(word.dateAdded, 30) : true)
      .filter(word => {
        if (selectedNormalTags.length !== 0) { // languages & tags filter
          let flag = false;
          selectedNormalTags.forEach(tag => {
            if(!flag) flag = languageCodeIntoUserFriendlyFormat(word.language) === tag.substring(1)
            if(!flag) flag = word.tag.find(wordTag => wordTag === tag.substring(1)) !== undefined
          })
          return flag;
        } 
        return true;
      })
      .sort((a, b) => {
        if (support.mixedSem !== selectedSem) 
          return support.wordOrderPref === 'desc' ? b.dateAdded - a.dateAdded : a.dateAdded - b.dateAdded;
        else return 0;
      });

  // # Language & Tags Creating
  const hasFound = words.find((datum: WordsChunk) => datum[0].sem === selectedSem)
  if(typeof hasFound !== "undefined") {
    hasFound.forEach(word => {
      const {language, tag} = word;
      const convertedLanguage = "#" + languageCodeIntoUserFriendlyFormat(language);
      if (normalTags.findIndex(elem => elem === convertedLanguage) === -1) setNormalTags([...normalTags, convertedLanguage])
      if (tag) tag.forEach(tag => {
        if (typeof normalTags.find(elem => elem === `#${tag}`) === "undefined")  // 여기서 elem은 이미 # 태그가 붙어있음.
          setNormalTags([...normalTags, `#${tag}`]);
      })
    })
  }
  // Special Tag Rendering
  // ! HERE IT RENDERS THE SPECIAL TAG
  const specialTagsList: SpecialTag[] = ['all', 'favorite' , ...filteredSpecialTag(filterTargetWords) ];
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
    <Tooltip title={tr.expandMore[ln]} placement="bottom">
      <IconButton className={"ShowMoreButton"} color="inherit" aria-label="more" onClick={() => handleMoreClick()}>
        <ExpandMoreIcon fontSize="small" style={{ color: support.isDarkMode ? buttonDark : buttonLight }} />
      </IconButton>
    </Tooltip>
  )

  const renderingSems = support.sems.length > RENDERING_YEAR_CHIP_LIMIT
    ? (expandedYearChip ? support.sems : onlyBiggestThree(support.sems)) : support.sems

  const RenderSearchResult = support.searchData !== "" && <SearchResult />
  const RenderWordList = support.searchData === "" && (
    <Fragment>
      <ListSetting selectedSem={selectedSem} handleSemChipClick={handleSemChipClick}/>
      <Grid style={{textAlign: 'center', paddingTop: 50}}>
        {support.sems.length !== 0 &&
          <Fragment>
            {support.sems.length > RENDERING_YEAR_CHIP_LIMIT &&
              <Chip 
              clickable
              label={expandedYearChip ? `${tr.closeExtendedYearChip[ln]}` : `...`}
              onClick={() => expandYearChip(!expandedYearChip)}
              color={'default'}
            />
            }
            {
              renderingSems
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
                )
              )
            }
          </Fragment>
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
      <Grid style={{ margin: 8 }}
        container
        direction="column"    
        justifyContent="center"
        alignItems="center"
      >
        {selectedSem === 0
        ? <h3>{tr.chooseSem[ln]}</h3>
        : !filteredWordsList 
          ? <CircularProgress />
          : filteredWordsList.slice(0, wordCardsMax).map((datus, idx) => {
                if (support.wordDisplayPref === 'wordcard') {
                  return datus.imageWrns.length > 0
                    ? <ImageCard key={datus.wrn ? datus.wrn : datus._id} word={datus} />
                    : <EncryptedWordCard key={datus.wrn ? datus.wrn : datus._id} word={datus} />
                }
                else if (support.wordDisplayPref === 'list') return <WordList key={datus.wrn} word={datus} idx={idx + 1} />
                else return null;
            })
        }
      </Grid>
      {selectedSem !== 0 && filteredWordsList &&
        <Tooltip title={tr.toTopOfPage[ln]} placement="bottom">
          <IconButton className={"GoToTopOfPage"} color="inherit" aria-label="more" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <GoUpToTopPageIcon fontSize="small" style={{ color: support.isDarkMode ? buttonDark : buttonLight }} />
          </IconButton>
        </Tooltip> 
      }
      { selectedSem !== 0 && typeof filteredWordsList !== "boolean" && wordCardsMax < filteredWordsList.length! && renderMoreButton }
      <Grid style={{ paddingBottom: 20 }}/>
    </Fragment>
  )

  // Return
  return (
    <Fragment>
      { RenderSearchResult }
      { RenderWordList }
    </Fragment>
  );
}

export default YearChip;