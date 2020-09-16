import React from 'react';

export default function Welcome(props) {
  return (
    <div>
      {console.log(props.profile)}
      <img src={require('./home.jpg')} alt="welcome"/>
    </div>
  )
}