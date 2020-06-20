import React, {Component} from 'react';

// Bootstrap import
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';

// Import the shared style of wordcard
import WordCardStyle from '../styles/WordCardStyle';
import LoadingAnimationStyle from '../styles/LoadingAnimationStyle'

// Handles the leftside Tab
class List extends Component {
  render() {
    if(this.props.isLoaded) return (
      <div>
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                {this.props.semesters.map((semester, index) => {
                  return(
                    <Nav.Item key={index}>
                      <Nav.Link eventKey={`${semester.year}-${semester.semester}`}>{`${semester.year}-${semester.semester}`}</Nav.Link>
                    </Nav.Item>
                  )
                })}
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                {this.props.semesters.map((semester, index) => {                  
                  return(
                    <Tab.Pane key={index} eventKey={`${semester.year}-${semester.semester}`}>
                      <UpperTab words={this.props.words[index]} handleClickEdit={this.props.handleClickEdit}/>
                    </Tab.Pane>
                  )
                })}
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    );
    else return <LoadingAnimationStyle />
  };
}

// Stateless Functional Component
// Handles the upper tab and distribute correct words to the EachWord
function UpperTab (props) {
  // Looping languages
  const languages = ['Korean', 'English', 'Chinese', 'Japanese'];
    
  return (
    <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
      {languages.map((language, index) => {
        const words = props.words.filter(word => word.language === language)
        return(
          <Tab key={index} eventKey={language} title={language}>
            <EachWord words={words} handleClickEdit={props.handleClickEdit}/>
          </Tab>
        )
      })}
    </Tabs>
  )
}

// Stateless Functional Component
function EachWord (props) {
  return (
    <div>
      {props.words.map((word) => 
        <WordCardStyle 
          handleClickEdit={props.handleClickEdit}
          word={word}
        />
      )}
    </div>
  )
}

export default List;