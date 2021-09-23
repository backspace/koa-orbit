/// <reference types="koa-bodyparser" />
import Koa from 'koa';
export interface Subject {
    app?: Koa;
}
export default function (subject: Subject, sourceName: string): void;
