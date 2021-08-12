import React, { Fragment, useEffect, useState } from 'react';
// type
import OkrData from './OkrPageData';
import { OkrGetOkrObjectInput, OkrGetOkrObjectPayload } from '../type/payloadType';
import { State } from '../types';
// MUI
import { Chip, Grid, Typography, IconButton } from '@material-ui/core';
// MUI icon
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';

// Redux
import store from '../redux/store';
import { useSelector } from 'react-redux';
// Redux action
import { offOkrReload, setDialog } from '../redux/actions';
import { throwEvent } from '../frontendWambda';
import LoadingFbStyle from '../components/loading_fbstyle/LoadingFbStyle';


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
  const [ data, setData ] = useState<OkrGetOkrObjectPayload>();
  // Dialog state

  useEffect(() => {
    // selecting sem algorithm. for now, I will hard code choosing 213
    const foundSemByAlgorithm = 213;

    // get okr Data 
    const input: OkrGetOkrObjectInput = {
      sem: foundSemByAlgorithm,
      okrObjectType: "KeyResult"
    };
    throwEvent("okr:getOkrObject", input)
      .then(res => {
        if (res.serverResponse === "Accepted") {
          setData(res.payload as OkrGetOkrObjectPayload)
        }
      })

    // Set selectedSem for data pulling
    setSelectedSem(foundSemByAlgorithm);
  }, []);

  // handler for loading
  useEffect(() => {
    if (!okrLoading) return; 

    // get okr Data 
    const input: OkrGetOkrObjectInput = {
      sem: selectedSem,
      okrObjectType: "KeyResult"
    };
    throwEvent("okr:getOkrObject", input)
      .then(res => {
        if (res.serverResponse === "Accepted") {
          setData(res.payload as OkrGetOkrObjectPayload)
        }
      })

    // finally
    store.dispatch(offOkrReload());
    
  }, [okrLoading, selectedSem]);

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

  const RenderList = data && data.map(data => (
    <Typography gutterBottom>
      {data.title}
    </Typography>
  ))

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
        { okrLoading && <LoadingFbStyle />}
        <Grid style={{ paddingTop: 10 }}>
          { RenderList }
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default OkrHome;