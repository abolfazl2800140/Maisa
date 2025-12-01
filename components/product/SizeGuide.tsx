'use client';

import { useState } from 'react';
import { Ruler, X, Info } from 'lucide-react';

interface SizeGuideProps {
  category?: string;
}

export default function SizeGuide({ category }: SizeGuideProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sizeData: Record<string, { title: string; sizes: { size: string; capacity: string; dimensions: string }[] }> = {
    backpack: {
      title: 'راهنمای سایز کوله پشتی',
      sizes: [
        { size: 'کوچک', capacity: '۱۵-۲۰ لیتر', dimensions: '۴۰×۲۵×۱۵ سانتی‌متر' },
        { size: 'متوسط', capacity: '۲۰-۳۰ لیتر', dimensions: '۴۵×۳۰×۱۸ سانتی‌متر' },
        { size: 'بزرگ', capacity: '۳۰-۴۰ لیتر', dimensions: '۵۰×۳۵×۲۰ سانتی‌متر' },
      ],
    },
    'laptop-bag': {
      title: 'راهنمای سایز کیف لپ‌تاپ',
      sizes: [
        { size: '۱۳ اینچ', capacity: '-', dimensions: '۳۵×۲۵×۵ سانتی‌متر' },
        { size: '۱۵ اینچ', capacity: '-', dimensions: '۴۰×۳۰×۶ سانتی‌متر' },
        { size: '۱۷ اینچ', capacity: '-', dimensions: '۴۵×۳۵×۷ سانتی‌متر' },
      ],
    },
    'school-bag': {
      title: 'راهنمای سایز کیف مدرسه',
      sizes: [
        { size: 'ابتدایی', capacity: '۱۰-۱۵ لیتر', dimensions: '۳۵×۲۵×۱۲ سانتی‌متر' },
        { size: 'راهنمایی', capacity: '۱۵-۲۰ لیتر', dimensions: '۴۰×۳۰×۱۵ سانتی‌متر' },
        { size: 'دبیرستان', capacity: '۲۰-۲۵ لیتر', dimensions: '۴۵×۳۲×۱۸ سانتی‌متر' },
      ],
    },
  };

  const getCategoryKey = (cat?: string): string => {
    if (!cat) return 'backpack';
    if (cat.includes('laptop')) return 'laptop-bag';
    if (cat.includes('school')) return 'school-bag';
    return 'backpack';
  };

  const categoryKey = getCategoryKey(category);
  const data = sizeData[categoryKey];

  if (!data) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
      >
        <Ruler className="w-4 h-4" />
        <span>راهنمای سایز</span>
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-lg font-semibold text-gray-900">{data.title}</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="p-3 text-right text-sm font-semibold text-gray-900">سایز</th>
                        {categoryKey === 'backpack' || categoryKey === 'school-bag' ? (
                          <th className="p-3 text-right text-sm font-semibold text-gray-900">ظرفیت</th>
                        ) : null}
                        <th className="p-3 text-right text-sm font-semibold text-gray-900">ابعاد</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.sizes.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="p-3 text-sm font-medium text-primary">{item.size}</td>
                          {categoryKey === 'backpack' || categoryKey === 'school-bag' ? (
                            <td className="p-3 text-sm text-gray-600">{item.capacity}</td>
                          ) : null}
                          <td className="p-3 text-sm text-gray-600">{item.dimensions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Info Box */}
                <div className="mt-6 bg-blue-50 border border-blue-100 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-blue-500" />
                    <h3 className="text-sm font-semibold text-gray-900">نکات مهم</h3>
                  </div>
                  <ul className="space-y-1.5 text-sm text-gray-600">
                    <li>• ابعاد ذکر شده تقریبی است و ممکن است در مدل‌های مختلف کمی متفاوت باشد.</li>
                    <li>• برای انتخاب سایز مناسب، حتماً ابعاد وسایلی که قصد حمل دارید را در نظر بگیرید.</li>
                    <li>• در صورت تردید، سایز بزرگتر را انتخاب کنید.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
