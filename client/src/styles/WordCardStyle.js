/**
 * This wordCard.js contains styling of a card word
 * 
 * This WordCardStyle requires 
 *  1. One word data
 */

// Import the basics
import React from 'react';

// Bootstrap Import
import Card from 'react-bootstrap/Card';

// Material UI Import
import IconButton from '@material-ui/core/IconButton';
import EditRounded from '@material-ui/icons/EditRounded';

// Import Style
import WordMenuStyle from './wordCardStyle/WordMenuStyle'
import StringifyStyle from './wordCardStyle/StringifyStyle';
import EditWordStyle from './wordCardStyle/EditWordStyle';
import BeginReviewStyle from './wordCardStyle/BeginReviewStyle';

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
            <WordMenuStyle />
            <IconButton aria-label="edit" onClick={handleClickOpen}>
              <EditRounded />
            </IconButton>
            <BeginReviewStyle word={word} type="quick"/>
            <BeginReviewStyle word={word} type="careful"/>
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