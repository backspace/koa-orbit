"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _serializerFor;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Serializer = void 0;
const jsonapi_1 = require("@orbit/jsonapi");
class Serializer {
    constructor(settings) {
        _serializerFor.set(this, void 0);
        __classPrivateFieldSet(this, _serializerFor, jsonapi_1.buildJSONAPISerializerFor(settings));
    }
    serializeDocument(document) {
        const serializer = __classPrivateFieldGet(this, _serializerFor).call(this, jsonapi_1.JSONAPISerializers.ResourceDocument);
        return serializer.serialize(document);
    }
    deserializeDocument(document) {
        const serializer = __classPrivateFieldGet(this, _serializerFor).call(this, jsonapi_1.JSONAPISerializers.ResourceDocument);
        return serializer.deserialize(document).data;
    }
    deserializeDocuments(document) {
        const serializer = __classPrivateFieldGet(this, _serializerFor).call(this, jsonapi_1.JSONAPISerializers.ResourceDocument);
        return serializer.deserialize(document).data;
    }
    deserializeUninitializedDocument(document) {
        var _a;
        if (document.data && !Array.isArray(document.data) && !((_a = document.data) === null || _a === void 0 ? void 0 : _a.id)) {
            document.data.id = 'yolo';
        }
        const serializer = __classPrivateFieldGet(this, _serializerFor).call(this, jsonapi_1.JSONAPISerializers.ResourceDocument);
        const record = serializer.deserialize(document).data;
        delete record.id;
        return record;
    }
    serializeResourceTypePath(type) {
        const serializer = __classPrivateFieldGet(this, _serializerFor).call(this, jsonapi_1.JSONAPISerializers.ResourceTypePath);
        return serializer.serialize(type);
    }
    serializeResourceFieldPath(relationhip, type) {
        const serializer = __classPrivateFieldGet(this, _serializerFor).call(this, jsonapi_1.JSONAPISerializers.ResourceFieldPath);
        return serializer.serialize(relationhip, {
            type: type,
        });
    }
    resourceFieldParamSerializer() {
        return __classPrivateFieldGet(this, _serializerFor).call(this, jsonapi_1.JSONAPISerializers.ResourceFieldParam);
    }
}
exports.Serializer = Serializer;
_serializerFor = new WeakMap();
//# sourceMappingURL=serializer.js.map