import { KeepStyleBtnPropType, KeepStyleBtnProperty, KsbState } from '../../frontendTypes';

export const UPDATE_KSB = '[KSB] Update';
export const CLICK_KSB = '[KSB] Click';
export const LOAD_KSB = '[KSB] Start Loading';
export const CREATE_KSB = '[KSB] Create'
export const ALTER_KSB_STATE = '[KSB] State Change'

export const updateKsb = (data: KeepStyleBtnProperty[] ) => {
  return {
    type: UPDATE_KSB,
    payload: data
  };
};

export const KsbClick =  (props: KeepStyleBtnPropType) => {
  return {
    type: CLICK_KSB,
    payload: props
  };
};

export const loadKsb =  (props: KeepStyleBtnPropType) => {
  return {
    type: CLICK_KSB,
    payload: props
  };
};

export type CreateKsbPayload = { props: KeepStyleBtnPropType, ksbState: KsbState }
export const createKsb =  (props: KeepStyleBtnPropType, ksbState: KsbState) => {
  return {
    type: CLICK_KSB,
    payload: { props, ksbState } as CreateKsbPayload
  };
};

export type AlterKsbStatePayload = CreateKsbPayload;
export const alterKsbState =  (props: KeepStyleBtnPropType, ksbState: KsbState) => {
  return {
    type: ALTER_KSB_STATE,
    payload: { props, ksbState } as AlterKsbStatePayload
  };
};