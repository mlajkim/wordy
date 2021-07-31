import React from 'react';
// Type
import { State } from '../../types';
// Translate
import tr from './settingDialog.tr.json'
import trAppbar from '../../app/appbar.tr.json'
// Material UI core
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
// Redux
import store from '../../redux/store';
import { useSelector } from 'react-redux';
// Redyx Action
import { offDialog } from '../../redux/actions';
import { modifySupport } from '../../redux/actions/supportAction';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const SettingDialog: React.FC = () => {
  // Redux states
  const { language, support } = useSelector((state: State) => state);
  const ln = language;

  return (
    <div>
      <Dialog onClose={() => store.dispatch(offDialog())} aria-labelledby="customized-dialog-title" open maxWidth="xs" fullWidth>
        <DialogTitle id="customized-dialog-title" onClose={() => store.dispatch(offDialog())}>
          {trAppbar.setting[ln]}
        </DialogTitle>
        <DialogContent dividers >
          <Typography gutterBottom color="textSecondary">
            {tr.tip[ln]}
          </Typography>
          <FormGroup>
            <FormControlLabel
              value="isYearQuadrantEnabled"
              control={
                <Checkbox 
                  color="default" size="small" checked={support.isYearQuadrantEnabled} 
                  onChange={() => store.dispatch(modifySupport({ isYearQuadrantEnabled: !support.isYearQuadrantEnabled }, true))}
                />}
              label={tr.customizeSemester[ln]}
              style={{ display: 'inline-block' }}
              labelPlacement="start"
            />
            <FormControlLabel
              value="isDarkmode"
              control={
                <Checkbox 
                  color="default" size="small" checked={support.isDarkMode} 
                  onChange={() => store.dispatch(modifySupport({ isDarkMode: !support.isDarkMode }))}
                />}
              label={tr.enableDarkmode[ln]}
              style={{ display: 'inline-block' }}
              labelPlacement="start"
            />
          </FormGroup>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingDialog;