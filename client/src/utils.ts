import moment from 'moment';

export const convertSem = (sem: number) => {
  return {
    year: sem % 10 + 2000,
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
  return parseInt(now.format('YYYY')) % 100 * 10 + sem
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