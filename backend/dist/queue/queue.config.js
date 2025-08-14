"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapingQueue = void 0;
class SimpleQueue {
    constructor() {
        this.jobs = [];
        this.jobCounter = 0;
    }
    async add(name, data, opts = {}) {
        const job = {
            id: String(++this.jobCounter),
            data,
            progress: 0,
            opts,
            remove: async () => {
                const index = this.jobs.findIndex(j => j.id === job.id);
                if (index > -1) {
                    this.jobs.splice(index, 1);
                }
            }
        };
        this.jobs.push(job);
        return job;
    }
    async getJobs(types) {
        return this.jobs.filter(job => types.includes('waiting') ||
            types.includes('delayed') ||
            types.includes('paused'));
    }
    async getJobCounts() {
        return {
            waiting: this.jobs.filter(j => j.progress === 0).length,
            active: this.jobs.filter(j => j.progress > 0 && j.progress < 100).length,
            completed: this.jobs.filter(j => j.progress === 100).length,
            failed: 0,
            delayed: 0
        };
    }
    async clean(grace, type) {
        this.jobs = this.jobs.filter(job => job.progress !== 100);
    }
}
exports.scrapingQueue = new SimpleQueue();
//# sourceMappingURL=queue.config.js.map