import type { ReactNode } from 'react';

interface Props {
  title: string;
  message?: string;
  tone?: 'error' | 'neutral';
  children?: ReactNode; // action buttons / links
}

/** Shared layout for error, empty and not-found states. */
export default function StatusMessage({ title, message, tone = 'neutral', children }: Props) {
  return (
    <div className={`status status--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <h2 className="status__title">{title}</h2>
      {message && <p className="status__text">{message}</p>}
      {children && <div className="status__actions">{children}</div>}
    </div>
  );
}
