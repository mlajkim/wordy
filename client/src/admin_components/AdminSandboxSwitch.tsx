// eslint-disable-next-line
import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
// utils
import {Props} from '../model';

const AdminSandboxSwitch: React.FC<Props> = ({
  isSandbox,
  setSandbox,
}) => {
  return (
    <FormControlLabel
      control={<Switch checked={isSandbox} onChange={() => setSandbox(!isSandbox)} />}
      label={isSandbox ? 'SANDBOX MODE (WARNING)' : 'REAL MODE'}
    />
  );
}

export default AdminSandboxSwitch;