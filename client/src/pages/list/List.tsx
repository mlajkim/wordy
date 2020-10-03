import React, {Fragment} from 'react';
import tr from './list.tr.json';
import {Language} from '../../types';
// Redux
import store from '../../redux/store';
import {setDialog, setLanguage} from '../../redux/actions';
import {useSelector} from 'react-redux';

const List = () => {
  const {language} = useSelector((state: {language: Language}) => state);
  const ln = language;

  return (
    <Fragment>
      list
    </Fragment>
    
  )
};

export default List;