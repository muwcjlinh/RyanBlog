import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CategorySchema = new Schema ({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  nameCategory: { type: String, required: true },
  visible: { type: Boolean, default: true }
},
{
  timestamps: true
});

export default mongoose.model('Category', CategorySchema);