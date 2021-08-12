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
import { Resource, UnencryptedPureResource, ResourceId } from "../../type/resourceType";
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
  (RE: WordyEvent, resource: Resource, unencryptedPureResource: ResourceId | UnencryptedPureResource)
  : ResourceId | UnencryptedPureResource  => {
  
    // validate with wpServiceLogic
  if (wpServiceLogic(RE, resource) !== "Passed") {
    const censoredObject = pick(unencryptedPureResource, 'wrn') as ResourceId;
    censoredObject.resoureAvailability = "NotVisible";
    censoredObject.rejectedReason = `Rejected by ${SERVICE_NAME} due to resource policy`;

    return censoredObject;
  }

  return unencryptedPureResource;
}

type WpResponse = "Passed" | "NotPassed";
export const wpServiceLogic = (RE: WordyEvent, resource: Resource): WpResponse => {  
  // applying policy
  const policy: Policy = policyGrabber(resource.wpWrn);

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
        if (validateWrn(RE.identifiedAsWrn!, policyPrincipal) === 'Passed') {
          const actions = intoArray(definedStatement.action);
          for (const action of actions) {
            if (validateWrn(RE.eventType!, action) === 'Passed'
              && conditionChecker(RE, resource, definedStatement.condition) === "Passed"  
            ) 
              return "NotPassed"; // no longer requires checking
          };
        }
      };
    } else if (definedStatement.effect === "Allow") {
      for (const policyPrincipal of policyPrincipals) {
        if (validateWrn(RE.identifiedAsWrn!, policyPrincipal) === 'Passed') {
          const actions = intoArray(definedStatement.action);
          for (const action of actions) {
            if (validateWrn(RE.eventType!, action) === 'Passed'
              && conditionChecker(RE, resource, definedStatement.condition) === "Passed"
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
export const conditionChecker = (RE: WordyEvent, resource: Resource, givenCondition: Condition): WpResponse => {
  let defaultResponse: WpResponse = "Passed";
  const conditions = Object.entries(givenCondition ? givenCondition : []);

  // validating
  // logic: must match all, if blocked once, then it rejects
  // Also, not supported condition is ignored and therefore will be 'allowed', until you specfiy logic
  for (const condition of conditions) {
    switch(condition[0]) {
      case "requesterWrnMatchesResourceOwnerWrn":
        if (RE.requesterWrn !== resource.ownerWrn) defaultResponse = "NotPassed";
        break; // no longer requires checking. it is not passed.
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
export const policyGrabber = (wpWrn: AvailableWpWrn) => {
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
}
