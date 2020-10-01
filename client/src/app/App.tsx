// eslint-disable-next-line
import React from 'react';
import Appbar from './Appbar';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from  'react-apollo';
import Dialog from './Dialog';

const client = new ApolloClient({uri: '/graphql'});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Appbar />
      <Dialog />
    </ApolloProvider>
  )
};

export default App;