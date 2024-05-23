import mongoose from 'npm:mongoose'
import multitenant from 'npm:mongoose-multitenant';
import { RolesUser } from "../../../roles.ts";


const UserSchema = new mongoose.Schema({
  tenantsId: {type: mongoose.Schema.Types.ObjectId, ref: 'Tenants', required: true},
  document_id: {
    type: String,
    required: true,
    min: [10, 'The document_id must have at least 10 characters'],
    max: [14, 'The document_id must have a maximum of 14 characters'],
  },
  name: {
    type: String,
    required: true,
    min: [3, 'The name must have at least 3 characters'],
    max: [50, 'The name must have a maximum of 50 characters'],
  },
  email: {
    type: String,
    required: true,
    min: [5, 'The email must have at least 5 characters'],
    max: [100, 'The email must have a maximum of 100 characters'],
  },
  password: {
    type: String,
    required: true,
    min: [6, 'The password must have at least 6 characters'],
    max: [100, 'The password must have a maximum of 100 characters'],
  },
  phone: {
    type: String,
    required: true,
    min: [10, 'The phone must have at least 10 characters'],
    max: [15, 'The phone must have a maximum of 15 characters'],
  },
  photo: {
    type: String,
    required: true,
  },
  roles: [{
    type: String,
    required: true,
    enum: RolesUser,
  }],
}, { timestamps: true });

UserSchema.plugin(multitenant);

const UserModel = mongoose.model("Users", UserSchema);

export default UserModel