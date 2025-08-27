'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  Calendar,
  Clock,
  DollarSign,
  ArrowLeft,
  ArrowRight,
  Tag,
  ImageIcon,
  Star,
  Users,
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

  const savedServices = data.savedServices || [];
  const hasMultiplePricingOptions = savedServices.length > 1;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Service Review
        </h1>
        <p className="text-gray-600">
          Review your service details before publishing
        </p>
      </motion.div>

      {/* Service Overview - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="shadow border-0 bg-gradient-to-br p-0 pb-5 from-white via-blue-50/30 to-green-50/30 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500 text-white relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardTitle className="flex items-center gap-3 text-xl relative z-10  py-2">
              <div className="p-2 bg-white/20 rounded-full">
                <CheckCircle className="w-5 h-5" />
              </div>
              Service Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {data.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="secondary"
                        className="text-sm px-4 py-2 bg-gradient-to-r from-blue-100 to-green-100 text-blue-800 border-0"
                      >
                        {data.type
                          ?.replace('-', ' ')
                          .replace(/\b\w/g, (l: string) => l.toUpperCase()) ||
                          'Beauty & Wellness'}
                      </Badge>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">
                          New Service
                        </span>
                      </div>
                      <div>
                        <Badge
                          className={
                            data.status === 'available'
                              ? 'bg-green-100 text-green-800 capitalize'
                              : 'bg-gray-200 text-gray-700 capitalize'
                          }
                        >
                          {data.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 p-6 rounded-xl border border-gray-100">
                  <p className="text-gray-700 leading-relaxed text-base">
                    {data.description}
                  </p>
                </div>
              </div>
            </div>

            {data.images && data.images.length > 0 && (
              <div className="mt-8">
                <h4 className="font-bold text-xl mb-6 flex items-center gap-3 text-gray-800">
                  <div className="p-2 bg-gradient-to-r from-blue-100 to-green-100 rounded-full">
                    <ImageIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-lg font-semibold">
                    Service Gallery ({data.images.length} images)
                  </span>
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {data.images.map((image: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="group relative"
                    >
                      <img
                        src={image || '/placeholder.svg'}
                        alt={`Service ${index + 1}`}
                        className="w-full h-32 object-cover rounded-xl border-3 border-white shadow-lg group-hover:shadow-2xl transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="shadow border-0 overflow-hidden p-0">
          <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardTitle className="flex items-center gap-3 text-xl relative z-10 p-2">
              <div className="p-2 bg-white/20 rounded-full">
                <DollarSign className="w-5 h-5" />
              </div>
              Pricing Options{' '}
              {hasMultiplePricingOptions && (
                <Badge className="bg-white/20 text-white border-white/30">
                  {savedServices.length} Options Available
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            {savedServices.length > 0 ? (
              <div className="space-y-4">
                {savedServices.map((service: any, index: number) => (
                  <motion.div
                    key={service.id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-white to-gray-50/50 p-5 rounded-2xl border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-lg"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 items-center">
                      <div className="flex items-center gap-3 lg:col-span-1">
                        <div className="p-3 bg-gradient-to-r from-blue-100 to-green-100 rounded-full">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-bold text-lg">
                            {service.duration}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center gap-3 lg:col-span-1">
                        <div className="p-3 bg-gradient-to-r from-gray-100 to-blue-100 rounded-full">
                          <DollarSign className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Original Price
                          </p>
                          <p className="font-bold text-lg">
                            ${Number.parseFloat(service.price).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 lg:col-span-1">
                        {service.discount && service.discount !== 'none' ? (
                          <>
                            <div className="p-3 bg-gradient-to-r from-red-100 to-pink-100 rounded-full">
                              <Tag className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Discount</p>
                              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 text-sm px-3 py-1">
                                {service.discount} OFF
                              </Badge>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="p-3 bg-gray-100 rounded-full">
                              <Tag className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Discount</p>
                              <Badge
                                variant="outline"
                                className="text-gray-500 border-gray-300"
                              >
                                No Discount
                              </Badge>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-3 lg:col-span-2">
                        <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full">
                          <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Final Price</p>
                          <p className="font-semibold text-2xl text-green-700">
                            ${service.finalPrice}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {hasMultiplePricingOptions && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl border border-blue-200"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="font-bold text-blue-900">
                          Multiple Options Available
                        </p>
                        <p className="text-sm text-blue-700">
                          Customers can choose from {savedServices.length}{' '}
                          different pricing configurations to best suit their
                          needs.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="p-6 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <DollarSign className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No Pricing Configured
                </h3>
                <p className="text-gray-500">
                  Please go back and configure your service pricing options.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="shadow border-0 overflow-hidden p-0 pb-6">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-green-600 text-white relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardTitle className="flex items-center gap-3 text-xl relative z-10 py-2">
              <div className="p-2 bg-white/20 rounded-full">
                <Calendar className="w-5 h-5" />
              </div>
              Availability Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <h4 className="font-bold text-xl mb-6 text-gray-800">
                Weekly Schedule
              </h4>
              {enabledDays.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {enabledDays.map((schedule, index) => (
                    <motion.div
                      key={schedule.day}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br from-white to-purple-50/30 p-6 rounded-2xl border-2 border-purple-100 hover:border-purple-200 transition-all duration-300 shadow-sm hover:shadow-lg"
                    >
                      <div className="flex justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full">
                            <Calendar className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-lg text-gray-800">
                              {schedule.day}
                            </p>
                            <p className="text-sm text-gray-500">Available</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">
                            {schedule.startTime} - {schedule.endTime}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="p-6 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                    <Calendar className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No Schedule Configured
                  </h3>
                  <p className="text-gray-500">
                    Please go back and set up your availability schedule.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col lg:flex-row justify-between gap-6 pt-3"
      >
        <Button
          onClick={onBack}
          className="w-full lg:w-2/6 text-black border-gray-800 bg-gradient-to-t to-[#FFFFFF] from-[#FFFFFF] p-5 cursor-pointer text-sm mt-2 shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500 "
        >
          <ArrowLeft className="w-5 h-5 mr-3" />
          Back to Availability
        </Button>
        <Button
          onClick={onComplete}
          className="w-full lg:w-2/6 text-gray-50 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 p-5 cursor-pointer text-sm mt-2 shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500 "
        >
          Publish Service
          <ArrowRight className="w-5 h-5 ml-3" />
        </Button>
      </motion.div>
    </div>
  );
}
