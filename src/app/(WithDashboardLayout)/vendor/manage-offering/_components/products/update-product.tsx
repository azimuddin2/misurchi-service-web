'use client';

import { AppButton } from '@/components/shared/app-button';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import MSWImageUploader from '@/components/ui/core/MSWImageUploader';
import ImagePreviewer from '@/components/ui/core/MSWImageUploader/ImagePreviewer';
import { Checkbox } from '@/components/ui/checkbox';
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from '@/redux/features/product/productApi';
import { toast } from 'sonner';
import { ProductStatus } from '@/constants/product';
import { updateProductSchema } from './updateProductValidation';
import { TProduct } from '@/types/product.type';
import Spinner from '@/components/shared/Spinner';
import Link from 'next/link';
import { useGetAllProductTypeQuery } from '@/redux/features/productType/productTypeApi';
import { ColorInput } from '@/components/ui/core/color-input';
import RecommendedType from '@/components/modules/recommended-type';
import SizeSelect from '@/components/ui/core/size-select';
import { TextEditor } from '@/components/ui/core/text-editor';

type Props = {
  productId: string;
};

const UpdateProduct = ({ productId }: Props) => {
  const [deleteKeys, setDeleteKeys] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[] | []>([]);
  const [imagePreview, setImagePreview] = useState<string[] | []>([]);

  const user = useAppSelector(selectCurrentUser);
  const router = useRouter();

  const { data: productTypeData } = useGetAllProductTypeQuery({});
  const { data, isLoading } = useGetProductByIdQuery(productId);
  const product: TProduct | undefined = data?.data;
  const [updateProduct] = useUpdateProductMutation();

  const form = useForm({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: '',
      productType: product?.productType || '',
      quantity: '',
      price: '',
      discountPrice: product?.discountPrice || '',
      colors: [] as string[],
      recommendedType: [] as string[],
      size: [] as string[],
      status: '',
      description: '',
    },
  });

  const {
    control,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        productType: product.productType || '',
        quantity: String(product.quantity),
        price: String(product.price),
        discountPrice: product.discountPrice || 'none',
        colors: product.colors || [],
        recommendedType: product.recommendedType || [],
        size: Array.isArray(product.size)
          ? product.size
          : product.size
            ? [product.size]
            : [],
        status: product.status ?? '',
        description: product.description ?? '',
      });
      setImagePreview(product.images?.map((img) => img.url) || []);
    }
  }, [product, form]);

  const handleDeleteImage = (key: string) => {
    setDeleteKeys((prev) => [...prev, key]);
    setImagePreview((prev) =>
      prev.filter((url) => {
        const img = product?.images?.find((img) => img.key === key);
        return img?.url !== url;
      }),
    );
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const modifiedData = {
      ...data,
      quantity: Number(data.quantity),
      price: Number(data.price),
      deleteKey: deleteKeys,
    };

    const formData = new FormData();
    formData.append('data', JSON.stringify(modifiedData));
    imageFiles.forEach((file) => formData.append('images', file));

    const toastId = toast.loading('Updating product...');
    try {
      const res = await updateProduct({
        id: productId,
        body: formData,
      }).unwrap();
      toast.success(res.message || 'Product updated successfully');
      router.push(`/vendor/manage-offering/view-product/${productId}`);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update product');
    } finally {
      toast.dismiss(toastId);
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="bg-white rounded-lg flex-grow max-w-5xl p-4 lg:p-8 shadow">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Images part */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <p className="text-primary font-medium text-base mb-3">
                Product Images
              </p>
            </div>
            <div className="flex gap-4">
              <MSWImageUploader
                setImageFiles={setImageFiles}
                setImagePreview={setImagePreview}
                label="Upload Images"
                className="w-full lg:w-fit mt-0"
              />
              <ImagePreviewer
                className="flex flex-wrap gap-4"
                setImageFiles={setImageFiles}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                currentImages={product?.images || []}
                handleDeleteImage={handleDeleteImage}
              />
            </div>
          </div>

          {/* Product Name */}
          <div className="">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="lg:mb-0 mb-5">
                  <FormLabel className="!text-gray-700 !text-base font-medium">
                    Product Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Product Name"
                      {...field}
                      value={field.value || ''}
                      className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Type */}
            <FormField
              control={form.control}
              name="productType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-gray-700 !text-sm font-medium">
                    Product Category
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || 'none'}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="bg-[#f5f5f5] py-6 border-none w-full rounded-sm">
                        <SelectValue placeholder="Select Product Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem disabled value="none">
                          Please Select Category
                        </SelectItem>
                        {productTypeData?.data?.map((productType) => (
                          <SelectItem
                            key={productType._id}
                            value={`${productType?.name}`}
                          >
                            {productType?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quantity */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="lg:mb-0 mb-5">
                  <FormLabel className="!text-gray-700 !text-base font-medium">
                    Quantity
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Quantity"
                      {...field}
                      value={field.value || ''}
                      className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="lg:mb-0 mb-5">
                  <FormLabel className="!text-gray-700 !text-base font-medium">
                    Price
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Price"
                      {...field}
                      value={field.value || ''}
                      className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Discount Price */}
            <FormField
              control={form.control}
              name="discountPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-gray-700 !text-sm font-medium">
                    Discount Percentage
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || 'none'}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="bg-[#f5f5f5] py-6 border-none w-full rounded-sm">
                        <SelectValue placeholder="Select discount" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Discount</SelectItem>
                        {Array.from({ length: 20 }, (_, i) => (i + 1) * 5).map(
                          (percent) => (
                            <SelectItem key={percent} value={`${percent}%`}>
                              {percent}% Off
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Size */}
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-gray-700 !text-base font-medium">
                    Size
                  </FormLabel>
                  <FormControl>
                    <SizeSelect
                      value={field.value || []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Recommended Type */}
            <FormField
              control={form.control}
              name="recommendedType"
              render={({ field }) => (
                <FormItem className="lg:mb-0">
                  <FormLabel className="!text-gray-700 !text-sm font-medium">
                    Recommended Type
                  </FormLabel>
                  <FormControl>
                    <RecommendedType
                      value={field.value || []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Colors */}
          <FormField
            control={form.control}
            name="colors"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="!text-gray-700 !text-base font-medium">
                  Colors
                </FormLabel>
                <FormControl>
                  <ColorInput
                    value={field.value || []}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="!text-gray-700 !text-base font-medium mt-3">
                  Status Options
                </FormLabel>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-5 lg:px-10 my-3">
                  {ProductStatus.map((status) => (
                    <FormItem
                      key={status}
                      className="flex items-center space-x-2"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value === status}
                          onCheckedChange={() => field.onChange(status)}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">{status}</FormLabel>
                    </FormItem>
                  ))}
                </div>
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="!text-gray-700 !text-base font-medium">
                  Product Description
                </FormLabel>
                <TextEditor
                  {...field}
                  name="description"
                  control={control}
                  placeholder="Enter description here..."
                  minHeight={300}
                />
              </FormItem>
            )}
          />

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <AppButton
              className="w-full text-gray-50 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80"
              content={
                <div className="flex justify-center items-center space-x-2 font-semibold">
                  <p className="font-medium">
                    {isSubmitting ? 'Updating...' : 'Update'}
                  </p>
                  <ArrowRight />
                </div>
              }
            />

            <div className="p-3 cursor-pointer text-sm mt-2 shadow-sm rounded-sm border-b-4 border-r-4 shadow-gray-500 w-full text-black border-gray-800 bg-gradient-to-t to-[#FFFFFF] from-[#FFFFFF] hover:bg-green-500/80">
              <Link
                href={`/${user?.role || 'vendor'}/manage-offering`}
                className="w-full inline-flex justify-center items-center space-x-1 font-semibold"
              >
                <span className="uppercase text-sm font-semibold">Cancel</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UpdateProduct;
