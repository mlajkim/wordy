import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
// utils
import {Props} from '../utils';

const SandboxSwitch: React.FC<Props> = (props) => {
  return (
    <FormGroup row>
      <FormControlLabel
        control={<Switch checked={props.isSandbox} onChange={() => props.setSandbox(!props.isSandbox)} />}
        label="Secondary"
      />
    </FormGroup>
  );
}

export default SandboxSwitch;