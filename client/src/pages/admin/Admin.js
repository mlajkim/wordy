import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function Admin() {
  const classes = useStyles();

  const lists = [
    {
      title: '프로 구독중인 유저를 보여주세요',
      show: 'hi'
    },
    {
      title: '현재 총 가입된 유저를 보여주세요',
      show: 'bye  '
    }
  ]

  const accordions = lists.map(val => {
    return (
      <Accordion key={val.title}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>{val.title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {val.show}
          </Typography>
        </AccordionDetails>
      </Accordion>
    )
  })

  return (
    <div className={classes.root}>
      {accordions}
    </div>
  );
}

