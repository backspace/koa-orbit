/// <reference types="koa-bodyparser" />
import { RecordQuery, RecordSource, RecordQueryable, RecordUpdatable } from '@orbit/records';
import { SerializerForFn, SerializerClassForFn, SerializerSettingsForFn } from '@orbit/serializers';
import { Request } from 'koa';
import Router from 'koa-router';
export interface ServerSource extends RecordSource, RecordQueryable<unknown>, RecordUpdatable<unknown> {
}
export interface ServerSettings {
    source: ServerSource;
    prefix?: string;
    readonly?: boolean;
    serializerFor?: SerializerForFn;
    serializerClassFor?: SerializerClassForFn;
    serializerSettingsFor?: SerializerSettingsForFn;
    filterQuery?: (query: RecordQuery, req: Request) => Promise<void>;
}
export default function createJSONAPIRouter(settings: ServerSettings): Router;
