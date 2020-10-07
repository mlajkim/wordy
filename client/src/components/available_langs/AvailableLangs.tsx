import React, { Fragment, useEffect } from 'react';
import axios from 'axios';
import * as API from '../../API';
import { State } from '../../types';
// Translation
import tr from './available_langs.tr.json';
// Material UI
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
// Redux
import {useSelector} from 'react-redux';
import store from '../../redux/store';
import {setAddWordLangPref} from '../../redux/actions';

const LANGUAGES_AVAILABLE_LIST = [
  {code: 'ko', name: '한국어'},{code: 'en', name: 'English'},
  {code: 'ja', name: '日本語'},{code: 'zh', name: '中文 (简体)'}
];

const AvailableLangs: React.FC = () => {
  const {language, user, languages} = useSelector((state: State) => state);
  const ln = language;
  const [open, setOpen] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    store.dispatch(setAddWordLangPref(event.target.value as string))
    axios.put(`api/v2/mongo/languages/${user.ID}`, 
    {payload: {addWordLangPref: event.target.value}}, 
    API.getAuthorization());
  };

  useEffect(() => {
    const newUser = user;
    if(newUser.ID) axios.get(`/api/v2/mongo/languages/${newUser.ID}`, API.getAuthorization())
      .then(res => {
        // if empty
        if(res.status === 204) {
          axios.post(`/api/v2/mongo/languages`, {
            // default english, stil adding data null
            payload: { ownerID: newUser.ID, firstName: newUser.firstName, addWordLangPref: 'en', data: []}
          }, API.getAuthorization())
            .then(newRes => store.dispatch(setAddWordLangPref(newRes.data.payload.addWordLangPref)))
          return;
        }
        store.dispatch(setAddWordLangPref(res.data.payload.addWordLangPref))
      })
  }, [user]);

  const menuItems = LANGUAGES_AVAILABLE_LIST.map(lang => (
    <MenuItem key={lang.code} value={lang.code}>{lang.name}</MenuItem>
  ));

  return (
    <Fragment>
      <InputLabel id="demo-controlled-open-select-label">{tr.selectLang[ln]}</InputLabel>
      <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          value={languages.addWordLangPref}
          onChange={(e) => handleChange(e)}
        >
          {menuItems}
        </Select>
    </Fragment>
  )
}

export default AvailableLangs