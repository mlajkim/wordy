import React, {Fragment} from 'react';
// Material UI
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
// Redux
import { useSelector } from 'react-redux';
// Theme
import { listDark, listLight } from '../../theme';
// Type
import { State } from '../../types';


const Setting = () => {
  const { support } = useSelector((state: State) => state);

  return (
    <Fragment>
      <Container maxWidth="md" style={{marginTop: 10, textAlign: "center"}}>
        <Typography component="div" style={{ backgroundColor: support.isDarkMode ? listDark : listLight, height: '30vh' }}>
          hi
        </Typography>
      </Container>
    </Fragment>
  )
};

export default Setting;