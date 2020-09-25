// eslint-disable-next-line
import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
// import API
import {change_user_db} from './AdminAPI';
// Admin Components 
import AdminSandboxSwitch from '../../admin_components/AdminSandboxSwitch';
import AdminShowState from '../../admin_components/AdminShowState';
import AdminDisplaySub from '../../admin_components/AdminDisplaySub';
// utils
import {Props} from '../../model';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const Admin: React.FC<Props> = (props) => {
  const classes = useStyles();

  const lists = [
    {
      title: '현재 STATE 값들 전부 표기해주세요',
      show: (
        <AdminShowState {... props.profile}/>
      )
    },
    {
      title: '실제결재모드 / 샌드박스 모드를 변환할게요',
      show: (
        <AdminSandboxSwitch {... props}/>
      )
    },
    {
      title: '구독 가능한 정보들을 보여주세요',
      show: (
        <div>
          <AdminDisplaySub {... props}/>
        </div>
      )
    },
    {
      title: '프로에서 베이직 계정으로 바꿔주세요',
      show: ( 
        <Button color="secondary" onClick={() => change_user_db(props,'subscription', '')}>
          이 계정을 프로에서 베이직으로 바꾸기 (누르시면 바로 실행되니 조심하세요)
        </Button>
      )
    },
    {
      title: '현 구독 정보들을 보여주세요',
      show: '구독 정보!'
    },
    {
      title: '프로 구독중인 유저를 보여주세요',
      show: 'hi'
    },
    {
      title: '현재 총 가입된 유저를 보여주세요',
      show: 'bye  '
    }
  ];


  return (
    <div className={classes.root}>
      {lists.map(val => {
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
              {val.show}
            </AccordionDetails>
          </Accordion>
        )
      })}
    </div>
  );
}

export default Admin;