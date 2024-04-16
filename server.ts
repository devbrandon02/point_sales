import { ConnectDatabases } from "./app/databases/database.connect.ts";
import { LoadEnv } from "./app/loadEnv.ts";
import { Application, Context,  } from "https://deno.land/x/oak@14.2.0/mod.ts";
import AUTH_ROUTER from "./app/modules/auth/routes/auth.routes.ts";
import * as oakCompress from "https://deno.land/x/oak_compress@v0.0.2/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import tenantModel from "./app/modules/tenants/models/tenants.model.ts";
import TENANT_ROUTER from "./app/modules/tenants/routes/tenants.routes.ts";


const identifyTenant = async (ctx: Context, next: Function) => {
  if(ctx.request.url.pathname === `/${Deno.env.get("API_VERSION")}/tenant/create`){
    return await next()
  }
  
  const tenantDomain = ctx.request.headers.get("X-Tenant-domain");
  if (!tenantDomain) {
    ctx.response.status = 400;
    ctx.response.body = "Missing X-Tenant-domain header";
    return;
  }

  const tenant = await tenantModel.findOne({ domain: tenantDomain });
  if (!tenant) {
    ctx.response.status = 404;
    ctx.response.body = "Tenant not found";
    return;
  }

  ctx.state.tenant = tenant;
  await next();
}

async function authenticate(ctx: Context, next: Function) {
  // Lógica de autenticación y autorización aquí
  // Verifica que el usuario tenga permisos para acceder a este tenant
  await next();
}

const InitServer = async () => {
  const app = new Application();

  await LoadEnv();
  app.use(oakCors()); 
  app.use(identifyTenant)
  app.use(authenticate)
  app.use(oakCompress.brotli());
  app.use(AUTH_ROUTER.routes());
  app.use(TENANT_ROUTER.routes());

  try {
    await ConnectDatabases();
    console.log("✅ Connection Databases Success...");
    console.log("✅ Server Running SUCCESS");
    await app.listen({ port: 8000 });
  } catch (error) {
    console.log("❌ Server Running FAILED", error);
  }
};

InitServer();
