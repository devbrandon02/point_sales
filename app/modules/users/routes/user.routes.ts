import { Router } from "https://deno.land/x/oak@14.2.0/router.ts";
import { CreateUserApi } from "../api/user.api.ts";

  
const API_VERSION = Deno.env.get("API_VERSION") || "api/v1";

const USER_ROUTER = new Router({
  prefix: `/${API_VERSION}/user`,
});

// TENANT_ROUTER.get("/list", (ctx) => ListTenantsApi(ctx));
USER_ROUTER.post("/create", (ctx) => CreateUserApi(ctx));

export default USER_ROUTER;
