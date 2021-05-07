import { EventType } from '../../type/eventType';
export const THROW_EVENT = '[Event] THROW_EVENT';
export const UPDATE_EVENT = '[Event] UPDATE_EVENT';

export const throwEvent =  (event: EventType) => {
  return {
    type: THROW_EVENT,
    payload: event
  };
};