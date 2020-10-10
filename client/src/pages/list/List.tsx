import React, {Fragment} from 'react';
import * as API from '../../API';
import './List.css';
import {State} from '../../types';
import YearChip from './YearChip';
// Material UI
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
// Translation
import tr from './list.tr.json';
// Redux
import store from '../../redux/store';
import {setDialog} from '../../redux/actions';
import {useSelector} from 'react-redux';

const List = () => {
  // Redux states
  const {language, years, user} = useSelector((state: State) => state);
  const ln = language;

  return (
    <Fragment>
      <Container maxWidth="md" style={{marginTop: 10, textAlign: "center"}}>
      <Typography component="div" style={{ backgroundColor: '#F2F2F2', height: '100vh' }}>
        {years.length === 0
          ? <div style={{paddingTop: 50}}>
              <h4>{tr.empty[ln]}</h4>
              <Button variant="outlined" color="primary" 
                onClick={() => API.handleNewWordAddingType(user.ID!, 'one')}>
                {tr.emptyBtn[ln]}
              </Button>
              <Button disabled variant="outlined" color="secondary" 
                onClick={() => API.handleNewWordAddingType(user.ID!, 'mass')}>
                {tr.emptyProBtn[ln]}
              </Button>
            </div>
          : <YearChip />
        }
        </Typography>
      </Container>
    </Fragment>
    
  )
};

export default List;