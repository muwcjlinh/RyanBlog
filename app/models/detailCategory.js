import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const DetailCategorySchema = new Schema ({
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  firstColumn: { type: String, required: true },
  secondColumn: { type: String, required: true}
},
{
  timestamps: true
});

export default mongoose.model('detailCategory', DetailCategorySchema);