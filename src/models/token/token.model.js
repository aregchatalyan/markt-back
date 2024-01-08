import { model, Schema } from 'mongoose';

const TokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  refreshToken: {
    type: String,
    required: true
  }
}, {
  versionKey: false,
  timestamps: true
});

export const TokenModel = model('Token', TokenSchema);
