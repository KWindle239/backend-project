const { table } = require("console");
const fs = require("fs/promises");
const db = require("../db/connection");

exports.findArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
        if (!rows.length){
            return Promise.reject()
        }
        return rows[0];
    });
};