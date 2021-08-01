import React, { useEffect, useState } from 'react';
import { State } from '../../types';
import { ADDABLE_LANGUAGES_LIST } from '../../type/generalType';
import { languageCodeIntoUserFriendlyFormat } from '../../type/sharedWambda';
// Component 
import LoadingFbStyle from '../../components/loading_fbstyle/LoadingFbStyle';
// Translation
import tr from './available_langs.tr.json';
// Material UI
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Tooltip from '@material-ui/core/Tooltip';
// Material UI icon
import CheckIcon from '@material-ui/icons/Check';
// Redux
import {useSelector} from 'react-redux';
import store from '../../redux/store';
// Redux Actions
import { modifySupport } from '../../redux/actions/supportAction';

type Props = {
  setDetectApi?: React.Dispatch<React.SetStateAction<"enabled" | "disabled">>;
  detectApi?: "enabled" | "disabled";
  detectedLanguage?: string;
};

const AvailableLangs: React.FC<Props> = ({ setDetectApi, detectApi, detectedLanguage }) => {
  const { support, language } = useSelector((state: State) => state);
  const ln = language;
  const [open, setOpen] = React.useState(false);
  const [endUserChosen, setEndUserChosen] = useState(false);

  // Detected language automatically change the data
  useEffect(() => {
    if (detectApi === 'enabled') {
      const idx = ADDABLE_LANGUAGES_LIST.findIndex(lang => lang === detectedLanguage);
      if (idx !== -1) store.dispatch(modifySupport({ addWordLangPref: detectedLanguage }));
    }
      

  }, [detectApi, detectedLanguage])

  const handleLanguageSelectionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setEndUserChosen(true);
    if (typeof setDetectApi === 'function') setDetectApi("disabled"); // no longer 
    store.dispatch(modifySupport({ addWordLangPref: event.target.value as string }));
  };

  const menuItems = ADDABLE_LANGUAGES_LIST.map(lang => (
    <MenuItem key={lang} value={lang}>{languageCodeIntoUserFriendlyFormat(lang)}</MenuItem>
  ));

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
        onChange={(e) => handleLanguageSelectionChange(e)}
      >
        {menuItems}
      </Select>
      { endUserChosen && 
        <Tooltip title={tr.help[ln]} placement="right" style={{ marginLeft: 5 }}>
          <CheckIcon />
        </Tooltip>}
      { !endUserChosen && detectApi === 'enabled' && <LoadingFbStyle />}
    </div>
  )
}

export default AvailableLangs