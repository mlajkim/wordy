import React from 'react';

// Material UI Import
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

// Switch
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

class EditWordStyle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      wordId: props.word._id,
      word: props.word.word, 
      pronunciation: props.word.pronunciation,
      definition: props.word.definition,
      exampleSentence: props.word.exampleSentence,
      isPublic: props.word.isPublic
    }

    this.handleClickSave = this.handleClickSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClickSwitch = this.handleClickSwitch.bind(this);
  }

  handleChange(e) {
    this.setState({[e.target.id]: e.target.value});
  }

  handleClickSwitch() {
    let previousValue = this.state.isPublic;
    this.setState({isPublic: !previousValue});
  }

  async handleClickSave() {
    console.log("Saved!") // Delete this test code

    await fetch('/mongoApi/words', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        wordId: this.state.wordId,
        word: this.state.word,
        pronunciation: this.state.pronunciation,
        definition: this.state.definition,
        exampleSentence: this.state.exampleSentence,
        isPublic: this.state.isPublic
      })
    })

    // Finally close it
    this.props.handleClose();
  }

  render() {
    // Word Data
    const wordType = ['word', 'pronunciation', 'definition', 'exampleSentence'];
    const word = this.props.word;

    return(
      <Dialog 
        open={this.props.open} 
        onClose={this.props.handleClose} 
        aria-labelledby="form-dialog-title"
        maxWidth="md"  
      >
        <DialogTitle id="form-dialog-title">Edit</DialogTitle>
        <DialogContent>
          {wordType.map(wordType => {
            return (
              <TextField
                onChange={this.handleChange}
                key={wordType}
                margin="dense"
                id={wordType}
                defaultValue = {word[wordType]}
                label={wordType}
                fullWidth
              />
            )
          })}
          <FormControlLabel
            control={
              <Switch
                onClick={this.handleClickSwitch}
                checked={this.state.isPublic}
                color="Secondary"
                name="checked"
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            }
            label="Make it public"
            labelPlacement="end"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleClickSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default EditWordStyle;