// Mains & Types
import React, { Fragment, useState } from 'react';
import { State } from '../../types';
// Translation
import tr from './list_setting.tr.json';
// Material UI
import IconButton from '@material-ui/core/IconButton';  
// Icons
import TuneOutlinedIcon from '@material-ui/icons/TuneOutlined';
import ArrowUp from '@material-ui/icons/ArrowUpward';
import ArrowDown from '@material-ui/icons/ArrowDownward';
// Redux
import store from '../../redux/store';
import {useSelector} from 'react-redux';
import {getWords} from '../../redux/actions/wordsAction';

// @@ Supportive
const Lists: React.FC = () => {
  const {language, support} = useSelector((state: State) => state);
  const ln = language;
  
  return (
    <Fragment>
      <h4>hi</h4>
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