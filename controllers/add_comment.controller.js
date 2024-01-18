const { addComment } = require("../models/add_comment.model");

const postCommentOnArticle = (req, res, next) => {
    const { article_id } = req.params;
    const newComment = req.body;

    addComment(article_id, newComment).then((comment) => {
        res.status(201).send({ comment })
    })
    .catch((err) => {
        next(err);
    });
};

module.exports = { postCommentOnArticle }