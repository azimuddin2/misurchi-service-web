'use client';

import { useState, useRef } from 'react';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AppButton } from '@/components/shared/app-button';
import rectangleBgImg from '@/assets/images/rectangle.png';
import { Form } from '@/components/ui/form';

const OTP_LENGTH = 4;

const VerifyOtpForm = () => {
  const form = useForm<FieldValues>();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    // Move to next input if current one is filled
    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== '');

  const onSubmit: SubmitHandler<FieldValues> = async () => {
    const otpCode = otp.join('');
    if (!isOtpComplete) return;

    try {
      console.log('Submitted OTP:', otpCode);
      // Submit OTP logic here
    } catch (error) {
      console.error('OTP Submission Error:', error);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${rectangleBgImg.src})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
      }}
      className="flex justify-center items-center min-h-screen p-4"
    >
      <div className="bg-white p-6 py-8 lg:py-10 lg:px-8 rounded-xl border shadow-md w-full max-w-lg">
        <div>
          <h3 className="text-sm text-gray-700 uppercase font-medium">
            Enter Verification Code
          </h3>
          <h2 className="text-xl lg:text-2xl font-medium mt-1 mb-6">
            Verify Your Password
          </h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* OTP Fields */}
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => {
                    inputsRef.current[index] = el;
                  }}
                  className="h-14 text-center text-xl font-bold tracking-widest border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-sm"
                />
              ))}
            </div>

            {/* Submit Button */}
            <AppButton
              disabled={!isOtpComplete}
              className={`w-full text-white border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:from-green-600 hover:to-green-900 disabled:opacity-50 disabled:cursor-not-allowed`}
              content={
                <div className="flex justify-center items-center gap-2 font-semibold">
                  <span className="uppercase">Verify</span>
                  <ArrowRight size={18} />
                </div>
              }
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyOtpForm;
