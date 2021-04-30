/**
 * 
 * No 's' Even when it supports multiple actions in one action
 * Its always to have more data than less.
 */

export type AvailableEvent = {
  
};

export type FilteredEvent = {

};

export type EventHeader = {
  eventName: EventName
  eventCriticality: 'low' | 'medium' | 'high' | 'very high'
  eventVersion: string
  eventAvailability: 'Available' | 'Deprecated' | 'AdminOnly'
  unavailableDate: string
};

export type UserIdentity = {
  wrn: string
};



export type EventType = {
  // Event Header
  eventName: EventName
  eventVersion: number // "1.0"
  eventId: string // randomly created.
  eventTime: number // "12482304230922Z" (UTD)
  sourceIpAddress: string // "142.33.225.13"
  sourceIpCountry: string

  // 
  requesterWrn: string // "wrn::user:anonymus:<hiddenusercode>x8asdsfmo8Sfdis8FS_dasdj7@@!d:" or "wrn:user:root::"
  eventAccessKey: string // used for restricted APIs,
  payload: any 
};  

// @Wrn (Wordy Resource Name) (Inspired for ARN, Amazon Resource Name)
// wrn (fixed?) (More like can be versioned)
// WrnType = word, user, log, preference
// wrnClassification = different for each typed (This is only for reference and not valid)
// wrnId = Actual ID for the ID and in fact, very important. must be encypted and cared.
export type Wrn = `wrn:blank_for_future_usage:wrn_type:wrn_classification:wrn_id`;

// @Event
export type EventName = SigninEvent | WordEvent | UserEvent | PreferenceEvent| CreditEvent;

export type SigninEvent = 'GetRefreshToken' | 'GetAccessToken';
export type WordEvent = 'AddWord' | 'GetWord'| 'DeleteWord' | 'ModifyWord';
export type UserEvent = 'AddUser' | 'GetUser'| 'DeleteUser' | 'ModifyWords';
export type PreferenceEvent = 'AddPreference' | 'GetPreference'| 'DeletePreference' | 'ModifyPreference';
export type CreditEvent = 'AddCredit' | 'GetCredit'| 'DeleteCredit' | 'ModifyCredit'| 'SetCredit'| 'ChargeCredit'| 'SpendCredit';