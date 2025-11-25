'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage, FieldProps } from 'formik';
import {
  FaArrowRight,
  FaSave,
  FaPlus,
  FaTrash,
  FaImage,
  FaStar,
  FaLink,
  FaUpload,
  FaGripVertical,
} from 'react-icons/fa';
import { adminApi } from '@/lib/api/admin';
import toast from 'react-hot-toast';
import { toPersianNumbers, formatPricePersian } from '@/lib/utils/persianNumbers';
import { updateProductSchema } from '@/lib/validations/product';

interface ProductVariant {
  id: string;
  color: string;
  colorCode: string;
  size: string;
  stockQuantity: number;
  isNew?: boolean;
}

interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
  displayOrder: number;
  isNew?: boolean;
}

// کامپوننت نمایش خطا
const FormError = ({ name }: { name: string }) => (
  <ErrorMessage name={name}>
    {(msg) => <p className="text-red-500 text-sm mt-1">{msg}</p>}
  </ErrorMessage>
);

// کامپوننت Input با استایل
const FormInput = ({
  label,
  name,
  type = 'text',
  required = false,
  placeholder = '',
  ...props
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  [key: string]: any;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <Field name={name}>
      {({ field, meta }: FieldProps) => (
        <>
          <input
            {...field}
            {...props}
            type={type}
            placeholder={placeholder}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent ${
              meta.touched && meta.error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {meta.touched && meta.error && <p className="text-red-500 text-sm mt-1">{meta.error}</p>}
        </>
      )}
    </Field>
  </div>
);


export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [initialValues, setInitialValues] = useState({
    name: '',
    slug: '',
    description: '',
    categoryId: '',
    brandId: '',
    basePrice: '',
    discountPercentage: '0',
    isFeatured: false,
    isActive: true,
  });

  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [draggedImageId, setDraggedImageId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [productId]);

  const loadData = async () => {
    try {
      const [product, categoriesData, brandsData] = await Promise.all([
        adminApi.getProduct(productId),
        adminApi.getCategories(),
        adminApi.getBrands(),
      ]);

      setCategories(categoriesData);
      setBrands(brandsData);

      setInitialValues({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        categoryId: product.category?.id || '',
        brandId: product.brand?.id || '',
        basePrice: String(product.basePrice),
        discountPercentage: String(product.discountPercentage || 0),
        isFeatured: product.isFeatured,
        isActive: product.isActive,
      });

      setVariants(
        product.variants?.map((v: any) => ({
          id: v.id,
          color: v.color || '',
          colorCode: v.colorCode || '#000000',
          size: v.size || '',
          stockQuantity: v.stockQuantity || 0,
        })) || []
      );

      setProductImages(
        product.images?.map((img: any, index: number) => ({
          id: img.id,
          url: img.imageUrl,
          isPrimary: img.isPrimary,
          displayOrder: img.displayOrder ?? index,
        })) || []
      );
    } catch (error: any) {
      toast.error('خطا در دریافت اطلاعات محصول');
      router.push('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
    try {
      const productData = {
        name: values.name,
        slug: values.slug,
        description: values.description,
        categoryId: values.categoryId,
        brandId: values.brandId || undefined,
        basePrice: Number(values.basePrice),
        discountPercentage: Number(values.discountPercentage),
        isFeatured: values.isFeatured,
        isActive: values.isActive,
        variants: variants.filter((v) => v.color || v.size).map((v) => ({
          id: v.isNew ? undefined : v.id,
          color: v.color,
          colorCode: v.colorCode,
          size: v.size,
          stockQuantity: v.stockQuantity,
        })),
        images: productImages.map((img) => ({
          id: img.isNew ? undefined : img.id,
          imageUrl: img.url,
          isPrimary: img.isPrimary,
          displayOrder: img.displayOrder,
        })),
      };

      await adminApi.updateProduct(productId, productData);
      toast.success('محصول با موفقیت ویرایش شد');
      router.push('/admin/products');
    } catch (error: any) {
      toast.error(error.message || 'خطا در ویرایش محصول');
      setSubmitting(false);
    }
  };

  // Variant functions
  const addVariant = () => {
    setVariants([
      ...variants,
      { id: Date.now().toString(), color: '', colorCode: '#000000', size: '', stockQuantity: 0, isNew: true },
    ]);
  };

  const removeVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const updateVariant = (id: string, field: string, value: any) => {
    setVariants(variants.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  };

  // Image functions
  const addImageByUrl = () => {
    if (!newImageUrl.trim()) {
      toast.error('لطفاً آدرس تصویر را وارد کنید');
      return;
    }

    try {
      new URL(newImageUrl);
    } catch {
      toast.error('آدرس تصویر معتبر نیست');
      return;
    }

    const newImage: ProductImage = {
      id: Date.now().toString(),
      url: newImageUrl.trim(),
      isPrimary: productImages.length === 0,
      displayOrder: productImages.length,
      isNew: true,
    };

    setProductImages([...productImages, newImage]);
    setNewImageUrl('');
    toast.success('تصویر اضافه شد');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file.type.startsWith('image/')) {
        toast.error(`فایل ${file.name} یک تصویر نیست`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`حجم فایل ${file.name} بیشتر از ۵ مگابایت است`);
        continue;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const newImage: ProductImage = {
          id: Date.now().toString() + i,
          url: base64,
          isPrimary: productImages.length === 0 && i === 0,
          displayOrder: productImages.length + i,
          isNew: true,
        };
        setProductImages((prev) => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('تصاویر اضافه شدند');
  };

  const removeImage = (id: string) => {
    const imageToRemove = productImages.find((img) => img.id === id);
    const newImages = productImages.filter((img) => img.id !== id);

    if (imageToRemove?.isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }

    newImages.forEach((img, index) => {
      img.displayOrder = index;
    });

    setProductImages(newImages);
  };

  const setPrimaryImage = (id: string) => {
    setProductImages(
      productImages.map((img) => ({
        ...img,
        isPrimary: img.id === id,
      }))
    );
  };

  const handleDragStart = (id: string) => {
    setDraggedImageId(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedImageId || draggedImageId === targetId) return;

    const draggedIndex = productImages.findIndex((img) => img.id === draggedImageId);
    const targetIndex = productImages.findIndex((img) => img.id === targetId);

    const newImages = [...productImages];
    const [draggedImage] = newImages.splice(draggedIndex, 1);
    newImages.splice(targetIndex, 0, draggedImage);

    newImages.forEach((img, index) => {
      img.displayOrder = index;
    });

    setProductImages(newImages);
  };

  const handleDragEnd = () => {
    setDraggedImageId(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {/* سربرگ */}
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg">
          <FaArrowRight size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">ویرایش محصول</h1>
          <p className="text-gray-600 mt-1">{initialValues.name}</p>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={updateProductSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {({ isSubmitting, values, errors, touched }) => {
          const finalPrice = values.basePrice
            ? Number(values.basePrice) * (1 - Number(values.discountPercentage) / 100)
            : 0;

          return (
            <Form className="space-y-6">
              {/* اطلاعات اصلی */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">اطلاعات محصول</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <FormInput label="نام محصول" name="name" required />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
                    <Field
                      as="textarea"
                      name="description"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <FormError name="description" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      دسته‌بندی <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      name="categoryId"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent ${
                        touched.categoryId && errors.categoryId ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">انتخاب کنید</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </Field>
                    <FormError name="categoryId" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">برند</label>
                    <Field
                      as="select"
                      name="brandId"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">انتخاب کنید</option>
                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </Field>
                  </div>
                </div>
              </div>

              {/* قیمت */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">قیمت</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label="قیمت (تومان)" name="basePrice" type="number" required />
                  <FormInput label="تخفیف (درصد)" name="discountPercentage" type="number" min="0" max="100" />
                </div>

                {values.basePrice && (
                  <div className="mt-4 p-4 bg-primary/5 rounded-xl">
                    <p className="text-sm text-gray-600">قیمت نهایی:</p>
                    <p className="text-2xl font-bold text-primary">{formatPricePersian(finalPrice)} تومان</p>
                  </div>
                )}
              </div>

              {/* تصاویر محصول */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  <FaImage className="inline-block ml-2" />
                  تصاویر محصول
                </h2>

                {/* آپلود فایل */}
                <div className="mb-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <FaUpload className="text-2xl text-primary" />
                      </div>
                      <div>
                        <p className="text-gray-700 font-medium">برای آپلود تصویر کلیک کنید</p>
                        <p className="text-sm text-gray-500 mt-1">فرمت‌های مجاز: JPG, PNG, WebP - حداکثر ۵ مگابایت</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* افزودن با URL */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaLink className="inline-block ml-1" />
                    یا آدرس تصویر را وارد کنید
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={addImageByUrl}
                      className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors flex items-center gap-2"
                    >
                      <FaPlus />
                      افزودن
                    </button>
                  </div>
                </div>

                {/* پیش‌نمایش تصاویر */}
                {productImages.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-3">
                      {toPersianNumbers(productImages.length)} تصویر - برای تغییر ترتیب، تصاویر را بکشید
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {productImages
                        .sort((a, b) => a.displayOrder - b.displayOrder)
                        .map((image) => (
                          <div
                            key={image.id}
                            draggable
                            onDragStart={() => handleDragStart(image.id)}
                            onDragOver={(e) => handleDragOver(e, image.id)}
                            onDragEnd={handleDragEnd}
                            className={`relative group border-2 rounded-xl overflow-hidden cursor-move transition-all ${
                              image.isPrimary ? 'border-primary ring-2 ring-primary/30' : 'border-gray-200'
                            } ${draggedImageId === image.id ? 'opacity-50' : ''}`}
                          >
                            <div className="aspect-square relative bg-gray-100">
                              <img
                                src={image.url}
                                alt="تصویر محصول"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                }}
                              />

                              <div className="absolute top-2 right-2 bg-white/80 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                <FaGripVertical className="text-gray-500" />
                              </div>

                              {image.isPrimary && (
                                <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                  <FaStar size={10} />
                                  اصلی
                                </div>
                              )}

                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                {!image.isPrimary && (
                                  <button
                                    type="button"
                                    onClick={() => setPrimaryImage(image.id)}
                                    className="p-2 bg-white text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                                    title="تنظیم به عنوان تصویر اصلی"
                                  >
                                    <FaStar />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => removeImage(image.id)}
                                  className="p-2 bg-white text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                                  title="حذف تصویر"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </div>

                            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                              {toPersianNumbers(image.displayOrder + 1)}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {productImages.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FaImage className="mx-auto text-4xl mb-2 opacity-30" />
                    <p>هنوز تصویری اضافه نشده است</p>
                  </div>
                )}
              </div>


              {/* تنوع محصول */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">تنوع محصول (رنگ و سایز)</h2>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="flex items-center gap-2 text-primary hover:text-primary-dark"
                  >
                    <FaPlus />
                    <span>افزودن</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {variants.map((variant) => (
                    <div key={variant.id} className="p-4 border border-gray-200 rounded-xl">
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">رنگ</label>
                          <input
                            type="text"
                            value={variant.color}
                            onChange={(e) => updateVariant(variant.id, 'color', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="مشکی"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-600 mb-1">کد رنگ</label>
                          <input
                            type="color"
                            value={variant.colorCode}
                            onChange={(e) => updateVariant(variant.id, 'colorCode', e.target.value)}
                            className="w-full h-10 border border-gray-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-600 mb-1">سایز</label>
                          <input
                            type="text"
                            value={variant.size}
                            onChange={(e) => updateVariant(variant.id, 'size', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="بزرگ"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-600 mb-1">موجودی</label>
                          <input
                            type="number"
                            value={variant.stockQuantity}
                            onChange={(e) => updateVariant(variant.id, 'stockQuantity', Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>

                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => removeVariant(variant.id)}
                            className="w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <FaTrash className="mx-auto" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {variants.length === 0 && (
                    <p className="text-center text-gray-500 py-4">هیچ تنوعی اضافه نشده است</p>
                  )}
                </div>
              </div>

              {/* تنظیمات */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">تنظیمات</h2>
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Field type="checkbox" name="isActive" className="w-5 h-5 text-primary rounded" />
                    <span className="text-gray-700">فعال (نمایش در سایت)</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <Field type="checkbox" name="isFeatured" className="w-5 h-5 text-primary rounded" />
                    <span className="text-gray-700">محصول ویژه</span>
                  </label>
                </div>
              </div>

              {/* دکمه‌ها */}
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  <FaSave />
                  <span>{isSubmitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}</span>
                </button>
                <Link
                  href="/admin/products"
                  className="px-8 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  انصراف
                </Link>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
