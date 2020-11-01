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

export type Fetchy3ActionPayload = { method: Method, url: Url, payload: Payload, onSuccess: OnSuccess }
type Method = 'get' | 'post' | 'put' | 'delete';
type Url = string;
type Payload = null | object[];
type OnSuccess = any;

export const fetchy3 = (method: Method, url: Url, payload: Payload, onSuccess: OnSuccess) => {
  return {
    type: FETCHY3,
    payload: { method, url, payload, onSuccess }
  }
}