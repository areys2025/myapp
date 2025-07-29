
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  inputClassName?: string;
}

const Input: React.FC<InputProps> = ({ label, id, error, className = '', inputClassName = '', ...props }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-neutral-dark mb-1">{label}</label>}
      <input
        id={id}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${error ? 'border-red-500' : ''} ${inputClassName}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};


interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  textareaClassName?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, id, error, className = '', textareaClassName = '', ...props }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-neutral-dark mb-1">{label}</label>}
      <textarea
        id={id}
        rows={3}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${error ? 'border-red-500' : ''} ${textareaClassName}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};


interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  selectClassName?: string;
  options: { value: string | number; label: string }[];
  placeholder?: string; 
}

export const Select: React.FC<SelectProps> = ({ label, id, error, className = '', selectClassName = '', options, placeholder, ...props }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-neutral-dark mb-1">{label}</label>}
      <select
        id={id}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm 
                   bg-primary text-white border-primary-dark 
                   focus:ring-2 focus:ring-offset-1 focus:ring-offset-primary-light focus:ring-primary-light focus:border-primary-dark 
                   ${error ? 'border-red-500 focus:ring-red-500' : 'border-primary-dark'} ${selectClassName}`}
        {...props}
      >
        {placeholder && <option value="" className="bg-primary-light text-neutral-dark">{placeholder}</option>}
        {options.map(option => (
          <option 
            key={option.value} 
            value={option.value} 
            // Note: Styling of <option> tags is inconsistent across browsers.
            // Background and hover effects might not render as expected in all browsers.
            className="bg-primary-light text-neutral-dark hover:bg-primary hover:text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
