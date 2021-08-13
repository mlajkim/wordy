import React, { Fragment, useEffect, useState } from 'react';
// type
import { OkrGetOkrObjectInput, OkrGetOkrObjectPayload, WpChangeWpInput, OkrGetMyOkrPayload } from '../type/payloadType';
import { OkrObject } from '../type/resourceType';
import { State } from '../types';
// Library
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
// Internal
import { convertSem } from '../utils';
// Translation
import yearChipTr from '../pages/list/year_chip.tr.json';
import tr from './okr_home.tr.json';
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
  okrData: OkrGetMyOkrPayload | undefined,
  setOkrData: React.Dispatch<React.SetStateAction<OkrGetMyOkrPayload | undefined>>;
}> = ({
  okrData, setOkrData
}) => {
  // Redux states
  const { support, language, okrLoading } = useSelector((state: State) => state);
  const ln = language;
  // state
  const [ selectedSem, setSelectedSem ] = useState(0);
  const [ data, setData ] = useState<OkrGetOkrObjectPayload>();
  const [ selectedData, setSelectedData ] = useState<OkrObject>();
  const [menu, openMenu] = useState<null | HTMLElement>(null);
  // Dialog state

  useEffect(() => {
    // selecting sem algorithm. for now, I will hard code choosing 213
    const foundSemByAlgorithm = 213;

    // get okr Data 
    const input: OkrGetOkrObjectInput = {
      userLink: okrData!.userLink,
      tempAccessToken: okrData!.tempAccessToken,
      sem: foundSemByAlgorithm,
      okrObjectType: "KeyResult"
    };
    throwEvent("okr:getOkrObject", input)
      .then(res => {
        if (res.serverResponse === "Accepted") setData(res.payload as OkrGetOkrObjectPayload);
      })
    
    // Set selectedSem for data pulling
    setSelectedSem(foundSemByAlgorithm);
  }, [okrData]);

  // handler for loading
  useEffect(() => {
    if (!okrLoading) return; 

    // get okr Data 
    const input: OkrGetOkrObjectInput = {
      userLink: okrData!.userLink,
      tempAccessToken: okrData!.tempAccessToken,
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
    
  }, [okrLoading, selectedSem, okrData]);

  // handler
  const hdlChipClick = () => {

  };

  // handler
  const hdlClickMenu = (inputType: string) => {
    if (typeof selectedData === 'undefined') return;

    const userInput: WpChangeWpInput = {
      modifyingTarget: selectedData.wrn,
      modifyingWpWrn: inputType === "toPublic" 
        ? "wrn::wp:pre_defined:backend:dangerously_public:210811"
        : "wrn::wp:pre_defined:backend:only_owner:210811"
    }

    throwEvent("wp:changeWp", userInput);
    openMenu(null);
  };

  const hdlMenuOpen = (target: HTMLElement, value: OkrObject) => {
    openMenu(target);
    setSelectedData(value);
  }
 
  const RenderChips = okrData && okrData.okrSems.map(sem => (
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
  
  // Sort first, and get the data
  const RenderList = data && data.map((data, idx) => (
    <Draggable draggableId={data.wrn} key={data.wrn} index={idx}>
      {(provided) => (
        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
          <Typography gutterBottom>
            {data.resoureAvailability === "Visible"
              ? data.title
              : tr.thisDataIsPrivate[ln]
            }
            <IconButton size={"small"} className={"key render"} color="inherit" onClick={(e) => hdlMenuOpen(e.currentTarget, data)}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Typography>
        </div>
      )}
    </Draggable>
    )
  )

  //handler
  const hdlDragEnd = (result: any) => {
    if(!data) return;

    const sourceIdx = result.source.index;
    const destinationIdx = result.destination.index;

    const newDataArr = Array.from(data);
    const sourceData = newDataArr.splice(sourceIdx, 1)[0];
    newDataArr.splice(destinationIdx, 0, sourceData);

    // finally
    setData(newDataArr);
  }

  const tempArr = ["hi", "bi"]
  return (
    <Fragment>
      <Grid style={{ textAlign: 'left', paddingLeft: 25, paddingTop: 20 }}>
        <Grid style={{ paddingTop: 10 }}>
          {okrData && `${okrData.name}@${okrData.id}`}
          <IconButton className={"moreMyOkr"} color="inherit" aria-label="language" onClick={(e) => store.dispatch(setDialog("CreateOkrObject"))}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Grid>
        <Grid style={{ paddingTop: 25 }}>
          { RenderChips }
        </Grid>
        <Grid style={{ paddingTop: 10 }}>
          <DragDropContext onDragEnd={(result) => hdlDragEnd(result)}>
            <Droppable droppableId="testTempid">
              {(provided) => (
                <div ref={provided.innerRef}  {...provided.droppableProps}>
                  { RenderList }
                  { provided.placeholder }
                </div>
              )}
            </Droppable>
          </DragDropContext>
          { okrLoading && <LoadingFbStyle />}
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