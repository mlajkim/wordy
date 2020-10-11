export const FETCHY = '[API] Fetch';

export const fetchy = (
  method: 'post' | 'get' | 'put' | 'delete',
  url: string,
  data: object
) => {
  return {
    type: FETCHY,
    payload: {method, url, data}
  }
}

