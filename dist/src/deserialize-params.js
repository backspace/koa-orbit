"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeSortParams = exports.deserializeFilterParams = void 0;
function deserializeFilterParams(schema, serializer, type, filter) {
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
exports.deserializeFilterParams = deserializeFilterParams;
function deserializeSortParams(schema, serializer, type, sort) {
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
exports.deserializeSortParams = deserializeSortParams;
//# sourceMappingURL=deserialize-params.js.map