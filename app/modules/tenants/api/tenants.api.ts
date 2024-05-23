import { Context } from "https://deno.land/x/oak@14.2.0/mod.ts";
import { CreateTenantRequest, CreateTenantResponse, ListTenantsResponse } from "../schemas/schemas.ts";
import { Status } from "jsr:@oak/commons@0.7/status";
import { TenantsController } from "../controllers/tenants.controllers.ts";


export const CreateTenantApi = async (ctx: Context)  => {
  const { 
    tenant
  } = await ctx.request.body.json()
  if(!tenant.name || !tenant.email || !tenant.phone || !tenant.logo || !tenant.domain || !tenant.point_of_sale){
    ctx.response.status = Status.BadRequest
    return ctx.response.body = {error: "@CreateTenantApi: Some mandatory values ​​are missing"}
  }

  const { name, email, phone, logo, domain, point_of_sale, modules_enabled } = tenant

  const CREATE_TENANT_REQUEST: CreateTenantRequest = {
    Tenant: {
      name,
      email,
      phone,
      logo,
      domain,
      point_of_sale,
      modules_enabled: modules_enabled || [],
      theme: {
        primary_color: "#000000",
        secondary_color: "#000000",
        background_color: "#000000",
        text_color: "#000000",
        link_color: "#000000",
        button_color: "#000000",
        button_text_color: "#000000"
      }
    }
  }

  try {
    const RESPONSE_CONTROLLER: CreateTenantResponse = await new TenantsController().createTenant(CREATE_TENANT_REQUEST)
    ctx.response.status = Status.Created
    return ctx.response.body = RESPONSE_CONTROLLER
  } catch (error) {
    ctx.response.status = Status.InternalServerError
    return ctx.response.body = {error: "@CreateTenantApi: Unexpected error in controller" + error}
  }
}


export const ListTenantsApi = async (ctx: Context) => {
  const page = Number(ctx.request.url.searchParams.get("page"))
  const limit = Number(ctx.request.url.searchParams.get("limit"))
  
  if(!page || !limit){
    ctx.response.status = Status.BadRequest
    return ctx.response.body = {error: "@ListTenantsApi: Page and limit are required"}
  }
  
  try {
    const RESPONSE_CONTROLLER: ListTenantsResponse = await new TenantsController().listTenants(ctx, page, limit)
    ctx.response.status = Status.OK
    return ctx.response.body = {
      tenants: RESPONSE_CONTROLLER.tenants,
      totalPages: RESPONSE_CONTROLLER.totalPages,
      currentPage: RESPONSE_CONTROLLER.currentPage
    }
    
  } catch (error) {
    console.log("@ListTenantsApi: Unexpected error in controller", error);
  
    ctx.response.status = Status.InternalServerError
    return ctx.response.body = {error: "@ListTenantsApi: Unexpected error in controller" + error}
  }
}