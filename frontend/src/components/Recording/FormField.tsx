import React from 'react';
import { colors, spacing, componentStyles } from './theme';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  description?: string;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  description?: string;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  description?: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  description?: string;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  children,
  error,
  required = false,
  htmlFor,
  className = '',
  description,
}) => {
  const fieldId = htmlFor || `field-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={className} style={{ marginBottom: spacing.lg }}>
      <label
        htmlFor={fieldId}
        style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: colors.text.secondary,
          marginBottom: spacing.sm,
        }}
      >
        {label}
        {required && (
          <span
            style={{ color: colors.status.error.bg, marginLeft: spacing.xs }}
            aria-label="ضروری"
          >
            *
          </span>
        )}
      </label>
      
      {description && (
        <p
          style={{
            fontSize: '12px',
            color: colors.text.muted,
            marginBottom: spacing.sm,
            margin: 0,
          }}
          id={`${fieldId}-description`}
        >
          {description}
        </p>
      )}
      
      <div>
        {React.cloneElement(children as React.ReactElement, {
          id: fieldId,
          'aria-describedby': description ? `${fieldId}-description` : error ? `${fieldId}-error` : undefined,
          'aria-invalid': !!error,
        })}
      </div>
      
      {error && (
        <p
          id={`${fieldId}-error`}
          role="alert"
          style={{
            fontSize: '12px',
            color: colors.status.error.bg,
            marginTop: spacing.xs,
            margin: 0,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export const Input: React.FC<InputProps> = ({
  label,
  error,
  description,
  className = '',
  required = false,
  ...props
}) => {
  const inputStyles: React.CSSProperties = {
    width: '100%',
    background: colors.background.tertiary,
    border: `1px solid ${error ? colors.status.error.bg : colors.border.primary}`,
    borderRadius: '8px',
    padding: spacing.md,
    color: colors.text.primary,
    fontSize: '14px',
    transition: 'all 150ms ease',
    outline: 'none',
  };

  return (
    <FormField 
      label={label} 
      error={error} 
      description={description} 
      required={required}
      className={className}
    >
      <input
        {...props}
        style={{
          ...inputStyles,
          ...props.style,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = colors.border.focus;
          e.target.style.boxShadow = `0 0 0 3px ${colors.accent.primary}20`;
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? colors.status.error.bg : colors.border.primary;
          e.target.style.boxShadow = 'none';
          props.onBlur?.(e);
        }}
      />
    </FormField>
  );
};

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  description,
  className = '',
  required = false,
  ...props
}) => {
  const textareaStyles: React.CSSProperties = {
    width: '100%',
    background: colors.background.tertiary,
    border: `1px solid ${error ? colors.status.error.bg : colors.border.primary}`,
    borderRadius: '8px',
    padding: spacing.md,
    color: colors.text.primary,
    fontSize: '14px',
    transition: 'all 150ms ease',
    outline: 'none',
    resize: 'vertical',
    minHeight: '80px',
  };

  return (
    <FormField 
      label={label} 
      error={error} 
      description={description} 
      required={required}
      className={className}
    >
      <textarea
        {...props}
        style={{
          ...textareaStyles,
          ...props.style,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = colors.border.focus;
          e.target.style.boxShadow = `0 0 0 3px ${colors.accent.primary}20`;
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? colors.status.error.bg : colors.border.primary;
          e.target.style.boxShadow = 'none';
          props.onBlur?.(e);
        }}
      />
    </FormField>
  );
};

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  description,
  children,
  className = '',
  required = false,
  ...props
}) => {
  const selectStyles: React.CSSProperties = {
    width: '100%',
    background: colors.background.tertiary,
    border: `1px solid ${error ? colors.status.error.bg : colors.border.primary}`,
    borderRadius: '8px',
    padding: spacing.md,
    color: colors.text.primary,
    fontSize: '14px',
    transition: 'all 150ms ease',
    outline: 'none',
    cursor: 'pointer',
  };

  return (
    <FormField 
      label={label} 
      error={error} 
      description={description} 
      required={required}
      className={className}
    >
      <select
        {...props}
        style={{
          ...selectStyles,
          ...props.style,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = colors.border.focus;
          e.target.style.boxShadow = `0 0 0 3px ${colors.accent.primary}20`;
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? colors.status.error.bg : colors.border.primary;
          e.target.style.boxShadow = 'none';
          props.onBlur?.(e);
        }}
      >
        {children}
      </select>
    </FormField>
  );
};

export default FormField;