const { findCommentsByArticleId } = require("../models/comments_by_ID.model");

const getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;

    findCommentsByArticleId(article_id).then((comments) => {
        res.status(200).send({ comments })
    })
    .catch((err) => {
        next(err);
    });  
};

module.exports = { getCommentsByArticleId }