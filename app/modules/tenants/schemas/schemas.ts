export interface Tenant {
  name: string,
  email: string,
  phone: string,
  logo: string,
  point_of_sale: string,
  domain: string[]
  modules_enabled: string[]
  theme: {
    primary_color: string
    secondary_color: string,
    background_color: string,
    text_color: string
    link_color: string
    button_color: string,
    button_text_color: string, 
  },
}


export interface CreateTenantRequest {
  Tenant: Tenant
}

export interface CreateTenantResponse {
  msg: string
}

export interface ListTenantsResponse {
  tenants: Tenant[]
  totalPages?: number
  currentPage?: number
}