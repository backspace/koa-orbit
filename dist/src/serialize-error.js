"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeError = void 0;
const records_1 = require("@orbit/records");
const data_1 = require("@orbit/data");
const utils_1 = require("@orbit/utils");
async function serializeError(error) {
    const id = utils_1.uuid();
    const title = error.message;
    let detail = '';
    let code = 500;
    if (error instanceof records_1.RecordNotFoundException) {
        detail = error.description;
        code = 404;
    }
    else if (error instanceof data_1.ClientError || error instanceof data_1.ServerError) {
        detail = error.description;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        code = error.response.status;
    }
    else if (error instanceof records_1.SchemaError || error instanceof records_1.RecordException) {
        detail = error.description;
        code = 400;
    }
    return {
        status: code,
        body: { errors: [{ id, title, detail, code }] },
    };
}
exports.serializeError = serializeError;
//# sourceMappingURL=serialize-error.js.map