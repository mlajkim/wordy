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

  // Method
  const handleAddTag = (tag: string) => {
    const newTags = [...tags, tag];
    setTags(newTags);
    store.dispatch(modifySupport({lastTags: newTags}));
    store.dispatch(modifySupport({lastTags: newTags}));
  }
  // ..Method
  const handleDeleteTag = (index: number) => {
    const length = tags.length;
    const newTags = [...tags.slice(0, index), ...tags.slice(index + 1, length)];
    setTags(newTags);
  }
  // ..Method
  const handleRecTag = (tag: string) => {
    console.log('rectag clicked', tag);
  }
  // Render (Recomannded Chip)
  const recommandedChips = support.recommandedTags.length > 0 
    ? support.recommandedTags.map(tag => {
      return (
        <Chip
          key={tag}
          onClick={() => handleRecTag(tag)}
          label={tag}
          color="primary"
          variant="outlined"
        />
      )
    })
    : <h4>Add your tag first :)</h4>
  // Return JSX 
  return (
    <div>
      <ChipInput 
        label={tr.tag[ln]} 
        value={tags}
        onAdd={(tag) => handleAddTag(tag)}
        onDelete={(_tag, index) => handleDeleteTag(index)}
        fullWidth 
      />
      {support.recommandedTags.length > 0  && <InputLabel id="recTagLabel" style={{marginTop: 10, marginBottom: 10}}>{tr.recTag[ln]}</InputLabel>}
      { recommandedChips }
    </div>
  );
}

export default TagsList;