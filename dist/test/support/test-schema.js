"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const records_1 = require("@orbit/records");
exports.default = new records_1.RecordSchema({
    models: {
        planet: {
            attributes: {
                name: {
                    type: 'string',
                },
                description: {
                    type: 'string',
                },
                createdAt: {
                    type: 'datetime',
                },
            },
            relationships: {
                moons: {
                    kind: 'hasMany',
                    type: 'moon',
                    inverse: 'planet',
                    dependent: 'remove',
                },
            },
        },
        moon: {
            attributes: {
                name: {
                    type: 'string',
                },
            },
            relationships: {
                planet: {
                    kind: 'hasOne',
                    type: 'planet',
                    inverse: 'moons',
                },
            },
        },
        typedModel: {
            attributes: {
                someText: { type: 'string' },
                someNumber: { type: 'number' },
                someDate: { type: 'date' },
                someDateTime: { type: 'datetime' },
                someBoolean: { type: 'boolean' },
            },
        },
        article: {
            relationships: {
                tags: {
                    kind: 'hasMany',
                    type: 'tag',
                    inverse: 'articles',
                },
            },
        },
        tag: {
            attributes: {
                name: { type: 'string' },
            },
            relationships: {
                articles: {
                    kind: 'hasMany',
                    type: 'article',
                    inverse: 'tags',
                },
            },
        },
    },
});
//# sourceMappingURL=test-schema.js.map