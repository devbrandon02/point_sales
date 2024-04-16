import mongoose from 'npm:mongoose'
import multitenant from 'npm:mongoose-multitenant';

const UserSchema = new mongoose.Schema({
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
  photo: {
    type: String,
    required: true,
  },
  roles: [{
    type: String,
    required: true,
  }],
});

UserSchema.plugin(multitenant);

const UserModel = mongoose.model("Users", UserSchema);

export default UserModel