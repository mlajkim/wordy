import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.handleChangePage = this.handleChangePage.bind(this);
  } // Constructor ends

  handleChangePage(newPage) {
    this.props.changePage(newPage);
  } // handleChangePage ends

  render() {
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Nav className="mr-auto">
            <Nav.Link onClick={() => this.handleChangePage("Home")}>Home</Nav.Link>
            <Nav.Link onClick={() => this.handleChangePage("QuickReview")}>Quick Review</Nav.Link>
          </Nav>
        </Navbar>
      </div>
    );
  } // Render ends
  
}

export default NavBar;