import { Resource } from '../type/resourceType';
import { Wrn, Gateway, JwtData, AssignedIdentity } from '../type/availableType';

export type WordyEvent = {
  
  // header (data from end user)
  eventVersion: "1.0.210731",
  eventType: EventType,
  tempAccessToken?: string,
  requesterInputData?: any,
  // header core (written by server, but its important)
  status?: number;
  // body (what end user wants)
  serverResponse?: ServerResponse
  serverMessage?: string;
  payload?: any // data that is sent to end-user (front end)
  price?: number
  // tail (data put by server)
  requesterWrn?: Wrn; // actual initiator
  identifiedAsWrn?: Wrn | AssignedIdentity;
  requesterInfo?: JwtData;
  validatedBy?: (EventType | Gateway)[];
  internalResource?: Resource[] | Resource; // unrefined pure resource. will be deleted at CMK
  
};

export type ServerResponse = "Denied" | "Accepted" | "LogicallyDenied";
export type EventType =  `word:${WordSerivce}` | `okr:${OkrService}` | `kms:${KmsService}` | `user:${UserService}`
  | `wp:${WpService}` | `wss:${Wss}`;

type Wss = // Wordy Signin Service
  "signOut"

type WpService = // Wordy Policy 
  "*" |
  "changeWp";

type OkrService =
  "*" | //all
  "createMyOkr" |
  "getMyOkr" |
  "getOkrContainer" |
  "createOkrObject" |
  "getOkrObject" |
  "inviteMember" | // will be used to invite any member using his or her public account number
  "acceptInvitation" | // accepts the invitation
  "rejectInvitation" | // rejects the invitaton
  "blockInvitation"; // block the invitation. the user can no longer 

type UserService = 
  "*" |
  "createUser" |
  "getUser";
  
type KmsService = 
  "*" |
  "decryptDek";

type WordSerivce = 
  "*" | //all
  "detectLanguage" |
  "postWord"


export const pathFinder = (eventType: EventType): string => {
  const arr = eventType.split(":");
  return `/${arr[0]}/${arr[1]}`
};