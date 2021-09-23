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

  // Draw Checkbox
  const checkBoxSetting = [
    {
      value: 'isDarkmode',
      checked: support.isDarkMode,
      label: tr.enableDarkmode[ln],
      onChange: () => store.dispatch(modifySupport({ isDarkMode: !support.isDarkMode }))
    },
    {
      value: 'isYearQuadrantEnabled',
      checked: support.isYearQuadrantEnabled,
      label: tr.customizeSemester[ln],
      onChange: () => store.dispatch(modifySupport({ isYearQuadrantEnabled: !support.isYearQuadrantEnabled }))
    },
    // SEARCH SETTING
    {
      value: 'searchOnlyDownloaded',
      checked: support.searchOnlyDownloaded,
      label: tr.searchOnlyDownloaded[ln],
      onChange: () => store.dispatch(modifySupport({ searchOnlyDownloaded: !support.searchOnlyDownloaded }))
    },
    // For Adding Word
    {
      value: 'setDisplayTypeWordCard',
      checked: support.languageDetectionEnabled,
      label: tr.languageDetectionEnabled[ln],
      onChange: () => store.dispatch(modifySupport({ languageDetectionEnabled: !support.languageDetectionEnabled }))
    },
    // From the word list setting
    {
      value: 'setDisplayTypeWordCard',
      checked: support.wordDisplayPref === 'wordcard',
      label: tr.setDisplayTypeWordCard[ln],
      onChange: () => store.dispatch(modifySupport({ wordDisplayPref: support.wordDisplayPref === 'wordcard' ? 'list' : 'wordcard' }))
    },
    {
      value: 'yearOrderPref',
      checked: support.yearOrderPref === 'desc',
      label: tr.setYearDesc[ln],
      onChange: () => store.dispatch(modifySupport({ yearOrderPref: support.yearOrderPref === 'desc' ? 'asc' : 'desc' }))
    },
    {
      value: 'wordOrderPref',
      checked: support.wordOrderPref === 'desc',
      label: tr.setWordDesc[ln],
      onChange: () => store.dispatch(modifySupport({ wordOrderPref: support.wordOrderPref === 'desc' ? 'asc' : 'desc' }))
    },
  ];

  const DrawCheckbox = checkBoxSetting.map(block => (
    <FormControlLabel
      value={block.value}
      key={block.value}
      control={
        <Checkbox 
          color="default" size="small" checked={block.checked} 
          onChange={() => block.onChange()}
        />}
      label={block.label}
      style={{ display: 'inline-block' }}
      labelPlacement="start"
    />
  ))

  return (
    <div>
      <Dialog onClose={() => store.dispatch(offDialog())} aria-labelledby="customized-dialog-title" open maxWidth="xs" fullWidth>
        <DialogTitle id="customized-dialog-title" onClose={() => store.dispatch(offDialog())}>
          {trAppbar.setting[ln]}
          <Typography gutterBottom color="textSecondary" style={{ fontSize: 13 }}>
            {tr.tip[ln]}
          </Typography>
        </DialogTitle>
        <DialogContent dividers >
          <FormGroup>
            <Typography gutterBottom color="primary" style={{ fontSize: 15 }}>
              {tr.basicSetting[ln]}
            </Typography>
            { DrawCheckbox.slice(0, 2) }
          </FormGroup>
          <FormGroup style={{ marginTop: 15}}>
            <Typography gutterBottom color="primary" style={{ fontSize: 15 }}>
                {tr.searchSetting[ln]}
            </Typography>
            { DrawCheckbox.slice(2, 3) }
          </FormGroup>
          <FormGroup style={{ marginTop: 15}}>
            <Typography gutterBottom color="primary" style={{ fontSize: 15 }}>
                {tr.addingWordSetting[ln]}
            </Typography>
            { DrawCheckbox.slice(3, 4) }
          </FormGroup>
          <FormGroup style={{ marginTop: 15}}>
            <Typography gutterBottom color="primary" style={{ fontSize: 15 }}>
                {tr.listSetting[ln]}
            </Typography>
            { DrawCheckbox.slice(4) }
          </FormGroup>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingDialog;