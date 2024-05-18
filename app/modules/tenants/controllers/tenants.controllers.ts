import { Context } from "https://deno.land/x/oak@14.2.0/mod.ts";
import { Redis } from "https://deno.land/x/redis@v0.27.0/mod.ts";

import tenantModel from "../models/tenants.model.ts";
import {
  CreateTenantRequest,
  CreateTenantResponse,
  ListTenantsResponse,
} from "../schemas/schemas.ts";


export class TenantsController {
  public async createTenant(createTenantRequest: CreateTenantRequest): Promise<CreateTenantResponse> {
    try {
      await tenantModel.create(createTenantRequest)
    } catch (error) {
      throw new Error("@TenantsController: Error when trying to save the registry", error);
    }
    
    const response: CreateTenantResponse = {
      msg: "Tenant created successfully",
    };
  
    return response;
  }

  public async listTenants(ctx: Context, page: number, limit: number): Promise<ListTenantsResponse> {
    const redis = ctx.state.redis as Redis;
    const tenantsCache = await redis.get("tenants")

    try {
      // if(tenantsCache){        
      //   return JSON.parse(tenantsCache) as ListTenantsResponse;
      // }

      const listTenants = await tenantModel.find({})
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createAt: -1 });

      const count = await tenantModel.countDocuments();

      const response: ListTenantsResponse = {
        tenants: listTenants,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      };

      // await redis.set("tenants", JSON.stringify(response));

      return response;

    } catch (error) {
      throw new Error("@TenantsController: Error when trying to list tenants", error);
    }
  }
}





