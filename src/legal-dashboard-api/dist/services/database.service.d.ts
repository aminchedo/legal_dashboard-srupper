import { DatabaseClient } from '../interfaces/database.interface';
declare class DatabaseService {
    private client;
    constructor();
    getClient(): DatabaseClient;
}
export declare const databaseService: DatabaseService;
export {};
