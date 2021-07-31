// Mains & Types
import React, { Fragment, useEffect, useState } from 'react';
import { State } from '../../types';
import moment from 'moment';
// Translation
import tr from './list_setting.tr.json';
import trAppbar from '../../app/appbar.tr.json'
// Theme 
import { buttonLight, buttonDark } from '../../theme';
// Material UI
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
// Icons
import RefreshIcon from '@material-ui/icons/Refresh';
import CloudDoneIcon from '@material-ui/icons/CloudDoneOutlined';
import CheckIcon from '@material-ui/icons/Check';
import CasinoIcon from '@material-ui/icons/Casino';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import SettingsIcon from '@material-ui/icons/Settings';
// Redux
import store from '../../redux/store';
import { useSelector } from 'react-redux';
// Actions
import { modifySupport, getSupport } from '../../redux/actions/supportAction';
import { setDialog, setSnackbar } from '../../redux/actions';
import { syncWords, mixWords } from '../../redux/actions/wordsAction';


// @@ MAIN
const CLOUD_ICON_LASTING_TIMER = 2000; // how long it will show the cloud image
type Props = { selectedSem: number };
const ListSetting: React.FC<Props> = (props) => {
const { selectedSem } = props;
const { language, support } = useSelector((state: State) => state);
const ln = language;
// States
const [refreshStep, setRefreshStep] = useState<0 | 1 | 2>(2); // 0: loading 1: done 2: back to clickable
const [timer, setTimer] = useState<number>(0);
// Method
const handleRefresh = () => {
  setRefreshStep(0);
  store.dispatch(syncWords(selectedSem));
  store.dispatch(getSupport());
  store.dispatch(modifySupport({ mixedSem: 0 })); // Resets the mix button to 0
  // This is to show the end user that is has been synced
  setTimer(moment().valueOf() + CLOUD_ICON_LASTING_TIMER);
  setRefreshStep(1);
};

/**
 * Written on Jul 25, 2021
 */
const hdlMixingWords = () => {
  const lastMixedSum = support.mixedSem;
  if (lastMixedSum !== selectedSem) {
    store.dispatch(modifySupport({ mixedSem: selectedSem }, true));
    store.dispatch(mixWords(selectedSem));
    store.dispatch(setSnackbar(`${tr.mixed[ln]}`));
  }
  else {
    store.dispatch(modifySupport({ mixedSem: 0 }, true));
  }
};

// Effect
useEffect(() => {
  if (timer > moment().valueOf()) {
    const interval = setInterval(() => {
      setRefreshStep(2);
    }, CLOUD_ICON_LASTING_TIMER);
    return () => clearInterval(interval);
  }
}, [refreshStep, timer]);
// renderer
const refreshIcon = () => {
  switch (refreshStep) {
    case 0:
      return (
        <IconButton disabled style={{ float:'right',textAlign:'right', color: support.isDarkMode ? buttonLight : buttonDark }}>
          <CheckIcon />
        </IconButton>
      );
    case 1:
      return (
        <IconButton disabled style={{ float:'right',textAlign:'right', color: support.isDarkMode ? buttonLight : buttonDark }}>
          <CloudDoneIcon />
        </IconButton>
      );
    case 2:
      return (
        <IconButton style={{ float:'right',textAlign:'right', color: support.isDarkMode ? buttonLight : buttonDark }} onClick={() => handleRefresh()}>
          <Tooltip title={"Refresh"} placement="bottom">
            <RefreshIcon />
          </Tooltip>
        </IconButton>
      );
    default:
      return <h3>ERROR! IF YOU ARE ADMIN, CHECK YOUR CODE</h3>
  }
}

return (
  <Fragment>
    <IconButton style={{ float:'right',textAlign:'right', color: support.isDarkMode ? buttonLight : buttonDark }} onClick={() => store.dispatch(setDialog('SettingDialog'))}>
      <Tooltip title={trAppbar.setting[ln]} placement="bottom">
        <SettingsIcon />
      </Tooltip>
    </IconButton>
    { selectedSem !== 0 && 
      <IconButton style={{ float:'right',textAlign:'right', color: support.isDarkMode ? buttonLight : buttonDark }} onClick={() => hdlMixingWords()}>
        {
          selectedSem === support.mixedSem
            ?
              <Tooltip title={"Back to normal"} placement="bottom">
                <ClearAllIcon />
              </Tooltip>
            : 
              <Tooltip title={"Mix it"} placement="bottom">
                <CasinoIcon />
              </Tooltip> 
        }
      </IconButton>
    }            
    { selectedSem !== 0 && refreshIcon() }
  </Fragment>
)
  
};

export default ListSetting;