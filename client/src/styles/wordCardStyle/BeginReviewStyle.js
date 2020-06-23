// Import the basics
import React from 'react';

// Import UI
import IconButton from '@material-ui/core/IconButton';
import SpeedIcon from '@material-ui/icons/Speed';
import SlowMotionVideoIcon from '@material-ui/icons/SlowMotionVideo';

function BeginReviewStyle (props) {
  if(props.type === 'quick'){
    return (
      <dev>
        <IconButton aria-label="quick">
          <SpeedIcon />
        </IconButton>
      </dev>
    )
  }else if(props.type === 'careful'){
    return (
      <dev>
        <IconButton aria-label="careful">
          <SlowMotionVideoIcon />
        </IconButton>
      </dev>
    )
  }
}

export default BeginReviewStyle;