import React from 'react';

// Material UI Core
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

// Import Style
import WordCardStyle from '../../styles/WordCardStyle';

class ParsedToday extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      words: [],
      open: false
    }

    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClickOpen = async() => {  
    // Fetch
    const response = await fetch('/mongoApi/words/parsedToday', {
      method: 'GET',
      headers: {'Content-Type':'application/json'}
    })

    // Convert & Save the data into word array
    const data = await response.json();
    this.setState({
      words: data,
      open: true
    });
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render() {
    return (
      <div>
        <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
          Show Parsed Today
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Parsed Today"}</DialogTitle>
          {this.state.words.length !== 0 && 
            <DialogContent>
              {this.state.words.map(word => {
                return <WordCardStyle word={word} />
              })}
            </DialogContent>
          }
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Okay
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default ParsedToday;