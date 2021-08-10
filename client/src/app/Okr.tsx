import React, { Fragment, useEffect, useState } from 'react';
// Types
import { State } from '../types';
// library
import { throwEvent } from '../frontendWambda';
// Material UI
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
// pages
import OkrWelcome from '../okr/OkrWelcome';
import OkrLoading from '../okr/OkrLoading';
import OkrNotSignedIn from '../okr/OkrNotSignedIn';
// Theme
import { listDark, listLight } from '../theme';
// Redux
import {useSelector} from 'react-redux';
// Redux Actions
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
  // Okr State
  // const [pathData, setPathData] = useState<PathData>({ federalProviderAndId: "" });
  const [okrPage, setOkrPage] = useState<"loading" | "notSignedIn" | "welcome">("loading");

  // Run once: read the path URL for it
  useEffect(() => {
    // Read and organize the path data
    const path = window.location.pathname; // /okr/<userName>/accessToken
    const pathArr = path.split("/"); // ["", "okr", "userName", "tempAccessToken"]
    const pathData: PathData = {
      federalProviderAndId: pathArr.length > 2 ? pathArr[2] : "",
      tempAccessToken: pathArr.length > 3 ? pathArr[2]: ""
    };

    throwEvent("user:getUser", pathData)
      .then(() => setOkrPage("welcome"));
  }, []);

  return (
    <Fragment>
      <Container maxWidth="md" style={{marginTop: 10, textAlign: "center"}}>
        <Typography component="div" style={{ backgroundColor: support.isDarkMode ? listDark : listLight, minHeight: '30vh' }}>
          {okrPage === "loading" && <OkrLoading />}
          {okrPage === "welcome" && <OkrWelcome />}
          {okrPage === 'notSignedIn' && <OkrNotSignedIn setOkrPage={setOkrPage}/>}
        </Typography>
      </Container>
    </Fragment>
  )
};

export default Okr;