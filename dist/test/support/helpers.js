"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = void 0;
const supertest_1 = __importDefault(require("supertest"));
async function request(app, options) {
    const url = options.url + (options.query ? `?${options.query}` : '');
    const method = options.method || 'GET';
    const headers = options.headers || {};
    const body = options.payload;
    headers['accept'] = 'application/vnd.api+json';
    if (method === 'POST' || method === 'PATCH') {
        headers['content-type'] = 'application/vnd.api+json';
    }
    let response;
    switch (method) {
        case 'POST':
            response = await supertest_1.default(app.callback())
                .post(url)
                .set(headers)
                .send(body);
            break;
        case 'PATCH':
            response = await supertest_1.default(app.callback())
                .patch(url)
                .set(headers)
                .send(body);
            break;
        case 'DELETE':
            response = await supertest_1.default(app.callback()).delete(url).set(headers);
            break;
        default:
            response = await supertest_1.default(app.callback()).get(url).set(headers);
    }
    return {
        status: response.status,
        headers: response.header,
        body: response.body,
    };
}
exports.request = request;
//# sourceMappingURL=helpers.js.map