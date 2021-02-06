import React, {Fragment} from 'react';
// Material UI Core
import Button from '@material-ui/core/Button';
// Redux
import store from '../../redux/store';
// redux actions
import { fetchy3, consoler } from '../../redux/actions/apiAction';

export default function AdminPage() {
  const handleGenerateKey = () => {
    store.dispatch(fetchy3('post', '/permissions', null, consoler));
  }
  
  return (
    <Fragment>
      <Button onClick={() => handleGenerateKey()}>Generate random GAME KEY</Button>
    </Fragment>
  )
}