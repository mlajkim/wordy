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
      semesters: [{
        year: 2017,
        semester: 4
      },{
        year: 2018,
        semester: 1
      }],
      userId: '5ee4ccfa4b391e1e931c4b64'
    }

    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    // Load Semesters Data First
    fetch('/mongoApi/semesters', {
      method: 'GET',
      headers: {'Content-Type':'application/json'}
    })
    .then(result => result.json())
    .then(data => this.setState({semesters: data}))
    .catch(err => console.log(err))

    // Load Words Data
    fetch('/mongoApi/words/semesterized', {
      method: 'GET',
      headers: {'Content-Type':'application/json'}
    })
    .then(result => result.json())
    .then(data => this.setState({words: data}))
    .catch(err => console.log(err))

  }

  render() {
    return (
      <div>
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                {this.state.semesters.map(semester => {
                  return(
                    <Nav.Item>
                      <Nav.Link eventKey={`${semester.year}-${semester.semester}`}>{`${semester.year}-${semester.semester}`}</Nav.Link>
                    </Nav.Item>
                  )
                })}
                  
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                {this.state.semesters.map((semester, index) => {
                  return(
                    <Tab.Pane eventKey={`${semester.year}-${semester.semester}`}>
                      <UpperTab words={this.state.words[index]}/>
                    </Tab.Pane>
                  )
                })}
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

class EachWord extends Component {
  render(){
    return (
      <div></div>
    )
  }
}

export default List;