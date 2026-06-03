'use client';

import { useEffect, useState } from 'react';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  ArrowRight,
  Upload,
  X,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { AppButton } from '@/components/shared/app-button';
import { ServiceStatus } from '@/constants/service';
import { TImage, TServicePricing } from '@/types/service.type';
import { useGetAllServiceTypeQuery } from '@/redux/features/serviceType/serviceTypeApi';
import { Badge } from '@/components/ui/badge';
import RecommendedType from '@/components/modules/recommended-type';
import { TextEditor } from '@/components/ui/core/text-editor';

// ---------------- Schema ----------------
const serviceSchema = z.object({
  name: z.string({ required_error: 'Service name is required' }),
  type: z.string({ required_error: 'Service category is required' }),
  recommendedType: z.array(z.string()).optional(),
  pricing: z.object({
    duration: z.string({ required_error: 'Duration is required' }),
    price: z.string({ required_error: 'Price is required' }),
    discount: z.string().optional(),
  }),
  status: z.enum([...ServiceStatus] as [string, ...string[]]),
  description: z
    .string({
      required_error: 'Service description is required',
    })
    .refine(
      (val) => {
        const length = val
          .replace(/<[^>]*>/g, '')
          .replace(/&nbsp;/g, ' ')
          .trim().length;
        return length >= 100 && length <= 500;
      },
      { message: 'Description must be between 100 and 500 characters' },
    ),
});

// ---------------- Component ----------------
interface ServiceDetailsStepProps {
  data: any;
  onNext: (data: any) => void;
}

export function ServiceDetailsStep({ data, onNext }: ServiceDetailsStepProps) {
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [savedServices, setSavedServices] = useState<TServicePricing[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteKey, setDeleteKey] = useState<string[]>([]);

  const { data: serviceTypeData } = useGetAllServiceTypeQuery({});
  const durations = Array.from({ length: 48 }, (_, i) => (i + 1) * 30);

  const form = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      type: data?.type || '',
      recommendedType: [],
      pricing: { duration: '30 min', price: '', discount: 'none' },
      status: ServiceStatus[0],
      description: '',
    },
  });

  const { control } = form;

  // ---------------- Prefill existing data ----------------
  useEffect(() => {
    if (!data) return;
    form.reset({
      name: data.name || '',
      type: data?.type || '',
      recommendedType: data.recommendedType || [],
      description: data.description || '',
      status: data.status || ServiceStatus[0],
      pricing: {
        duration: data.pricing?.duration || '30 min',
        price: data.pricing?.price?.toString() || '',
        discount: data.pricing?.discount || 'none',
      },
    });
    setImages(data.images?.map((img: TImage) => img?.url) || []);
    setImageFiles(data.imageFiles || []);
    setSavedServices(data.savedServices || []);
  }, [data, form]);

  // ---------------- Helper ----------------
  const calculateFinalPrice = (price: string, discount: string) => {
    const numPrice = parseFloat(price) || 0;
    if (!discount || discount === 'none')
      return {
        original: numPrice.toFixed(2),
        discount: '0.00',
        final: numPrice.toFixed(2),
      };
    const discountPercent = parseInt(discount.replace('%', '')) || 0;
    const discountAmount = (numPrice * discountPercent) / 100;
    const finalPrice = numPrice - discountAmount;
    return {
      original: numPrice.toFixed(2),
      discount: discountAmount.toFixed(2),
      final: finalPrice.toFixed(2),
    };
  };

  // ---------------- Service Entry ----------------
  const saveServiceEntry = () => {
    const { duration, price, discount } = form.getValues('pricing');
    if (!price || parseFloat(price) <= 0) {
      form.setError('pricing.price', { message: 'Please enter a valid price' });
      return;
    }
    const { final } = calculateFinalPrice(price, discount || 'none');
    const newEntry: TServicePricing = {
      id: editingId || Date.now().toString(),
      duration,
      price,
      discount: discount || 'none',
      finalPrice: final,
    };
    if (editingId) {
      setSavedServices((prev) =>
        prev.map((e) => (e.id === editingId ? newEntry : e)),
      );
      setEditingId(null);
    } else setSavedServices((prev) => [...prev, newEntry]);

    form.setValue('pricing.duration', '30 min');
    form.setValue('pricing.discount', 'none');
  };

  const editServiceEntry = (entry: TServicePricing) => {
    form.setValue('pricing', {
      duration: entry.duration,
      price: entry.price,
      discount: entry.discount,
    });
    setEditingId(entry.id);
  };

  const deleteServiceEntry = (id: string) =>
    setSavedServices((prev) => prev.filter((e) => e.id !== id));

  // ---------------- Image Upload ----------------
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const arrFiles = Array.from(files);
    setImageFiles((prev) => [...prev, ...arrFiles]);
    arrFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result)
          setImages((prev) => [...prev, event.target!.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const imageUrl = images[index];
    const existingImage = data?.images?.find(
      (img: TImage) => img?.url === imageUrl,
    );
    if (existingImage) setDeleteKey((prev) => [...prev, existingImage.key]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------------- Submit ----------------
  const onSubmit: SubmitHandler<FieldValues> = (formData) => {
    let finalSavedServices = [...savedServices];
    if (savedServices.length === 0 && formData.pricing.price) {
      const { final } = calculateFinalPrice(
        formData.pricing.price,
        formData.pricing.discount || 'none',
      );
      finalSavedServices = [
        {
          id: Date.now().toString(),
          duration: formData.pricing.duration,
          price: formData.pricing.price,
          discount: formData.pricing.discount || 'none',
          finalPrice: final,
        },
      ];
    }
    onNext({
      ...formData,
      images,
      imageFiles,
      deleteKey,
      savedServices: finalSavedServices,
    });
  };

  const watchedPrice = form.watch('pricing.price');
  const watchedDiscount = form.watch('pricing.discount');
  const pricePreview = watchedPrice
    ? calculateFinalPrice(watchedPrice, watchedDiscount || 'none')
    : null;

  // ---------------- UI ----------------
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Images */}
        <div className="space-y-4">
          <FormLabel>Service Images</FormLabel>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <img
                  src={img}
                  alt={`Service ${idx}`}
                  className="w-full h-24 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
            <div className="relative w-full h-24 border-2 border-dashed rounded-lg">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-500">Add Image</span>
              </div>
            </div>
          </div>
        </div>

        {/* Service Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="!text-gray-700 !text-sm font-medium">
                Service Name
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || ''}
                  placeholder="e.g., Bridal Makeup Session"
                  className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Service Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Category</FormLabel>
              <FormControl>
                <Select
                  value={field.value || data?.type || ''}
                  onValueChange={(v) => field.onChange(v)}
                >
                  <SelectTrigger className="bg-[#f5f5f5] py-6 border-none w-full rounded-sm">
                    <SelectValue placeholder="Select service category" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypeData?.data?.map((type) => (
                      <SelectItem key={type._id} value={type.name}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

        {/* Pricing */}
        <div className="mt-5 shadow p-5 rounded-lg bg-white">
          <h3 className="text-xl mb-3">Service Pricing</h3>
          <FormField
            control={form.control}
            name="pricing.duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(v) => field.onChange(v)}
                  >
                    <SelectTrigger className="bg-[#f5f5f5] py-6 border-none w-full rounded-sm">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Undefined option */}
                      <SelectItem value="no-duration">
                        No fixed duration
                      </SelectItem>
                      {durations.map((m) => (
                        <SelectItem
                          key={m}
                          value={m >= 60 ? `${m / 60} hr` : `${m} min`}
                        >
                          {m >= 60 ? `${m / 60} hr` : `${m} min`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <FormField
              control={form.control}
              name="pricing.price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      placeholder="250.00"
                      className="bg-[#f5f5f5] py-6 border-none w-full rounded-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pricing.discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || 'none'}
                      onValueChange={(v) => field.onChange(v)}
                    >
                      <SelectTrigger className="bg-[#f5f5f5] py-6 border-none w-full rounded-sm">
                        <SelectValue placeholder="Select discount" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Discount</SelectItem>
                        {Array.from({ length: 20 }, (_, i) => (i + 1) * 5).map(
                          (p) => (
                            <SelectItem key={p} value={`${p}%`}>
                              {p}% Off
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
          </div>

          <Button
            type="button"
            onClick={saveServiceEntry}
            className="mt-5 uppercase w-full text-[#000000] border-gray-800 bg-gradient-to-t to-[#d6fbf7] from-[#c0eae5] p-5 cursor-pointer text-sm shadow-sm rounded-sm border-b-4 border-r-4 shadow-gray-500 font-semibold hover:bg-gradient-to-t hover:to-[#c0eae5] hover:from-[#a8d5d0]"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            {editingId ? 'Update Service' : 'Save Service'}
          </Button>
        </div>

        {/* Saved Services */}
        {savedServices.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Saved Service Options ({savedServices.length})
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-green-100 to-blue-100">
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Duration
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Original Price
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Discount
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Final Price
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {savedServices.map((entry, index) => (
                  <tr
                    key={entry.id}
                    className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}
                  >
                    <td className="p-4 font-medium">{entry.duration}</td>
                    <td className="p-4">
                      ${Number.parseFloat(entry.price).toFixed(2)}
                    </td>
                    <td className="p-4">
                      {entry.discount === 'none' ? (
                        <Badge variant="outline">No Discount</Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-red-100 text-red-700"
                        >
                          {entry.discount}
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 font-bold text-green-700">
                      ${entry.finalPrice}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => editServiceEntry(entry)}
                          className="h-8 w-8 p-0 hover:bg-blue-100"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => deleteServiceEntry(entry.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="!text-gray-700 !text-base font-medium">
                Status Options
              </FormLabel>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-5 lg:px-10 my-3">
                {ServiceStatus.map((status) => (
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
                    <FormLabel className="capitalize">{status}</FormLabel>
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
                control={control as any}
                placeholder="Enter description here..."
                minHeight={300}
              />
            </FormItem>
          )}
        />

        <div className="lg:flex justify-end">
          <AppButton
            className="w-full lg:w-2/6 text-gray-50 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 p-5"
            content={
              <div className="flex justify-center items-center space-x-2">
                <p className="font-medium text-sm">Continue to Availability</p>
                <ArrowRight />
              </div>
            }
          />
        </div>
      </form>
    </Form>
  );
}
