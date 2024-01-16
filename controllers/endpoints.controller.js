const { findEndpoints } = require("../models/endpoints.model");

const getEndpoints = (req, res, next) => {
    findEndpoints().then((endpoints) => {
        res.status(200).send({ endpoints })
    });
};

module.exports = { getEndpoints }