import { Router } from "https://deno.land/x/oak@14.2.0/router.ts";
import { LoginApi } from "../api/login.api.ts";

const API_VERSION = Deno.env.get("API_VERSION") || "api/v1";

const AUTH_ROUTER = new Router({
  prefix: `/${API_VERSION}/auth`,
});

AUTH_ROUTER.post("/login", (ctx) => LoginApi(ctx));

export default AUTH_ROUTER;
