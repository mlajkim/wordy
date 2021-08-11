import React, { Fragment, useEffect } from 'react';
// type
import OkrData from './OkrPageData';
import { State } from '../types';
// MUI
import { Chip, Grid } from '@material-ui/core';
// Redux
import { useSelector } from 'react-redux';


const OkrHome: React.FC<{
  okrData: OkrData,
  setOkrData: React.Dispatch<React.SetStateAction<OkrData | undefined>>;
}> = ({
  okrData, setOkrData
}) => {
  // Redux states
  const {language, support} = useSelector((state: State) => state);
  const ln = language;
  // state
  const { myOkrData } = okrData;

  useEffect(() => {
    
  }, []);

  // handler
  const hdlChipClick = () => {

  };

  const RenderChips = myOkrData.okrSems.map(sem => (
    <Chip
      key={sem}
      variant="outlined"
      size="small"
      label={sem}
      clickable
      color={support.isDarkMode ? undefined : "primary"}
      onClick={() => hdlChipClick()}
    />
  ));

  // select color 


  return (
    <Fragment> 
      <Grid style={{ textAlign: 'center', paddingTop: 10 }}>
        {`${myOkrData.name}@${myOkrData.id}`}
      </Grid>
      <Grid style={{ textAlign: 'center', paddingTop: 50 }}>
        { RenderChips }
      </Grid>
    </Fragment>
  );
};

export default OkrHome;