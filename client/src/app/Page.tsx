import React from 'react';
import { useSelector } from "react-redux";
// Pages
import Home from '../pages/home/Home';

const Page = () => {
  // states
  const page = useSelector((state: any) => state.page);
  
  switch(page) {
    case '' || 'home': 
      return <Home />;

    default:
      return null;
  }
}

export default Page;