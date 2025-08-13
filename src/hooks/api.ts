import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { endpoints } from '../services/apiClient';
import { useToast } from '../contexts/ToastContext';
import { 
  Document, 
  ScrapingJob, 
  Proxy, 
  SystemHealth, 
  AnalyticsData, 
  DashboardStats,
  DashboardActivity,
  PaginationOptions,
  FilterOptions 
} from '../types';

// Query keys
export const queryKeys = {
  // Auth
  auth: ['auth'],
  profile: ['auth', 'profile'],
  
  // Documents
  documents: ['documents'],
  document: (id: string) => ['documents', id],
  
  // Analytics
  analytics: ['analytics'],
  analyticsDashboard: ['analytics', 'dashboard'],
  analyticsDocuments: ['analytics', 'documents'],
  analyticsJobs: ['analytics', 'jobs'],
  analyticsProxies: ['analytics', 'proxies'],
  analyticsTrends: ['analytics', 'trends'],
  
  // Jobs
  jobs: ['jobs'],
  job: (id: string) => ['jobs', id],
  jobLogs: (id: string) => ['jobs', id, 'logs'],
  jobResults: (id: string) => ['jobs', id, 'results'],
  
  // Proxies
  proxies: ['proxies'],
  proxy: (id: string) => ['proxies', id],
  proxyHealth: ['proxies', 'health'],
  proxyAnalytics: ['proxies', 'analytics'],
  
  // System
  system: ['system'],
  systemHealth: ['system', 'health'],
  systemMetrics: ['system', 'metrics'],
  systemLogs: ['system', 'logs'],
  systemAlerts: ['system', 'alerts'],
  systemServices: ['system', 'services'],
  
  // Settings
  settings: ['settings'],
  userSettings: ['settings', 'user'],
  systemSettings: ['settings', 'system'],
  
  // Help
  help: ['help'],
  helpCategories: ['help', 'categories'],
  helpArticle: (id: string) => ['help', 'articles', id],
  
  // Recording
  recording: ['recording'],
  recordingItem: (id: string) => ['recording', id],
  
  // Data
  data: ['data'],
  dataTables: ['data', 'tables'],
};

// Custom hook for handling mutations with toast notifications
export const useMutationWithToast = (
  mutationFn: any,
  options?: {
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
    successMessage?: string;
    errorMessage?: string;
  }
) => {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      if (options?.successMessage) {
        toast.success(options.successMessage);
      }
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message = options?.errorMessage || error.message || 'An error occurred';
      toast.error('Error', message);
      options?.onError?.(error);
    },
  });
};

// Auth hooks
export const useProfile = () => {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: () => endpoints.auth.profile(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useLogin = () => {
  const toast = useToast();
  return useMutationWithToast(
    endpoints.auth.login,
    {
      successMessage: 'Login successful',
      errorMessage: 'Invalid credentials',
    }
  );
};

// Documents hooks
export const useDocuments = (options?: { filters?: FilterOptions; pagination?: PaginationOptions }) => {
  const params = { ...options?.filters, ...options?.pagination };
  return useQuery({
    queryKey: [...queryKeys.documents, params],
    queryFn: () => endpoints.documents.list(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useDocument = (id: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.document(id),
    queryFn: () => endpoints.documents.get(id),
    enabled: enabled && !!id,
  });
};

export const useCreateDocument = () => {
  const queryClient = useQueryClient();
  return useMutationWithToast(
    endpoints.documents.create,
    {
      successMessage: 'Document uploaded successfully',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.documents });
      },
    }
  );
};

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();
  return useMutationWithToast(
    ({ id, data }: { id: string; data: any }) => endpoints.documents.update(id, data),
    {
      successMessage: 'Document updated successfully',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.documents });
      },
    }
  );
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  return useMutationWithToast(
    endpoints.documents.delete,
    {
      successMessage: 'Document deleted successfully',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.documents });
      },
    }
  );
};

export const useProcessDocument = () => {
  const queryClient = useQueryClient();
  return useMutationWithToast(
    endpoints.documents.process,
    {
      successMessage: 'Document processing started',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.documents });
      },
    }
  );
};

// Analytics hooks
export const useAnalyticsDashboard = () => {
  return useQuery({
    queryKey: queryKeys.analyticsDashboard,
    queryFn: () => endpoints.analytics.dashboard(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAnalyticsDocuments = (params?: any) => {
  return useQuery({
    queryKey: [...queryKeys.analyticsDocuments, params],
    queryFn: () => endpoints.analytics.documents(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAnalyticsJobs = (params?: any) => {
  return useQuery({
    queryKey: [...queryKeys.analyticsJobs, params],
    queryFn: () => endpoints.analytics.jobs(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAnalyticsProxies = (params?: any) => {
  return useQuery({
    queryKey: [...queryKeys.analyticsProxies, params],
    queryFn: () => endpoints.analytics.proxies(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAnalyticsTrends = (params?: any) => {
  return useQuery({
    queryKey: [...queryKeys.analyticsTrends, params],
    queryFn: () => endpoints.analytics.trends(params),
    staleTime: 10 * 60 * 1000,
  });
};

// Jobs hooks
export const useJobs = (options?: { filters?: FilterOptions; pagination?: PaginationOptions }) => {
  const params = { ...options?.filters, ...options?.pagination };
  return useQuery({
    queryKey: [...queryKeys.jobs, params],
    queryFn: () => endpoints.jobs.list(params),
    staleTime: 1 * 60 * 1000, // 1 minute for real-time updates
  });
};

export const useJob = (id: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.job(id),
    queryFn: () => endpoints.jobs.get(id),
    enabled: enabled && !!id,
    refetchInterval: 5000, // Refetch every 5 seconds for running jobs
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutationWithToast(
    endpoints.jobs.create,
    {
      successMessage: 'Scraping job created successfully',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.jobs });
      },
    }
  );
};

export const useStartJob = () => {
  const queryClient = useQueryClient();
  return useMutationWithToast(
    endpoints.jobs.start,
    {
      successMessage: 'Job started successfully',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.jobs });
      },
    }
  );
};

export const useStopJob = () => {
  const queryClient = useQueryClient();
  return useMutationWithToast(
    endpoints.jobs.stop,
    {
      successMessage: 'Job stopped successfully',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.jobs });
      },
    }
  );
};

// Proxies hooks
export const useProxies = (options?: { filters?: FilterOptions; pagination?: PaginationOptions }) => {
  const params = { ...options?.filters, ...options?.pagination };
  return useQuery({
    queryKey: [...queryKeys.proxies, params],
    queryFn: () => endpoints.proxies.list(params),
    staleTime: 2 * 60 * 1000,
  });
};

export const useProxy = (id: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.proxy(id),
    queryFn: () => endpoints.proxies.get(id),
    enabled: enabled && !!id,
  });
};

export const useCreateProxy = () => {
  const queryClient = useQueryClient();
  return useMutationWithToast(
    endpoints.proxies.create,
    {
      successMessage: 'Proxy created successfully',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.proxies });
      },
    }
  );
};

export const useTestProxy = () => {
  return useMutationWithToast(
    endpoints.proxies.test,
    {
      successMessage: 'Proxy test completed',
    }
  );
};

export const useProxyHealth = () => {
  return useQuery({
    queryKey: queryKeys.proxyHealth,
    queryFn: () => endpoints.proxies.health(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

// System hooks
export const useSystemHealth = () => {
  return useQuery({
    queryKey: queryKeys.systemHealth,
    queryFn: () => endpoints.system.health(),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000, // Real-time monitoring
  });
};

export const useSystemMetrics = (params?: any) => {
  return useQuery({
    queryKey: [...queryKeys.systemMetrics, params],
    queryFn: () => endpoints.system.metrics(params),
    staleTime: 1 * 60 * 1000,
  });
};

export const useSystemAlerts = () => {
  return useQuery({
    queryKey: queryKeys.systemAlerts,
    queryFn: () => endpoints.system.alerts(),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
};

export const useAcknowledgeAlert = () => {
  const queryClient = useQueryClient();
  return useMutationWithToast(
    endpoints.system.acknowledgeAlert,
    {
      successMessage: 'Alert acknowledged',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.systemAlerts });
      },
    }
  );
};

// Settings hooks
export const useUserSettings = () => {
  return useQuery({
    queryKey: queryKeys.userSettings,
    queryFn: () => endpoints.settings.user(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useUpdateUserSettings = () => {
  const queryClient = useQueryClient();
  return useMutationWithToast(
    endpoints.settings.updateUser,
    {
      successMessage: 'Settings updated successfully',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.userSettings });
      },
    }
  );
};

// Help hooks
export const useHelpSearch = (query: string, enabled = true) => {
  return useQuery({
    queryKey: [...queryKeys.help, 'search', query],
    queryFn: () => endpoints.help.search(query),
    enabled: enabled && !!query && query.length > 2,
    staleTime: 10 * 60 * 1000,
  });
};

export const useHelpCategories = () => {
  return useQuery({
    queryKey: queryKeys.helpCategories,
    queryFn: () => endpoints.help.categories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useHelpArticle = (id: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.helpArticle(id),
    queryFn: () => endpoints.help.article(id),
    enabled: enabled && !!id,
    staleTime: 30 * 60 * 1000,
  });
};