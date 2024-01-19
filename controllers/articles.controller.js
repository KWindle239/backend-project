const { findArticles } = require("../models/articles.model");
const { checkTopicExists} = require("../check-exists");

const getArticles = (req, res, next) => {
    const criteria = req.query;
    topic = criteria.topic;

    const findQuery = findArticles(topic);
    const queries = [findQuery];

    if(topic){
        const topicExistenceQuery = checkTopicExists(topic);
        queries.push(topicExistenceQuery);
    }

    Promise.all(queries)
        .then((response) => {
            const articles = response[0];
        res.status(200).send({ articles})
    })
    .catch((err) => {
        next(err);
    });
};

module.exports = { getArticles }