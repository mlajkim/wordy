// Import the basics
import React from 'react';

// Import Bootstrap
import Spinner from 'react-bootstrap/Spinner'

function LoadingAnimationStyle () {
  return(
    <Spinner animation="border" variant="success"  role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  )
}

export default LoadingAnimationStyle;