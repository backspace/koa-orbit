"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("@orbit/data");
const koa_router_1 = __importDefault(require("koa-router"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const qs_1 = __importDefault(require("qs"));
const deserialize_params_1 = require("./deserialize-params");
const serialize_error_1 = require("./serialize-error");
const serializer_1 = require("./serializer");
const CONTENT_TYPE = 'application/vnd.api+json; charset=utf-8';
function createJSONAPIRouter(settings) {
    var _a;
    const { source, prefix, readonly, serializerFor, serializerClassFor, serializerSettingsFor, } = settings;
    const name = source.name;
    const schema = source.schema;
    const filterQuery = (_a = settings.filterQuery) !== null && _a !== void 0 ? _a : (async () => true);
    const serializer = new serializer_1.Serializer({
        schema,
        serializerFor,
        serializerClassFor,
        serializerSettingsFor,
    });
    const router = new koa_router_1.default({ prefix });
    router.use(koa_bodyparser_1.default({ enableTypes: ['json'] }));
    router.use(async (ctx, next) => {
        try {
            ctx.state.query = qs_1.default.parse(ctx.querystring);
            await next();
            if (ctx.status === 200 || ctx.status === 201) {
                ctx.body = serializer.serializeDocument(ctx.body);
                ctx.type = CONTENT_TYPE;
            }
        }
        catch (error) {
            await source.requestQueue.clear().catch(() => true);
            Object.assign(ctx, serialize_error_1.serializeError(error));
            ctx.type = CONTENT_TYPE;
        }
    });
    for (const type of Object.keys(schema.models)) {
        const resourceType = serializer.serializeResourceTypePath(type);
        const resourcePath = `/${resourceType}`;
        const resourcePathWithId = `/${resourceType}/:id`;
        router.get(`findRecords(${type})`, resourcePath, async (ctx) => {
            const { headers, state: { query: { filter, sort, include }, }, } = ctx;
            const term = source.queryBuilder.findRecords(type);
            if (filter) {
                term.filter(...deserialize_params_1.deserializeFilterQBParams(source.schema, serializer.resourceFieldParamSerializer(), type, filter));
            }
            if (sort) {
                term.sort(...deserialize_params_1.deserializeSortQBParams(schema, serializer.resourceFieldParamSerializer(), type, sort));
            }
            const query = data_1.buildQuery(term.toQueryExpression(), {
                from: 'jsonapi',
                [name]: { headers, include },
            }, undefined, source.queryBuilder);
            await filterQuery(query, ctx.request);
            const records = await source.query(query);
            ctx.status = 200;
            ctx.body = { data: records };
        });
        router.get(`findRecord(${type})`, resourcePathWithId, async (ctx) => {
            const { headers, params: { id }, state: { query: { include }, }, } = ctx;
            const recordIdentity = { type, id };
            const term = source.queryBuilder.findRecord(recordIdentity);
            const query = data_1.buildQuery(term, {
                raiseNotFoundExceptions: true,
                from: 'jsonapi',
                [name]: { headers, include },
            }, undefined, source.queryBuilder);
            await filterQuery(query, ctx.request);
            const record = await source.query(query);
            ctx.status = 200;
            ctx.body = { data: record };
        });
        if (!readonly) {
            router.post(`addRecord(${type})`, resourcePath, async (ctx) => {
                const { headers, state: { query: { include }, }, } = ctx;
                const uninitializedRecord = serializer.deserializeUninitializedDocument(ctx.request.body);
                const record = await source.update((t) => t.addRecord(uninitializedRecord), {
                    from: 'jsonapi',
                    [name]: { headers, include },
                });
                const location = router.url(`findRecord(${type})`, { id: record.id });
                ctx.status = 201;
                ctx.set('location', location);
                ctx.body = { data: record };
            });
            router.patch(`updateRecord(${type})`, resourcePathWithId, async (ctx) => {
                const { headers, params: { id }, } = ctx;
                const recordIdentity = { type, id };
                const record = serializer.deserializeDocument(ctx.request.body);
                await source.update((t) => t.updateRecord({ ...record, ...recordIdentity }), {
                    raiseNotFoundExceptions: true,
                    from: 'jsonapi',
                    [name]: { headers },
                });
                ctx.status = 204;
            });
            router.delete(`removeRecord(${type})`, resourcePathWithId, async (ctx) => {
                const { headers, params: { id }, } = ctx;
                const recordIdentity = { type, id };
                await source.update((t) => t.removeRecord(recordIdentity), {
                    raiseNotFoundExceptions: true,
                    from: 'jsonapi',
                    [name]: { headers },
                });
                ctx.status = 204;
            });
        }
        schema.eachRelationship(type, (propertyName, { kind, type: relationshipType }) => {
            const relationshipName = serializer.serializeResourceFieldPath(propertyName, relationshipType);
            const relationshipPath = `${resourcePathWithId}/${relationshipName}`;
            if (kind === 'hasMany') {
                router.get(`findRelatedRecords(${type}, ${relationshipType})`, relationshipPath, async (ctx) => {
                    const { headers, params: { id }, state: { query: { filter, sort, include }, }, } = ctx;
                    const recordIdentity = { type, id };
                    const term = source.queryBuilder.findRelatedRecords(recordIdentity, propertyName);
                    if (filter) {
                        term.filter(...deserialize_params_1.deserializeFilterQBParams(source.schema, serializer.resourceFieldParamSerializer(), relationshipType, filter));
                    }
                    if (sort) {
                        term.sort(...deserialize_params_1.deserializeSortQBParams(schema, serializer.resourceFieldParamSerializer(), relationshipType, sort));
                    }
                    const query = data_1.buildQuery(term, {
                        from: 'jsonapi',
                        [name]: { headers, include },
                    }, undefined, source.queryBuilder);
                    await filterQuery(query, ctx.request);
                    const records = await source.query(query);
                    ctx.status = 200;
                    ctx.body = { data: records };
                });
                if (!readonly) {
                    router.patch(`replaceRelatedRecords(${type}, ${relationshipType})`, relationshipPath, async (ctx) => {
                        const { headers, params: { id }, } = ctx;
                        const recordIdentity = { type, id };
                        const records = serializer.deserializeDocuments(ctx.request.body);
                        await source.update((q) => q.replaceRelatedRecords(recordIdentity, propertyName, records), {
                            from: 'jsonapi',
                            [name]: { headers },
                        });
                        ctx.status = 204;
                    });
                    router.post(`addToRelatedRecords(${type}, ${relationshipType})`, relationshipPath, async (ctx) => {
                        const { headers, params: { id }, } = ctx;
                        const recordIdentity = { type, id };
                        const records = serializer.deserializeDocuments(ctx.request.body);
                        await source.update((q) => records.map((record) => q.addToRelatedRecords(recordIdentity, propertyName, record)), {
                            from: 'jsonapi',
                            [name]: { headers },
                        });
                        ctx.status = 204;
                    });
                    router.delete(`removeFromRelatedRecords(${type}, ${relationshipType})`, relationshipPath, async (ctx) => {
                        const { headers, params: { id }, } = ctx;
                        const recordIdentity = { type, id };
                        const records = serializer.deserializeDocuments(ctx.request.body);
                        await source.update((q) => records.map((record) => q.removeFromRelatedRecords(recordIdentity, propertyName, record)), {
                            from: 'jsonapi',
                            [name]: { headers },
                        });
                        ctx.status = 204;
                    });
                }
            }
            else {
                router.get(`findRelatedRecord(${type}, ${relationshipType})`, relationshipPath, async (ctx) => {
                    const { headers, params: { id }, state: { query: { include }, }, } = ctx;
                    const recordIdentity = { type, id };
                    const term = source.queryBuilder.findRelatedRecord(recordIdentity, propertyName);
                    const query = data_1.buildQuery(term, { from: 'jsonapi', [name]: { headers, include } }, undefined, source.queryBuilder);
                    await filterQuery(query, ctx.request);
                    const record = await source.query(query);
                    ctx.status = 200;
                    ctx.body = { data: record };
                });
                if (!readonly) {
                    router.patch(`replaceRelatedRecord(${type}, ${relationshipType})`, relationshipPath, async (ctx) => {
                        const { headers, params: { id }, } = ctx;
                        const recordIdentity = { type, id };
                        const record = serializer.deserializeDocument(ctx.request.body);
                        await source.update((q) => q.replaceRelatedRecord(recordIdentity, propertyName, record), {
                            from: 'jsonapi',
                            [name]: { headers },
                        });
                        ctx.status = 204;
                    });
                }
            }
        });
    }
    return router;
}
exports.default = createJSONAPIRouter;
//# sourceMappingURL=index.js.map