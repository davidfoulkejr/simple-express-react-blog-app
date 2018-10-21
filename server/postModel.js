import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const postModel = new Schema({
    title: { type: String },
    author: { type: String },
    content: { type: String }
});

export default mongoose.model('Post', postModel)