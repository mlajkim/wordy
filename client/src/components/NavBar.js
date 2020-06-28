/**
 * Navbar 
 */

// Import the necessary
import React, {Component} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

class NavBar extends Component {
  render() {
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Nav className="mr-auto">
            <Nav.Link href="/home">Home</Nav.Link>
            <Nav.Link href="/quickReview">Quick Review</Nav.Link>
            <Nav.Link href="/carefulReview">Careful Review</Nav.Link>
            <Nav.Link href="/list">List</Nav.Link>
            <Nav.Link href="/progress">Progress</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link >v1.0</Nav.Link>
            <Button href="/signin" variant="outline-light">Sign in</Button>{' '}
          </Nav>
        </Navbar>
      </div>
    );
  }
}

export default NavBar;