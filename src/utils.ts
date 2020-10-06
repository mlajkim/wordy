import moment from 'moment';

export const getDate = () => {
  const now = moment();
  const year = parseInt(now.format('YYYY'));
  const month = parseInt(now.format('MM'));
  let sem = 1;
  if(month <= 3) sem = 1;
  else if (month <= 6) sem = 2;
  else if (month <= 9) sem = 3;
  else sem = 4;

  return {now, year, sem}
  
}