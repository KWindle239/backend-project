const db = require("../db/connection");

exports.findArticleById = (article_id) => {
    const sql = 
    `SELECT articles.*, 
    COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    LIMIT 1`
    return db.query(sql, [article_id])
    .then(({ rows }) => {
        if (!rows.length){
            return Promise.reject()
        }
        return rows[0];
    });
};
