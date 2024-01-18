const db = require("../db/connection");

exports.addComment = (article_id, newComment) => {
    return db.query(
        `INSERT INTO comments
        (author, body, article_id)
        VALUES
        ($1, $2, $3)
        RETURNING *
        `,
        [newComment.username, newComment.body, article_id]
    ).then(({ rows }) => {
        return rows[0]
    })
};