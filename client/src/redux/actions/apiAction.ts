export const FETCHY = '[API] Fetchy';
export const FETCHY_FINALLY = '[API] Fetchy Finally'

export const fetchy = (
  method: 'post' | 'get' | 'put' | 'delete',
  url: string,
  payload?: object[] | null,
  onSuccess?: any
) => {
  return {
    type: FETCHY,
    payload: {method, url, payload, onSuccess}
  }
}
