'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useAddProductMutation } from '@/redux/features/product/productApi';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AppButton } from '@/components/shared/app-button';
import MSWImageUploader from '@/components/ui/core/MSWImageUploader';
import ImagePreviewer from '@/components/ui/core/MSWImageUploader/ImagePreviewer';
import { ArrowRight, CalendarIcon, Clock, Users } from 'lucide-react';
import { ProductStatus } from '@/constants/product';

// ------------------- TYPES -------------------
type DaySchedule = {
  enabled: boolean;
  startHour: number;
  startMinute: number;
  startPeriod: 'AM' | 'PM';
  endHour: number;
  endMinute: number;
  endPeriod: 'AM' | 'PM';
  seats: number;
};

type WeeklySchedule = Record<string, DaySchedule>;

const daysOfWeek = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

// ------------------- COMPONENT -------------------
const AddService = () => {
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>(() =>
    daysOfWeek.reduce((acc, day) => {
      acc[day.key] = {
        enabled: false,
        startHour: 9,
        startMinute: 0,
        startPeriod: 'AM',
        endHour: 5,
        endMinute: 0,
        endPeriod: 'PM',
        seats: 10,
      };
      return acc;
    }, {} as WeeklySchedule),
  );

  console.log(weeklySchedule);
  const form = useForm({
    // resolver: zodResolver(addProductSchema),
  });
  const {
    formState: { isSubmitting },
  } = form;
  const [addProduct] = useAddProductMutation();

  // ------------------- HANDLERS -------------------
  const updateSchedule = (
    day: string,
    field: keyof DaySchedule,
    value: any,
  ) => {
    setWeeklySchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const formatTimeTo12Hour = (
    hour: number,
    minute: number,
    period: 'AM' | 'PM',
  ) => {
    const h = hour % 12 === 0 ? 12 : hour % 12;
    return `${h}:${String(minute).padStart(2, '0')} ${period}`;
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const formattedSchedule = Object.fromEntries(
      Object.entries(weeklySchedule).map(([day, schedule]) => [
        day,
        {
          enabled: schedule.enabled,
          startTime: formatTimeTo12Hour(
            schedule.startHour,
            schedule.startMinute,
            schedule.startPeriod,
          ),
          endTime: formatTimeTo12Hour(
            schedule.endHour,
            schedule.endMinute,
            schedule.endPeriod,
          ),
          seats: schedule.seats,
        },
      ]),
    );

    const modifiedData = {
      user: user?.userId,
      ...data,
      quantity: Number(data.quantity),
      price: Number(data.price),
      weeklySchedule: formattedSchedule,
    };

    const formData = new FormData();
    formData.append('data', JSON.stringify(modifiedData));
    imageFiles.forEach((file) => formData.append('images', file));

    try {
      console.log(modifiedData); // sent to backend
      // const res = await addProduct(formData).unwrap();
      // toast.success(res.message || 'Product added successfully');
      // router.push(`/vendor/manage-offering/view-product/${res.data?._id}`);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to add product');
    }
  };

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  // ------------------- UI -------------------
  return (
    <div className="bg-white rounded-lg flex-grow max-w-5xl p-4 lg:p-8 shadow">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Images */}
          <div className="mb-6">
            <p className="text-primary font-medium text-base mb-3">
              Product Images/Videos
            </p>
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
              />
            </div>
          </div>

          {/* Service Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Name</FormLabel>
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
                <FormLabel>Service Type</FormLabel>
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

          {/* Weekly Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-green-600" /> Weekly
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {daysOfWeek.map((day, index) => {
                const schedule = weeklySchedule[day.key];
                return (
                  <motion.div
                    key={day.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-4 p-4 rounded-lg border ${schedule.enabled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <div className="flex items-center gap-3 min-w-32">
                      <Switch
                        checked={schedule.enabled}
                        onCheckedChange={(checked) =>
                          updateSchedule(day.key, 'enabled', checked)
                        }
                      />
                      <Label>{day.label}</Label>
                    </div>

                    {schedule.enabled ? (
                      <div className="flex items-center gap-4 flex-1">
                        {/* Start Time */}
                        <div className="flex items-center gap-1">
                          <p className="text-xs">Start Time</p>
                          <Clock className="h-6 w-6" />
                          <Select
                            value={schedule.startHour.toString()}
                            onValueChange={(val) =>
                              updateSchedule(
                                day.key,
                                'startHour',
                                parseInt(val),
                              )
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {hours.map((h) => (
                                <SelectItem key={h} value={h.toString()}>
                                  {h}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span>:</span>
                          <Select
                            value={schedule.startMinute.toString()}
                            onValueChange={(val) =>
                              updateSchedule(
                                day.key,
                                'startMinute',
                                parseInt(val),
                              )
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {minutes.map((m) => (
                                <SelectItem key={m} value={m.toString()}>
                                  {String(m).padStart(2, '0')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={schedule.startPeriod}
                            onValueChange={(val) =>
                              updateSchedule(
                                day.key,
                                'startPeriod',
                                val as 'AM' | 'PM',
                              )
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AM">AM</SelectItem>
                              <SelectItem value="PM">PM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <span className="text-gray-500">to</span>

                        {/* End Time */}
                        <div className="flex items-center gap-1">
                          End Time
                          <Select
                            value={schedule.endHour.toString()}
                            onValueChange={(val) =>
                              updateSchedule(day.key, 'endHour', parseInt(val))
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {hours.map((h) => (
                                <SelectItem key={h} value={h.toString()}>
                                  {h}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span>:</span>
                          <Select
                            value={schedule.endMinute.toString()}
                            onValueChange={(val) =>
                              updateSchedule(
                                day.key,
                                'endMinute',
                                parseInt(val),
                              )
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {minutes.map((m) => (
                                <SelectItem key={m} value={m.toString()}>
                                  {String(m).padStart(2, '0')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={schedule.endPeriod}
                            onValueChange={(val) =>
                              updateSchedule(
                                day.key,
                                'endPeriod',
                                val as 'AM' | 'PM',
                              )
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AM">AM</SelectItem>
                              <SelectItem value="PM">PM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Seats */}
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <Input
                            type="number"
                            value={schedule.seats}
                            min={1}
                            onChange={(e) =>
                              updateSchedule(
                                day.key,
                                'seats',
                                parseInt(e.target.value) || 1,
                              )
                            }
                            className="w-20"
                          />
                          <span className="text-sm text-gray-500">seats</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500 italic">Closed</span>
                    )}
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status Options</FormLabel>
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    rows={8}
                    className="bg-[#f5f5f5] py-4 px-4 border-none rounded-sm w-full"
                    placeholder="Enter description here..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <AppButton
            className="w-full text-gray-50 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80"
            content={
              <div className="flex justify-center items-center space-x-2 font-semibold">
                <p>{isSubmitting ? 'Saving...' : 'Save'}</p>
                <ArrowRight />
              </div>
            }
          />
        </form>
      </Form>
    </div>
  );
};

export default AddService;
