import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import tr from './menu.tr.json';
import { Language } from '../../types';
// images
import reviewImg from '../../img/review.jpeg';
import listImg from '../../img/list.jpeg';
// Redux
import store from '../../redux/store';
import {setPage} from '../../redux/actions';
import {useSelector} from 'react-redux';

const useStyles = makeStyles({
  root: {
    maxWidth: 400,
    margin: 30
  },
  media: {
    height: 140,
  },
});
type Props = {
  type: 'review'| 'list';
}
const Menu = ({type}: Props) => {
  const ln = useSelector((state: {language: Language}) => state.language);
  const classes = useStyles();

  const handleClick = () => {
    store.dispatch(setPage(type));
  }

  return (
    <Card className={classes.root}>
      <CardActionArea onClick={() => handleClick()}>
        <CardMedia
          className={classes.media}
          image={type === 'review' ? reviewImg : listImg}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {type==='review' ? tr.reviewTitle[ln] : tr.listTitle[ln]}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {type==='review' ? tr.reviewDesc[ln] : tr.listDesc[ln]}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default Menu;