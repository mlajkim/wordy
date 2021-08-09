import React, { Fragment } from 'react';
// Types
import { State } from '../types';
// Material UI
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
// Translation
import tr from './okr.tr.json';
import {useSelector} from 'react-redux';
// Theme
import { listDark, listLight } from '../theme';
// Redux
import store from '../redux/store';
import { modifyNewWordAddingType } from '../redux/actions/supportAction';

const Okr: React.FC = () => {
  // Redux states
  const { language, support } = useSelector((state: State) => state);
  const ln = language;

  return (
    <Fragment>
      <Container maxWidth="md" style={{marginTop: 10, textAlign: "center"}}>
        <Typography component="div" style={{ backgroundColor: support.isDarkMode ? listDark : listLight, minHeight: '30vh' }}>
          hi
        </Typography>
      </Container>
    </Fragment>
    
  )
};

export default Okr;