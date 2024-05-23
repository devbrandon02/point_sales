import { RolesUser } from "../../../roles.ts";

export interface User {
  _id: string;
  tenantsId: string;
  document_id: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
  roles: RolesUser[];
}

export interface CreateUserByTenantRequest {
  User: User;
}

export interface CreateUserByTenantResponse {
  msg: string;
}

export interface ListUserByTenantResponse {
  Users: User[];
  totalPages?: number;
  currentPage?: number;
}
