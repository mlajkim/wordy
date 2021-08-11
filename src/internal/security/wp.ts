/**
 * Commented on Aug 11, 2021
 * WP Wordy Policy Service
 * 
 * Commented on Aug 11, 2021
 * By default, there should be only one wp for each resourece. not multiple.
 * Also, for now, supporting only policy version 1.0.210729
 */

// Type
import { Resource } from "../../type/resourceType";
import { AvailableWpWrn } from "../../type/availableType";
import { Policy, StatementType } from '../../typesBackEnd';
import { WordyEvent } from '../../type/wordyEventType';
// service
import { intoArray, validateWrn } from '../../type/sharedWambda';
// Decalred
import {
  PREDEFINED_ONLY_ME, 
  PREDEFINED_ONLY_TO_GROUP_MEMBERS, 
  PREDEFINED_ONLY_TO_GROUP_AND_TEMPORARY_TOKEN,
  PREDEFINED_ONLY_TO_TEMPORARY_TOKEN,
  PREDEFINED_ONLY_TO_WORDY_MEMBER,
  PREDEFINED_DANGEROUSLY_PUBLIC,
  PREDEFINED_ONLY_TO_ADMIN
} from './predefinedPolicies';

type WpResponse = "Passed" | "NotPassed";
export const wpService = (requestedEvent: WordyEvent, resource: Resource): WpResponse => {
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
        if (validateWrn(requestedEvent.requesterWrn!, policyPrincipal) === 'Passed') {
          const actions = intoArray(definedStatement.action);
          for (const action of actions) {
            if (validateWrn(requestedEvent.eventType!, action) === 'Passed') 
              return "NotPassed"; // no longer requires checking
          };
        }
      };
    } else if (definedStatement.effect === "Allow") {
      for (const policyPrincipal of policyPrincipals) {
        if (validateWrn(requestedEvent.requesterWrn!, policyPrincipal) === 'Passed') {
          const actions = intoArray(definedStatement.action);
          for (const action of actions) {
            if (validateWrn(requestedEvent.eventType!, action) === 'Passed') {
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

// currently does not support customized wp
// but will eventually connect to mongo db and get the data from db
export const policyGrabber = (wpWrn: AvailableWpWrn) => {
  switch(wpWrn) {
    case "wrn::wp:pre_defined:backend:only_me:210811":
      return PREDEFINED_ONLY_ME;
    case "wrn::wp:pre_defined:backend:only_to_group_members:210811":
      return PREDEFINED_ONLY_TO_GROUP_MEMBERS;
    case "wrn::wp:pre_defined:backend:only_to_group_and_temporary_token:210811":
      return PREDEFINED_ONLY_TO_GROUP_AND_TEMPORARY_TOKEN;
    case "wrn::wp:pre_defined:backend:only_to_temporary_token:210811":
      return PREDEFINED_ONLY_TO_TEMPORARY_TOKEN;
    case "wrn::wp:pre_defined:backend:only_to_wordy_member:210811":
      return PREDEFINED_ONLY_TO_WORDY_MEMBER;
      case "wrn::wp:pre_defined:backend:only_to_admin:210811":
        return PREDEFINED_ONLY_TO_ADMIN;
    case "wrn::wp:pre_defined:backend:dangerously_public:210811":
      return PREDEFINED_DANGEROUSLY_PUBLIC;
    default:
      // by default it is only available to the owner
      return PREDEFINED_ONLY_ME;
  }
}
