import React, {Fragment, useEffect} from 'react';
import Background from '../../img/listPage.jpeg';
import Cookies from 'js-cookie';
import axios from 'axios';
import * as API from '../../API';
import {State} from '../../types';
// Material UI
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
// Translation
import tr from './list.tr.json';
// Redux
import store from '../../redux/store';
import {setDialog, setLanguages} from '../../redux/actions';
import {useSelector} from 'react-redux';

const List = () => {
  const {language, user} = useSelector((state: State) => state);
  const ln = language;

  return (
    <Fragment>
      <Container maxWidth="md" style={{marginTop: 10}}>
        <Typography component="div" style={{ backgroundColor: '#F2F2F2', height: '100vh' }}>
          It seems like you have not added any data yet.
          <Button variant="outlined" color="primary">Add your words here</Button>
        </Typography>
      </Container>
    </Fragment>
    
  )
};

export default List;