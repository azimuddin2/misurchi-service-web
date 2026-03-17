import { ProductStatus } from '@/constants/product';
import { z } from 'zod';

export const updateProductSchema = z.object({
  name: z.string({
    required_error: 'Product name is required',
  }),

  productType: z.string({
    required_error: 'Product type is required',
  }),

  quantity: z.string({
    required_error: 'Quantity is required',
  }),

  price: z.string({
    required_error: 'Price is required',
  }),

  discountPrice: z.string().nullable().optional(),

  colors: z
    .array(z.string())
    .min(1, { message: 'Please add at least one color' }),

  recommendedType: z.array(z.string()).optional(),

  size: z
    .array(z.string())
    .min(1, { message: 'Please select at least one size' }),

  status: z.enum([...ProductStatus] as [string, ...string[]], {
    required_error: 'Please select a product status',
  }),

  description: z
    .string({
      required_error: 'Product description is required',
    })
    .refine(
      (val) =>
        val
          .replace(/<[^>]*>/g, '')
          .replace(/&nbsp;/g, ' ')
          .trim().length >= 500,
      { message: 'Description must be at least 500 characters' },
    ),
});
