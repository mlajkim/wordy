import React, { Fragment, useEffect, useState } from 'react';
// type
import OkrData from './OkrPageData';
import { State } from '../types';
// MUI
import { Chip, Grid, Menu, MenuItem, IconButton } from '@material-ui/core';
// MUI icon
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';

// Redux
import store from '../redux/store';
import { useSelector } from 'react-redux';
// Redux action
import { offDialog, offOkrReload, setDialog } from '../redux/actions';
import { throwEvent } from '../frontendWambda';


const OkrHome: React.FC<{
  okrData: OkrData,
  setOkrData: React.Dispatch<React.SetStateAction<OkrData | undefined>>;
}> = ({
  okrData, setOkrData
}) => {
  // Redux states
  const { support, okrLoading } = useSelector((state: State) => state);
  // state
  const { myOkrData } = okrData;
  const [ selectedSem, setSelectedSem ] = useState(0);
  // Dialog state

  useEffect(() => {
    // selecting sem algorithm. for now, I will hard code choosing 213
    const foundSemByAlgorithm = 213;

    // Set selectedSem for data pulling
    setSelectedSem(foundSemByAlgorithm);
  }, []);

  // handler for loading
  useEffect(() => {
    if (okrLoading) {
      console.log("loading happens"); // test

      // finally
      store.dispatch(offOkrReload());
    };
  }, [okrLoading]);

  // handler
  const hdlChipClick = () => {

  };

  const RenderChips = myOkrData.okrSems.map(sem => (
    <Chip
      key={sem}
      variant={sem === selectedSem ? undefined : "outlined"}
      size="small"
      label={sem}
      clickable
      color={support.isDarkMode ? undefined : "primary"}
      onClick={() => hdlChipClick()}
    />
  ));

  return (
    <Fragment>
      <Grid style={{ textAlign: 'left', paddingLeft: 25, paddingTop: 20 }}>
        <Grid style={{ paddingTop: 10 }}>
          {`${myOkrData.name}@${myOkrData.id}`}
          <IconButton className={"moreMyOkr"} color="inherit" aria-label="language" onClick={() => store.dispatch(setDialog("CreateOkrObject"))}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Grid>
        <Grid style={{ paddingTop: 25 }}>
          { RenderChips }
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default OkrHome;