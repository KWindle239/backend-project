const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
require("jest-sorted");

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
                "GET /api/articles/:article_id": expect.any(Object),
                "GET /api/articles/:article_id/comments": expect.any(Object),
                "POST /api/articles/:article_id/comments": expect.any(Object),
                "PATCH /api/articles/:article_id": expect.any(Object)
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

describe("GET /api/articles", () => {
    test("status 200, responds with an array of article objects with the needed properties", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
            const expected = {
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(String)
            }
            expect(body.articles).toBeInstanceOf(Array);
            expect(body.articles[0]).toMatchObject(expected);
        });
    });
    test("responds with an array where articles are sorted by date in descending order", () => {
        return request(app)
        .get("/api/articles")
        .then(({ body }) => {
            expect(body.articles).toBeSortedBy("created_at", {
                descending: true,
              });
        });
    });
    test("responds with article objects which don't have a body property", () => {
        return request(app)
        .get("/api/articles")
        .then(({ body }) => {
            unwantedProperty = {body: expect.any(String)};
            expect(body.articles[0]).toEqual(expect.not.objectContaining(unwantedProperty));
        });
    });
});

describe("GET /api/articles/:article_id/comments", () => {
    test("status 200, responds with an array of comments with the needed properties", () => {
        return request(app)
        .get("/api/articles/3/comments")
        .then(({ body }) => {
            const expected = {
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                article_id: 3
            }
            expect(body.comments).toBeInstanceOf(Array);
            expect(body.comments[0]).toEqual(expected);
        });
    });
    test("responds with an array where comments are sorted by date in ascending order", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .then(({ body }) => {
            expect(body.comments).toBeSortedBy("created_at");
        });
    });
})

describe("POST /api/articles/:article_id/comments", () => {
    test("status 201, responds with the newly added comment", () => {
        return request(app)
        .post("/api/articles/3/comments")
        .send({
            username: "icellusedkars",
            body: "Not my cup of tea"
        })
        .expect(201)
        .then((response) => {
            expect(response.body.comment).toEqual({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: "icellusedkars",
                body: "Not my cup of tea",
                article_id: 3
            });
        });
    });
    test("status 404, responds with 404 when username does not exist", () => {
        return request(app)
        .post("/api/articles/3/comments")
        .send({
            username: "ghostbuster1",
            body: "who you gonna call"
        })
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("Not Found")
        });
    });
    test("status 400, responds with 400 when the new comment object has no body property", () => {
        return request(app)
        .post("/api/articles/3/comments")
        .send({
            username: "icellusedkars",
        })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("Bad Request")
        });
    });
    test("status 400, responds with 400 when an invalid (incorrect data type) article id is used", () => {
        return request(app)
        .post("/api/articles/pineapple/comments")
        .send({
            username: "icellusedkars",
            body: "Not my cup of tea"
        })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("Bad Request")
        });
    });
})

describe("PATCH /api/articles/:article_id", () => {
    test("status 200, responds with the updated article", () => {
        return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes : -50 })
        .expect(200)
        .then((response) => {
            expect(response.body.article).toEqual({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: expect.any(String),
                votes: 50,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              });
        });
    });
    test("status 400, responds with 400 when an object with an invalid inc_votes value", () => {
        return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes : "cactus" })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
})

describe.only("DELETE /api/comments/:comment_id", () => {
    test("status 204, responds with 204 after deleting the comment that corresponds with the id passed in", () => {
        return request(app)
        .delete("/api/comments/1")
        .expect(204)
    });
    test("status 404, responds with 404 if a valid id that is not currently in the data is used", () => {
        return request(app)
        .delete("/api/comments/133")
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("Endpoint Not Found")
        })
    })
    test("status 400, responds with 400 if an invalid id (wrong data type) is used", () => {
        return request(app)
        .delete("/api/comments/strawberry")
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("Bad Request")
        })
    })
});

describe("404 error tests", () => {
    test("status 404: responds with 404 when endpoint is spelt incorrectly", () => {
        return request(app)
        .get("/api/tpics")
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("Endpoint Not Found");
        });
    });
    test("status 404: GET/api/articles/:article_id: responds with 404 when a valid id that is not currently in our data is used", () => {
        return request(app)
        .get("/api/articles/30")
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("Endpoint Not Found");
        });
    });
    test("status 404: GET/api/articles/:article_id/comments: responds with 404 when a valid id that is not currently in our data is used", () => {
        return request(app)
        .get("/api/articles/45/comments")
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("Endpoint Not Found");
        });
    });
});

describe("400 error tests", () => {
    test("status 400: GET/api/articles/:article_id: responds with 400 when an invalid (incorrect data type) id is used", () => {
        return request(app)
        .get("/api/articles/banana")
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("Bad Request")
        });
    });
    test("status 400: GET/api/articles/:article_id/comments: responds with 400 when an invalid (incorrect data type) id is used", () => {
        return request(app)
        .get("/api/articles/mango/comments")
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("Bad Request")
        });
    });
});