import React, {useEffect, useState} from 'react';
import {State} from '../../types';
// Material UI
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';
// Translation
import tr from './year_chip.tr.json';
// Redux
import store from '../../redux/store';
import {setYears, setDialog} from '../../redux/actions';
import {useSelector} from 'react-redux';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(0.5),
      },
    },
  }),
);

// @ MAIN
const YearChip = () => {
  const classes = useStyles();
  // Component state
  const [selectedYear, setSelectedYear] = useState(null);
  // Redux states
  const {language, user, years} = useSelector((state: State) => state);
  const ln = language;

  const handleChipClick = (data: any) => {
    setSelectedYear(data.year);
  };

  const yearChipList = years.length > 0 
    ? years.map(data => (
        <Chip 
          key={data.year} 
          clickable
          label={`${data.year}${tr.year[ln]} ${data.sem}${tr.sem[ln]}`} 
          onClick={() => handleChipClick(data)}
          color={data.year === selectedYear ? 'primary' : 'default'}
        />
      ))
    : null;

  return (
    <div className={classes.root}>
      {yearChipList}
    </div>
  );
}

export default YearChip;