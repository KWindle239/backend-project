const { findUsers } = require("../models/get_users.model");

const getUsers = (req, res, next) => {
    findUsers().then((users) => {
        res.status(200).send({ users })
    })
    .catch((err) => {
        next(err);
    });
};

module.exports = { getUsers }