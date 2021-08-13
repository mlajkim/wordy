import React, { Fragment, useEffect, useState } from 'react';
// type
import OkrData from './OkrPageData';
import { OkrGetOkrObjectInput, OkrGetOkrObjectPayload } from '../type/payloadType';
import { State } from '../types';
// Internal
import { convertSem } from '../utils';
// Translation
import yearChipTr from '../pages/list/year_chip.tr.json';
// MUI
import { Chip, Grid, Typography, IconButton, Menu, MenuItem } from '@material-ui/core';
// MUI icon
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import MoreVertIcon from '@material-ui/icons/MoreVert';
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
  const { support, language, okrLoading } = useSelector((state: State) => state);
  const ln = language;
  // state
  const { myOkrData } = okrData;
  const [ selectedSem, setSelectedSem ] = useState(0);
  const [ data, setData ] = useState<OkrGetOkrObjectPayload>();
  const [menu, openMenu] = useState<null | HTMLElement>(null);
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
          setData(res.payload as  OkrGetOkrObjectPayload)
        }
      })

    // finally
    store.dispatch(offOkrReload());
    
  }, [okrLoading, selectedSem]);

  // handler
  const hdlChipClick = () => {

  };

  // handler
  const hdlClickMenu = (inputType: string) => {
    if (inputType === "toPublic") {

    } else if (inputType === "toPrivate") {

    }
  }
 
  const RenderChips = myOkrData.okrSems.map(sem => (
    <Chip
      key={sem}
      variant={sem === selectedSem ? undefined : "outlined"}
      size="small"
      label={`${convertSem(sem).year}${yearChipTr.year[ln]} ${convertSem(sem).sem}${yearChipTr.sem[ln]}`}
      clickable
      color={support.isDarkMode ? undefined : "primary"}
      onClick={() => hdlChipClick()}
    />
  ));

  const RenderList = data && data.map(data => (
    <Typography gutterBottom key={data.wrn}>
      {data.title}
      <IconButton size={"small"} className={"key render"} color="inherit" onClick={(e) => openMenu(e.currentTarget)}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
    </Typography>
  ))

  return (
    <Fragment>
      <Grid style={{ textAlign: 'left', paddingLeft: 25, paddingTop: 20 }}>
        <Grid style={{ paddingTop: 10 }}>
          {`${myOkrData.name}@${myOkrData.id}`}
          <IconButton className={"moreMyOkr"} color="inherit" aria-label="language" onClick={(e) => store.dispatch(setDialog("CreateOkrObject"))}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Grid>
        <Grid style={{ paddingTop: 25 }}>
          { RenderChips }
        </Grid>
        <Grid style={{ paddingTop: 10 }}>
          { okrLoading && <LoadingFbStyle />}
          { RenderList }
        </Grid>
      </Grid>
      {/* Menu */}
      <Menu
        id="simple-menu"
        anchorEl={menu}
        keepMounted
        open={Boolean(menu)}
        onClose={() => openMenu(null)}
      >
        <MenuItem onClick={() => hdlClickMenu('toPublic')}>{`Change To Public`}</MenuItem>
        <MenuItem onClick={() => hdlClickMenu('toPrivate')}>{`Change To Only Me (Private)`}</MenuItem>
      </Menu>
    </Fragment>
  );
};

export default OkrHome;