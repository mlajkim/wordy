// Mains & Types
import React, { Fragment, useState } from 'react';
import { State } from '../../types';
// Translation
import tr from './list_setting.tr.json';
// Material UI
import IconButton from '@material-ui/core/IconButton';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
// Icons
import TuneOutlinedIcon from '@material-ui/icons/TuneOutlined';
import ArrowUp from '@material-ui/icons/ArrowUpward';
import ArrowDown from '@material-ui/icons/ArrowDownward';
// Redux
import store from '../../redux/store';
import { useSelector } from 'react-redux';
// Actions
import { modifySupport } from '../../redux/actions/supportAction';

// @@ Supportive
const Lists: React.FC = () => {
  const {language, support} = useSelector((state: State) => state);
  const ln = language;

  const wordOrderItems = [
    {
      value: 'asc',
      translated: tr.asc[ln]
    },
    {
      value: 'desc',
      translated: tr.desc[ln]
    },
  ];
  
  return (
    <Fragment>
      <InputLabel id="demo-simple-select-label">{tr.wordOrder[ln]}</InputLabel>
        <Select
          value={support.wordOrderPref}
          onChange={(e) => store.dispatch(modifySupport({ wordOrderPref: e.target.value }))}
        >
          {
            wordOrderItems.map(elem => (
              <MenuItem value={elem.value}>{elem.translated}</MenuItem>
            ))
          }
        </Select>
    </Fragment>
  )
}

// @@ MAIN
const ListSetting: React.FC = () => {
  const [isShowing, setShowing] = useState<boolean>(false);

  return (
    <Fragment>
      {isShowing
        ? (
          <Lists />
        )
        : (
          <IconButton style={{ float:'right',textAlign:'right'}} onClick={() => setShowing(true)}>
            <TuneOutlinedIcon />
          </IconButton>
        )
      }
    </Fragment>
  )
};

export default ListSetting;