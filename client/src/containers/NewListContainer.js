import React from 'react'

import NewList from '../components/NewList';

export default class NewListContainer extends React.Component {
  render() {
    return (
      <div> Hello New List  Container
        <NewList />
      </div>
    )
  }
}