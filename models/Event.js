const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

var schema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    title: {type: String, required: true, trim: true},
    event_description: {type: String, required: true, trim: true},
    event_type: {type: String, required: true, trim: true},
    event_topic: {type: String, required: true, trim: true},

    survey: [{type: Schema.Types.ObjectId, ref: 'Survey'}],
    createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

schema.plugin(mongoosePaginate);
var Event = mongoose.model('Event', schema);

module.exports = Event;
