const { findArticleById } = require("../models/article_by_ID.model");

const getArticleById = (req, res, next) => {
    const { article_id } = req.params;

    findArticleById(article_id).then((article) => {
        res.status(200).send({ article })
    })
    .catch((err) => {
        next(err);
    });
};

module.exports = { getArticleById }