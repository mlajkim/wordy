import axios from 'axios';
import cookies from 'js-cookie';

export const handleUserChangeDB = (accessToken: string, payload: any) => {
  console.log({payload: {...payload}})
  axios.put(`/api/v2/mongo/users`, {payload: {...payload}}, {
    headers: {Authorization: `Bearer ${accessToken}`}
  })
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

