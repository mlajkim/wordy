import { UPDATE_KSB } from '../actions/keepStyleBtnAction'

// this is more of userPreference (I will change the naming later)
const keepStyleBtn = (state = [], action: any) => {
  switch(action.type) {
    
    case UPDATE_KSB: // Front end only
      return action.payload 
      
    default:
      return state;
  }
}

export default keepStyleBtn;