import axios from 'axios';
import cookies from 'js-cookie';
import { FederalProvider } from './types';

export const handleUserChangeDB = (accessToken: string, payload: any) => {
  console.log({payload: {...payload}})
  axios.put(`/api/v2/mongo/users`, {payload: {...payload}}, {
    headers: {Authorization: `Bearer ${accessToken}`}
  })
}

// @ AUTHENTICATION 
export const generateAccessToken = async (federalProvider: FederalProvider, federalID: string) => {
  const data = (await axios.post(`/api/v2/auth/login`, {
    federalProvider, federalID
  })).data;

  return {
    error: data.error as boolean, 
    accessToken: data.payload.accessToken as string, 
    expires: data.payload.expires as number
  }
}

export const getAuthorization = () => {
  return {
    headers: {
      Authorization: `Bearer ${cookies.get('login')}`
    }
  }
}

export const getAccessToken = () => {
  return cookies.get('login') as string
}

export const addToken = (name: string, data: any, expires: number) => {
  cookies.set(name, data, {expires});
}

// @ SIGN OUT / FORCE EXPIRING
export const killCookie = (what: string) =>  {
  cookies.remove('login');
}

