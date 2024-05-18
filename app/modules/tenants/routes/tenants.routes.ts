import { Router } from "https://deno.land/x/oak@14.2.0/router.ts";
import { CreateTenantApi, ListTenantsApi } from "../api/tenants.api.ts";

  
const API_VERSION = Deno.env.get("API_VERSION") || "api/v1";

const TENANT_ROUTER = new Router({
  prefix: `/${API_VERSION}/tenant`,
});

TENANT_ROUTER.get("/list", (ctx) => ListTenantsApi(ctx));
TENANT_ROUTER.post("/create", (ctx) => CreateTenantApi(ctx));

export default TENANT_ROUTER;
