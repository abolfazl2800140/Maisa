import { FaExclamationCircle, FaRedo } from 'react-icons/fa';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
}

export default function ErrorMessage({
  title = 'خطایی رخ داده است',
  message = 'متأسفانه مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.',
  onRetry,
  showHomeButton = true
}: ErrorMessageProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaExclamationCircle className="text-3xl text-red-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {title}
        </h2>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>

        <div className="flex gap-3 justify-center">
          {showHomeButton && (
            <a
              href="/"
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              بازگشت به خانه
            </a>
          )}
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2"
            >
              <FaRedo />
              تلاش مجدد
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
