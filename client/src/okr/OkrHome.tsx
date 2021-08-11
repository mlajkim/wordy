import React, { Fragment } from 'react';
// type
import OkrData from './OkrPageData';

const OkrHome: React.FC<{
  okrData: OkrData | undefined,
  setOkrData: React.Dispatch<React.SetStateAction<OkrData>>;
}> = ({
  okrData, setOkrData
}) => {
  return (
    <Fragment>
      Hi, youare loggied in
    </Fragment>
  );
};

export default OkrHome;