export const FETCHY = '[API] Fetchy';
export const FETCHY3 = '[API] Fetchy3'

export const fetchy = (
  method: 'post' | 'get' | 'put' | 'delete', url: string, payload?: object[] | null,
  onSuccess?: any, additionalUrl?: string | null //4, 5
) => {
  return {
    type: FETCHY,
    payload: {method, url, payload, onSuccess, additionalUrl}
  }
}

export type Fetchy3ActionPayload = {
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  payload: object[] | null,
  onSuccess: any | null
}

export const fetchy3 = ({ method, url, payload, onSuccess }: Fetchy3ActionPayload) => {
  return {
    type: FETCHY3,
    payload: { method, url, payload, onSuccess }
  }
}