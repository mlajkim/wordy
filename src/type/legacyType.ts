import { AddableLanguage } from './generalType'
import { AvailableWpWrn } from './availableType'
import Wrn from './wrn'

export type LegacyPureWord = {
  // ! This will  be used to define if the data is encrypted or not!
  wrn: Wrn,
  ownerWrn: Wrn,
  isEncrypted: boolean,
  imageWrn: Wrn[],
  wpWrn: AvailableWpWrn,
  legacyId: string,
  // ! Legacy below
  _id: string,
  ownerID: string,
  order: number, 
  dateAdded: number, 
  // reviews
  lastReviewed: number,
  reviewdOn: number[], 
  step: number,
  // others
  seederID: string, 
  packageID: string, 
  isFavorite: boolean,
  sem: number,
  language: AddableLanguage,
  tag: string[],
  word: string,
  pronun: string,
  meaning: string,
  example: string,
  isPublic: boolean,
} 