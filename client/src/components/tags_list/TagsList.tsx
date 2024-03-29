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
import { setSnackbar } from '../../redux/actions';
// Type
type PropsRequired = {tags: string[], setTags: React.Dispatch<React.SetStateAction<string[]>>, setChangeDetected: React.Dispatch<React.SetStateAction<boolean>> };

// @ EXPORT DEFAULT React.FC
const TagsList: React.FC <PropsRequired> = ({ tags, setTags, setChangeDetected }) => {
  const {language, support} = useSelector((state: State) => state);
  const ln = language;

  // Method
  const hdlAddTags = (tag: string) => {
    setChangeDetected(true)
    const newTags = [...tags, tag]
    setTags(newTags)
    store.dispatch(modifyRecommandedTags(newTags)) // these two are different
    store.dispatch(modifySupport({ lastTags: newTags })) // these two are different
  }
  // ..Method
  const hdlDeleteTags = (index: number) => {
    setChangeDetected(true)
    const length = tags.length
    const newTags = [...tags.slice(0, index), ...tags.slice(index + 1, length)]
    setTags(newTags)
    store.dispatch(modifySupport({ lastTags: newTags }))
  }

  const hdlClickRecommandedTags = (tag: string) => {
    if (tags.findIndex(datus => datus === tag) !== -1) {
      store.dispatch(setSnackbar(tr.exists[ln], 'warning'))
    }
    else { hdlAddTags(tag); setChangeDetected(true) }
  }

  // Render (Recomannded Chip)
  const recommandedChips = support.recommandedTags.length > 0 
    ? support.recommandedTags.map(tag => {
      return (
        <Chip
          key={tag}
          onClick={() => hdlClickRecommandedTags(tag)}
          label={tag}
          color="primary"
          variant="outlined"
        />
      )
    })
    : null;
  // Return JSX 
  return (
    <div>
      <ChipInput 
        label={tr.tag[ln]} 
        value={tags}
        onAdd={(tag) => hdlAddTags(tag)}
        onDelete={(_tag, index) => hdlDeleteTags(index)}
        fullWidth 
      />
      <div style={{ display: 'inline-flex', marginTop: 8 }}>
        {support.recommandedTags.length > 0  && <InputLabel id="recTagLabel" style={{marginTop: 10, marginBottom: 10}}>{tr.recTag[ln]}</InputLabel>}
        <div style={{ marginLeft: 5 }}>
          
        </div>
        { recommandedChips }
      </div>
    </div>
  );
}

export default TagsList;