import { Login_Request, Login_Response } from "../schemas/schemas.ts";

export const LoginController = (
  { email, password, g_recaptcha_response }: Login_Request,
): Login_Response => {
  const response: Login_Response = {
    jwt_token: "Bien",
  };

  return response;
};
