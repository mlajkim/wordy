import React, {Fragment} from 'react';
import Background from '../../img/dashboard.jpeg';
import { Language } from '../../types';
import tr from './dashboard.tr.json';
// Redux
import store from '../../redux/store';
import {setDialog, setSignedIn, setPage} from '../../redux/actions';
import {useSelector} from 'react-redux';

const Dashboard = () => {
  const ln = useSelector((state: {language: Language}) => state.language);

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
      <h1>{tr.title[ln]}</h1>
      </div>
    </Fragment>
  );
};

export default Dashboard;