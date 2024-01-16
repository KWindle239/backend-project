const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data")

beforeEach(() => seed(testData));

afterAll(() => {
    return db.end();
});

describe ("GET /api/topics", () => {
    test("status 200, returns an array of topic objects", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then((response) => {
        console.log(response.body.topics)
        expect(response.body.topics).toBeInstanceOf(Array);
        expect(response.body.topics).toHaveLength(3);
        response.body.topics.forEach((topic) => {
            expect(topic).toHaveProperty('slug', expect.any(String));
            expect(topic).toHaveProperty('description', expect.any(String));
        })
    })
    });
    test("404: responds with 404 when non-existant path", () => {
        return request(app)
        .get("/api/tpics")
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("endpoint not found");
        });
    });
});