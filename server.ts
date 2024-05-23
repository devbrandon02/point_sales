// LIBRARY IMPORTS
import * as oakCompress from "https://deno.land/x/oak_compress@v0.0.2/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { Session, RedisStore  } from "https://deno.land/x/oak_sessions/mod.ts";
import * as jose from 'https://deno.land/x/jose@v5.3.0/index.ts'

// OTHER IMPORTS
import { ConnectDatabases } from "./app/databases/database.connect.ts";
import { LoadEnv } from "./app/loadEnv.ts";
import AUTH_ROUTER from "./app/modules/auth/routes/auth.routes.ts";
import tenantModel from "./app/modules/tenants/models/tenants.model.ts";
import TENANT_ROUTER from "./app/modules/tenants/routes/tenants.routes.ts";
import { connect } from "https://deno.land/x/redis@v0.27.0/redis.ts";
import { Application, Context } from "https://deno.land/x/oak@14.2.0/mod.ts";
import { Status } from "jsr:@oak/commons@0.7/status";
import USER_ROUTER from "./app/modules/users/routes/user.routes.ts";


const identifyTenant = async (ctx: Context, next: Function) => {
  if(ctx.request.url.pathname === `/${Deno.env.get("API_VERSION")}/tenant/create`){
    return await next()
  }
  
  const tenantDomain = ctx.request.headers.get("X-Tenant-domain");
  if (!tenantDomain) {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = "Missing X-Tenant-domain header";
    return;
  }

  const tenant = await tenantModel.findOne({ domain: tenantDomain });
  if (!tenant) {
    ctx.response.status = Status.NotFound;
    ctx.response.body = "Tenant not found";
    return;
  }

  ctx.state.tenant = tenant;
  await next();
}

const configCacheProvider = async (app: Application<Record<string, any>>) => {
  const redis = await connect({
    hostname: Deno.env.get("REDIS_HOST") || "",
    port: Number(Deno.env.get("REDIS_PORT") || ""), 
  });

  const store = new RedisStore(redis);
  app.use(async (ctx, next) => {
    ctx.state.redis = redis; 
    ctx.state.session = new Session(ctx, store);
    await next();
  });
};

async function authenticate(ctx: Context, next: Function) {
  const key = Deno.env.get("JWT_SECRET");
  const jwt = ctx.request.headers.get("Authorization")?.replace("Bearer ", "");
  const secretJwtEncoded = new TextEncoder().encode(key);  
  
  if(ctx.request.url.pathname === `/${Deno.env.get("API_VERSION")}/auth/login`){
      return await next()
    }
    
    if (!key || !jwt) {
      ctx.response.status = 401;
      ctx.response.body = "Unauthorized";
      return;
    }

  const protectedHeader = jose.decodeProtectedHeader(jwt)  

  const payload = await jose.jwtVerify(jwt, secretJwtEncoded, {
    algorithms: [protectedHeader.alg || "HS256"],
    issuer: Deno.env.get("JWT_ISSUER"),
    audience: Deno.env.get("JWT_AUDIENCE"),
    requiredClaims: ["exp", "iat", "iss", "aud"],
    currentDate: new Date(),
    maxTokenAge: "12h",
  });

  console.log("payload", payload);
  

  if (!payload) {
    ctx.response.status = 401;
    ctx.response.body = "Unauthorized";
    return;
  }

  ctx.state.user = payload;

  await next();
}

const InitServer = async () => {
  console.log("🦕 SERVER OAK RUNNING...");
  const app = new Application();

  await LoadEnv();
  await configCacheProvider(app);

  app.use(oakCors()); 
  app.use(identifyTenant)
  app.use(authenticate)
  app.use(oakCompress.brotli());
  app.use(AUTH_ROUTER.routes());
  app.use(TENANT_ROUTER.routes());
  app.use(USER_ROUTER.routes());


  try {
    await ConnectDatabases();
    console.log("✅ CONNECTION DATABASES SUCCESS...");
    console.log("✅ SERVER OAK RUNNING SUCCESS...");
    console.log("✅ CACHE PROVIDER SUCCESS...")
    await app.listen({ port: 8000 });
  } catch (error) {
    console.log("❌ Server Running FAILED", error);
  }
};

InitServer();
