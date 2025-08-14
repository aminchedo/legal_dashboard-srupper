import { DatabaseClient } from '../types/database.types';
declare class DatabaseService {
    private client;
    constructor();
    getClient(): DatabaseClient;
}
export declare const databaseService: DatabaseService;
export {};
