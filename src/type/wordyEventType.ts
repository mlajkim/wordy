export type WordyEvent = {
  // header
  eventVersion: "2021-07",
  eventType: EventType,
  accessToken?: string,
  requesterData?: any,
  // body
  serverResponse?: "Denied" | "Accepted";
  serverMessage?: string;
  payload?: any
  // tail 
  validatedBy?: Validator[]
}

export type Validator = "iamGateway" | "wcsGateway" | "kmsGateway" | "mongoGateway" | "cloudTrailGateway";

export type EventType =  `word:${WordSerivce}`

type WordSerivce = "detectLanguage"


export const pathFinder = (eventType: EventType): string => {
  const arr = eventType.split(":");
  return `/apigateway/${arr[0]}/${arr[1]}`
};