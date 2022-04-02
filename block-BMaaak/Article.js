const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let articleSchema = new Schema({
  title: String,
  description: { type: String, index: true, unique: true },
  tags: [String],
});

articleSchema.index({ tags: 1 });
articleSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Article', articleSchema);
