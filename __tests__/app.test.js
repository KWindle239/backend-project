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
        expect(response.body.topics).toBeInstanceOf(Array);
        expect(response.body.topics).toHaveLength(3);
        response.body.topics.forEach((topic) => {
            expect(topic).toHaveProperty('slug', expect.any(String));
            expect(topic).toHaveProperty('description', expect.any(String));
        });
    });
    });
});

describe("GET/api", () => {
    test("status 200, returns an object detailing available endpoints", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
            const expected = {
                "endpoints": {
                "GET /api": expect.any(Object),
                "GET /api/topics": expect.any(Object),
                "GET /api/articles": expect.any(Object)
                }
            };
            expect(response.body).toEqual(expected);
        });
    });
});

describe("error tests", () => {
    test("404: responds with 404 when non-existent path", () => {
        return request(app)
        .get("/api/tpics")
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("endpoint not found");
        });
    });
});