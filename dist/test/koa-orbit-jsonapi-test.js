"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const jsonapi_1 = __importDefault(require("@orbit/jsonapi"));
const core_1 = __importDefault(require("@orbit/core"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const orbit_sql_1 = __importDefault(require("orbit-sql"));
const test_schema_1 = __importDefault(require("./support/test-schema"));
const koa_orbit_shared_1 = __importDefault(require("./support/koa-orbit-shared"));
const src_1 = __importDefault(require("../src"));
let server;
let app;
let source;
const subject = {};
core_1.default.globals.fetch = node_fetch_1.default;
function createServer() {
    const app = new koa_1.default();
    const source = new orbit_sql_1.default({
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
    return new Promise((resolve) => {
        server = app.listen(0, () => {
            resolve(server);
        });
        server.once('close', () => {
            source.deactivate();
        });
    });
}
QUnit.module('Koa Orbit (jsonapi)', function (hooks) {
    hooks.beforeEach(async () => {
        const server = await createServer();
        const { port } = server.address();
        const host = `http://localhost:${port}`;
        app = new koa_1.default();
        source = new jsonapi_1.default({
            schema: test_schema_1.default,
            host,
        });
        const router = src_1.default({ source });
        app.use(router.routes());
        app.use(router.allowedMethods());
        subject.app = app;
    });
    hooks.afterEach(async () => {
        await source.deactivate();
        await server.close();
    });
    koa_orbit_shared_1.default(subject, 'jsonapi');
});
//# sourceMappingURL=koa-orbit-jsonapi-test.js.map