/**
 * Navbar 
 */

// Import the necessary
import React, {Component} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

class NavBar extends Component {
  render() {
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Nav className="mr-auto">
            <Nav.Link href="/home">Home</Nav.Link>
            <Nav.Link href="/mongoReview">Quick Review (MongoDB)</Nav.Link>
            <Nav.Link href="/review/quick">Quick Review (SQLite)</Nav.Link>
            <Nav.Link href="/review/careful">Careful Review (SQLite)</Nav.Link>
          </Nav>
        </Navbar>
      </div>
    );
  }
}

export default NavBar;