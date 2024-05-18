export interface CreateTenantRequest {
  name: string,
  email: string,
  phone: string,
  logo: string,
  point_of_sale: string,
  domain: string
}

export interface CreateTenantResponse {
  msg: string
}

export interface ListTenantsResponse {
  tenants: any[]
  totalPages?: number
  currentPage?: number
}