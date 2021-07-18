import React, {Fragment, useState} from 'react';
import { State } from '../../types';
// Types
import { KeepStyleBtnPropType, KsbState } from '../../frontendTypes';
// Redux
import store from '../../redux/store';
import {deleteWords} from '../../redux/actions/wordsAction';
import {offDialog, setSnackbar} from '../../redux/actions';
import {useSelector} from 'react-redux';
// Redux Actions
import { KsbClick } from '../../redux/actions/keepStyleBtnAction';
// Material UI Cores
import CircularProgress from '@material-ui/core/CircularProgress';
// Material UI Icons
import DoneIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Error';

const KeepStyleBtn: React.FC<KeepStyleBtnPropType> = (props) => {
  const [processState, setProcessState] = useState<KsbState>("idle");
  const { keepStyleBtn } = useSelector((state: State) => state);
  const idx = keepStyleBtn.findIndex(ksb => ksb.btnName === props.btnName);
  if (idx !== -1) setProcessState(keepStyleBtn[idx].ksbState); // Change to its state!!
  const BtnType = props.BtnType;

  // Action Handler
  const hdlClick = () => {
    store.dispatch(KsbClick(props));
  };

  // Button Renderer 
  // Logically only one button exsits
  let RenderButton = null;
  switch (processState) {
    case 'idle':
      return RenderButton = <BtnType onClick={() => hdlClick()}/>
    case 'loading':
      return RenderButton = <CircularProgress size={20} />
    case 'fail':
      return RenderButton = <ErrorIcon />
    case 'OK':
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