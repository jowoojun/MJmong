const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

var schema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    survey: [{type: Schema.Types.ObjectId, ref: 'Survey'}],
    // 이미지가 들어가는 스키마가 필요함
    title: {type: String, required: true, trim: true},
    locate: {type: String, required: true, trim: true},
    info: {type: String, required: true, trim: true},
    event_type: {type: String, trim: true},
    // 좋아요 ,  응답 , 읽은 사람수
    numLikes: {type: Number, default: 0},
    numComments: {type: Number, default: 0},
    numReads: {type: Number, default: 0},
    img: [String],
    createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

schema.plugin(mongoosePaginate);
var Event = mongoose.model('Event', schema);

module.exports = Event;
