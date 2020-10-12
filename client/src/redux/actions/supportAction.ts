export const UPDATE_SUPPORT = '[SUPPORT] Update';
export const SET_SUPPORT = '[SUPPORT] Set';
export const ADD_SEM = '[SUPPORT] Add Sem';
export const SYNC_SUPPORT = '[SYNC_SUPPORT] Sync Support'

// Ultimately
export const updateSupport = (data: object) => {
  return {
    type: UPDATE_SUPPORT,
    payload: data
  };
};

export const syncSupport = () => {
  return {
    type: SYNC_SUPPORT
  }
}

export const setSupport = (data: any) => {
  return {
    type: UPDATE_SUPPORT,
    payload: data
  };
};

export const addSem = (data: number) => {
  return {
    type: ADD_SEM,
    payload: data
  }
}

