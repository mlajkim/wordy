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
        <h4>서비스 개발중입니다 (10월 내)</h4>
        <h4>Under construction (Within October)</h4>
        <h4>準備中でございます (10月の末まで) </h4>
        <h4>现在作成中 (到十月)</h4>
      </div>
    </Fragment>
    
  )
};

export default Review;