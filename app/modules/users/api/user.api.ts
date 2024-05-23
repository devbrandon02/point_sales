import { Context } from "https://deno.land/x/oak@14.2.0/mod.ts";
import { Status } from "jsr:@oak/commons@0.7/status";
import { CreateUserByTenantRequest } from "../schemas/schemas.ts";
import { UserControllers } from "./user.controllers.ts";

export const CreateUserApi = async (ctx: Context) => {
    const tenantId = ctx.state.tenant?._id;
    
    if(!ctx.state.user || !tenantId){
        ctx.response.status = 401;
        return ctx.response.body = {error: "@UserApi: Unauthorized"};
    }

    const { User } = await ctx.request.body.json()
    const { name, email, phone, password, roles, document_id, photo } = User;

    console.log("user", User);
    
    if(!name || !email || !phone || !password || !roles || !document_id){
        ctx.response.status = Status.BadRequest;
        return ctx.response.body = {error: "@UserApi: Some mandatory values ​​are missing"};
    }

    try {
        const CREATE_USER_REQUEST: CreateUserByTenantRequest = {
            User: {
              name,
              email,
              phone,
              password,
              roles,
              document_id,
              photo,
              tenantsId: tenantId,
              _id: ""
            }
        }
        const CREATE_RESPONSE = await new UserControllers().RegisterUserByTenant(ctx, CREATE_USER_REQUEST);
        ctx.response.status = Status.Created;
        return ctx.response.body = CREATE_RESPONSE;
    } catch (error) {
        console.log("@UserApi: Unexpected error in controller", error);
        ctx.response.status = 500;
        return ctx.response.body = { error: "@UserApi: Unexpected error in controller" + error };
    }
};