import React, { useEffect, useState } from 'react'
import { State } from '../../types'
import { ADDABLE_LANGUAGES_LIST } from '../../type/generalType'
import { languageCodeIntoUserFriendlyFormat } from '../../type/sharedWambda'
import { orderFirst } from '../../frontendWambda'
// Component 
import LoadingFbStyle from '../../components/loading_fbstyle/LoadingFbStyle'
// Translation
import tr from './available_langs.tr.json'
// MUI
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Tooltip from '@material-ui/core/Tooltip'
// MUI icon
import CheckIcon from '@material-ui/icons/Check'
// Redux
import store from '../../redux/store'
import { useSelector } from 'react-redux'
// Redux Actions
import { modifySupport } from '../../redux/actions/supportAction'

type Props = {
  setDetectApi?: React.Dispatch<React.SetStateAction<"enabled" | "disabled">>
  detectApi?: "enabled" | "disabled"
  detectedLanguage?: string
  enableDetect?: boolean
};

const AvailableLangs: React.FC<Props> = ({ setDetectApi, detectApi, detectedLanguage, enableDetect }) => {
  const { support, language } = useSelector((state: State) => state);
  const ln = language;
  const [open, setOpen] = React.useState(false);
  const [endUserChosen, setEndUserChosen] = useState(false);

  // Detected language automatically change the data
  useEffect(() => {
    if (detectApi === 'enabled') {
      const idx = ADDABLE_LANGUAGES_LIST.findIndex(lang => lang === detectedLanguage);
      if (idx !== -1) {
        store.dispatch(modifySupport({ addWordLangPref: detectedLanguage }))
      };
    };
  }, [detectApi, detectedLanguage])

  const handleClickLang = () => {
    setEndUserChosen(true);
    if (typeof setDetectApi === 'function') setDetectApi("disabled"); // no longer API working
  }

  const menuItems = orderFirst(ln, ADDABLE_LANGUAGES_LIST)
  .map(lang => (
    <MenuItem 
      onClick={() => handleClickLang()} 
      key={lang} 
      value={lang}
    >
      {languageCodeIntoUserFriendlyFormat(lang)}
    </MenuItem>
  ))

  return (
    <div style={{ display: 'inline-flex' }}>
      <InputLabel id="demo-controlled-open-select-label" style= {{ paddingTop: 7 }}>{tr.selectLang[language]}</InputLabel>
      <Select
        style={{ marginLeft: 5 }}
        labelId="demo-controlled-open-select-label"
        id="demo-controlled-open-select"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        value={support.addWordLangPref}
        onChange={(e) => store.dispatch(modifySupport({ addWordLangPref: e.target.value as string }))}
      >
        {menuItems}
      </Select>
      { endUserChosen && 
        <Tooltip title={tr.help[ln]} placement="right" style={{ marginLeft: 5 }}>
          <CheckIcon fontSize="small" style={{ marginTop: 5 }}/>
        </Tooltip>}
      { !endUserChosen && enableDetect && detectApi === 'enabled' && <LoadingFbStyle />}
    </div>
  )
}

export default AvailableLangs