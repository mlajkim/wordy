import React, {Fragment} from 'react';
import './Home.css';
import Button from '@material-ui/core/Button';
import tr from './home.tr.json';
import {Language} from '../../types';
// imgs
import Background from '../../img/home_background.jpeg';
// Redux
import store from '../../redux/store';
import {setDialog, setLanguage} from '../../redux/actions';
import {useSelector} from 'react-redux';

const style = {
  intro: {
    paddingTop: '8%',
    fontSize: 18
  },
  signUpButton: {
    marginBottom: 25
  },
  span: {
    textDecoration: "underline", 
    margin: 3, 
    cursor: "pointer"
  }
}

const Home = () => {
  const ln = useSelector((state: {language: Language}) => state.language);

  const handleLanguageChange = () => {
    store.dispatch(setLanguage('en'));
  };
  const handleDialog = (type: 'LoginDialog' | 'SignUpDialog') => {
    store.dispatch(setDialog(type))
  };

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
        <div className="center" style={style.intro}>
          <h1 className="center title">{tr.title[ln]}</h1>
          <p>{tr.desc1[ln]}</p> 
          <p>{tr.desc2[ln]}</p>
          <p>{tr.desc3[ln]}</p>
          <p>{tr.desc4[ln]}</p>
          <Button variant="outlined" color="primary" style={style.signUpButton} onClick={() => handleDialog('SignUpDialog')}>{tr.signUpBtn[ln]}</Button>
          <p style={{fontSize: 13}}>{tr.loginInstead[ln]}<span onClick={() => handleDialog('LoginDialog')}style={style.span}>{tr.loginBtn[ln]}</span></p>
          {ln !== 'en' && <p style={{fontSize: 13}}>Wordy offered in: <span onClick={() => handleLanguageChange()}style={style.span}>English</span></p>}
        </div>
      </div>
    </Fragment>
    
  )
};

export default Home;