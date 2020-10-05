import axios from 'axios';

export const handleUserChangeDB = (accessToken: string, payload: any) => {
  console.log({payload: {...payload}})
  axios.put(`/api/v2/mongo/users`, {payload: {...payload}}, {
    headers: {Authorization: `Bearer ${accessToken}`}
  })
}

