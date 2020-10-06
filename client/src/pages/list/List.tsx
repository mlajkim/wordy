import React, {Fragment, useEffect} from 'react';
import './List.css';
import * as API from '../../API';
import {State} from '../../types';
//GraphQL & Apolo
import { useQuery } from 'react-apollo';
import { YEARS_QUERY } from '../../apollo/queries';
// Material UI
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
// Translation
import tr from './list.tr.json';
// Redux
import store from '../../redux/store';
import {setYears, setDialog} from '../../redux/actions';
import {useSelector} from 'react-redux';

const List = () => {
  // Redux states
  const {language, user, years} = useSelector((state: State) => state);
  const ln = language;
  // Apollo states
  const {loading, error, data} = useQuery(YEARS_QUERY, {
    variables: { ID: user.ID, accessToken: API.getAccessToken() }
  });
  useEffect(() => {
    if(!loading && !error) store.dispatch(setYears(data.years));
  }, [loading, error]);

  return (
    <Fragment>
      <Container maxWidth="md" style={{marginTop: 10, textAlign: "center"}}>
      <Typography component="div" style={{ backgroundColor: '#F2F2F2', height: '100vh' }}>
        {years.length === 0
          ? <div style={{paddingTop: 50}}>
              <h4>{tr.empty[ln]}</h4>
              <Button variant="outlined" color="primary" onClick={() => store.dispatch(setDialog('AddWordsDialog'))}>
                {tr.emptyBtn[ln]}
              </Button>
              <Button disabled variant="outlined" color="secondary" >
                {tr.emptyProBtn[ln]}
              </Button>
            </div>
          : <h3>I see you have data</h3>
        }
        </Typography>
      </Container>
    </Fragment>
    
  )
};

export default List;