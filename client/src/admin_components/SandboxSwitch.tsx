// eslint-disable-next-line
import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
// utils
import {Props} from '../utils';

const SandboxSwitch: React.FC<Props> = ({
  isSandbox,
  setSandbox,
}) => {
  return (
    <FormControlLabel
      control={<Switch checked={isSandbox} onChange={() => setSandbox(!isSandbox)} />}
      label="Secondary"
    />
  );
}

export default SandboxSwitch;