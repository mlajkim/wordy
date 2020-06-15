import React, {Component} from 'react';

// Bootstrap import
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';

class List extends Component {
  render() {
    return (
      <div>
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="first">Tab 1</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second">Tab 2</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="first">
                  <UpperTab name='helloTab' />
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <UpperTab name='hehe'/>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    );
  }
}

class UpperTab extends Component {
  render() {
    return (
      <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
        <Tab eventKey="Korean" title="Korean">
         meh
        </Tab>
        <Tab eventKey="English" title="English">
          meh
        </Tab>
        <Tab eventKey="Chinese" title="Chinese">
          meh
        </Tab>
        <Tab eventKey="Japanese" title="Japanese">
          meh
        </Tab>
      </Tabs>
    )
  }
}

export default List;