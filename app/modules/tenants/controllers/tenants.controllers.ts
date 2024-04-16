import tenantModel from "../models/tenants.model.ts";
import {
  CreateTenantRequest,
  CreateTenantResponse,
} from "../schemas/schemas.ts";

export const TenantsController = async (
  createTenantRequest: CreateTenantRequest,
): Promise<CreateTenantResponse> => {

  try {
    await tenantModel.create(createTenantRequest)
  } catch (error) {
    throw new Error("@TenantsController: Error when trying to save the registry", error);
  }
  
  const response: CreateTenantResponse = {
    msg: "Tenant created successfully",
  };

  return response;
};
