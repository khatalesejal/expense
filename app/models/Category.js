// models/Category.js
import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional, if you want per-user categories
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
export default Category;
