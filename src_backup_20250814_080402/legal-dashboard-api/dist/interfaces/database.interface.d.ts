export interface DatabaseTransaction {
    begin(): void;
    commit(): void;
    rollback(): void;
}
export interface DatabaseClient {
    query<T = unknown>(sql: string, params?: unknown[]): T[];
    run(sql: string, params?: unknown[]): void;
    transaction(): DatabaseTransaction;
}
