import React from 'react';
import { countryCodeIntoLanguage } from '../../utils'
import { State, AddableLang } from '../../types';
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

const LANGUAGES_AVAILABLE_LIST: AddableLang[] = ['ko', 'en', 'ja', 'zh'];

const AvailableLangs: React.FC = () => {
  const { user, support, language } = useSelector((state: State) => state);
  const [open, setOpen] = React.useState(false);

  const handleLanguageSelectionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    store.dispatch(modifySupport({ addWordLangPref: event.target.value as string }));
  };

  const menuItems = LANGUAGES_AVAILABLE_LIST.map(lang => (
    <MenuItem key={lang} value={lang}>{countryCodeIntoLanguage(lang)}</MenuItem>
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