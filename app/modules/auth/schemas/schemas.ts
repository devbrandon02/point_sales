export interface Login_Request {
  email: string
  password: string
  g_recaptcha_response: string
  tenantsId: string
}

export interface Login_Response {
  jwt_token: string
  error: string | boolean
}