// Main
import { intoArray, validateWrn } from '../../type/sharedWambda';
import { censorUserWrn } from '../../internal/compute/backendWambda';
// Type
import { StatementType, AUTHORIZED_MESSAGE, Policy } from '../../typesBackEnd';
import { Gateway } from '../../type/availableType';
import { WordyEvent } from '../../type/wordyEventType';


export const iamGateway = (requestedEvent: WordyEvent, policy: Policy): WordyEvent => {
	// Validation
	if (requestedEvent.serverResponse === "Denied") return requestedEvent;
    
  // Record
	const GATEWAY_NAME: Gateway = "iamGateway"
	requestedEvent.validatedBy 
    ? requestedEvent.validatedBy.push(GATEWAY_NAME)   
    : requestedEvent.validatedBy = [GATEWAY_NAME]; 

	requestedEvent.serverResponse = "Denied" // by default
	requestedEvent.serverMessage = `Implicitly denied by ${GATEWAY_NAME} due to insufficient pemission`; // by default

	if (policy.version === "1.0.210729") {
    const definedStatements = intoArray(policy.statement) as StatementType[]; 

	for (const definedStatement of definedStatements) {
    const policyPrincipals = intoArray(definedStatement.principal) as string[];
    if (definedStatement.effect === "Deny") {
    for (const policyPrincipal of policyPrincipals) {
        
      if (validateWrn(requestedEvent.requesterWrn!, policyPrincipal) === 'Passed') {
        const actions = intoArray(definedStatement.action);
        for (const action of actions) {
          if (validateWrn(requestedEvent.eventType!, action) === 'Passed') {
            requestedEvent.serverResponse = "Denied";
            requestedEvent.serverMessage = 
              `User: ${censorUserWrn(requestedEvent.requesterWrn)} is not authorized to perform: ${requestedEvent.eventType}`
            return requestedEvent; // returned denied event
          }
        };
      }
    };
			} else if (definedStatement.effect === "Allow") {
        for (const policyPrincipal of policyPrincipals) {
          if (validateWrn(requestedEvent.requesterWrn!, policyPrincipal) === 'Passed') {
            const actions = intoArray(definedStatement.action);
            for (const action of actions) {
              if (validateWrn(requestedEvent.eventType!, action) === 'Passed') {
                requestedEvent.serverResponse = "Accepted";
                requestedEvent.serverMessage = AUTHORIZED_MESSAGE
                break; // for performance
              }
            };
          }
        };
			} else {
						requestedEvent.serverMessage = "Internal Error; Access denied" // should not happen
				}
		}
	}
	else {
			requestedEvent.serverMessage = "Not authorized due to unsupported version receieved"
	}

	return requestedEvent;
}