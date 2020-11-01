// Mains
import { State } from '../../types'
import React from 'react';
// Material UI
import Chip from '@material-ui/core/Chip';
import InputLabel from '@material-ui/core/InputLabel';
// Translation
import tr from './tag_list.tr.json';
// Etc
import ChipInput from 'material-ui-chip-input'
// Redux
import store from '../../redux/store';
import { useSelector } from 'react-redux';
// Actions
import { modifyRecommandedTags, modifySupport } from '../../redux/actions/supportAction';

// Type
type PropsRequired = {tags: string[], setTags: React.Dispatch<React.SetStateAction<string[]>> };

// @ EXPORT DEFAULT React.FC
const TagsList: React.FC <PropsRequired> = ({ tags, setTags }) => {
  const {language, support} = useSelector((state: State) => state);
  const ln = language;

  const handleChange = (newTags: string[]) => {
    store.dispatch(modifyRecommandedTags(newTags));
    store.dispatch(modifySupport({lastTags: newTags}));
    setTags(newTags);
  }

  const recommandedChips = support.recommandedTags.length > 0 
    ? support.recommandedTags.map(tag => {
      return (
        <Chip
          label={tag}
          color="primary"
          variant="outlined"
        />
      )
    })
    : null

  return (
    <div>
      <ChipInput label={tr.tag[ln]} onChange={(value) => handleChange(value)} defaultValue={tags} fullWidth />
      <InputLabel id="recTagLabel" style={{marginTop: 10, marginBottom: 10}}>{tr.recTag[ln]}</InputLabel>
      { recommandedChips }
    </div>
  );
}

export default TagsList;