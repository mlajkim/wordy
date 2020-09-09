import React from 'react';

export default function Introduce(props) {
  return (
    <div>
      <img src={require('./Introduce.jpg')} alt="introduction" />
      <h1>
        I am glad you have joined our community, {props.profile.givenName}!!
        You can start your journey and become multi lingular really quick.
      </h1>
    </div>
  );
};