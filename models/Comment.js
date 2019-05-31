const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event' },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  content: { type: String },
  createdAt: { type: Date, default: Date.now },
  score: { type: Number }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

const Comment = mongoose.model('Comment', schema);

module.exports = Comment;
