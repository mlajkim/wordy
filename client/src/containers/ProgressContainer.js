import React from 'react';

import Progress from '../components/Progess';

class ProgressContainer extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      userId: '5ee4ccfa4b391e1e931c4b64'
    }
  }

  render(){
    return(
      <div>
        <Progress />
      </div>
    )
  }
}

export default ProgressContainer;