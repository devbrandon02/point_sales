import { Context } from "https://deno.land/x/oak@14.2.0/mod.ts";
import { LoginController } from "../controllers/login.controllers.ts";

export const LoginApi = async (ctx: Context)  => {

  const responseController = await LoginController({
    email: "Brandon",
    password: "Hola",
    g_recaptcha_response: ""
  })

  return ctx.response.body = responseController
}