import React, {Component} from 'react';

// Bootstrap import
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';

class List extends Component {
  constructor(props){
    super(props);
    this.state = {
      words: [],
      semesters: ['2018-1', '2018-2', '2018-3'],
      userId: '5ee4ccfa4b391e1e931c4b64'
    }

    this.componentDidMount = this.componentDidMount.bind(this);
    this.organizeTerms = this.organizeTerms.bind(this);
  }

  componentDidMount() {
     // Load data
     fetch('/mongoApi/words/semesterized', {
      method: 'GET',
      headers: {'Content-Type':'application/json'}
    })
    .then(res => res.json())
    .then(result => {
      this.setState({
        words: result.words,
        semesters: result.semesters
      })
    }, () => {
      this.organizeTerms();
    })
    .catch(err => {
      // No log, set to 0
    }) 
  }

  // This function organizes the terms 
  organizeTerms() {

  }

  render() {
    return (
      <div>
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                {this.state.semesters.map((semester, index) => {
                  return (
                    <Nav.Item>
                      <Nav.Link eventKey={`${index}`}>{semester}</Nav.Link>
                    </Nav.Item>
                  )
                })}
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="0">
                  <UpperTab name='helloTab' />
                </Tab.Pane>
                <Tab.Pane eventKey="1">
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