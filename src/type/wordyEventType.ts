export type WordyEvent = {
  // header (data from end user)
  eventVersion: "2021-07",
  eventType: EventType,
  accessToken?: string,
  requesterData?: any,
  // body (what end user wants)
  serverResponse?: "Denied" | "Accepted";
  serverMessage?: string;
  payload?: any
  // tail (data put by server)
  requesterWrn?: string;
  validatedBy?: Validator[]
}

export type Validator = "iamGateway" | "wcsGateway" | "kmsGateway" | "mongoGateway" | "cloudTrailGateway";

export type EventType =  `word:${WordSerivce}`

type WordSerivce = "detectLanguage"


export const pathFinder = (eventType: EventType): string => {
  const arr = eventType.split(":");
  return `/${arr[0]}/${arr[1]}`
};