type SharedResponse_v1 = {
  responseType: 'OK' | 'new' | 'deny';
  message: string;
}

export type RequestRefreshtokenThroughGoogleResponse_V1 = SharedResponse_v1 & {
  refreshtoken: string;
  accesstoken: string;
};