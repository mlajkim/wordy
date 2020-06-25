/**
 * This stand alone function converts the data into 
 * Body parsed json type
 * must be the Date.now();
 */
export default function dateConverter (date) {
  const jsonDate = {}
  const theDate = Date.now(date);

  jsonDate.year = theDate.getYear() + 1900; // Year of 2020 will be 120.
  jsonDate.month = theDate.getMonth();
  jsonDate.getDate = theDate.getDate();
  jsonDate.day = theDate.getDay();

  return jsonDate;
}