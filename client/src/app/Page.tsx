import React from 'react';
// Pages
import Home from '../pages/home/Home';
import Dashboard from '../pages/dashboard/Dashboard';
import Review from '../pages/review/Review';
import List from '../pages/list/List';
// Redux
import store from '../redux/store';
import {setPage, setDialog} from '../redux/actions';
import {useSelector} from 'react-redux';

const Page = () => {
  // states
  const {page, isSignedIn} = useSelector((state: any) => state);
  
  switch(page) {
    case '' || 'home': 
      return <Home />;

    case 'dashboard':
      return <Dashboard />;
    
    case isSignedIn && 'review':
      return <Review />;

    case isSignedIn && 'list':
      return <List />;

    default:
      store.dispatch(setPage('home'));
      store.dispatch(setDialog('Warning401'))
      return <Home />;
  }
}

export default Page;