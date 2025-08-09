class ApiClient {
    private baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    private get token() {
        return localStorage.getItem('accessToken') || localStorage.getItem('authToken');
    }

    private async fetch(path: string, options: RequestInit = {}) {
        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
        };
        const response = await fetch(`${this.baseUrl}${path}`, { ...options, headers });
        if (!response.ok) {
            const errorBody = await response.text();
            console.error("API Error Response:", errorBody);
            throw new Error(`API request failed: ${response.statusText}`);
        }
        return response.json();
    }

    async getDocuments(filters: Record<string, any> = {}) {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                params.append(key, String(value));
            }
        });
        return this.fetch(`/documents?${params}`);
    }

    async deleteDocument(id: string) {
        return this.fetch(`/documents/${id}`, { method: 'DELETE' });
    }

    async getAnalytics(dateRange = {}) {
        return this.fetch('/analytics', {
            method: 'POST',
            body: JSON.stringify(dateRange),
        });
    }

    async getScrapingStats() {
        return this.fetch('/scraping/stats');
    }

    async listScrapingSources() {
        return this.fetch('/scraping/sources');
    }
}

export const apiClient = new ApiClient();
