
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