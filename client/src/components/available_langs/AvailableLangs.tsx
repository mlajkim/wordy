import React from 'react';
import { State } from '../../types';
import { ADDABLE_LANGUAGES_LIST } from '../../type/generalType';
import { languageCodeIntoUserFriendlyFormat } from '../../type/sharedWambda';
// Translation
import tr from './available_langs.tr.json';
// Material UI
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
// Redux
import {useSelector} from 'react-redux';
import store from '../../redux/store';
// Redux Actions
import { modifySupport } from '../../redux/actions/supportAction';

type Props = {
  disableDetectingLanguage?: React.Dispatch<React.SetStateAction<boolean>>
};

const AvailableLangs: React.FC<Props> = ({ disableDetectingLanguage }) => {
  const { support, language } = useSelector((state: State) => state);
  const [open, setOpen] = React.useState(false);

  const handleLanguageSelectionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    if (typeof disableDetectingLanguage !== 'undefined') disableDetectingLanguage(true); // no longer 
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
    </div>
  )
}

export default AvailableLangs