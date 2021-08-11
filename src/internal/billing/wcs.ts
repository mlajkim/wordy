// Wordy Credit Service
// Type
import { EventType, WordyEvent } from "../../type/wordyEventType";
import { Gateway } from '../../type/availableType';
// Declare
const SERVICE_NAME: Gateway = "wcsGateway"

const COST_LIST: { RE: EventType, price: number }[] = [
  {
    RE: "word:detectLanguage", // Requested Event
    price: 1
  },
]
export const wcsGateway = (WE: WordyEvent) => {
  // Validation: if it is not accepted, credit service does not take the credit
	if (WE.serverResponse !== "Accepted") return WE;

  // taking credit begins here
  // by default, if it is not defined, there is no cost for the event
  const data = COST_LIST.find(el => el.RE === WE.eventType);
  if (typeof data !== "undefined") {
    // here take the creidit from mongoDB or anything;

    // Apply the price
    WE.price = data.price; // let the end user know the price

    // Validation is only added when there is cost! 
    WE.validatedBy 
    ? WE.validatedBy.push(SERVICE_NAME) 
    : WE.validatedBy = [SERVICE_NAME];
  }; 

  return WE;
};