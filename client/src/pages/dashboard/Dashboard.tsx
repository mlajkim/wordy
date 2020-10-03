import React, {Fragment} from 'react';
import Background from '../../img/dashboard.jpeg';
import { Language } from '../../types';
import tr from './dashboard.tr.json';
// Redux
import {useSelector} from 'react-redux';
// Components
import Menu from '../../components/menu/Menu';

const Dashboard = () => {
  const ln = useSelector((state: {language: Language}) => state.language);

  return (
    <Fragment>
      <div style={{
        backgroundImage: `url(${Background})`,
        marginTop: 10,
        height: 700,
        width: "100%",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}>
      <h1 style={{paddingTop: 35, paddingLeft: 35}}>{tr.title[ln]}</h1>
      <Menu type="review"/>
      <Menu type="list"/>
      </div>
    </Fragment>
  );
};

export default Dashboard;