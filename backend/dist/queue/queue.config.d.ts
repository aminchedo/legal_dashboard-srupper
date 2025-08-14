interface Job {
    id: string;
    data: any;
    progress: number;
    opts: any;
    remove(): Promise<void>;
}
interface JobCounts {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
}
declare class SimpleQueue {
    private jobs;
    private jobCounter;
    add(name: string, data: any, opts?: any): Promise<Job>;
    getJobs(types: string[]): Promise<Job[]>;
    getJobCounts(): Promise<JobCounts>;
    clean(grace: number, type: string): Promise<void>;
}
export declare const scrapingQueue: SimpleQueue;
export {};
