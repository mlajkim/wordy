import { Years } from '../../types';
import * as actions from '../actionTypes';

const years = (state = [], action: any) => {
  switch(action.type) {
    case actions.SET_YEARS:
      return action.payload.addWhat.map((data: any) => {return {year: data.year, sem: data.sem}});

    case actions.DELETE_ONE_YEAR:
      return state.filter((datus: Years) => datus.year !== action.payload.year || datus.sem !== action.payload.sem)

    case actions.ADD_YEARS:
      return [...state, action.payload];
      
    default:
      return state; 
  }
}

export default years;