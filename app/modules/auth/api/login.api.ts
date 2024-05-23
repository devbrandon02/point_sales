import { Context } from "https://deno.land/x/oak@14.2.0/mod.ts";
import { LoginController } from "../controllers/login.controllers.ts";



export const LoginApi = async (ctx: Context)  => {
  const tenantId = ctx.state.tenant?._id;
  if(!tenantId){
      ctx.response.status = 401;
      return ctx.response.body = {error: "@UserApi: Unauthorized"};
  }

  const { email, password, g_recaptcha_response } = await ctx.request.body.json()
  if(!email || !password){
    ctx.response.status = 400
    return ctx.response.body = {error: "@LoginApi: Some mandatory values ​​are missing"}
  }
  
  try {
    const responseController = await new LoginController().login(ctx, {
      email: email,
      password: password,
      g_recaptcha_response: "g_recaptcha_response",
      tenantsId: tenantId
    })
    
    ctx.response.status = 200
    return ctx.response.body = responseController
  } catch (error) {
    console.log("@LoginApi: Unexpected error in controller");
    return ctx.response.body = {error: "@LoginApi: Unexpected error in controller" + error}
  }

}