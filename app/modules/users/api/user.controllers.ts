import { Context } from "https://deno.land/x/oak@14.2.0/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

import { CreateUserByTenantRequest } from "../schemas/schemas.ts";
import UserModel from "../models/user.model.ts";

export class UserControllers {
    async RegisterUserByTenant(ctx: Context, createUserByTenantRequest: CreateUserByTenantRequest) {
        const hashPassword = await bcrypt.hash(createUserByTenantRequest.User.password);

        const userModel = new UserModel({
            name: createUserByTenantRequest.User.name,
            email: createUserByTenantRequest.User.email,
            phone: createUserByTenantRequest.User.phone,
            password: hashPassword,
            roles: createUserByTenantRequest.User.roles,
            document_id: createUserByTenantRequest.User.document_id,
            photo: createUserByTenantRequest.User.photo,
            tenantsId: createUserByTenantRequest.User.tenantsId,
        });
        
        try {
            const user = await UserModel.find({ 
                email: userModel.email, 
                document_id: userModel.document_id, 
                tenantsId: createUserByTenantRequest.User.tenantsId
            })
            
            if(user.length > 0){
                ctx.response.status = 400;
                return ctx.response.body = {error: "User already exists"};
            }
            
            console.log("userModel", userModel);
            
            await UserModel.create(userModel)
        } catch (error) {
            throw new Error("@UserControllers: Error when trying to save the registry", error);
        }

        const response = {
            msg: "User created successfully",
        };

        return response;
    }
}