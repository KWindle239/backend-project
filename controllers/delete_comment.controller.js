const { removeComment } = require("../models/delete_comment.model");

const deleteComment = (req, res, next) => {
    const { comment_id } = req.params;

    removeComment(comment_id).then((comment) => {
        res.status(204).send({ msg: 'No Content'})
    })
    .catch((err) => {
        next(err);
    });
};

module.exports = { deleteComment }