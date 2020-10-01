// eslint-disable-next-line
import React from 'react';
import Appbar from './Appbar';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from  'react-apollo';
// Redux
import store from '../redux/store';
import {Provider} from 'react-redux'
// Mains
import Dialog from './Dialog';

const client = new ApolloClient({uri: '/graphql'});

const App = () => {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <Appbar />
        <Dialog />
      </ApolloProvider>
    </Provider>
    
  )
};

export default App;