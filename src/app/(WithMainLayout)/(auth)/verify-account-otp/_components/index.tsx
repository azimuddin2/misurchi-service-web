'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AppButton } from '@/components/shared/app-button';
import rectangleBgImg from '@/assets/images/rectangle.png';
import { Form } from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from '@/redux/features/otp/otpApi';
import { toast } from 'sonner';
import { TResponse } from '@/types';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';

const OTP_LENGTH = 4;
const RESEND_COOLDOWN = 60;

const VerifyAccountOtpForm = () => {
  const form = useForm<FieldValues>();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);

  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);

  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  // ── Countdown timer ──────────────────────────────────────────
  useEffect(() => {
    if (countdown === 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // ── OTP input handlers ───────────────────────────────────────
  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
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

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, OTP_LENGTH).split('');
    const updatedOtp = [...otp];
    digits.forEach((digit, i) => {
      updatedOtp[i] = digit;
    });
    setOtp(updatedOtp);
    const lastIndex = Math.min(digits.length - 1, OTP_LENGTH - 1);
    inputsRef.current[lastIndex]?.focus();
  };

  const resetOtpInputs = () => {
    setOtp(Array(OTP_LENGTH).fill(''));
    setTimeout(() => inputsRef.current[0]?.focus(), 0);
  };

  const isOtpComplete = otp.every((digit) => digit !== '');

  // ── Resend OTP ───────────────────────────────────────────────
  const handleResend = async () => {
    const email = user?.email as string;

    try {
      const res = (await resendOtp(email)) as TResponse<any>;

      if (res.error) {
        toast.error(res?.error?.data?.message || 'Failed to resend OTP.');
        return;
      }

      toast.success('A new OTP has been sent to your email.');
      resetOtpInputs();
      setCountdown(RESEND_COOLDOWN);
      setCanResend(false);
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  // ── Verify OTP ───────────────────────────────────────────────
  const onSubmit: SubmitHandler<FieldValues> = async () => {
    const otpCode = otp.join('');
    if (!isOtpComplete) return;

    try {
      const res = (await verifyOtp({ otp: otpCode })) as TResponse<
        string | any
      >;

      if (res.error) {
        toast.error(res.error.data.message);
      } else {
        if (user?.role === 'vendor') {
          toast.success(res.data.message);
          router.push('/choose-offer');
        } else if (user?.role === 'user') {
          toast.success(res.data.message);
          router.push('/user/profile');
        }
      }
    } catch (error: any) {
      const message = error?.data?.message || error?.message;
      toast.error(message);
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
      <div className="bg-white p-6 py-8 lg:py-8 lg:px-8 rounded-xl border shadow-md w-full max-w-lg">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-sm text-gray-700 uppercase font-medium">
            Enter Verification Code
          </h3>
          <h2 className="text-xl lg:text-2xl font-medium mt-1">
            Verify Your Account
          </h2>
          {user?.email && (
            <p className="text-sm text-gray-500 mt-1">
              Code sent to{' '}
              <span className="text-green-600 font-medium">{user.email}</span>
            </p>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* OTP Inputs */}
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
                  onPaste={index === 0 ? handlePaste : undefined}
                  ref={(el) => {
                    inputsRef.current[index] = el;
                  }}
                  className="h-14 text-center text-xl font-bold tracking-widest border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-sm"
                />
              ))}
            </div>

            {/* Verify Button */}
            <AppButton
              disabled={!isOtpComplete || isVerifying}
              className="w-full text-white border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:from-green-600 hover:to-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
              content={
                <div className="flex justify-center items-center gap-2 font-semibold">
                  <span className="uppercase">
                    {isVerifying ? 'Verifying...' : 'Verify'}
                  </span>
                  <ArrowRight size={18} />
                </div>
              }
            />
          </form>
        </Form>

        {/* Resend Section */}
        <div className="cursor-pointer mt-6 text-sm text-gray-500 text-center">
          <p className="text-lg mb-1">Not receive a code?</p>

          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="mx-auto block text-green-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition uppercase cursor-pointer"
            >
              {isResending ? 'Sending...' : 'Resend OTP'}
            </button>
          ) : (
            <p>
              Resend OTP in{' '}
              <span className="text-green-600 font-semibold">{countdown}s</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyAccountOtpForm;
