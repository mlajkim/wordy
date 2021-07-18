import { UPDATE_KEEP_STYLE_BTN } from '../actions/keepStyleAction'

// this is more of userPreference (I will change the naming later)
const keepStyleBtn = (state = {}, action: any) => {
  switch(action.type) {
    
    case UPDATE_KEEP_STYLE_BTN: // Front end only
      return { ...state, ...action.payload }
      
    default:
      return state;
  }
}

export default keepStyleBtn;