import React, { Fragment, useEffect, useState } from 'react';
// type
import { 
  OkrGetOkrObjectInput, OkrGetOkrObjectPayload, WpChangeWpInput, OkrGetMyOkrPayload, 
  OkrGetOkrContainerPayload, OkrGetOkrContainerInput,
  OkrChangeOrderOfItemInput,
  OkrDeleteOkrObjectInput
} from '../type/payloadType';
import { ResourceId, OkrObjectPure, OkrContainerPure } from '../type/resourceType';
import { Wrn } from '../type/availableType';
import { State } from '../types';
// Library
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
// Translation
import tr from './okr_home.tr.json';
// MUI
import { Chip, Grid, Typography, IconButton, Menu, MenuItem, Badge } from '@material-ui/core';
// MUI icon
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import GroupIcon from '@material-ui/icons/Group';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
// Redux
import store from '../redux/store';
import { useSelector } from 'react-redux';
// Redux action
import { offOkrReload, setDialog, setOkrReloadOn, setSnackbar } from '../redux/actions';
import { throwEvent } from '../frontendWambda';
import LoadingFbStyle from '../components/loading_fbstyle/LoadingFbStyle';


const OkrHome: React.FC<{
  okrData: OkrGetMyOkrPayload,
  containerData: OkrContainerPure & ResourceId,
  setContainerData: React.Dispatch<React.SetStateAction<(OkrContainerPure & ResourceId) | undefined>>
}> = ({ okrData, containerData, setContainerData }) => {
  // Redux states
  const { support, language, okrLoading } = useSelector((state: State) => state);
  const ln = language;
  // state
  const [ okrObjects, setData ] = useState<OkrGetOkrObjectPayload>();
  const [ selectedData, setSelectedData ] = useState<ResourceId & OkrObjectPure>();
  const [ menu, openMenu ] = useState<null | HTMLElement>(null);
  const [ selectedChip, selectChip ] = useState<Wrn>(okrData.whichOneDownloadFirst);
  // Dialog state
  // foundState
  const [isDropDisabled, setDropDisabled] = useState(true);
  const [hoveredElement, setHoveredElement] = useState<Wrn>();

  // handler for loading
  useEffect(() => {
    if (!okrLoading.isLoading) return;

    // Get the container data first
    const getOkrContainerInput: OkrGetOkrContainerInput = { containerWrn: containerData.wrn }
    throwEvent("okr:getOkrContainer", getOkrContainerInput)
      .then(res => {
        const { foundContainerData, doesBelongToRequester } = res.payload as OkrGetOkrContainerPayload;
        setContainerData(foundContainerData);
        setDropDisabled(doesBelongToRequester !== true);
        const input: OkrGetOkrObjectInput = {
          userLink: okrData!.userLink,
          tempAccessToken: okrData!.tempAccessToken,
          containingObject: foundContainerData.containingObject!,
        };

        // get data
        throwEvent("okr:getOkrObject", input)
        .then(res => {
          if (res.serverResponse === "Accepted") {
            setData(res.payload as OkrGetOkrObjectPayload)
          };

          // finally
          store.dispatch(offOkrReload());
        })
      })
      .catch(() => store.dispatch(offOkrReload()))
    
  }, [okrLoading, okrData, containerData.wrn, setContainerData]);

  // handler
  const hdlClickMenu = (e: any, objectActionType: 'TO_PUBLIC' | 'TO_ONLY_ME' | 'DELETE') => {
    const userInput: WpChangeWpInput = {
      modifyingTarget: selectedData!.wrn,
      modifyingWpWrn: objectActionType === "TO_PUBLIC" 
        ? "wrn::wp:pre_defined:backend:dangerously_public:210811"
        : "wrn::wp:pre_defined:backend:only_owner:210811"
    };

    switch (objectActionType) {
      case "TO_ONLY_ME" || "TO_ONLY_ME": 
        throwEvent("wp:changeWp", userInput);
        break;
      case "DELETE":
        const eventInput: OkrDeleteOkrObjectInput = { deletingTargetWrn: selectedData!.wrn }
        throwEvent("okr:deleteOkrObject", eventInput)
          .then(() => store.dispatch(setOkrReloadOn()))
        break;
      default:
        break; // nothing happens
    };
    
    // finally
    openMenu(null);
  };

  const hdlMenuOpen = (target: HTMLElement, value: OkrObjectPure & ResourceId) => {
    openMenu(target);
    setSelectedData(value);
  }
 
  const RenderChips = okrData && okrData.quarterlyContainers.map(containerWrn => (
    <Chip
      key={containerWrn}
      variant={containerWrn === selectedChip ? undefined : "outlined"}
      size="small"
      label={`${containerWrn}`}
      clickable
      color={support.isDarkMode ? undefined : "primary"}
      onClick={() => selectChip(containerWrn)}
    />
  ));
  
  const hdlMouseHover = (e: React.MouseEvent, wrn: Wrn) => {
    if (e.type === 'mouseover') return setHoveredElement(wrn);
    else if (e.type === 'mouseleave') setHoveredElement(undefined);
  }
  
  // Sort first, and get the data
  const orderedOkrObjects = okrObjects && okrObjects.sort((a, b) => a.objectOrder! - b.objectOrder!);
  const RenderList = orderedOkrObjects && orderedOkrObjects.map((data, idx) => (
    <Draggable draggableId={data.wrn} key={data.wrn} index={idx}>
      {(provided) => (
        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} 
          onMouseOver={(e) => hdlMouseHover(e, data.wrn)} 
          onMouseLeave={(e) => hdlMouseHover(e, data.wrn)}
          defaultValue={data.wrn}
        >
          <Typography gutterBottom style={{ marginLeft: data.type === "Objective" ? 0 : 35, paddingTop: 5, paddingBottom: 5 }}>
            {data.resoureAvailability === "Visible"
              ? data.title
              : tr.thisDataIsPrivate[ln]
            }
            <IconButton size={"small"} className={"key render"} color="inherit" onClick={(e) => hdlMenuOpen(e.currentTarget, data)}>
              {hoveredElement === data.wrn && <MoreVertIcon fontSize="small" />}
            </IconButton>
          </Typography>
        </div>
      )}
    </Draggable>
    )
  )

  //handler
  const hdlDragEnd = async (result: any) => {
    if (isDropDisabled || !okrObjects) return;
    if (result.destination === null) return; // happens when dragged to non DragDropContext area

    const sourceIdx = result.source.index;
    const destinationIdx = result.destination.index;

    const originalData = Array.from(okrObjects);
    const newDataArr = originalData;
    const sourceData = newDataArr.splice(sourceIdx, 1)[0];
    newDataArr.splice(destinationIdx, 0, sourceData);

    // 
    if (newDataArr[0].type !== "Objective") {
      store.dispatch(setSnackbar("Key Result or daily routine cannot be on the top of list", "warning"));
      return;
    }

    // change frontEnd
    setData(newDataArr); // at first change the front end.

    // prepare for back sync if rejected, back to orignal data array.
    const newlyOrderedObjects = newDataArr.map((el, idx) => {
      el.objectOrder = idx;
      return el;
    });
    
    // Get pure WRN[] list & do the change of DB
    const input: OkrChangeOrderOfItemInput = { newlyOrderedObjects };
    const RE = await throwEvent("okr:changeOrderOfItem", input);
    if (RE.serverResponse === 'Accepted') return;

    // Back to original data
    setData(originalData); // as it has not been returned yet.
  }

  return (
    <Fragment>
      <Grid style={{ textAlign: 'left', paddingLeft: 25, paddingTop: 20 }}>
        <Grid style={{ paddingTop: 10 }}>
          {okrData && `${okrData.name}@${okrData.id}`}
          
          <IconButton className={"moreMyOkr"} color="inherit" aria-label="language" onClick={(e) => store.dispatch(setDialog("CreateOkrObject", containerData))}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
          
          <IconButton className={"GroupIcon"} color="inherit" aria-label="language" onClick={() => store.dispatch(setDialog("GroupDialog", okrData))}>
            <GroupIcon fontSize="small" />
          </IconButton>
          <IconButton className={"Notification"} color="inherit" aria-label="language" onClick={() => {}}>
            <Badge color="secondary" variant="dot">
              <NotificationsNoneIcon fontSize="small" />
            </Badge>
          </IconButton>
          
          
        </Grid>
        <Grid style={{ paddingTop: 25 }}>
          { RenderChips }
        </Grid>
        <Grid style={{ paddingTop: 10 }}>
          <DragDropContext onDragEnd={(result) => hdlDragEnd(result)}>
            <Droppable isDropDisabled={isDropDisabled} droppableId="testTempid">
              {(provided) => (
                <div ref={provided.innerRef}  {...provided.droppableProps}>
                  { RenderList }
                  { provided.placeholder }
                </div>
              )}
            </Droppable>
          </DragDropContext>
          { okrLoading.isLoading && <LoadingFbStyle />}
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
        <MenuItem onClick={(e) => hdlClickMenu(e, 'TO_PUBLIC')}>{`Change To Public`}</MenuItem>
        <MenuItem onClick={(e) => hdlClickMenu(e, 'TO_ONLY_ME')}>{`Change To Only Me (Private)`}</MenuItem>
        <MenuItem onClick={(e) => hdlClickMenu(e, 'DELETE')}>{`Delete this`}</MenuItem>
      </Menu>
    </Fragment>
  );
};

export default OkrHome;