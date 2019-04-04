import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const postModel = new Schema({
    title: { type: String },
    author: { type: String },
    content: { type: String },
    private: { type: Boolean }
});

export default mongoose.model('Post', postModel)
