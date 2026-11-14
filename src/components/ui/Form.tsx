'use client';

import React from 'react';
import clsx from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export function Input({ label, error, helper, className, id, ...rest }: InputProps) {
  const inputId = id || rest.name || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="label-base">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx('input-base', error && 'border-red-400 focus:border-red-500 focus:ring-red-500/15', className)}
        {...rest}
      />
      {error ? (
        <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
      ) : helper ? (
        <p className="mt-1 text-xs text-ink-500">{helper}</p>
      ) : null}
    </div>
  );
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export function Textarea({ label, error, helper, className, id, ...rest }: TextareaProps) {
  const inputId = id || rest.name || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="label-base">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={clsx('input-base min-h-24 resize-y', error && 'border-red-400 focus:border-red-500 focus:ring-red-500/15', className)}
        {...rest}
      />
      {error ? (
        <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
      ) : helper ? (
        <p className="mt-1 text-xs text-ink-500">{helper}</p>
      ) : null}
    </div>
  );
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export function Select({ label, error, helper, className, id, children, ...rest }: SelectProps) {
  const inputId = id || rest.name || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="label-base">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={clsx('input-base appearance-none bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27%23737373%27 viewBox=%270 0 24 24%27%3E%3Cpath d=%27M7 10l5 5 5-5z%27/%3E%3C/svg%3E")] bg-[length:20px] bg-[right_0.6rem_center] bg-no-repeat pr-10', error && 'border-red-400', className)}
        {...rest}
      >
        {children}
      </select>
      {error ? (
        <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
      ) : helper ? (
        <p className="mt-1 text-xs text-ink-500">{helper}</p>
      ) : null}
    </div>
  );
}
