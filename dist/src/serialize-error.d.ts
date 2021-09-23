export declare function serializeError(error: Error): Promise<{
    status: number;
    body: unknown;
}>;
