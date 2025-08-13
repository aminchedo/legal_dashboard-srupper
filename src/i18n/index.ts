import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation files
const resources = {
  en: {
    translation: {
      common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        create: 'Create',
        search: 'Search',
        filter: 'Filter',
        export: 'Export',
        import: 'Import',
        refresh: 'Refresh',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        close: 'Close',
        confirm: 'Confirm',
        actions: 'Actions',
        status: 'Status',
        name: 'Name',
        description: 'Description',
        date: 'Date',
        type: 'Type',
        size: 'Size',
        total: 'Total',
        active: 'Active',
        inactive: 'Inactive',
        enabled: 'Enabled',
        disabled: 'Disabled',
      },
      nav: {
        dashboard: 'Dashboard',
        documents: 'Documents',
        analytics: 'Analytics',
        jobs: 'Jobs',
        proxies: 'Proxies',
        system: 'System',
        settings: 'Settings',
        help: 'Help',
        recording: 'Recording',
        data: 'Data',
        logout: 'Logout',
      },
      dashboard: {
        title: 'Dashboard',
        overview: 'Overview',
        recentActivity: 'Recent Activity',
        quickActions: 'Quick Actions',
        statistics: 'Statistics',
        performance: 'Performance',
        alerts: 'Alerts',
      },
      documents: {
        title: 'Documents',
        upload: 'Upload Document',
        preview: 'Preview',
        download: 'Download',
        process: 'Process',
        extract: 'Extract Text',
        analyze: 'Analyze',
      },
      analytics: {
        title: 'Analytics',
        charts: 'Charts',
        trends: 'Trends',
        reports: 'Reports',
        insights: 'Insights',
      },
      jobs: {
        title: 'Scraping Jobs',
        create: 'Create Job',
        start: 'Start',
        stop: 'Stop',
        pause: 'Pause',
        resume: 'Resume',
        progress: 'Progress',
        logs: 'Logs',
      },
      proxies: {
        title: 'Proxy Management',
        test: 'Test Proxy',
        configure: 'Configure',
        rotation: 'Rotation',
        health: 'Health Check',
      },
      system: {
        title: 'System Health',
        monitoring: 'Monitoring',
        performance: 'Performance',
        logs: 'System Logs',
        alerts: 'Alerts',
        metrics: 'Metrics',
      },
      auth: {
        login: 'Login',
        logout: 'Logout',
        email: 'Email',
        password: 'Password',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot password?',
        signIn: 'Sign In',
        signOut: 'Sign Out',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;