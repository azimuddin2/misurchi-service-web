import { ProductStatus } from '@/constants/product';
import { z } from 'zod';

export const addProductSchema = z.object({
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

  discountPrice: z
    .string()
    .min(0, 'Discount must be at least 0')
    .max(100, "Discount can't exceed 100")
    .nullable()
    .optional(),

  colors: z
    .array(z.string())
    .min(1, { message: 'At least one color is required' })
    .nonempty({ message: 'At least one color is required' }),

  size: z.string({
    required_error: 'Size is required',
  }),

  status: z.enum([...ProductStatus] as [string, ...string[]], {
    required_error: 'Product status is required',
  }),

  description: z.string({
    required_error: 'Product description is required',
  }),
});
