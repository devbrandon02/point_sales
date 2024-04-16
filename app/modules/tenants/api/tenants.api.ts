import { Context } from "https://deno.land/x/oak@14.2.0/mod.ts";
import { CreateTenantRequest, CreateTenantResponse } from "../schemas/schemas.ts";
import { BODY_TYPES } from "https://deno.land/x/oak@14.2.0/util.ts";
import { Status } from "jsr:@oak/commons@0.7/status";
import { TenantsController } from "../controllers/tenants.controllers.ts";

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
    const RESPONSE_CONTROLLER: CreateTenantResponse = await TenantsController(CREATE_TENANT_REQUEST)
    ctx.response.status = Status.Created
    return ctx.response.body = RESPONSE_CONTROLLER
  } catch (error) {
    ctx.response.status = Status.InternalServerError
    return ctx.response.body = {error: "@CreateTenantApi: Unexpected error in controller" + error}
  }
}
