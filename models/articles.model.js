const { table } = require("console");
const fs = require("fs/promises");
const db = require("../db/connection");

exports.findArticles = () => {
    const sql = 
    `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
    COUNT(comments.article_id) AS comment_count
    FROM articles
    JOIN comments on articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC`
    return db.query(sql)
    .then((result) => {
        return result.rows
    });
};