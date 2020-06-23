import React from 'react';

// Material UI Import
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';

// Material UI Icon Import (Outside)
import MoreVertIcon from '@material-ui/icons/MoreVert';

// Material UI Icon Import (Inside)
import EditRounded from '@material-ui/icons/EditRounded';
import SpeedIcon from '@material-ui/icons/Speed';
import SlowMotionVideoIcon from '@material-ui/icons/SlowMotionVideo';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const options = [
  'Edit',
  'Quick',
  'Careful',
  'Delete'
];

const ITEM_HEIGHT = 48;

export default function WordMenuStyle() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
            <ListItemIcon>
              {option === 'Edit' && <EditRounded fontSize="small" />}
              {option === 'Quick' && <SpeedIcon fontSize="small" />}
              {option === 'Careful' && <SlowMotionVideoIcon fontSize="small" />}
              {option === 'Delete' && <DeleteForeverIcon fontSize="small" />}
            </ListItemIcon>
            <Typography variant="inherit">
              {option}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}