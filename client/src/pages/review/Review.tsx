import React, {Fragment} from 'react';
import { State } from '../../types';
import * as API from '../../API';
// Translation
import tr from './review.tr.json';
import listTr from '../list/list.tr.json';
// Redux
import store from '../../redux/store';
import {useSelector} from 'react-redux';
// Actions
import {setPage} from '../../redux/actions';
// Material UI
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
//Requirements
const REQUIRED_WORDS_COUNT = 100;

const Review = () => {
  // Redux states
  const {language, support, user} = useSelector((state: State) => state);
  const ln = language;
  // Requirements
  const notEnoughWords = support.newWordCnt - support.deletedWordCnt < REQUIRED_WORDS_COUNT;

  // Methods
  const handleAddWordClick = () => {
    store.dispatch(setPage('list'))
    API.handleNewWordAddingType(user.ID!, 'one');
  }
  
  return (
    <Fragment>
      <Container maxWidth="md" style={{marginTop: 10, textAlign: "center"}}>
        <Typography component="div" style={{ backgroundColor: '#F2F2F2', height: '18vh' }}>
          <div style={{paddingTop: 50}}>
            {notEnoughWords
              ? (
                <Fragment>
                  <h4>{tr.notEnough[ln]}: {REQUIRED_WORDS_COUNT}</h4>
                  <h5>({tr.userHas[ln]}: {support.newWordCnt-support.deletedWordCnt})</h5>
                  <Button variant="outlined" color="primary" 
                    onClick={() => handleAddWordClick()}>
                    {listTr.emptyBtn[ln]}
                  </Button>
                </Fragment>
                )
              : <h4>ok</h4>
            }
          </div>
        </Typography>
      </Container>
      
    </Fragment>
  )
};

export default Review;