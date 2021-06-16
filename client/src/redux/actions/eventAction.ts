import AvailableActions from '../../type/AvailableActions';
export const CREATE_EVENT = '[Event] CREATE_EVENT';
export const UPDATE_EVENT = '[Event] UPDATE_EVENT';

export type CreateEventPayload = {
  eventAction: AvailableActions;
  payload: object[]
}

export const createEvent =  (action: AvailableActions, payload: object[]) => {
  return {
    type: CREATE_EVENT,
    payload: { eventAction: action, payload } as CreateEventPayload
  };
};