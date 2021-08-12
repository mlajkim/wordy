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

// test
export const okay: Policy = {
  version: "1.0.210729",
  comment: "Allow anyone to ",
  statement: [
    {
      effect: "Allow",
      action: "*",
      principal: "*",
      condition: { 
        wordyAccessTokenValidated: true
      }
    },
    {
      effect: "Deny",
      action: "*",
      principal: "wrn::group:albanySquad:mdb:w9fuhhgosnt23brefwdf",
      // this group will be converted into principal user wrn that moment.
    },
  ]
};
// test
export const newOkay: Policy = {
  version: "1.0.210729",
  comment: "Allow anyone to ",
  statement: [
    {
      effect: "Allow",
      action: "*",
      principal: "*",
      condition: { 
        wordyAccessTokenValidated: true
      }
    },
    {
      effect: "Deny",
      action: "*",
      principal: [
        "wrn::tts:",
        "wrn::group:albanySquad:mdb:w9fuhhgosnt23brefwdf",
        "wrn::user:google:mdb:1231241824124124",
        "wrn::user:google:mdb:12311251254124124"
      ],
      // this group will be converted into principal user wrn that moment.
    },
  ]
};


// Google developer
// From now on, you will be maksing a policy uisng the following 
export const googlePolicy : Policy = {
  version: "1.0.210729",
  comment: "Allow anyone to ",
  statement: [
    {
      effect: "Allow",
      action: "*",
      principal: "wrn::group:google_japan:asdgy8af87f78shifssdfsf",
      condition: { 
        wordyAccessTokenValidated: true
      }
    },
    {
      effect: "Allow",
      action: "*",
      principal: "*",
      condition: { 
        availableOnlyToTheGroupMemberOfOwner: true
      }
    }
  ]
};
// availableOnlyToTheGroupMemberOfOwner -> 
// get the user wrn data
// add extra, called 
// wrn::identity::member

/**
 * 
 * 
 * Letting you to identifedAs 
 * wrn::identity:member:internal:pre_defined_seeable_after_availableOnlyToTheGroupMemberOfOwner_true:
 */