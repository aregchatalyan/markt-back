import { model, Schema } from 'mongoose';

export const VALID_USER = {
  FIRST_NAME: {
    min: 2,
    max: 20
  },
  LAST_NAME:  {
    min: 2,
    max: 20
  },
  USERNAME:   {
    min: 2,
    max: 12
  },
  PASSWORD:   {
    min: 8,
    max: 20
  },
  ROLES:      {
    USER:  'user',
    ADMIN: 'admin'
  }
}

const UserSchema = new Schema({
  first_name: {
    type:      String,
    required:  true,
    minLength: VALID_USER.FIRST_NAME.min,
    maxLength: VALID_USER.FIRST_NAME.max
  },
  last_name:  {
    type:      String,
    required:  true,
    minLength: VALID_USER.LAST_NAME.min,
    maxLength: VALID_USER.LAST_NAME.max
  },
  username:   {
    type:      String,
    required:  false,
    default:   '',
    minLength: VALID_USER.USERNAME.min,
    maxLength: VALID_USER.USERNAME.max
  },
  email:      {
    type:      String,
    required:  true,
    unique:    true,
    lowercase: true
  },
  avatar:     {
    type:     String,
    required: false,
    default:  ''
  },
  phone:      {
    type:     String,
    required: false,
    default:  ''
  },
  password:   {
    type:     String,
    required: true
  },
  secret:     {
    type:     String,
    required: false,
    default:  undefined
  },
  active:     {
    type:     Boolean,
    required: true,
    default:  false
  },
  role:       {
    type:     String,
    required: true,
    default:  VALID_USER.ROLES.USER,
    enum:     Object.values(VALID_USER.ROLES)
  }
}, {
  versionKey: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

export const UserModel = model('User', UserSchema);
