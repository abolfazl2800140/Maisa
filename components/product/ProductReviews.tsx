'use client';

import { useState } from 'react';
import { Star, User, ThumbsUp, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { toPersianNumbers } from '@/lib/utils/persianNumbers';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

export default function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      userName: 'علی محمدی',
      rating: 5,
      comment: 'کیف بسیار با کیفیت و زیبا. دوخت‌های آن عالی است و جای لپ‌تاپ خیلی مناسبه.',
      date: '۱۴۰۳/۰۸/۱۵',
      helpful: 12
    },
    {
      id: '2',
      userName: 'سارا احمدی',
      rating: 4,
      comment: 'کیف خوبیه ولی کمی سنگین است. به جز این موضوع، کیفیت ساخت عالیه.',
      date: '۱۴۰۳/۰۸/۱۰',
      helpful: 8
    },
    {
      id: '3',
      userName: 'رضا کریمی',
      rating: 5,
      comment: 'عالی! دقیقاً همون چیزی بود که می‌خواستم. ارسال هم سریع بود.',
      date: '۱۴۰۳/۰۸/۰۵',
      helpful: 15
    }
  ]);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    userName: '',
    rating: 5,
    comment: ''
  });

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: reviews.length > 0
      ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100)
      : 0
  }));

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newReview.userName.trim() || !newReview.comment.trim()) {
      toast.error('لطفاً تمام فیلدها را پر کنید');
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      userName: newReview.userName,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toLocaleDateString('fa-IR'),
      helpful: 0
    };

    setReviews([review, ...reviews]);
    setNewReview({ userName: '', rating: 5, comment: '' });
    setShowReviewForm(false);

    toast.success('نظر شما با موفقیت ثبت شد');
  };

  const handleHelpful = (reviewId: string) => {
    setReviews(reviews.map(r =>
      r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
    ));
    toast.success('از نظر شما متشکریم');
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        نظرات کاربران
      </h2>

      {/* Rating Summary */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Overall Rating */}
          <div className="text-center md:border-l border-gray-200">
            <div className="text-4xl font-bold text-primary mb-2">{toPersianNumbers(parseFloat(averageRating))}</div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(parseFloat(averageRating))
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">از {toPersianNumbers(reviews.length)} نظر</p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-14">{toPersianNumbers(star)} ستاره</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-8 text-left">{toPersianNumbers(count)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Add Review Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="h-10 px-6 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
          >
            {showReviewForm ? 'بستن فرم' : 'ثبت نظر جدید'}
          </button>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">نظر خود را بنویسید</h3>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">نام شما</label>
              <input
                type="text"
                value={newReview.userName}
                onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                className="w-full h-10 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
                placeholder="نام و نام خانوادگی"
              />
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">امتیاز شما</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="focus:outline-none p-1"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        star <= newReview.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">نظر شما</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors h-28 resize-none"
                placeholder="نظر خود را درباره این محصول بنویسید..."
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="h-10 px-6 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
              >
                ثبت نظر
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="h-10 px-6 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
              >
                انصراف
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">
            هنوز نظری ثبت نشده است. اولین نفری باشید که نظر می‌دهید!
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{review.userName}</h4>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= review.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mb-3">{review.comment}</p>

              <button
                onClick={() => handleHelpful(review.id)}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                آیا این نظر مفید بود؟ ({toPersianNumbers(review.helpful)})
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
