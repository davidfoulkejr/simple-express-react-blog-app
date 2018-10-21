import express from 'express';
import Post from './postModel';
const postRouter = express.Router();

postRouter.route('/')
    .get((req, res) => {
        Post.find({}, (err, posts) => {
            res.send({ posts });
        });
    })
    .post((req, res) => {
        Post.create(req.body, (err, post) => {
            if (err) res.sendStatus(403);
            else res.status(201).send({ post });
        });
    });

postRouter.route('/:postId')
    .get((req, res) => {
        Post.findById(req.params.postId, (err, post) => {
            console.log(post);
        })
    })
    .delete((req, res) => {
        Post.deleteOne({ _id: req.params.postId }, (err, post) => {
            if (err) res.sendStatus(403);
            else res.sendStatus(204);
        })
    })
    .patch((req, res) => {
        if (req.body._id) delete req.body._id;
        Post.findByIdAndUpdate(req.params.postId, req.body, { new: true }, (err, post) => {
            if (err) res.sendStatus(403);
            else res.status(203).send({ post });
        })
    })

export default postRouter;