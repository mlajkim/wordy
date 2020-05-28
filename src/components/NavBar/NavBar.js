import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

class NavBar extends React.Component {

  render() {
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand newPage="Home" onClick={this.props.handleClick}>
            <img
              alt=""
              src="/logo.svg"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            {this.props.currentPage}
          </Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link onClick={this.props.handleClick} newPage="Home">Home</Nav.Link>
            <Nav.Link onClick={this.props.handleClick} newPage="QuickReview">Quick Review</Nav.Link>
          </Nav>
        </Navbar>
      </div>
    );
  }
}

export default NavBar;