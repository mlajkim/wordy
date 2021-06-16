import React from 'react';
// Pages
import Home from '../pages/home/Home';
import Dashboard from '../pages/dashboard/Dashboard';
import Review from '../pages/review/Review';
import List from '../pages/list/List';
import Scrabbly from '../pages/scrabbly/Scrabbly';
import AdminPage from '../pages/adminPage/AdminPage';
import Setting from '../pages/setting/Setting';
// Redux
import store from '../redux/store';
import {setPage, setDialog} from '../redux/actions';
import {useSelector} from 'react-redux';

const Page = () => {
  // states
  const {page, user} = useSelector((state: any) => state);
  
  switch(page) {
    case '' || 'home': 
      return <Home />;

    case 'dashboard':
      return <Dashboard />;

    case user.isSignedIn && 'setting':
      return <Setting />;

    case user.isSignedIn && 'scrabbly':
      return <Scrabbly />;

    case 'admin':
      return <AdminPage />;
    
    case user.isSignedIn && 'review':
      return <Review />;

    case user.isSignedIn && 'list':
      return <List />;

    default:
      // When you are not signed it, or any fail.
      store.dispatch(setPage('home'));
      store.dispatch(setDialog('Warning401'))
      return <Home />;
  }
}

export default Page;