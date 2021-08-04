export type WordyEvent = {
  // header (data from end user)
  eventVersion: "1.0.210731",
  eventType: EventType,
  accessToken?: string,
  requesterInputData?: any,
  // body (what end user wants)
  serverResponse?: "Denied" | "Accepted";
  serverMessage?: string;
  payload?: any
  // tail (data put by server)
  requesterWrn?: string;
  validatedBy?: Validator[]
}

export type Validator = "iamGateway" | "wcsGateway" | "kmsGateway" | "mongoGateway" | "cloudTrailGateway";

export type EventType =  `word:${WordSerivce}` | `okr:${OkrService}`

type WordSerivce = 
  "*" | //all
  "detectLanguage" |
  "postWord"

type OkrService =
  "*" | //all
  "inviteMember" | // will be used to invite any member using his or her public account number
  "acceptInvitation" | // accepts the invitation
  "rejectInvitation" | // rejects the invitaton
  "blockInvitation" | // block the invitation. the user can no longer 
  "createNewOkr" 


export const pathFinder = (eventType: EventType): string => {
  const arr = eventType.split(":");
  return `/${arr[0]}/${arr[1]}`
};