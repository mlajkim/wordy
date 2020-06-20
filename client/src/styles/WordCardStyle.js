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

function WordCardStyle (props) {
  const word = props.word;
  return(
    <Card className="text-center" key={word.id}>
      <Card.Body>
        <Card.Text>
          {word.word} - {word.definition}
          <IconButton aria-label="edit" onClick={props.handleClickEdit}>
            <EditRounded />
          </IconButton>
          <Badge style={{marginLeft: 12}} variant="success">Review</Badge>{' '}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default WordCardStyle;