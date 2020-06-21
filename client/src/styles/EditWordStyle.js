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
      word: 'this', 
      pronunciation: 'is',
      definition: 'sample',
      exampleSentence: 'example',
      isPublic: false
    }

    this.handleClickSave = this.handleClickSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({});
  }

  async handleClickSave() {
    console.log("Saved!") // Delete this test code

    await fetch('/mongoApi/words', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        word: this.state.word,
        pronunciation: this.state.pronunciation,
        definition: this.state.definition,
        exampleSentence: this.state.exampleSentence
      })
    })

    // Finally close it
    this.props.handleClose();
  }

  render() {
    // Word Data
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
          <RepeatingTextField 
            word={word}
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

function RepeatingTextField (props) {
  const wordType = ['word', 'pronunciation', 'definition', 'exampleSentence'];
  const word = props.word;
  const isPublicOfTheWord = props.word.isPublic;

  // Switch 
  const [state, setState] = React.useState({
    checked: isPublicOfTheWord
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

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
      <FormControlLabel
        control={
          <Switch
            checked={state.checkedB}
            onChange={handleChange}
            color="Secondary"
            name="checked"
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        }
        label="Make it public"
        labelPlacement="end"
      />
      
    </div>
  );
}

export default EditWordStyle;