// Main
import { intoArray, validateWrn } from '../../type/sharedWambda';
// Type
import { StatementType, AUTHORIZED_MESSAGE, Policy } from '../../typesBackEnd';
import { Gateway, AvailableWpWrn } from '../../type/availableType';
import { WordyEvent } from '../../type/wordyEventType';
import { policyGrabber, conditionChecker } from './wp'

export const iamGateway = (RE: WordyEvent, wpWrn: AvailableWpWrn): WordyEvent => {
	// Validation
	if (RE.serverResponse === "Denied") return RE;
  
  const policy: Policy = policyGrabber(wpWrn);

  // Record
	const GATEWAY_NAME: Gateway = "iamGateway"
	RE.validatedBy 
    ? RE.validatedBy.push(GATEWAY_NAME)   
    : RE.validatedBy = [GATEWAY_NAME]; 

	RE.serverResponse = "Denied" // by default
	RE.serverMessage = `Implicitly denied by ${GATEWAY_NAME} due to insufficient pemission`; // by default

	if (policy.version === "1.0.210729") {
    const definedStatements = intoArray(policy.statement) as StatementType[]; 

	for (const definedStatement of definedStatements) {
    const policyPrincipals = intoArray(definedStatement.principal) as string[];
    if (definedStatement.effect === "Deny") {
    for (const policyPrincipal of policyPrincipals) {
        
      if (validateWrn(RE.requesterWrn!, policyPrincipal) === 'Passed') {
        const actions = intoArray(definedStatement.action);
        for (const action of actions) {
          if (validateWrn(RE.eventType!, action) === 'Passed'
            && conditionChecker(RE, definedStatement.condition) === "Passed"
          ) {
            RE.serverResponse = "Denied";
            RE.serverMessage = `User ${RE.requesterWrn} is not authorized to perform: ${RE.eventType}`;
            return RE; // returned denied event
          }
        };
      }
    };
			} else if (definedStatement.effect === "Allow") {
        for (const policyPrincipal of policyPrincipals) {
          if (validateWrn(RE.requesterWrn!, policyPrincipal) === 'Passed') {
            const actions = intoArray(definedStatement.action);
            for (const action of actions) {
              if (validateWrn(RE.eventType!, action) === 'Passed'
                && conditionChecker(RE, definedStatement.condition) === "Passed"
              ) {
                RE.serverResponse = "Accepted";
                RE.serverMessage = AUTHORIZED_MESSAGE
                break; // for performance
              }
            };
          }
        };
			} else {
						RE.serverMessage = "Internal Error; Access denied" // should not happen
				}
		}
	}// end of if
	else {
			RE.serverMessage = "Not authorized due to unsupported version receieved"
	}

	return RE;
}