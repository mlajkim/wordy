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

// Material UI Cores
import Grid from '@material-ui/core/Grid';

// Material UI Icons Import
import IconButton from '@material-ui/core/IconButton';
import EditRounded from '@material-ui/icons/EditRounded';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

// Import Style
import WordMenuStyle from './wordCardStyle/WordMenuStyle'
import StringifyStyle from './wordCardStyle/StringifyStyle';
import EditWordStyle from './wordCardStyle/EditWordStyle';
import DeleteWordStyle from './wordCardStyle/DeleteWordStyle'
import BeginReviewStyle from './wordCardStyle/BeginReviewStyle';


function WordCardStyle (props) {
  // The Word Data
  const word = props.word;

  // Functions Styles
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  // Functions Styles Ends

  // Delete Functions
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const handleClickDelete = () => {
    setDeleteOpen(true);
  }
  const handleCloseDelete = () => {
    setDeleteOpen(false);
  };
  const handleDelete = async () => {
    // Delete the word first.
    await fetch('/mongoApi/words', {
      method: 'DELETE',
      headers: {'Content-Type':'application/json'}, // super important
      body: JSON.stringify({
        wordId: word._id
      })
    })
    // Then Close the Deletion Warning
    handleCloseDelete();
  }
  // Delete Styles Ends

  return(
    <div>
      <Card className="text-center" key={word._id}>
        <Card.Body>
          <Card.Text>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <StringifyStyle word={word} />
              <IconButton aria-label="edit" onClick={handleClickOpen}>
                <EditRounded />
              </IconButton>
              {/* Handles Review Button */}
              <BeginReviewStyle word={word} type="quick"/>
              <BeginReviewStyle word={word} type="careful"/>
              {/* Handles the delete button */}
              <IconButton aria-label="edit" onClick={handleClickDelete}>
                <DeleteForeverIcon />
              </IconButton>
            </Grid>
          </Card.Text>
        </Card.Body>
      </Card>
      {/* Editing Word Style Rendering*/}
      <EditWordStyle
        word={word} 
        open={open} 
        handleClose={handleClose} 
        aria-labelledby="form-dialog-title"
      />
       {/* Deleting Word Warning Style Rendering*/}
      <DeleteWordStyle 
        word={word}
        open={deleteOpen}
        handleClose={handleCloseDelete}
        handleDelete={handleDelete}
        aria-labelledby="Deleting Dialog"
      />
    </div>
  );
}

export default WordCardStyle;