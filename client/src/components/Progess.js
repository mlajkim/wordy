import React from 'react';

// Import from ./progress
import Chart from './progress/Chart'
import ParsedToday from './progress/ParsedToday'

class Progress extends React.Component {
  render() {
    return (
      <div>
        <Chart />
        <ParsedToday />
      </div>
    )
  }
}

export default Progress;