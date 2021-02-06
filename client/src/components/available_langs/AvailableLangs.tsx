import React, { useEffect } from 'react';
import axios from 'axios';
import * as API from '../../API';
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
import {setAddWordLangPref} from '../../redux/actions';

const LANGUAGES_AVAILABLE_LIST: AddableLang[] = ['ko', 'en', 'ja', 'zh'];

const AvailableLangs: React.FC = () => {
  const {language, user, support} = useSelector((state: State) => state);
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
            payload: { 
              ownerID: newUser.ID, firstName: newUser.firstName, addWordLangPref: 'en', data: [],
              addedWordsCount: 0, deletedWordsCount: 0
            }
          }, API.getAuthorization())
            .then(newRes => store.dispatch(setAddWordLangPref(newRes.data.payload.addWordLangPref)))
          return;
        }
        store.dispatch(setAddWordLangPref(res.data.payload.addWordLangPref))
      })
  }, [user]);

  const menuItems = LANGUAGES_AVAILABLE_LIST.map(lang => (
    <MenuItem key={lang} value={lang}>{countryCodeIntoLanguage(lang)}</MenuItem>
  ));

  return (
    <div style={{ display: 'inline-flex' }}>
      <InputLabel id="demo-controlled-open-select-label" style= {{ paddingTop: 7 }}>{tr.selectLang[ln]}</InputLabel>
      <Select
        style={{ marginLeft: 5 }}
        labelId="demo-controlled-open-select-label"
        id="demo-controlled-open-select"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        value={support.addWordLangPref}
        onChange={(e) => handleChange(e)}
      >
        {menuItems}
      </Select>
    </div>
  )
}

export default AvailableLangs