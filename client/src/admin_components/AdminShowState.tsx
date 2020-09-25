// eslint-disable-next-line
import React from 'react';
import Button from '@material-ui/core/Button';

const AdminShowState: React.FC<any> = (profile: any) => {
  const showTheseArr = ['subInfo', 'userInfo', 'typeOfLogIn', 'UNIQUE_ID'];

  return (
    <div>
      {showTheseArr.map(button => (
        <Button key={button} onClick={() => console.log(profile[`${button}`])}>{button}</Button>
      ))}
    </div>
  );
}

export default AdminShowState;