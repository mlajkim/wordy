import React, {Fragment} from 'react';
// Material UI
import Container from '@material-ui/core/Container';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
// Redux
import { useSelector } from 'react-redux';
import store from '../../redux/store';
// Theme
import { listDark, listLight } from '../../theme';
// Type
import { State } from '../../types';
// Redux Actions
import { modifySupport } from '../../redux/actions/supportAction';


const Setting = () => {
  const { support } = useSelector((state: State) => state);

  const hdlYearQuadrantEnabledClicked = () => {
    store.dispatch(modifySupport({ isYearQuadrantEnabled: !support.isYearQuadrantEnabled }, true));
  }

  return (
    <Fragment>
      <Container maxWidth="md" style={{marginTop: 10, textAlign: "left"}}>
        <Typography component="div" style={{ backgroundColor: support.isDarkMode ? listDark : listLight, height: '30vh' }}>
          { drawButton("Enable Year & Quadrant for MassWords", support.isYearQuadrantEnabled, hdlYearQuadrantEnabledClicked) }
        </Typography> 
      </Container>
    </Fragment>
  )
};

const drawButton = (labelName: string, value: boolean, hdlChangeAction: any) => {
  const DEFAULT_LABEL = 'start'; // Place label left to the button (starting position)
  return (
    <FormControlLabel
      value="top"
      control={
        <Switch color="primary" />
      }
      label={ labelName }
      onChange={() => hdlChangeAction()}
      labelPlacement={ DEFAULT_LABEL }
      checked={ value } 
    />
  )
}

export default Setting;