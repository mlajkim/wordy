import React, {Fragment} from 'react';
import tr from './review.tr.json';
import {Language} from '../../types';
// Redux
import store from '../../redux/store';
import {setDialog, setLanguage} from '../../redux/actions';
import {useSelector} from 'react-redux';

const Review = () => {
  const {language} = useSelector((state: {language: Language}) => state);
  const ln = language;

  return (
    <Fragment>
      home
    </Fragment>
    
  )
};

export default Review;