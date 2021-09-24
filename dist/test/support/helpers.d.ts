/// <reference types="koa-bodyparser" />
import Koa from 'koa';
export interface RequestOptions {
    url: string;
    query?: unknown;
    method?: string;
    headers?: Record<string, string>;
    payload?: unknown;
}
interface TestResponse {
    status: number;
    headers: Record<string, string>;
    body: any;
}
export declare function request(app: Koa, options: RequestOptions): Promise<TestResponse>;
export {};
