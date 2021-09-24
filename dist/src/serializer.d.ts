import { Record as InitializedRecord, RecordSchema, UninitializedRecord } from '@orbit/records';
import { JSONAPIResourceFieldSerializer, RecordDocument, ResourceDocument } from '@orbit/jsonapi';
import { SerializerForFn, SerializerClassForFn, SerializerSettingsForFn } from '@orbit/serializers';
export interface SerializerSettings {
    schema: RecordSchema;
    serializerFor?: SerializerForFn;
    serializerClassFor?: SerializerClassForFn;
    serializerSettingsFor?: SerializerSettingsForFn;
}
export declare class Serializer {
    #private;
    constructor(settings: SerializerSettings);
    serializeDocument(document: RecordDocument): ResourceDocument;
    deserializeDocument(document: ResourceDocument): InitializedRecord;
    deserializeDocuments(document: ResourceDocument): InitializedRecord[];
    deserializeUninitializedDocument(document: ResourceDocument): UninitializedRecord;
    serializeResourceTypePath(type: string): string;
    serializeResourceFieldPath(relationhip: string, type: string | string[] | undefined): string;
    resourceFieldParamSerializer(): JSONAPIResourceFieldSerializer;
}
