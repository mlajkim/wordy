import React, {Fragment} from 'react';
import { State } from '../../types';
// Material UI Core
import Button from '@material-ui/core/Button';
// redux actions
import { fetchy3, consoler } from '../../redux/actions/apiAction';
import store from '../../redux/store';
import { useSelector } from 'react-redux';

export default function AdminPage() {
  const { user } = useSelector((state: State) => state);

  const handleGenerateKey = () => {
    const payload = [{
      playerID: user.ID
    }]
    store.dispatch(fetchy3('post','/permissions', payload, consoler));
  }
  
  return (
    <Fragment>
      <Button onClick={() => handleGenerateKey()}>Generate random GAME KEY</Button>
    </Fragment>
  )
}