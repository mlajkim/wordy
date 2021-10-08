import React, { Fragment, useEffect, useState } from 'react'
// Type
import { State } from '../../types'
import RELEASES from '../../releases'
// Translate
import tr from './patchNote.tr.json'
// MUI core
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import FormGroup from '@material-ui/core/FormGroup'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
// MUI Icons
import CloseIcon from '@material-ui/icons/Close'
// Redux
import store from '../../redux/store'
import { useSelector } from 'react-redux'
// Redyx Action
import { offDialog } from '../../redux/actions'
import { modifySupport } from '../../redux/actions/supportAction'
const VISIBLE_AFTER_SECS = 1

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

const PatchNote: React.FC = () => {
  // Redux states
  const { language, support } = useSelector((state: State) => state)
  const ln = language
  const [patchNoteState, setPatchNoteState] = useState<"new" | "old" | "latest">("latest")
  const [isVisible, setVisible] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(true)
    }, VISIBLE_AFTER_SECS * 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (RELEASES[RELEASES[0].isFinished ? 0 : 1].version === support.lastReadVersion) store.dispatch(offDialog())
    const idx = RELEASES.findIndex(release => release.version === support.lastReadVersion)

    if (support.lastReadVersion === "") setPatchNoteState("new")
    else if (idx >= 2) setPatchNoteState("old")
    else setPatchNoteState("latest")

  }, [support.lastReadVersion])

  const hdlClickOkButton = () => {
    store.dispatch(modifySupport({
      lastReadVersion: RELEASES[RELEASES[0].isFinished ? 0 : 1].version
    }))
    store.dispatch(offDialog())
  }

  const RenderWelcomeNewUserContent = patchNoteState === "new" && (
    <Fragment>
      <Typography style={{ fontSize: 13, paddingTop: 5 }}>
        {tr.welcomeNewUser[ln]}
      </Typography>
      <Typography style={{ fontSize: 13, paddingTop: 5 }}>
        {tr.emailMe[ln]}
      </Typography>
      <Typography style={{ fontSize: 13, paddingTop: 5 }}>
        {`jkim67cloud@gmail.com`}
      </Typography>
    </Fragment>
  )

  const RenderMember = patchNoteState !== "new" && (
    <Fragment>
      <Typography color="textSecondary" style={{ fontSize: 13, paddingTop: 5 }}>
        {patchNoteState === "latest" ? tr.newVersionAdded[ln] : tr.welcomeBackToWordyCloud[ln]}
      </Typography>
      <Typography gutterBottom color="textSecondary" style={{ fontSize: 13 }}>
        {tr.hereIsTheReleaseNoteFront[ln] + `${support.lastReadVersion} => ${RELEASES[RELEASES[0].isFinished ? 0 : 1].version}` + tr.hereIsTheReleaseNoteBack[ln]}
      </Typography>
  </Fragment>
  )

  const RenderMemberUpdateContents = patchNoteState !== "new" &&
    RELEASES[RELEASES[0].isFinished ? 0 : 1].majorUpdates.map((update, idx) => (
      <Typography key={update} style={{ fontSize: 13, paddingTop: 5 }}>
        {`${idx + 1}. ` + update}
      </Typography>
    ))
  return (
    <div>
      { isVisible &&
        (
          <Dialog aria-labelledby="customized-dialog-title" open maxWidth="xs" fullWidth>
            <DialogTitle id="customized-dialog-title" onClose={() => store.dispatch(offDialog())}>
              {tr.welcome[ln]}
              { RenderMember }
            </DialogTitle>
            <DialogContent dividers >
              <FormGroup>
                { RenderWelcomeNewUserContent }
                { RenderMemberUpdateContents }
              </FormGroup>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => hdlClickOkButton()} color="primary">
                {tr.okay[ln]}
              </Button>
            </DialogActions>
          </Dialog>
        )
      }
    </div>
  );
};

export default PatchNote;