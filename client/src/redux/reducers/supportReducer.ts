import { Support } from '../../types'
import RELEASES from '../../releases'
// Redux Action
import { UPDATE_SUPPORT } from '../actions/supportAction';


const initialState: Support = {
  version: RELEASES[0].version,
  isBeta: !RELEASES[0].isFinished,
  versionDate: RELEASES[0].date,
  status: null,
  addWordLangPref: 'en', // user's prefrenece of adding language
  newWordAddingType: 'mass', // old support
  newWordCnt: 0,
  deletedWordCnt: 0,
  sems: [],
  wordOrderPref: 'asc',
  yearOrderPref: 'asc',
  wordDisplayPref: 'wordcard',
  lastTags: [],
  recommandedTags: [],
  isDarkMode: false, // dark mode off by default.
  // ! Version related
  lastReadVersion: "",
  // personal setting
  displayingLnUserPref: ['en', 'zh', 'ja', 'ko'], // The order is from the size of the langauge
  extendedSearchBar: false,
  isYearQuadrantEnabled: false,
  languageDetectionEnabled: true,
  highlightSearched: true,
  // Search pref
  searchOnlyDownloaded: true,
  // Search Data
  searchData: "",
  searchLoading: false,
  searchingBegins: false,
// reviewss
  mixedSem: 0,
  maxStep: 8,
  steps: [1, 8, 24, 72, 168, 336, 720, 720],
  // old
  addedWordsCount: 0, // 
  deletedWordsCount: 0
};

// this is more of userPreference (I will change the naming later)
const supports = (state = initialState, action: any) => {
  switch(action.type) {
    
    case UPDATE_SUPPORT: // Front end only
      return {...state, ...action.payload}
      
    default:
      return state;
  }
}

export default supports;