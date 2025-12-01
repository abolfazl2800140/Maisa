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
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              {icon}
            </div>
          </div>
        )}
        
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h2>
        
        {description && (
          <p className="text-gray-500 mb-6">
            {description}
          </p>
        )}

        {(actionLabel && (actionHref || onAction)) && (
          <div className="flex justify-center">
            {actionHref ? (
              <Link
                href={actionHref}
                className="h-12 px-6 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center"
              >
                {actionLabel}
              </Link>
            ) : (
              <button
                onClick={onAction}
                className="h-12 px-6 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors"
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
