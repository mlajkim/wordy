// Type
import { Policy } from "../../typesBackEnd";

// Declare
export const PREDEFINED_ONLY_OWNER: Policy = {
  version: "1.0.210729",
  statement: {
    effect: "Allow",
    action: "*",
    principal: "*",
    condition: {
      requesterWrnMatchesResourceOwnerWrn: true
    }
  }
};
export const PREDEFINED_ONLY_TO_GROUP_MEMBERS: Policy = {
  version: "1.0.210729",
  comment: "Available only to the members within the group member",
  statement: {
    effect: "Allow",
    action: "*",
    principal: "*",
    condition: {
      availableOnlyToTheGroupMemberOfOwner: true
    }
  }
};
export const PREDEFINED_ONLY_TO_GROUP_AND_TEMPORARY_TOKEN: Policy = {
  version: "1.0.210729",
  statement: [
    {
      effect: "Allow",
      action: "*",
      principal: "*",
      condition: {
        availableOnlyToTheGroupMemberOfOwner: true
      }
    },
    {
      effect: "Allow",
      action: "*",
      principal: "*",
      condition: {
        temporaryTokenValidated: true
      }
    }
  ]
};
export const PREDEFINED_ONLY_TO_TEMPORARY_TOKEN: Policy = {
  version: "1.0.210729",
  statement: {
    effect: "Allow",
    action: "*",
    principal: "*",
    condition: {
      temporaryTokenValidated: true
    }
  }
};
export const PREDEFINED_ONLY_TO_WORDY_MEMBER: Policy = {
  version: "1.0.210729",
  statement: {
    effect: "Allow",
    action: "*",
    principal: "*",
    condition: {
      wordyAccessTokenValidated: true
    }
  }
};
export const PREDEFINED_ONLY_TO_ADMIN: Policy = {
  version: "1.0.210729",
  statement: {
    effect: "Allow",
    action: "*",
    principal: "*",
    condition: {
      isAdmin: true
    }
  }
};
export const PREDEFINED_DANGEROUSLY_PUBLIC: Policy = {
  version: "1.0.210729",
  statement: {
    effect: "Allow",
    action: "*",
    principal: "*",
  }
};