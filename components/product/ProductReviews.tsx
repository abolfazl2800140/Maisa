'use client';

import { useState } from 'react';
import { FaStar, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';

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
            date: '1403/08/15',
            helpful: 12
        },
        {
            id: '2',
            userName: 'سارا احمدی',
            rating: 4,
            comment: 'کیف خوبیه ولی کمی سنگین است. به جز این موضوع، کیفیت ساخت عالیه.',
            date: '1403/08/10',
            helpful: 8
        },
        {
            id: '3',
            userName: 'رضا کریمی',
            rating: 5,
            comment: 'عالی! دقیقاً همون چیزی بود که می‌خواستم. ارسال هم سریع بود.',
            date: '1403/08/05',
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

        toast.success('نظر شما با موفقیت ثبت شد', {
            icon: '✅',
        });
    };

    const handleHelpful = (reviewId: string) => {
        setReviews(reviews.map(r =>
            r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
        ));
        toast.success('از نظر شما متشکریم', { icon: '👍' });
    };

    return (
        <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-secondary">نظرات کاربران</h2>

            {/* Rating Summary */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Overall Rating */}
                    <div className="text-center border-l border-gray-200">
                        <div className="text-5xl font-bold text-primary mb-2">{averageRating}</div>
                        <div className="flex items-center justify-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    className={`text-xl ${star <= Math.round(parseFloat(averageRating))
                                            ? 'text-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                        <p className="text-gray-600">از {reviews.length} نظر</p>
                    </div>

                    {/* Rating Distribution */}
                    <div className="space-y-2">
                        {ratingDistribution.map(({ star, count, percentage }) => (
                            <div key={star} className="flex items-center gap-3">
                                <span className="text-sm w-12">{star} ستاره</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm text-gray-600 w-12 text-left">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add Review Button */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-dark transition-colors"
                    >
                        {showReviewForm ? 'بستن فرم' : 'ثبت نظر جدید'}
                    </button>
                </div>
            </div>

            {/* Review Form */}
            {showReviewForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h3 className="text-xl font-bold mb-4">نظر خود را بنویسید</h3>
                    <form onSubmit={handleSubmitReview}>
                        <div className="mb-4">
                            <label className="block font-semibold mb-2">نام شما:</label>
                            <input
                                type="text"
                                value={newReview.userName}
                                onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                                placeholder="نام و نام خانوادگی"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block font-semibold mb-2">امتیاز شما:</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setNewReview({ ...newReview, rating: star })}
                                        className="focus:outline-none"
                                    >
                                        <FaStar
                                            className={`text-3xl transition-colors ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block font-semibold mb-2">نظر شما:</label>
                            <textarea
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary h-32 resize-none"
                                placeholder="نظر خود را درباره این محصول بنویسید..."
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-dark transition-colors"
                            >
                                ثبت نظر
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowReviewForm(false)}
                                className="border border-gray-300 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors"
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
                    <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
                        هنوز نظری ثبت نشده است. اولین نفری باشید که نظر می‌دهید!
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                        <FaUser className="text-gray-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">{review.userName}</h4>
                                        <p className="text-sm text-gray-500">{review.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar
                                            key={star}
                                            className={`text-sm ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

                            <div className="flex items-center gap-4 text-sm">
                                <button
                                    onClick={() => handleHelpful(review.id)}
                                    className="text-gray-600 hover:text-primary transition-colors flex items-center gap-1"
                                >
                                    👍 آیا این نظر مفید بود؟ ({review.helpful})
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
