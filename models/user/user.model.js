import { model, Schema } from 'mongoose';

const UserSchema = new Schema({
  first_name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 20
  },
  last_name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 20
  },
  username: {
    type: String,
    required: false,
    default: '',
    maxLength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  avatar: {
    type: String,
    required: false,
    default: ''
  },
  phone: {
    type: String,
    required: false,
    default: ''
  },
  password: {
    type: String,
    required: true
  },
  secret: {
    type: String,
    required: false,
    default: undefined
  },
  active: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  versionKey: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

export default model('User', UserSchema);
