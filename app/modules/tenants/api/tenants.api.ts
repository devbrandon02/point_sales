import { Context } from "https://deno.land/x/oak@14.2.0/mod.ts";
import { CreateTenantRequest, CreateTenantResponse, ListTenantsResponse } from "../schemas/schemas.ts";
import { BODY_TYPES } from "https://deno.land/x/oak@14.2.0/util.ts";
import { Status } from "jsr:@oak/commons@0.7/status";
import { TenantsController } from "../controllers/tenants.controllers.ts";
import { Redis } from "https://deno.land/x/redis@v0.27.0/mod.ts";
import tenantModel from "../models/tenants.model.ts";

export const CreateTenantApi = async (ctx: Context)  => {
  const { 
    name, 
    email, 
    phone, 
    logo, 
    domain, 
    point_of_sale 
  } = await ctx.request.body.json()
  if(!name || !email || !phone || !logo || !domain || !point_of_sale){
    ctx.response.status = Status.BadRequest
    return ctx.response.body = {error: "@CreateTenantApi: Some mandatory values ​​are missing"}
  } 

  const CREATE_TENANT_REQUEST: CreateTenantRequest = {
    name,
    email,
    logo,
    phone,
    point_of_sale,
    domain: domain
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
    ctx.response.status = Status.InternalServerError
    return ctx.response.body = {error: "@ListTenantsApi: Unexpected error in controller" + error}
  }
}