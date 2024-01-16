const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");

console.log("in the app")

app.get("/api/topics", getTopics);

app.all("*", (req, res) => {
    res.status(404).send({ msg: "endpoint not found"});
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send("Server Error!");
});

module.exports = app