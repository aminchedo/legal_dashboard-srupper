// Theme system with consistent spacing and improved contrast
export const spacing = {
  xs: '4px',    // 0.25rem
  sm: '8px',    // 0.5rem
  md: '16px',   // 1rem
  lg: '24px',   // 1.5rem
  xl: '32px',   // 2rem
  '2xl': '48px', // 3rem
  '3xl': '64px', // 4rem
} as const;

export const colors = {
  // Background colors with better contrast
  background: {
    primary: '#0f172a',    // slate-900
    secondary: '#1e293b',  // slate-800
    tertiary: '#334155',   // slate-700
    surface: '#475569',    // slate-600
  },
  
  // Text colors with WCAG AA compliance (4.5:1 contrast)
  text: {
    primary: '#ffffff',     // white
    secondary: '#e2e8f0',   // slate-200
    tertiary: '#cbd5e1',    // slate-300
    muted: '#94a3b8',       // slate-400
    inverse: '#1e293b',     // slate-800
  },
  
  // Status colors with improved contrast
  status: {
    success: {
      bg: '#059669',        // emerald-600
      text: '#ffffff',
      light: '#10b981',     // emerald-500
      lighter: '#d1fae5',   // emerald-100
    },
    error: {
      bg: '#dc2626',        // red-600
      text: '#ffffff',
      light: '#ef4444',     // red-500
      lighter: '#fee2e2',   // red-100
    },
    warning: {
      bg: '#d97706',        // amber-600
      text: '#ffffff',
      light: '#f59e0b',     // amber-500
      lighter: '#fef3c7',   // amber-100
    },
    info: {
      bg: '#2563eb',        // blue-600
      text: '#ffffff',
      light: '#3b82f6',     // blue-500
      lighter: '#dbeafe',   // blue-100
    },
  },
  
  // Accent colors
  accent: {
    primary: '#3b82f6',     // blue-500
    secondary: '#8b5cf6',   // violet-500
    success: '#10b981',     // emerald-500
    warning: '#f59e0b',     // amber-500
    danger: '#ef4444',      // red-500
  },
  
  // Border colors
  border: {
    primary: '#475569',     // slate-600
    secondary: '#64748b',   // slate-500
    light: '#cbd5e1',       // slate-300
    focus: '#3b82f6',       // blue-500
  },
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const;

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Component-specific styles
export const componentStyles = {
  button: {
    primary: `
      background: ${colors.accent.primary};
      color: ${colors.text.primary};
      padding: ${spacing.md} ${spacing.lg};
      border-radius: 12px;
      font-weight: 500;
      transition: all ${transitions.normal};
      box-shadow: ${shadows.md};
      border: none;
      cursor: pointer;
      
      &:hover {
        background: #2563eb;
        box-shadow: ${shadows.lg};
        transform: translateY(-1px);
      }
      
      &:disabled {
        background: ${colors.background.surface};
        color: ${colors.text.muted};
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
    `,
    
    secondary: `
      background: ${colors.background.secondary};
      color: ${colors.text.secondary};
      padding: ${spacing.md} ${spacing.lg};
      border-radius: 12px;
      font-weight: 500;
      transition: all ${transitions.normal};
      box-shadow: ${shadows.sm};
      border: 1px solid ${colors.border.primary};
      cursor: pointer;
      
      &:hover {
        background: ${colors.background.tertiary};
        box-shadow: ${shadows.md};
      }
    `,
  },
  
  card: `
    background: ${colors.background.secondary};
    border: 1px solid ${colors.border.primary};
    border-radius: 16px;
    padding: ${spacing.lg};
    box-shadow: ${shadows.md};
    transition: all ${transitions.normal};
    
    &:hover {
      box-shadow: ${shadows.lg};
    }
  `,
  
  input: `
    background: ${colors.background.tertiary};
    border: 1px solid ${colors.border.primary};
    border-radius: 8px;
    padding: ${spacing.md};
    color: ${colors.text.primary};
    font-size: 14px;
    transition: all ${transitions.fast};
    
    &:focus {
      outline: none;
      border-color: ${colors.border.focus};
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    &::placeholder {
      color: ${colors.text.muted};
    }
  `,
  
  modal: `
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    padding: ${spacing.md};
    
    .modal-content {
      background: ${colors.background.secondary};
      border: 1px solid ${colors.border.primary};
      border-radius: 16px;
      padding: ${spacing.xl};
      max-width: 90vw;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: ${shadows.xl};
      width: 100%;
      max-width: 600px;
    }
    
    @media (max-width: ${breakpoints.md}) {
      padding: ${spacing.sm};
      
      .modal-content {
        max-width: 95vw;
        max-height: 95vh;
        padding: ${spacing.lg};
      }
    }
  `,
  
  scrollbar: `
    scrollbar-width: thin;
    scrollbar-color: ${colors.background.surface} transparent;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: ${colors.background.surface};
      border-radius: 3px;
      
      &:hover {
        background-color: ${colors.border.primary};
      }
    }
  `,
};