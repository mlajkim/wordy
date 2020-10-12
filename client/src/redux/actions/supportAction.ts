export const UPDATE_SUPPORT = '[SUPPORT] Update';
export const SET_SUPPORT = '[SUPPORT] Set';
export const MODIFY_SUPPORT = '[SUPPORT] Modify'
export const SYNC_SUPPORT = '[SYNC_SUPPORT] Sync Support'
export const ADD_SEM_NO_DUPLICATE = '[SUPPORT] Add Sem (No Duplicate)';

// Ultimately
export const updateSupport = (data: object) => {
  return {
    type: UPDATE_SUPPORT,
    payload: data
  };
};

export const setSupport = (data: any) => {
  return {
    type: UPDATE_SUPPORT,
    payload: data
  };
};

export const modifySupport = (data: object) => {
  return {
    type: MODIFY_SUPPORT,
    payload: data
  };
}

export const syncSupport = () => {
  return {
    type: SYNC_SUPPORT
  }
}



export const addSemNoDup = (data: number) => {
  return {
    type: ADD_SEM_NO_DUPLICATE,
    payload: data
  }
}

