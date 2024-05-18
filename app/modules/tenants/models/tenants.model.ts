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
  theme: {
    primary_color: {
      type: String,
      required: false,
    },
    secondary_color: {
      type: String,
      required: false

    },
    background_color: {
      type: String,
      required: false
    },
    text_color: {
      type: String,
      required: false
    },
    link_color: {
      type: String,
      required: false
    },
    button_color: {
      type: String,
      required: false
    },
    button_text_color: {
      type: String,
      required: false
    }, 
  },
  modules_enabled: [{
    type: String,
    required: false
  }]

}, { timestamps: true });

const tenantModel = mongoose.model("Tenants", TenantSchema);

export default tenantModel