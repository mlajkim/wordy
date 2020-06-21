/**
 * This wordCard.js contains styling of a card word
 */

// Import the basics
import React from 'react';

// Bootstrap Import
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';

// Material UI Import
import IconButton from '@material-ui/core/IconButton';
import EditRounded from '@material-ui/icons/EditRounded';


// Import Style
import StringifyStyle from './StringifyStyle';
import EditWordStyle from './EditWordStyle';

function WordCardStyle (props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const word = props.word;
  return(
    <div>
      <Card className="text-center" key={word._id}>
        <Card.Body>
          <Card.Text>
            <StringifyStyle word={word} />
            <IconButton aria-label="edit" onClick={handleClickOpen}>
              <EditRounded />
            </IconButton>
            <Badge style={{marginLeft: 12}} variant="success">Review</Badge>{' '}
          </Card.Text>
        </Card.Body>
      </Card>
      <EditWordStyle
        word={word} 
        open={open} 
        handleClose={handleClose} 
        aria-labelledby="form-dialog-title"
      />
    </div>
  );
}

export default WordCardStyle;