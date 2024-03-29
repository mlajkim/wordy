/**
 * Commented on Aug 11, 2021
 * WP Wordy Policy Service
 * 
 * Commented on Aug 11, 2021
 * By default, there should be only one wp for each resourece. not multiple.
 * Also, for now, supporting only policy version 1.0.210729
 */
// External
import { pick } from 'lodash';
// Type
import { Resource, PureResource, ResourceId } from "../../type/resourceType";
import { AvailableWpWrn } from "../../type/availableType";
import { Policy, StatementType, Condition } from '../../typesBackEnd';
import { WordyEvent } from '../../type/wordyEventType';
// service
import { intoArray, validateWrn } from '../../type/sharedWambda';
// Decalred
import {
  PREDEFINED_ONLY_OWNER, 
  PREDEFINED_ONLY_TO_GROUP_MEMBERS, 
  PREDEFINED_ONLY_TO_WORDY_MEMBER,
  PREDEFINED_DANGEROUSLY_PUBLIC,
  PREDEFINED_ONLY_TO_ADMIN
} from './predefinedPolicies';
const SERVICE_NAME = "wpService";

export const wpService = 
  (
    RE: WordyEvent, 
    resource: Resource, 
    unencryptedPureResource: ResourceId | PureResource,
    wpWrn: AvailableWpWrn
  )
  : ResourceId | PureResource  => {
  // validate with wpServiceLogic
  if (wpServiceLogic(RE, resource, wpWrn) !== "Passed") {
    const censoredObject = pick(unencryptedPureResource, 'wrn', 'objectOrder', 'type') as ResourceId;
    censoredObject.resoureAvailability = "NotVisible";
    censoredObject.rejectedReason = `Rejected by ${SERVICE_NAME} due to resource policy`;

    return censoredObject;
  } else {
    unencryptedPureResource.resoureAvailability = "Visible";
  }

  return unencryptedPureResource;
}

type WpResponse = "Passed" | "NotPassed";
const wpServiceLogic = (RE: WordyEvent, resource: Resource, wpWrn?: AvailableWpWrn): WpResponse => {  
  // applying policy
  const policy: Policy = policyGrabber(wpWrn);

  // defining default responese, and by default, not passed.
  let returningResponse: WpResponse = "NotPassed"; // by default
  
  // only supporting 1.0.21029\
  if (resource.resourceVersion !== "1.0.210804")
    return "NotPassed";

  // get statements array
  const definedStatements = intoArray(policy.statement) as StatementType[];

  for (const definedStatement of definedStatements) {
    const policyPrincipals = intoArray(definedStatement.principal) as string[];
    if (definedStatement.effect === "Deny") {
      for (const policyPrincipal of policyPrincipals) {
        if (validateWrn(RE.requesterWrn!, policyPrincipal) === 'Passed') {
          const actions = intoArray(definedStatement.action);
          for (const action of actions) {
            if (validateWrn(RE.eventType!, action) === 'Passed'
              && conditionChecker(RE, definedStatement.condition, resource) === "Passed"  
            ) 
              return "NotPassed"; // no longer requires checking
          };
        }
      };
    } else if (definedStatement.effect === "Allow") {
      for (const policyPrincipal of policyPrincipals) {
        if (validateWrn(RE.requesterWrn!, policyPrincipal) === 'Passed') {
          const actions = intoArray(definedStatement.action);
          for (const action of actions) {
            if (validateWrn(RE.eventType!, action) === 'Passed'
              && conditionChecker(RE, definedStatement.condition, resource) === "Passed"
            ) {
              returningResponse = "Passed"
              break; // for performance
            }
          };
        }
      };
    } else return "NotPassed";
  }

  return returningResponse; // by default
}

// condition should be matched all!
// Since condition is optional, it passes if it is blank. 
export const conditionChecker = (RE: WordyEvent, givenCondition: Condition, resource?: Resource): WpResponse => {
  let defaultResponse: WpResponse = "Passed";
  const conditions = Object.entries(givenCondition ? givenCondition : [])

  if (typeof conditions === "undefined") return "Passed";

  // validating
  // logic: must match all, if blocked once, then it rejects
  // Also, not supported condition is ignored and therefore will be 'allowed', until you specfiy logic
  for (const condition of conditions) {
    switch(condition[0]) {
      case "requesterWrnMatchesResourceOwnerWrn":
        if (condition[1] !== true) continue;
        if (!resource) return "NotPassed"; // no resource? you are not passed.
        if (RE.requesterWrn !== resource.ownerWrn) return "NotPassed";
        break; // no longer requires checking. it is not passed.

      case "wordyAccessTokenValidated":
        if (condition[1] !== true) continue;
        if (RE.requesterInfo && typeof RE.requesterInfo.isWordyUser) defaultResponse = "Passed";
        else return "NotPassed";
        break; 
      

        case "isAdmin":
          if (condition[1] !== true) continue;
          if (RE.requesterInfo && RE.requesterInfo.isAdmin) defaultResponse = "Passed";
          else return "NotPassed";
          break; 


      default:
        // This is when it does not read the condition. 
        // condition is optional, any unsupported condition will not reflect not passing it
        defaultResponse = "Passed";
    } // end of switch
  }; // end of for 

  return defaultResponse; // by default, returning Passed.
}

// currently does not support customized wp
// but will eventually connect to mongo db and get the data from db
export const policyGrabber = (wpWrn?: AvailableWpWrn) => {
  switch(wpWrn) {
    case "wrn::wp:pre_defined:backend:only_owner:210811":
      return PREDEFINED_ONLY_OWNER;
    case "wrn::wp:pre_defined:backend:only_to_group_members:210811":
      return PREDEFINED_ONLY_TO_GROUP_MEMBERS;
    case "wrn::wp:pre_defined:backend:only_to_wordy_member:210811":
      return PREDEFINED_ONLY_TO_WORDY_MEMBER;
    case "wrn::wp:pre_defined:backend:only_to_admin:210811":
      return PREDEFINED_ONLY_TO_ADMIN;
    case "wrn::wp:pre_defined:backend:dangerously_public:210811":
      return PREDEFINED_DANGEROUSLY_PUBLIC;
    default:
      // by default it is only available to the owner
      return PREDEFINED_ONLY_OWNER;
  }
};


// This code is built by Yikumi
// For the same name of function but diferent argument type

/*

type KmsReturningValue = "Encrypt" | "Decrpyt"
function kmsService(serviceType: "Encrypt", encryptedDek:string):any;
function kmsService(serviceType: "Decrpyt"): KmsReturningValue;
function kmsService (serviceType: KmsReturningValue, encryptedDek?: string):any{
  if(serviceType === "Encrypt") {
      return serviceType + encryptedDek;
    } else if (serviceType === "Decrpyt") {
      return serviceType;
  }
};


*/