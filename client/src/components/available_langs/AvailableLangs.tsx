import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import * as API from '../../API';
import { State } from '../../types';
// Translation
import tr from './available_langs.tr.json';
// Material UI
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
// Redux
import {useSelector} from 'react-redux';

const LANGUAGES_AVAILABLE_LIST = [
  {code: 'ko', name: '한국어'},{code: 'en', name: 'English'},
  {code: 'ja', name: '日本語'},{code: 'zh', name: '中文 (简体)'}
];

const AvailableLangs: React.FC = () => {
  const {language, user} = useSelector((state: State) => state);
  const ln = language;

  const [addWordLangPref, setAddWordLangPref] = useState('en'); // English as default
  const [open, setOpen] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setAddWordLangPref(event.target.value as string);
    axios.put(`api/v2/mongo/languages/${user.ID}`, 
    {payload: {addWordLangPref: event.target.value}}, 
    API.getAuthorization())
  };

  useEffect(() => {
    if(user.ID) axios.get(`/api/v2/mongo/languages/${user.ID}`, API.getAuthorization())
      .then(res => setAddWordLangPref(res.data.payload.addWordLangPref))
  }, [user.ID]);

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
          value={addWordLangPref}
          onChange={handleChange}
        >
          {menuItems}
        </Select>
    </Fragment>  
    
  )
}

export default AvailableLangs