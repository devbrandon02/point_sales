import mongoose from 'npm:mongoose'

const TenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  point_of_sale: {
    type: String,
    required: true,
  },
  domain: [{
    type: String,
    required: true,
    default: 'localhost'
  }],

}, { timestamps: true });

const tenantModel = mongoose.model("Tenants", TenantSchema);

export default tenantModel