const fs = require("fs/promises");
const db = require("../db/connection");

exports.findCommentsByArticleId = (article_id) => {
    const sql = `SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id =$1 ORDER BY created_at`
    return db.query(sql, [article_id])
    .then(({ rows }) => {
        if (!rows.length){
            return Promise.reject()
        }
        return rows
    });
};

