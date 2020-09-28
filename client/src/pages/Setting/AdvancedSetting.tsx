// eslint-disable-next-line
import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button'
// utils
import { Props } from '../../model';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  }),
);

const AdvancedSetting: React.FC<Props> = ({
  setModal
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Advanced</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container direction="column">
              <Button variant="outlined" color="secondary" 
                      style={{ margin: 10}}
                      onClick={() => setModal({type: 'PauseResumeModal', data: 'pause'})}>
                PAUSE MEMBERSHIP
              </Button>
              <Button variant="outlined" color="primary" 
                      style={{ margin: 10}}
                      onClick={() => setModal({type: 'PauseResumeModal', data: 'resume'})}>
                RESUME MEMBERSHIP
              </Button>
              <Button 
                variant="outlined" color="secondary" 
                style={{ margin: 10 }}
                onClick={() => setModal({type: 'DeleteAccountModal', data: null})}>DELETE ACCOUNT
              </Button>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default AdvancedSetting;