import React from 'react';
import { useSelector } from "react-redux";
// Pages
import Home from '../pages/home/Home';
import Dashboard from '../pages/dashboard/Dashboard';

const Page = () => {
  // states
  const page = useSelector((state: any) => state.page);
  
  switch(page) {
    case '' || 'home': 
      return <Home />;

    case 'dashboard':
      return <Dashboard />
    default:
      return null;
  }
}

export default Page;