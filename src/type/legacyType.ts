import { AddableLanguage } from './generalType';

export type LegacyPureWord = {
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