'use client';

import type React from 'react';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowRight, Upload, X } from 'lucide-react';
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

const serviceSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  type: z.string().min(1, 'Service type is required'),
  duration: z.string().min(1, 'Duration is required'),
  price: z.string().min(1, 'Price is required'),
  discountPrice: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceDetailsStepProps {
  data: any;
  onNext: (data: any) => void;
}

export function ServiceDetailsStep({ data, onNext }: ServiceDetailsStepProps) {
  const [images, setImages] = useState<string[]>(data?.images || []);

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: data?.name || '',
      type: data?.type || '',
      duration: data?.duration || '',
      price: data?.price || '',
      discountPrice: data?.discountPrice || '',
      description: data?.description || '',
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
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
  };

  const onSubmit = (formData: ServiceFormData) => {
    onNext({ ...formData, images });
  };

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
            <label className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-green-400 transition-colors">
              <div className="text-center">
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <span className="text-xs text-gray-500">Add Image</span>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
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

        {/* Duration */}
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="!text-gray-700 !text-sm font-medium">
                Duration
              </FormLabel>
              <FormControl>
                <Input
                  className="bg-[#f5f5f5] py-6 border-none w-full rounded-sm"
                  {...field}
                  placeholder="e.g., 2 hrs"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="!text-gray-700 !text-sm font-medium">
                  Price
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-[#f5f5f5] py-6 border-none w-full rounded-sm"
                    {...field}
                    placeholder="e.g., $250"
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
                <FormLabel>Discount Price (Optional)</FormLabel>
                <FormControl>
                  <Input
                    className="bg-[#f5f5f5] py-6 border-none w-full rounded-sm"
                    {...field}
                    placeholder="e.g., 20%"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
