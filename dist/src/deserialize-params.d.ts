import { SortQBParam, FilterQBParam, RecordSchema } from '@orbit/records';
import { JSONAPIResourceFieldSerializer } from '@orbit/jsonapi';
export declare function deserializeFilterQBParams(schema: RecordSchema, serializer: JSONAPIResourceFieldSerializer, type: string, filter: Record<string, string>): FilterQBParam[];
export declare function deserializeSortQBParams(schema: RecordSchema, serializer: JSONAPIResourceFieldSerializer, type: string, sort: string): SortQBParam[];
