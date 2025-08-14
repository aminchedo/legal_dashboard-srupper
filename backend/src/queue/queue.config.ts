// Simple queue implementation without bull/redis for now
// This provides the basic interface that the controllers expect

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

class SimpleQueue {
  private jobs: Job[] = [];
  private jobCounter = 0;

  async add(name: string, data: any, opts: any = {}): Promise<Job> {
    const job: Job = {
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

  async getJobs(types: string[]): Promise<Job[]> {
    return this.jobs.filter(job => 
      types.includes('waiting') || 
      types.includes('delayed') || 
      types.includes('paused')
    );
  }

  async getJobCounts(): Promise<JobCounts> {
    return {
      waiting: this.jobs.filter(j => j.progress === 0).length,
      active: this.jobs.filter(j => j.progress > 0 && j.progress < 100).length,
      completed: this.jobs.filter(j => j.progress === 100).length,
      failed: 0,
      delayed: 0
    };
  }

  async clean(grace: number, type: string): Promise<void> {
    // Simple cleanup - remove completed jobs
    this.jobs = this.jobs.filter(job => job.progress !== 100);
  }
}

export const scrapingQueue = new SimpleQueue();