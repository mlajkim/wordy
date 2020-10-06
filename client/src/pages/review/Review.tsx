import React, {Fragment} from 'react';
import Background from '../../img/reviewPage.jpeg';
// Translation
// import tr from './review.tr.json';
// import {Language} from '../../types';
// Redux
// import store from '../../redux/store';
// import {setDialog, setLanguage} from '../../redux/actions';
// import {useSelector} from 'react-redux';

const Review = () => {
  // const {language} = useSelector((state: {language: Language}) => state);
  // const ln = language;

  return (
    <Fragment>
      <div style={{
        backgroundImage: `url(${Background})`,
        marginTop: 10,
        height: 650,
        width: "100%",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}>
        
      </div>
    </Fragment>
    
  )
};

export default Review;