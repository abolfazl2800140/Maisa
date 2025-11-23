import Link from 'next/link';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] px-4">
      <div className="max-w-md w-full text-center">
        {icon && (
          <div className="mb-6 flex justify-center">
            {icon}
          </div>
        )}
        
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {title}
        </h2>
        
        {description && (
          <p className="text-gray-600 mb-8">
            {description}
          </p>
        )}

        {(actionLabel && (actionHref || onAction)) && (
          <div className="flex justify-center">
            {actionHref ? (
              <Link
                href={actionHref}
                className="inline-block px-8 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
              >
                {actionLabel}
              </Link>
            ) : (
              <button
                onClick={onAction}
                className="px-8 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
              >
                {actionLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
