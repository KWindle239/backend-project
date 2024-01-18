const { updateArticle } = require("../models/update_article_info.model");

const patchArticle = (req, res, next) => {
    const { article_id } = req.params;
    const newVotes = req.body;

    updateArticle(article_id, newVotes).then((article) => {
        res.status(200).send({ article })
    })
    .catch((err) => {
        next(err);
    });
};

module.exports = { patchArticle }