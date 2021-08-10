import React, { Fragment, useEffect,useState } from 'react';
// Types
import { State } from '../types';
// library
import { throwEvent } from '../frontendWambda';
// Material UI
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
// Translation
import {useSelector} from 'react-redux';
// Theme
import { listDark, listLight } from '../theme';
// // Redux
// import store from '../redux/store';
// import { modifyNewWordAddingType } from '../redux/actions/supportAction';
// Declare
type PathData = {
  federalProviderAndId: string;
  tempAccessToken?: string;
}

const Okr: React.FC = () => {
  // Redux states
  const { support } = useSelector((state: State) => state);
  // const ln = language;
  // Okr State
  const [pathData, setPathData] = useState<PathData>({ federalProviderAndId: "" });

  // Run once: read the path URL for it
  useEffect(() => {
    const path = window.location.pathname; // /okr/<userName>/accessToken
    const pathArr = path.split("/"); // ["", "okr", "userName", "tempAccessToken"]
    if (pathArr.length > 3) setPathData({ federalProviderAndId: pathArr[2], tempAccessToken: pathArr[3] });
    else if (pathArr.length > 2) setPathData({ federalProviderAndId: pathArr[2] });
    else setPathData({ federalProviderAndId: "" }); // set blank, so that depending useEffect can run
  }, []);

  // When state is set, run the following
  useEffect(() => {
    throwEvent("user:getUser")
      .then(res => console.log(res));
  }, [pathData])

  return (
    <Fragment>
      <Container maxWidth="md" style={{marginTop: 10, textAlign: "center"}}>
        <Typography component="div" style={{ backgroundColor: support.isDarkMode ? listDark : listLight, minHeight: '30vh' }}>
          hello OKR.
        </Typography>
      </Container>
    </Fragment>
    
  )
};

export default Okr;