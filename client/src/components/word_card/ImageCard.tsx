import { FC, useState, Fragment, useEffect } from 'react'
// Type 
import { LegacyPureWord } from '../../type/legacyType'
import { State } from '../../types'
// Library
import Highlighter from "react-highlight-words"
// MUI
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
// Redux
// import store from '../../redux/store'
import { useSelector } from 'react-redux'
// Redux Actions

const IMAGE_NOT_FOUND_PATH = "/static/image_not_found.png"

const ImageCard: FC<{ word: LegacyPureWord, highlighted?: string}> = ({
  word, highlighted
}) => {
  const { support, language } = useSelector((state: State) => state)
  const ln = language

  const [imageLinks, setImageLinks] = useState<string[]>([IMAGE_NOT_FOUND_PATH])
  const [imageLinkIdx, setImageLinkIdx] = useState<0>(0)

  // get_link
  useEffect(() => {
    if (word.imageWrns.length === 0) {
    }
    // currently only accept one image per word

  }, [setImageLinks])

  const targetWord = highlighted ? support.highlightSearched ? highlighted : "" : ""

  let wordAndPronun = word.word
  wordAndPronun += word.pronun ? ` [${word.pronun}]` : ""

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={setImageLinks.length > 0 ? imageLinks[imageLinkIdx] : IMAGE_NOT_FOUND_PATH}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            <Highlighter
              textToHighlight={wordAndPronun} 
              highlightClassName="highlighted"
              searchWords={[targetWord]} autoEscape={true}
            />
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <Highlighter
              textToHighlight={word.meaning ? word.meaning : ""} 
              highlightClassName="highlighted"
              searchWords={[targetWord]} autoEscape={true}
            />
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Share
        </Button>
      </CardActions>
    </Card>
  )
}

export default ImageCard