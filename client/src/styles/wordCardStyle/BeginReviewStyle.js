// Import the basics
import React from 'react';

// Import UI
import IconButton from '@material-ui/core/IconButton';
import SpeedIcon from '@material-ui/icons/Speed';
import SlowMotionVideoIcon from '@material-ui/icons/SlowMotionVideo';

function BeginReviewStyle (props) {
  return (
    <div>
      <IconButton aria-label={props.type} >
        {props.type === 'quick' && <SpeedIcon />}
        {props.type === 'careful' && <SlowMotionVideoIcon />}
      </IconButton>
    </div>
  )
}

export default BeginReviewStyle;