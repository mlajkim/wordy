import moment from 'moment';

export const format_into_sem = (year: number, semester: number) => {
  return year % 100 + semester;
};

export const get_sem = () => {
  const now = moment();
  return parseInt(now.format('YYYY')) % 100 + parseInt(now.format('MM'))
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