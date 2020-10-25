import moment from 'moment';

export const convertSem = (sem: number) => {
  return {
    year: (Math.floor(sem / 10)) + 2000,
    sem: sem % 10
  } 
}

export const format_into_sem = (year: number, semester: number) => {
  return (year % 100) * 10 + semester;
};

export const get_sem = () => {
  const now = moment();
  let sem = 1;
  if(parseInt(now.format('MM')) >= 10) sem = 4;
  else if (parseInt(now.format('MM')) >= 7) sem = 3;
  else if (parseInt(now.format('MM')) >= 4) sem = 2;
  return (parseInt(now.format('YYYY')) % 100) * 10 + sem
};

export const handleCountryCode = (countryCode: string) => {
  switch(countryCode) {
    case 'KR':
      return 'ko'
    case 'JP':
      return 'ja'
    case 'CN':
      return 'en' // chinese not yet
    case 'FR':
      return 'en' // french not yet
    default:
      return 'en'
  }
};

export const countryCodeIntoLanguage = (countryCode: string) => {
  switch(countryCode) {
    case 'ko':
      return '🇰🇷 한국어'
    case 'en':
      return '🇺🇸 English'
    case 'ja':
      return '🇯🇵 日本語' // chinese not yet
    case 'zh':
      return '🇨🇳 中文 (简体)'
    default:
      return '?'
  }
};

export const checkIfToday = (time: number): boolean => {
  // addedDate
  const givenTime = moment(time).valueOf(); //moment = time
  const beginningOfToday = moment().startOf('day').valueOf();
  return beginningOfToday <= givenTime ? true : false;
};

// beforeDays에 입력된 값 (예를들어 1일경우 어제가 됩니다.)
export const checkIfThisDay = (time: number, beforeDays: number): boolean => {
  const givenTime = moment(time).valueOf(); //moment = time
  const theDaysBefore = beforeDays * 24 * 60 * 60 * 1000;
  const endOfTheBeforeDays = moment().endOf('day').valueOf() - theDaysBefore;
  const beginningOfTheBeforeDays = moment().startOf('day').valueOf() - theDaysBefore;
  return endOfTheBeforeDays >= givenTime && beginningOfTheBeforeDays <= givenTime ? true : false;
}

export const today = () => {
  return convertSem(get_sem());
};