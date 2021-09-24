import { SortParam, FilterParam, RecordSchema } from '@orbit/records';
import { JSONAPIResourceFieldSerializer } from '@orbit/jsonapi';
export declare function deserializeFilterParams(schema: RecordSchema, serializer: JSONAPIResourceFieldSerializer, type: string, filter: Record<string, string>): FilterParam[];
export declare function deserializeSortParams(schema: RecordSchema, serializer: JSONAPIResourceFieldSerializer, type: string, sort: string): SortParam[];
