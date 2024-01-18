const db = require("../db/connection");

exports.updateArticle = (article_id, newVotes) => {
    return db.query(
        `UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *
        `,
        [newVotes.inc_votes, article_id]
    ).then(({ rows }) => {
        return rows[0]
    })
}