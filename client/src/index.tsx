// eslint-disable-next-line
import React from 'react';
import ReactDOM from 'react-dom';
// Apolo
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from  'react-apollo';
// Redux
import store from './redux/store';
import {Provider} from 'react-redux'
// Cookies
import { CookiesProvider } from 'react-cookie';
// import App1 from './app/App1';
import App from './app/App';
const graphqlClient = new ApolloClient({uri: '/graphql'});

ReactDOM.render((
  <Provider store={store}>
    <ApolloProvider client={graphqlClient}>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </ApolloProvider>
  </Provider>
), document.getElementById('root'));