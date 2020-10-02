// eslint-disable-next-line
import React from 'react';
import Appbar from './Appbar';
// Mains
import Dialog from './Dialog';
import Page from './Page';
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