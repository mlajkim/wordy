// eslint-disable-next-line
import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import {Button} from '@material-ui/core';
// model
import {Props} from '../model';

const paypal_get_price = async (isSandbox: boolean) => {
  const sandbox = isSandbox ? '.sandbox' : null;
  const url = `https://api${sandbox}.paypal.com/v1/billing/plans/P-5ML4271244454362WXNWU5NQ`
  fetch(url, {
    headers: {
      Authorization: "Bearer Access-Token",
      "Content-Type": "application/json"
    }
  })
}

const AdminDisplaySub: React.FC<Props> = (props) => {
  const [price, setPrice] = React.useState({
    live: null,
    sandbox: null
  });

  const handleClick = () => {
    paypal_get_price(true);
    paypal_get_price(false);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={() => handleClick()}> 
        데이터 페이팔로부터 가져오기 
      </Button>
      <List component="nav" aria-label="mailbox folders">
        <ListItem button>
          <ListItemText primary={`LIVE 가격: ${price.live}`} />
        </ListItem>
        <Divider />
        <ListItem button divider>
          <ListItemText primary={`SANDBOX 가격: ${price.sandbox}`} />
        </ListItem>
      </List> 
    </div>
  )
}



export default AdminDisplaySub;