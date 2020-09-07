import React from 'react';

import Wordcard from '../../components/Wordcard/Wordcard';
import Button from '@material-ui/core/Button'

export default function List(props) {
  let body = props.words.map(word => {
    return <Wordcard key={word._id}
                     word={word}/>
  })

  return (
    <div>
      <Button onClick={() => props.setPage('')}>Go back home</Button>
       {body}
    </div>
  )
}