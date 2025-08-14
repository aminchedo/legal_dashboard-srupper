export interface ServiceHealth {
    name: string;
    status: 'ok' | 'degraded' | 'down';
    details?: Record<string, unknown>;
}
