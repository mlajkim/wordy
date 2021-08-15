import React, { Fragment, useEffect, useState } from 'react';
// Types
import { State } from '../types';
import { WordyEvent } from '../type/wordyEventType';
import { OkrContainerPure, ResourceId } from '../type/resourceType';
import { OkrGetMyOkrInput, OkrGetMyOkrPayload, OkrGetOkrContainerInput, OkrGetOkrContainerPayload } from '../type/payloadType';
// library
import { throwEvent } from '../frontendWambda';
// Material UI
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
// pages
import NotFound from '../okr/NotFound';
import OkrWelcome from '../okr/OkrWelcome';
import OkrLoading from '../okr/OkrLoading';
import OkrNotSignedIn from '../okr/OkrNotSignedIn';
import OkrHome from '../okr/OkrHome';
// Theme
import { listDark, listLight } from '../theme';
// Redux
import { useSelector } from 'react-redux';
// Redux
import store from '../redux/store';
import { setOkrReloadOn } from '../redux/actions';


const Okr: React.FC = () => {
  // Redux states
  const { support } = useSelector((state: State) => state);
  // Okr State
  // const [pathData, setPathData] = useState<PathData>({ federalProviderAndId: "" });
  const [okrPage, setOkrPage] = useState<"loading" | "notSignedIn" | "welcome" | "okrMode" | "notFound">("loading");
  const [okrData, setOkrData] = useState<OkrGetMyOkrPayload>();
  const [containerData, setContainerData] = useState<OkrContainerPure & ResourceId>();
  
  // Run once: read the path URL for it
  useEffect(() => {
    // Read and organize the path data
    const path = window.location.pathname; // /okr/<userName>/accessToken
    const pathArr = path.split("/"); // ["", "okr", "csuserName", "tempAccessToken"]
    const pathData: OkrGetMyOkrInput = {
      userLink: pathArr.length > 2 ? pathArr[2] : "",
      tempAccessToken: pathArr.length > 3 ? pathArr[3]: ""
    };

    const callAsyncFunction = async () => {
      const returnedWordyEvent = await throwEvent("okr:getMyOkr", pathData, pathData.tempAccessToken) as WordyEvent;
      if (returnedWordyEvent.serverResponse === "Accepted") {
        const okrData = returnedWordyEvent.payload as OkrGetMyOkrPayload;
        setOkrData(okrData);
        // get the events 
        const userInput: OkrGetOkrContainerInput = { containerWrn: okrData.whichOneDownloadFirst };
        const returnedGetOkrContainerEvent = await throwEvent("okr:getOkrContainer", userInput, pathData.tempAccessToken);

        if (returnedGetOkrContainerEvent) {
          const { foundContainerData } = returnedGetOkrContainerEvent.payload as OkrGetOkrContainerPayload;
          setContainerData(foundContainerData);
          setOkrPage("okrMode");

          store.dispatch(setOkrReloadOn());

          return; //
        }
      } else {
        if (pathData.userLink !== "") setOkrPage("notFound");
        else setOkrPage("welcome");
      }

    }
    
    // call
    callAsyncFunction()
  }, []);

  const showThisPage = () => {
    switch(okrPage) {
      case "notFound": return <NotFound />
      case "loading": return <OkrLoading />
      case "welcome": return <OkrWelcome />
      case "okrMode":
        if (okrData && containerData) return  <OkrHome okrData={okrData} containerData={containerData} setContainerData={setContainerData}/>
        return <OkrLoading />
      case "notSignedIn": return <OkrNotSignedIn setOkrPage={setOkrPage}/>
      default: return null;
    }
  }

  return (
    <Fragment>
      <Container maxWidth="md" style={{marginTop: 10, textAlign: "center"}}>
        <Typography component="div" style={{ backgroundColor: support.isDarkMode ? listDark : listLight, minHeight: '30vh' }}>
          { showThisPage() }
        </Typography>
      </Container>
    </Fragment>
  )
};

export default Okr;