// import
import cookies from 'js-cookie';
// types
import { AvailableCookies } from './type/generalType';

// Cookies API
export const readCookie = (cookieName: AvailableCookies) => {
  return cookies.get(cookieName) as string;
};

export const addOrUpdateCookie = (cookieName: AvailableCookies, data: any, expires?: number) => {
  cookies.set(cookieName, data, { expires });
};