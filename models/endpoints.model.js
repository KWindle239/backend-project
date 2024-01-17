const fs = require("fs/promises");
const db = require("../db/connection");

exports.findEndpoints = () => {
    return fs.readFile("endpoints.json", "utf8").then((data) => {
        return JSON.parse(data);
    });
};
