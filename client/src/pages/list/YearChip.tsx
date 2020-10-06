import React, {useState} from 'react';
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

const YearChip = () => {
  const classes = useStyles();
  // Component state
  const [year, setYear] = useState();
  // Redux states
  const {language, user, years} = useSelector((state: State) => state);
  const ln = language;

  const handleDelete = (data: any) => {
    console.info(data);
  };

  const handleClick = (e: any) => {
    console.log(e)
    console.info('You clicked the Chip.');
  };

  const yearChipList = years.map(data => (
    <Chip key={data.year}
      label={`${data.year}${tr.year[ln]}`} onClick={(e) => handleClick(e)}
    />
  ))

  return (
    <div className={classes.root}>
      {yearChipList}
    </div>
  );
}

export default YearChip;