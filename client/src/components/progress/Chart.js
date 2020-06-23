import React, { PureComponent } from 'react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const data = [
  {
    name: 'Wed ', Quick: 12, Careful: 14,
  },
  {
    name: 'Thu', Quick: 58, Careful: 13
  },
  {
    name: 'Fri', Quick: 112, Careful: 14,
  },
  {
    name: 'Sat', Quick: 88, Careful: 25,
  },
  {
    name: 'Sun', Quick: 34, Careful: 14,
  },
  {
    name: 'Mon', Quick: 54, Careful: 25,
  },
  {
    name: 'Today', Quick: 67, Careful: 14,
  },
];

export default class Example extends PureComponent {
  static jsfiddleUrl = 'https://jsfiddle.net/alidingling/30763kr7/';

  render() {
    return (
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Quick" fill="#8884d8" />
        <Bar dataKey="Careful" fill="#82ca9d" />
      </BarChart>
    );
  }
}