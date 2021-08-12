import React, { Fragment, useEffect, useState } from 'react';
// type
import OkrData from './OkrPageData';
import { State } from '../types';
// MUI
import { Chip, Grid, Menu, MenuItem, IconButton } from '@material-ui/core';
// MUI icon
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddBoxRoundedIcon from '@material-ui/icons/AddBoxRounded';
// Redux
import { useSelector } from 'react-redux';


const OkrHome: React.FC<{
  okrData: OkrData,
  setOkrData: React.Dispatch<React.SetStateAction<OkrData | undefined>>;
}> = ({
  okrData, setOkrData
}) => {
  // Redux states
  const { support } = useSelector((state: State) => state);
  // state
  const { myOkrData } = okrData;
  const [selectedSem, setSelectedSem] = useState(0);
  const [menu, openMenu] = useState<null | HTMLElement>(null);

  useEffect(() => {
    // selecting sem algorithm. for now, I will hard code choosing 213
    const foundSemByAlgorithm = 213;

    // Set selectedSem for data pulling
    setSelectedSem(foundSemByAlgorithm);
  }, []);

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

  // handler
  const hdlMoreClick = (e: React.MouseEvent<HTMLButtonElement>) => openMenu(e.currentTarget);

  // handler
  const hdlCreateObject = () => {

  }

  return (
    <Fragment>
      <Grid style={{ textAlign: 'left', paddingLeft: 25, paddingTop: 20 }}>
        <Grid style={{ paddingTop: 10 }}>
          {`${myOkrData.name}@${myOkrData.id}`}
          <IconButton className={"moreMyOkr"} color="inherit" aria-label="language" onClick={(e) => hdlMoreClick(e)}>
            <AddBoxRoundedIcon fontSize="small" />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={menu}
            keepMounted
            open={Boolean(menu)}
            onClose={() => openMenu(null)}
          >
            <MenuItem onClick={() => hdlCreateObject()}>Create Key Result</MenuItem>
          </Menu>
        </Grid>
        <Grid style={{ paddingTop: 25 }}>
          { RenderChips }
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default OkrHome;