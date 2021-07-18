import React, {Fragment, useState} from 'react';
import { State } from '../../types';
// Redux
import store from '../../redux/store';
import {deleteWords} from '../../redux/actions/wordsAction';
import {offDialog, setSnackbar} from '../../redux/actions';
import {useSelector} from 'react-redux';
// Material UI Cores
import CircularProgress from '@material-ui/core/CircularProgress';
// Material UI Icons
import DoneIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Error';

/**
 * If loading takes more time than expected, 
 * then it first lets the end user know that it is being late.
 * After the maximum time, the btn itself goes back to idle state
 * So that the end user can try one more time
 */
const MAX_LOADING_TIMEOUT_SEC = 20; 
const SLOWER_THAN_EXPECTED_TIMEOUT_SEC = MAX_LOADING_TIMEOUT_SEC / 2;

type CustomPayloadType = { sem: number, IDs: {ID: string}[] }

type KeepStyleBtnPropType = {
  btnName: string;
  BtnType: any;
  action: any;
  success: any;
  failure: any;
  customize: CustomizeInput;
};

type CustomizeInput = {

};

type ProcessState = 'idle' | 'loading' | 'fail' | 'ok'; 

const KeepStyleBtn: React.FC<KeepStyleBtnPropType> = ({
  btnName, BtnType, action, success, failure, customize
}) => {
  // State values
  const [processState, setProcessState] = useState<ProcessState>('idle');

  // Button Renderer 
  // Logically only one button exsits
  let RenderButton = null;
  switch (processState) {
    case 'idle':
      return RenderButton = <BtnType />
    case 'loading':
      return RenderButton = <CircularProgress size={20} />
    case 'fail':
      return RenderButton = <ErrorIcon />
    case 'ok':
      return RenderButton = <DoneIcon />
    default:
      RenderButton = <ErrorIcon /> // should not happen.
  }

  return (
    <Fragment>
      <BtnType>
        { RenderButton }
      </BtnType>
    </Fragment>
  );
}

export default KeepStyleBtn;