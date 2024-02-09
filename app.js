const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getEndpoints } = require("./controllers/endpoints.controller");
const { getArticleById } = require("./controllers/article_by_ID.controller");
const { getArticles } = require("./controllers/articles.controller");
const { getCommentsByArticleId } = require("./controllers/comments_by_ID.controller");
const { postCommentOnArticle } = require("./controllers/add_comment.controller");
const { patchArticle } = require("./controllers/update_article_info.controller");
const { deleteComment } = require("./controllers/delete_comment.controller");
const { getUsers } = require("./controllers/get_users.controller");
const cors = require("cors");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentOnArticle);
app.patch("/api/articles/:article_id", patchArticle);
app.delete("/api/comments/:comment_id", deleteComment);
app.get("/api/users", getUsers);

app.use(cors());

app.all("*", (req, res) => {
    res.status(404).send({ msg: "Not Found"});
});

app.use((err, reg, res, next) => {
    if (err.code === '23503') {
        res.status(404).send({ msg: 'Not Found'});
    } else {
        next(err);
    }
});

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Bad Request'})
    } else {
        next(err);
    }
});

app.use((err, req, res, next) => {
    if (err.code === '23502') {
        res.status(400).send({ msg: 'Bad Request'})
    } else {
        next(err);
    }
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send("Server Error!");
});

module.exports = app