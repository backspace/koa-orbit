"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qs_1 = __importDefault(require("qs"));
const helpers_1 = require("./helpers");
QUnit.config.testTimeout = 1000;
const { test } = QUnit;
function default_1(subject, sourceName) {
    QUnit.module('jsonapi', function () {
        test('get planets (empty)', async function (assert) {
            const response = await getPlanets(subject.app);
            assert.equal(response.status, 200);
            assert.equal(response.headers['content-type'], 'application/vnd.api+json; charset=utf-8');
            assert.deepEqual(response.body, { data: [] });
        });
        test('create planet', async function (assert) {
            const response = await createEarth(subject.app);
            assert.equal(response.status, 201);
            assert.equal(response.headers.location, `/planets/${response.body.data.id}`);
            assert.equal(response.body.data.type, 'planet');
            assert.ok(response.body.data.id);
            assert.deepEqual(response.body.data.attributes, compact({
                name: 'Earth',
                createdAt: response.body.data.attributes.createdAt,
            }));
        });
        test('get planets', async function (assert) {
            await createEarth(subject.app);
            const response = await getPlanets(subject.app);
            assert.equal(response.status, 200);
            assert.equal(response.body.data.length, 1);
        });
        test('get planet', async function (assert) {
            const { body } = await createEarth(subject.app);
            const id = body.data.id;
            const response = await getPlanet(subject.app, id);
            assert.equal(response.status, 200);
            assert.deepEqual(response.body.data, {
                type: 'planet',
                id,
                attributes: compact({
                    name: 'Earth',
                    createdAt: response.body.data.attributes.createdAt,
                }),
            });
        });
        test('update planet', async function (assert) {
            const { body } = await createEarth(subject.app);
            const id = body.data.id;
            const response = await helpers_1.request(subject.app, {
                method: 'PATCH',
                url: `/planets/${id}`,
                payload: {
                    data: {
                        id,
                        type: 'planet',
                        attributes: {
                            name: 'Earth 2',
                        },
                    },
                },
            });
            assert.equal(response.status, 204);
            const { status, body: { data }, } = await getPlanet(subject.app, id);
            assert.equal(status, 200);
            assert.deepEqual(data, {
                type: 'planet',
                id,
                attributes: compact({
                    name: 'Earth 2',
                    createdAt: data.attributes.createdAt,
                }),
            });
        });
        test('update not found', async function (assert) {
            if (sourceName == 'jsonapi') {
                assert.ok(true);
                return;
            }
            const response = await helpers_1.request(subject.app, {
                method: 'PATCH',
                url: `/planets/123`,
                payload: {
                    data: {
                        id: '123',
                        type: 'planet',
                        attributes: {
                            name: 'Earth 2',
                        },
                    },
                },
            });
            assert.equal(response.status, 404);
        });
        test('remove planet', async function (assert) {
            const { body } = await createEarth(subject.app);
            const id = body.data.id;
            const response = await helpers_1.request(subject.app, {
                method: 'DELETE',
                url: `/planets/${id}`,
            });
            assert.equal(response.status, 204);
            const { status } = await getPlanet(subject.app, id);
            assert.equal(status, 404);
            const { status: newStatus } = await createEarth(subject.app);
            assert.equal(newStatus, 201);
        });
        test('create moon', async function (assert) {
            const { body } = await createEarth(subject.app);
            const id = body.data.id;
            const response = await createMoon(subject.app, id);
            assert.equal(response.status, 201);
        });
        test('get planet moons', async function (assert) {
            const { body } = await createEarth(subject.app);
            const id = body.data.id;
            await createMoon(subject.app, id);
            const response = await getPlanetMoons(subject.app, id);
            assert.equal(response.status, 200);
            assert.equal(response.body.data.length, 1);
        });
        test('create typedModels', async function (assert) {
            const { body } = await createTypedModel(subject.app);
            const id = body.data.id;
            const response = await helpers_1.request(subject.app, {
                url: `/typed-models/${id}`,
            });
            assert.equal(response.status, 200);
            assert.deepEqual(response.body.data.attributes, {
                someText: 'Some text',
                someNumber: 2,
                someBoolean: true,
            });
        });
        test('many to many', async function (assert) {
            const { body } = await createTag(subject.app);
            const id = body.data.id;
            const response = await createArticle(subject.app, id);
            assert.equal(response.status, 201);
        });
        test('filter', async function (assert) {
            await createTags(subject.app);
            const response = await helpers_1.request(subject.app, {
                url: `/tags`,
                query: qs_1.default.stringify({
                    filter: {
                        name: 'b',
                    },
                }),
            });
            assert.equal(response.status, 200);
            assert.equal(response.body.data.length, 1);
            assert.deepEqual(response.body.data[0].attributes, {
                name: 'b',
            });
        });
        test('sort (asc)', async function (assert) {
            await createTags(subject.app);
            const response = await helpers_1.request(subject.app, {
                url: `/tags`,
                query: qs_1.default.stringify({
                    sort: 'name',
                }),
            });
            assert.equal(response.status, 200);
            assert.equal(response.body.data.length, 3);
            assert.deepEqual(response.body.data[0].attributes.name, 'a');
            assert.deepEqual(response.body.data[1].attributes.name, 'b');
            assert.deepEqual(response.body.data[2].attributes.name, 'c');
        });
        test('sort (desc)', async function (assert) {
            await createTags(subject.app);
            const response = await helpers_1.request(subject.app, {
                url: `/tags`,
                query: qs_1.default.stringify({
                    sort: '-name',
                }),
            });
            assert.equal(response.status, 200);
            assert.equal(response.body.data.length, 3);
            assert.deepEqual(response.body.data[0].attributes.name, 'c');
            assert.deepEqual(response.body.data[1].attributes.name, 'b');
            assert.deepEqual(response.body.data[2].attributes.name, 'a');
        });
    });
}
exports.default = default_1;
function createEarth(app) {
    return helpers_1.request(app, {
        method: 'POST',
        url: '/planets',
        payload: {
            data: {
                type: 'planet',
                attributes: {
                    name: 'Earth',
                },
            },
        },
    });
}
function createMoon(app, earthId) {
    return helpers_1.request(app, {
        method: 'POST',
        url: '/moons',
        payload: {
            data: {
                type: 'moon',
                attributes: {
                    name: 'Moon',
                },
                relationships: {
                    planet: {
                        data: {
                            type: 'planet',
                            id: earthId,
                        },
                    },
                },
            },
        },
    });
}
function getPlanet(app, id) {
    return helpers_1.request(app, {
        url: `/planets/${id}`,
    });
}
function getPlanets(app) {
    return helpers_1.request(app, {
        url: '/planets',
    });
}
function getPlanetMoons(app, id) {
    return helpers_1.request(app, {
        url: `/planets/${id}/moons`,
    });
}
function createTypedModel(app) {
    return helpers_1.request(app, {
        method: 'POST',
        url: '/typed-models',
        payload: {
            data: {
                type: 'typedModel',
                attributes: {
                    someText: 'Some text',
                    someNumber: 2,
                    someBoolean: true,
                },
            },
        },
    });
}
function createTag(app) {
    return helpers_1.request(app, {
        method: 'POST',
        url: '/tags',
        payload: {
            data: {
                type: 'tag',
            },
        },
    });
}
async function createTags(app) {
    await helpers_1.request(app, {
        method: 'POST',
        url: '/tags',
        payload: {
            data: {
                type: 'tag',
                attributes: {
                    name: 'a',
                },
            },
        },
    });
    await helpers_1.request(app, {
        method: 'POST',
        url: '/tags',
        payload: {
            data: {
                type: 'tag',
                attributes: {
                    name: 'c',
                },
            },
        },
    });
    await helpers_1.request(app, {
        method: 'POST',
        url: '/tags',
        payload: {
            data: {
                type: 'tag',
                attributes: {
                    name: 'b',
                },
            },
        },
    });
}
function createArticle(app, tagId) {
    return helpers_1.request(app, {
        method: 'POST',
        url: '/articles',
        payload: {
            data: {
                type: 'article',
                relationships: {
                    tags: {
                        data: [
                            {
                                type: 'tag',
                                id: tagId,
                            },
                        ],
                    },
                },
            },
        },
    });
}
function compact(obj) {
    for (const key in obj) {
        if (obj[key] === undefined) {
            delete obj[key];
        }
    }
    return obj;
}
//# sourceMappingURL=koa-orbit-shared.js.map