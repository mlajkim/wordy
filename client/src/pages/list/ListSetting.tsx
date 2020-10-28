// Mains & Types
import React, { Fragment, useEffect, useState } from 'react';
import { State } from '../../types';
// Translation
import tr from './list_setting.tr.json';
// Material UI
import IconButton from '@material-ui/core/IconButton';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid'
// Icons
import TuneOutlinedIcon from '@material-ui/icons/TuneOutlined';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CircularProgress from '@material-ui/core/CircularProgress';
import RefreshIcon from '@material-ui/icons/Refresh';
// Redux
import store from '../../redux/store';
import { useSelector } from 'react-redux';
// Actions
import { modifySupport } from '../../redux/actions/supportAction';

// @@ Supportive
const Lists: React.FC<{setShowing: any}> = ({ setShowing }) => {
  const {language, support} = useSelector((state: State) => state);
  const ln = language;
  
  return (
    <Grid style={{display: 'flex', textAlign: 'center'}}>
      <InputLabel id="wordOrder">{tr.wordOrder[ln]}</InputLabel>
        <Select
          value={support.wordOrderPref}
          onChange={(e) => store.dispatch(modifySupport({ wordOrderPref: e.target.value }))}
        >
          <MenuItem value='asc'>{tr.asc[ln]}</MenuItem>
          <MenuItem value='desc'>{tr.desc[ln]}</MenuItem>
        </Select>
      <InputLabel id="yearOrder">{tr.yearOrder[ln]}</InputLabel>
      <Select
        value={support.yearOrderPref}
        onChange={(e) => store.dispatch(modifySupport({ yearOrderPref: e.target.value }))}
      >
        <MenuItem value='asc'>{tr.asc[ln]}</MenuItem>
        <MenuItem value='desc'>{tr.desc[ln]}</MenuItem>
      </Select>
      <InputLabel id="wordListingType">{tr.wordDispalyType[ln]}</InputLabel>
      <Select
        value={support.wordDisplayPref}
        onChange={(e) => store.dispatch(modifySupport({ wordDisplayPref: e.target.value }))}
      >
        <MenuItem value='wordcard'>{tr.wordcard[ln]}</MenuItem>
        <MenuItem value='list'>{tr.list[ln]}</MenuItem>
      </Select>
      <IconButton onClick={() => setShowing(false)}>
        <ChevronRightIcon />
      </IconButton>
    </Grid>
  )
}

// @@ MAIN
const ListSetting: React.FC = () => {
  const [isShowing, setShowing] = useState<boolean>(false);
  const [refreshStep, setRefreshStep] = useState<0 | 1 | 2>(2); // 0: loading 1: done 2: back to clickable

  // Method
  const handleRefresh = () => {
    setRefreshStep(0);
    setRefreshStep(1);
  }

  // Effect
  useEffect(() => {
    if (refreshStep === 1) {
      setRefreshStep(2);
    }
  }, [refreshStep]);

  // renderer
  const refreshIcon = () => {
    switch (refreshStep) {
      case 0:
        return <CircularProgress />;
      case 1:
        return <h3>DONE</h3>;
      case 2:
        return (
          <IconButton style={{ float:'right',textAlign:'right'}} onClick={() => handleRefresh()}>
            <RefreshIcon />
          </IconButton>
        )
      default:
        return <h3>ERROR! IF YOU ARE ADMIN, CHECK YOUR CODE</h3>
    }
  }

  return (
    <Fragment>
      {isShowing
        ? (
          <Lists setShowing={setShowing} />
        )
        : (
          <Fragment>
            { refreshIcon }
            <IconButton style={{ float:'right',textAlign:'right'}} onClick={() => setShowing(true)}>
              <TuneOutlinedIcon />
            </IconButton>
          </Fragment>
        )
      }
    </Fragment>
  )
};

export default ListSetting;