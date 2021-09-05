import React, { Fragment } from 'react';
import { State } from '../../types';
// Translation
// Theme
import { listDark, listLight } from '../../theme';
// Redux
// import store from '../../redux/store';
import { useSelector } from 'react-redux';
// Material UI
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

const SearchResult: React.FC = () => {
  // Redux states
  const { support } = useSelector((state: State) => state);
  
  return (
    <Fragment>
      <Container maxWidth="md" style={{marginTop: 10, textAlign: "center"}}>
        <Typography component="div" style={{ backgroundColor: support.isDarkMode ? listDark : listLight, minHeight: '30vh' }}>
          "{support.searchData}" does not exist ...
        </Typography>
      </Container>
    </Fragment>
  )
};

export default SearchResult;