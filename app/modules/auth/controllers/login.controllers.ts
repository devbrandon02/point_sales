import * as jose from "https://deno.land/x/jose@v5.3.0/index.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.3.0/mod.ts";


import { Login_Request, Login_Response } from "../schemas/schemas.ts";
import UserModel from "../../users/models/user.model.ts";
import { Context } from "https://deno.land/x/oak@14.2.0/mod.ts";
import { Status } from "jsr:@oak/commons@0.7/status";

export class LoginController {
  JWT_SECRET: string | undefined = Deno.env.get("JWT_SECRET");
  JWT_ISSUER: string | undefined = Deno.env.get("JWT_ISSUER");
  JWT_AUDIENCE: string | undefined = Deno.env.get("JWT_AUDIENCE");

  constructor() {}

  private async validateRecaptchaToken(token: string): Promise<boolean> {}

  private async createJwtToken(): Promise<string> {
    if (!this.JWT_SECRET || !this.JWT_ISSUER || !this.JWT_AUDIENCE) {
      throw new Error(
        "@LoginController: JWT_SECRET or JWT_ISSUER or JWT_AUDIENCE not found in env vars"
      );
    }

    try {
      const secretJwtEncoded = new TextEncoder().encode(this.JWT_SECRET);

      const jwt = await new jose.SignJWT({ foo: "bar" })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setIssuer(this.JWT_ISSUER)
        .setAudience(this.JWT_AUDIENCE)
        .setExpirationTime("12h")
        .sign(secretJwtEncoded);
      return jwt;
    } catch (error) {
      return error
    }
  }

  public async login(ctx: Context, {
    email,
    password,
    g_recaptcha_response,
    tenantsId,
  }: Login_Request): Promise<Login_Response> {
    // const recaptchaValid = await this.validateRecaptchaToken(g_recaptcha_response);

    try {
      const user = await UserModel.findOne({ email, tenantsId });
      if (!user) {
        ctx.response.status = Status.NotFound;
        throw new Error("@LoginController: User not found");
      }
      
      const jwt = await this.createJwtToken();
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        ctx.response.status = Status.Unauthorized;
        throw new Error("@LoginController: Password does not match");
      }

      if (!jwt) {
        ctx.response.status = Status.InternalServerError;
        throw new Error("@LoginController: JWT could not be created");
      }
  
      const response: Login_Response = {
        jwt_token: jwt,
        error: false,
      } as Login_Response;

      return response;

      
    } catch (error) {
      throw new Error(error);
    }

  }
}
