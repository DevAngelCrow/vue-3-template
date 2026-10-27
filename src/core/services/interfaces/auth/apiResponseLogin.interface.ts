// Shape returned by POST /auth/login and POST /auth/refresh-token.
// The refresh token is NOT part of the body: it travels only in an HttpOnly
// cookie that JavaScript cannot read.
export interface AuthSessionData {
  id: string;
  user_name: string;
  access_token: string;
  token_type: string;
  user: string;
}

export interface ApiResponseLogin {
  data: AuthSessionData;
  statusCode: number;
  message: string;
}
