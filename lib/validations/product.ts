import * as Yup from 'yup';

// پیام‌های خطای فارسی
const messages = {
  required: 'این فیلد الزامی است',
  min: (field: string, min: number) => `${field} باید حداقل ${min} کاراکتر باشد`,
  max: (field: string, max: number) => `${field} نباید بیشتر از ${max} کاراکتر باشد`,
  minNumber: (field: string, min: number) => `${field} باید حداقل ${min} باشد`,
  maxNumber: (field: string, max: number) => `${field} نباید بیشتر از ${max} باشد`,
  invalidUrl: 'آدرس URL معتبر نیست',
  invalidEmail: 'ایمیل معتبر نیست',
  invalidPhone: 'شماره تلفن معتبر نیست',
};

// Variant Schema - هماهنگ با ProductVariantDto در بک‌اند
const variantSchema = Yup.object().shape({
  color: Yup.string().nullable(),
  colorCode: Yup.string().nullable(),
  size: Yup.string().nullable(),
  stockQuantity: Yup.number()
    .min(0, messages.minNumber('موجودی', 0))
    .required(messages.required),
});

// Image Schema - هماهنگ با ProductImageDto در بک‌اند
const imageSchema = Yup.object().shape({
  url: Yup.string().required(messages.required),
  isPrimary: Yup.boolean(),
  displayOrder: Yup.number(),
});

// Product Schema - هماهنگ با CreateProductDto در بک‌اند
export const createProductSchema = Yup.object().shape({
  name: Yup.string()
    .required(messages.required)
    .min(2, messages.min('نام محصول', 2))
    .max(200, messages.max('نام محصول', 200)),
  
  slug: Yup.string()
    .max(200, messages.max('نامک', 200)),
  
  description: Yup.string()
    .max(5000, messages.max('توضیحات', 5000))
    .nullable(),
  
  categoryId: Yup.string()
    .required('انتخاب دسته‌بندی الزامی است'),
  
  brandId: Yup.string().nullable(),
  
  basePrice: Yup.number()
    .required('قیمت الزامی است')
    .min(0, messages.minNumber('قیمت', 0))
    .typeError('قیمت باید عدد باشد'),
  
  discountPercentage: Yup.number()
    .min(0, messages.minNumber('تخفیف', 0))
    .max(100, messages.maxNumber('تخفیف', 100))
    .nullable(),
  
  isFeatured: Yup.boolean(),
  isActive: Yup.boolean(),
  
  variants: Yup.array().of(variantSchema),
  images: Yup.array().of(imageSchema),
});

// Update Product Schema
export const updateProductSchema = createProductSchema.shape({
  name: Yup.string()
    .min(2, messages.min('نام محصول', 2))
    .max(200, messages.max('نام محصول', 200)),
  categoryId: Yup.string(),
  basePrice: Yup.number()
    .min(0, messages.minNumber('قیمت', 0))
    .typeError('قیمت باید عدد باشد'),
});

// Initial values for create product form
export const createProductInitialValues = {
  name: '',
  slug: '',
  description: '',
  categoryId: '',
  brandId: '',
  basePrice: '',
  discountPercentage: '0',
  isFeatured: false,
  isActive: true,
};

export type CreateProductFormValues = typeof createProductInitialValues;
