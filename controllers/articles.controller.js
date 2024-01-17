const { findArticles } = require("../models/articles.model");

const getArticles = (req, res, next) => {
    findArticles().then((articles) => {
        res.status(200).send({ articles })
    })
    .catch((err) => {
        next(err);
    });
};

module.exports = { getArticles }