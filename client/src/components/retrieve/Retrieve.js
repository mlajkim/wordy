import React from 'react'

import Button from '@material-ui/core/Button'

export default function Retrieve (props) {
  return(
    <>
      <Button variant="outlined" color="primary" onClick={props.retrieveWords}>
        Retrieve Words
      </Button>
    </>
  )
}

