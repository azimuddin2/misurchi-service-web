'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  ArrowLeft,
  Calendar,
  Settings,
  Sparkles,
} from 'lucide-react';
import { ServiceDetailsStep } from './service-details-step';
import { AvailabilityStep } from './availability-step';
import { ReviewStep } from './review-step';
import { Progress } from '@/components/ui/progress';
import { TService } from '@/types/service.type';

const steps = [
  {
    id: 1,
    title: 'Service Details',
    description: 'Basic information about your service',
    icon: Settings,
  },
  {
    id: 2,
    title: 'Availability',
    description: 'Set your schedule and capacity',
    icon: Calendar,
  },
  {
    id: 3,
    title: 'Review & Publish',
    description: 'Review and publish your service',
    icon: Sparkles,
  },
];

export function AddService() {
  const [currentStep, setCurrentStep] = useState(1);
  const [serviceData, setServiceData] = useState<Partial<TService>>({});
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleStepComplete = (stepData: any) => {
    setServiceData((prev) => ({ ...prev, ...stepData }));

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep || completedSteps.includes(stepId)) {
      setCurrentStep(stepId);
    }
  };

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  // Database Save
  const handleDataSave = () => {
    const base64Images: string[] = serviceData.images || [];

    // Convert base64 strings to File objects
    const files: File[] = base64Images.map((base64, idx) => {
      const arr = base64.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], `image_${idx + 1}.${mime.split('/')[1]}`, {
        type: mime,
      });
    });

    // You can now append these files to FormData to send to backend
    const formData = new FormData();
    formData.append('data', JSON.stringify(serviceData)); // your other data
    files.forEach((file) => formData.append('images', file));

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // Now you can call your addProduct mutation or API
    // addProduct(formData)
  };

  return (
    <div className="px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Create New Service
        </h1>
        <p className="text-gray-600">
          Set up your service in just a few simple steps
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = completedSteps.includes(step.id);
            const isAccessible = step.id <= currentStep || isCompleted;

            return (
              <div
                key={step.id}
                className={`flex items-center cursor-pointer transition-all duration-200 ${
                  isAccessible
                    ? 'hover:scale-105'
                    : 'cursor-not-allowed opacity-50'
                }`}
                onClick={() => handleStepClick(step.id)}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? 'bg-gradient-to-t to-green-800 from-green-500/70 text-white'
                        : isActive
                          ? 'bg-green-100 text-green-600 ring-4 ring-green-100'
                          : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p
                      className={`text-sm font-medium ${isActive ? 'text-green-600' : 'text-gray-600'}`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400 max-w-24">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-4 transition-colors duration-300 ${
                      isCompleted || currentStep > step.id
                        ? 'bg-gradient-to-t to-green-800 from-green-500/70'
                        : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
        <Progress
          value={progress}
          className="h-2 [&>div]:bg-gradient-to-t [&>div]:from-green-500/70 [&>div]:to-green-600 transition-all duration-500"
        />
      </div>

      {/* Step Content */}
      <Card className="shadow border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-gray-900">
                {steps[currentStep - 1].title}
              </CardTitle>
              <p className="text-gray-600 mt-1">
                {steps[currentStep - 1].description}
              </p>
            </div>
            <Badge
              variant="outline"
              className="text-green-600 border-green-500"
            >
              Step {currentStep} of {steps.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <ServiceDetailsStep
                  data={serviceData}
                  onNext={handleStepComplete}
                />
              )}
              {currentStep === 2 && (
                <AvailabilityStep
                  data={serviceData}
                  onNext={handleStepComplete}
                  onBack={handleStepBack}
                />
              )}
              {currentStep === 3 && (
                <ReviewStep
                  data={serviceData as TService}
                  onBack={handleStepBack}
                  onComplete={handleDataSave}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center mt-8">
        <Button
          variant="outline"
          onClick={handleStepBack}
          disabled={currentStep === 1}
          className="flex items-center gap-2 bg-transparent"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>
        <div className="text-sm text-gray-500">
          {completedSteps.length} of {steps.length} steps completed
        </div>
        <div className="w-20" /> {/* Spacer for alignment */}
      </div>
    </div>
  );
}
