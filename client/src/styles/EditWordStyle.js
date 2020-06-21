import React from 'react';

// Material UI Import
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

function RepeatingTextField (props) {
  const wordType = ['word', 'pronunciation', 'definition', 'exampleSentence'];
  const word = props.word;
  return (
    <div>
      {wordType.map(wordType => {
        return (
          <TextField
            key={wordType}
            margin="dense"
            id={wordType}
            value = {word[wordType]}
            label={wordType}
            fullWidth
          />
        )
      })}
    </div>
  );
}

class EditWordStyle extends React.Component {
  constructor(props) {
    super(props);

  }
  render() {
    // Word Data
    const word = this.props.word;

    return(
      <Dialog open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Edit</DialogTitle>
        <DialogContent>
          <RepeatingTextField 
            word={word}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.props.handleClose} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default EditWordStyle;