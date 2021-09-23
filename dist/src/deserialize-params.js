"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeSortQBParams = exports.deserializeFilterQBParams = void 0;
function deserializeFilterQBParams(schema, serializer, type, filter) {
    const params = [];
    for (const property in filter) {
        const attribute = serializer.deserialize(property, { type });
        if (schema.hasAttribute(type, attribute)) {
            params.push({
                op: 'equal',
                attribute,
                value: filter[property],
            });
        }
    }
    return params;
}
exports.deserializeFilterQBParams = deserializeFilterQBParams;
function deserializeSortQBParams(schema, serializer, type, sort) {
    const params = [];
    for (const property of sort.split(',')) {
        const desc = property.startsWith('-');
        const attribute = serializer.deserialize(desc ? property.substring(1) : property, { type });
        if (schema.hasAttribute(type, attribute)) {
            params.push({
                attribute,
                order: desc ? 'descending' : 'ascending',
            });
        }
    }
    return params;
}
exports.deserializeSortQBParams = deserializeSortQBParams;
//# sourceMappingURL=deserialize-params.js.map