const db = require("../db/connection");

exports.removeComment = (comment_id) => {
    return db.query(
        `DELETE from comments
        WHERE comment_id = $1
        RETURNING *
        `,
        [comment_id]
    )
    .then(({ rows }) => {
        if (!rows.length){
            return Promise.reject()
        }
    });
}