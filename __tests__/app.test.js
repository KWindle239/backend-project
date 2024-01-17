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

describe("GET /api", () => {
    test("status 200, returns an object detailing available endpoints", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
            const expected = {
                "endpoints": {
                "GET /api": expect.any(Object),
                "GET /api/topics": expect.any(Object),
                "GET /api/articles": expect.any(Object),
                "GET /api/articles/:article_id": expect.any(Object)
                }
            };
            expect(response.body).toEqual(expected);
            expect(response.body).toBeInstanceOf(Object);
        });
    });
});

describe("GET /api/articles/: article_id", () => {
    test("status 200, returns an object with the article id (3) provided", () => {
        return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body }) => {
            expect(body.article).toBeInstanceOf(Object);
            const expected = {
                author: expect.any(String),
                title: expect.any(String),
                article_id: 3,
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String)
                };
            expect(body.article).toEqual(expected);
        });
    });
    test("status 200, returns an object with the article id (5) provided", () => {
        return request(app)
        .get("/api/articles/5")
        .expect(200)
        .then(({ body }) => {
            expect(body.article).toBeInstanceOf(Object);
            const expected = {
                author: expect.any(String),
                title: expect.any(String),
                article_id: 5,
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String)
                };
            expect(body.article).toEqual(expected);
        });
    });
});

describe("error tests", () => {
    test("404: responds with 404 when non-existent path when endpoint is spelt incorrectly", () => {
        return request(app)
        .get("/api/tpics")
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("Endpoint Not Found");
        });
    });
    test("404: responds with 404 when a valid id that is not currently in our data is used", () => {
        return request(app)
        .get("/api/articles/30")
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("Endpoint Not Found");
        });
    });
    test("400: responds with 400 when an invalid (incorrect data type) id is used", () => {
        return request(app)
        .get("/api/articles/banana")
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("Bad Request")
        })
    })
});