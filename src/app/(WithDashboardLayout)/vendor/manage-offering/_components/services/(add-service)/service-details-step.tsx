'use client';

import type React from 'react';
import { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowRight,
  Upload,
  X,
  PlusCircle,
  Edit,
  Trash2,
  DollarSign,
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
import { AppButton } from '@/components/shared/app-button';
import { Badge } from '@/components/ui/badge';
import { ServiceStatus } from '@/constants/service';
import { Checkbox } from '@/components/ui/checkbox';
import { TServicePricing } from '@/types/service.type';

const serviceSchema = z.object({
  name: z.string({ required_error: 'Service name is required' }),
  type: z.string({ required_error: 'Service type is required' }),
  pricing: z.object({
    duration: z.string({ required_error: 'Duration is required' }),
    price: z.string({ required_error: 'Price is required' }),
    discount: z.string().optional(),
  }),
  status: z.enum([...ServiceStatus] as [string, ...string[]], {
    required_error: 'Product status is required',
  }),
  description: z
    .string({ required_error: 'Description is required' })
    .min(100, 'Description must be at least 100 characters'),
});

interface ServiceDetailsStepProps {
  data: any;
  onNext: (data: any) => void;
}

export function ServiceDetailsStep({ data, onNext }: ServiceDetailsStepProps) {
  const [images, setImages] = useState<string[]>(data?.images || []);
  const [imageFiles, setImageFiles] = useState<File[] | []>(
    data?.imageFiles || [],
  );
  const [savedServices, setSavedServices] = useState<TServicePricing[]>(
    data?.savedServices || [],
  );
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: data?.name,
      type: data?.type,
      pricing: {
        duration: data?.pricing?.duration,
        price: data?.pricing?.price,
        discount: data?.pricing?.discount,
      },
      status: data?.status,
      description: data?.description,
    },
  });

  const calculateFinalPrice = (price: string, discount: string) => {
    const numPrice = Number.parseFloat(price) || 0;
    if (!discount || discount === 'none') return numPrice.toFixed(2);

    const discountPercent = Number.parseInt(discount.replace('%', '')) || 0;
    const discountAmount = (numPrice * discountPercent) / 100;
    const finalPrice = numPrice - discountAmount;
    return {
      original: numPrice.toFixed(2),
      discount: discountAmount.toFixed(2),
      final: finalPrice.toFixed(2),
      percentage: discountPercent,
    };
  };

  const saveServiceEntry = () => {
    const duration = form.getValues('pricing.duration');
    const price = form.getValues('pricing.price');
    const discount = form.getValues('pricing.discount') || 'none';

    if (!duration || !price || Number.parseFloat(price) <= 0) {
      form.setError('pricing.price', { message: 'Please enter a valid price' });
      return;
    }

    const priceCalc = calculateFinalPrice(price, discount);
    const finalPrice =
      typeof priceCalc === 'string' ? priceCalc : priceCalc.final;

    const newEntry: TServicePricing = {
      id: editingId || Date.now().toString(),
      duration,
      price,
      discount,
      finalPrice,
    };

    if (editingId) {
      setSavedServices((prev) =>
        prev.map((entry) => (entry.id === editingId ? newEntry : entry)),
      );
      setEditingId(null);
    } else {
      setSavedServices((prev) => [...prev, newEntry]);
    }

    // Clear form after saving
    form.setValue('pricing.duration', '30 min');
    form.setValue('pricing.discount', '');
  };

  const editServiceEntry = (entry: TServicePricing) => {
    form.setValue('pricing.duration', entry.duration);
    form.setValue('pricing.price', entry.price);
    form.setValue('pricing.discount', entry.discount);
    setEditingId(entry.id);
  };

  const deleteServiceEntry = (id: string) => {
    setSavedServices((prev) => prev.filter((entry) => entry.id !== id));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files); // Convert FileList → File[]

      // Save file objects
      setImageFiles((prev) => [...prev, ...fileArray]);

      // Generate preview URLs
      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages((prev) => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit: SubmitHandler<FieldValues> = (formData) => {
    let finalSavedServices = [...savedServices];

    // If no services are saved but pricing data exists, auto-save it
    if (
      savedServices.length === 0 &&
      formData.pricing.price &&
      Number.parseFloat(formData.pricing.price) > 0
    ) {
      const priceCalc = calculateFinalPrice(
        formData.pricing.price,
        formData.pricing.discount || 'none',
      );
      const finalPrice =
        typeof priceCalc === 'string' ? priceCalc : priceCalc.final;

      const autoSavedEntry: TServicePricing = {
        id: Date.now().toString(),
        duration: formData.pricing.duration,
        price: formData.pricing.price,
        discount: formData.pricing.discount || 'none',
        finalPrice,
      };

      finalSavedServices = [autoSavedEntry];
    }

    onNext({
      ...formData,
      images,
      imageFiles,
      savedServices: finalSavedServices,
    });
  };

  const watchedPrice = form.watch('pricing.price');
  const watchedDiscount = form.watch('pricing.discount');
  const pricePreview = watchedPrice
    ? calculateFinalPrice(watchedPrice, watchedDiscount || 'none')
    : null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Service Images */}
        <div className="space-y-4">
          <FormLabel className="text-base font-medium">
            Service Images
          </FormLabel>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <img
                  src={image || '/placeholder.svg'}
                  alt={`Service ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
            <div className="relative w-full h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <span className="text-xs text-gray-500">Add Image</span>
                </div>
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
              <FormLabel className="!text-gray-700 !text-sm font-medium">
                Service Type
              </FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-[#f5f5f5] py-6 border-none w-full rounded-sm">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beauty-wellness">
                      Beauty & Wellness
                    </SelectItem>
                    <SelectItem value="hair-styling">Hair Styling</SelectItem>
                    <SelectItem value="skincare">Skincare</SelectItem>
                    <SelectItem value="nail-care">Nail Care</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="shadow p-5 rounded-lg bg-white">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Service Pricing
          </h3>

          {/* Duration */}
          <FormField
            control={form.control}
            name="pricing.duration"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel className="!text-gray-700 !text-sm font-medium">
                  Duration
                </FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="bg-[#f5f5f5] py-6 border-none w-full rounded-sm">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30 min">30 minutes</SelectItem>
                      <SelectItem value="45 min">45 minutes</SelectItem>
                      <SelectItem value="1 hr">1 hour</SelectItem>
                      <SelectItem value="1.5 hrs">1.5 hours</SelectItem>
                      <SelectItem value="2 hrs">2 hours</SelectItem>
                      <SelectItem value="2.5 hrs">2.5 hours</SelectItem>
                      <SelectItem value="3 hrs">3 hours</SelectItem>
                      <SelectItem value="4 hrs">4 hours</SelectItem>
                      <SelectItem value="5 hrs">5 hours</SelectItem>
                      <SelectItem value="6 hrs">6 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Price */}
            <FormField
              control={form.control}
              name="pricing.price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-gray-700 !text-sm font-medium">
                    Price
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-[#f5f5f5] py-6 border-none w-full rounded-sm pl-8"
                      {...field}
                      value={field.value || ''}
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="250.00"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3ctext x='12' y='50%25' dy='0.35em' fontFamily='system-ui' fontSize='14' fill='%236b7280'%3e%24%3c/text%3e%3c/svg%3e")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'left center',
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Discount Percentage */}
            <FormField
              control={form.control}
              name="pricing.discount"
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
                        <SelectItem value="5%">5% Off</SelectItem>
                        <SelectItem value="10%">10% Off</SelectItem>
                        <SelectItem value="15%">15% Off</SelectItem>
                        <SelectItem value="20%">20% Off</SelectItem>
                        <SelectItem value="25%">25% Off</SelectItem>
                        <SelectItem value="30%">30% Off</SelectItem>
                        <SelectItem value="40%">40% Off</SelectItem>
                        <SelectItem value="50%">50% Off</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {watchedPrice && Number.parseFloat(watchedPrice) > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mb-4 border border-green-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Price Preview
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Original Price:</span>
                  <span className="font-medium">
                    ${Number.parseFloat(watchedPrice).toFixed(2)}
                  </span>
                </div>
                {watchedDiscount &&
                  watchedDiscount !== 'none' &&
                  typeof pricePreview === 'object' && (
                    <>
                      <div className="flex justify-between items-center text-sm text-red-600">
                        <span>Discount ({watchedDiscount}):</span>
                        <span>-${pricePreview?.discount}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-green-600">
                        <span>You Save:</span>
                        <span className="font-semibold">
                          ${pricePreview?.discount}
                        </span>
                      </div>
                    </>
                  )}
                <div className="flex justify-between items-center font-bold text-lg text-green-800 border-t pt-2 mt-2">
                  <span>Final Price:</span>
                  <span>
                    $
                    {typeof pricePreview === 'string'
                      ? pricePreview
                      : pricePreview?.final}
                  </span>
                </div>
              </div>
            </div>
          )}

          <Button
            type="button"
            onClick={saveServiceEntry}
            className="uppercase w-full text-[#000000] border-gray-800 bg-gradient-to-t to-[#d6fbf7] from-[#c0eae5] p-5 cursor-pointer text-sm shadow-sm rounded-sm border-b-4 border-r-4 shadow-gray-500 font-semibold hover:bg-gradient-to-t hover:to-[#c0eae5] hover:from-[#a8d5d0]"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            {editingId ? 'Update Service' : 'Save Service'}
          </Button>
        </div>

        {savedServices.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Saved Service Options ({savedServices.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm">
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
            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Total Options:</strong> {savedServices.length} pricing
                configurations saved
              </p>
            </div>
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
                        onCheckedChange={() => {
                          // Set the selected status string
                          field.onChange(status);
                        }}
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
              <FormLabel className="!text-gray-700 !text-sm font-medium">
                Service Description
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={12} // won't affect height due to default h-20
                  className="bg-[#f5f5f5] py-4 px-4 border-none rounded-sm w-full h-48"
                  placeholder="Describe your service in detail..."
                />
              </FormControl>
              <FormMessage />
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
