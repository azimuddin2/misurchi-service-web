'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle,
  Calendar,
  Clock,
  DollarSign,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ReviewStepProps {
  data: any;
  onBack: () => void;
  onComplete: () => void;
}

export function ReviewStep({ data, onBack, onComplete }: ReviewStepProps) {
  const enabledDays = Object.entries(data.availability?.weeklySchedule || {})
    .filter(([_, schedule]: [string, any]) => schedule.enabled)
    .map(([day, schedule]: [string, any]) => ({
      day: day.charAt(0).toUpperCase() + day.slice(1),
      ...schedule,
    }));

  return (
    <div className="space-y-6">
      {/* Service Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Service Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div>
              <h3 className="font-semibold text-lg">{data.name}</h3>
              <Badge variant="secondary" className="mt-1">
                {data.type}
              </Badge>
              <p className="text-gray-600 mt-2">{data.description}</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>Duration: {data.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <span>Price: {data.price}</span>
                {data.discountPrice && (
                  <Badge variant="outline" className="text-green-600">
                    {data.discountPrice} off
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {data.images && data.images.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Service Images</h4>
              <div className="flex gap-2 overflow-x-auto">
                {data.images.map((image: string, index: number) => (
                  <img
                    key={index}
                    src={image || '/placeholder.svg'}
                    alt={`Service ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Availability Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            Availability Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Weekly Schedule</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {enabledDays.map((schedule, index) => (
                <motion.div
                  key={schedule.day}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                >
                  <span className="font-medium">{schedule.day}</span>
                  <div className="text-sm text-gray-600">
                    {schedule.startTime} - {schedule.endTime}
                    <span className="ml-2 text-green-600">
                      ({schedule.seats} seats)
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {data.availability?.holidays &&
            data.availability.holidays.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-3">Holiday Hours</h4>
                  <div className="space-y-2">
                    {data.availability.holidays.map(
                      (holiday: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                        >
                          <span className="font-medium">{holiday.date}</span>
                          <div className="text-sm text-gray-600">
                            {holiday.startTime} - {holiday.endTime}
                            <span className="ml-2 text-blue-600">
                              ({holiday.seats} seats)
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </>
            )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="lg:flex justify-between pt-4">
        <Button
          onClick={onBack}
          className="w-full lg:w-2/6 text-black border-gray-800 bg-gradient-to-t to-[#FFFFFF] from-[#FFFFFF] p-5 cursor-pointer text-sm mt-2 shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500"
        >
          <ArrowLeft />
          <span>Back to Availability</span>
        </Button>
        <Button
          onClick={onComplete}
          className="w-full lg:w-2/6 text-gray-50 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 p-5 cursor-pointer text-sm mt-2 shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500 "
        >
          <span>Publish Service</span>
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
