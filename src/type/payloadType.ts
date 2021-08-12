// Commented on Aug 7, 2021
// this is validated type value
// This data is what backend sends

import { UserResource } from '../type/resourceType';

export type wordDetectLanguagePayload = { language: string, isReliable: boolean, confidence: number }[];

export type UserCreateUser = UserResource