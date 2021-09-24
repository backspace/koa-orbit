"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const orbit_sql_1 = __importDefault(require("orbit-sql"));
const test_schema_1 = __importDefault(require("./support/test-schema"));
const koa_orbit_shared_1 = __importDefault(require("./support/koa-orbit-shared"));
const src_1 = __importDefault(require("../src"));
let app;
let source;
const subject = {};
QUnit.module('Koa Orbit (sql)', function (hooks) {
    hooks.beforeEach(() => {
        app = new koa_1.default();
        source = new orbit_sql_1.default({
            schema: test_schema_1.default,
            knex: {
                client: 'sqlite3',
                connection: { filename: ':memory:' },
                useNullAsDefault: true,
            },
        });
        const router = src_1.default({ source });
        app.use(router.routes());
        app.use(router.allowedMethods());
        subject.app = app;
    });
    hooks.afterEach(async () => {
        source.deactivate();
    });
    koa_orbit_shared_1.default(subject, 'sql');
});
//# sourceMappingURL=koa-orbit-sql-test.js.map