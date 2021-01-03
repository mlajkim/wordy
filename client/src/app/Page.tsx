import React from 'react';
// Pages
import Home from '../pages/home/Home';
import Dashboard from '../pages/dashboard/Dashboard';
import Review from '../pages/review/Review';
import List from '../pages/list/List';
import Scrabbly from '../pages/scrabbly/Scrabbly'
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

    case 'scrabbly':
      return <Scrabbly />
    
    case user.isSignedIn && 'review':
      return <Review />;

    case user.isSignedIn && 'list':
      return <List />;

    default:
      store.dispatch(setPage('home'));
      store.dispatch(setDialog('Warning401'))
      return <Home />;
  }
}

export default Page;