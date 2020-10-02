// eslint-disable-next-line
import React, {useState} from 'react';
import Appbar from './Appbar';
// Mains
import Dialog from './Dialog';
import Page from './Page';
import Drawer from './Drawer';

const App = () => {
  
  return (
    <div>
      <Appbar />
      <Dialog />
      <Page />
    </div>
  )
};

export default App;