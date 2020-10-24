// Mains
import React, { Fragment } from 'react';
import { Language } from '../../types';
// Translation
import tr from './tag_list.tr.json';
// Etc
import ChipInput from 'material-ui-chip-input'

// Type
type PropsRequired = { ln: Language, tags: string[], setTags: React.Dispatch<React.SetStateAction<string[]>>, recommandedTags?: string[] };

// @ EXPORT DEFAULT React.FC
const TagsList: React.FC <PropsRequired> = ({ ln, tags, setTags, recommandedTags }) => {
  const recVal = recommandedTags?.map(tag => `${tr.rec[ln]}` + tag);

  return (
    <Fragment>
      <ChipInput label={tr.tag[ln]} onChange={(value) => setTags(value)} defaultValue={tags} fullWidth />
      {recVal && <ChipInput label={tr.tag[ln]} defaultValue={recVal} fullWidth onClick={(e) => console.log(e.target)}/>}
    </Fragment>
  );
}

export default TagsList;