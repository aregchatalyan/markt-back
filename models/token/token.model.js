import { model, Schema } from 'mongoose';

const TokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  refresh_token: {
    type: String,
    required: true
  }
}, {
  versionKey: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

export default model('Token', TokenSchema);
