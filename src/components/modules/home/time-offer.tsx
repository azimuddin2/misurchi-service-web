'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import offerProduct from '@/assets/images/offer.png';
import offerBackgroundImg from '@/assets/images/offer-bg.png';

const TimeOffer = () => {
  const calculateTimeLeft = () => {
    const difference = +new Date('2025-08-31T00:00:00') - +new Date();
    let timeLeft = {
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
    };

    if (difference > 0) {
      timeLeft = {
        days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(
          2,
          '0',
        ),
        hours: String(
          Math.floor((difference / (1000 * 60 * 60)) % 24),
        ).padStart(2, '0'),
        minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(
          2,
          '0',
        ),
        seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, '0'),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      style={{
        backgroundImage: `url(${offerBackgroundImg.src})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
      className="py-12 px-4 md:px-16"
    >
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-10">
        {/* Text & Countdown */}
        <div className="text-center lg:text-left">
          <h2 className="text-5xl font-semibold text-gray-900">30% OFF</h2>
          <p className="text-5xl mt-2 mb-6 text-gray-700 font-medium">
            Limited Time Offer! Don't Miss Out!
          </p>

          <div className="flex justify-center lg:justify-start gap-3 text-white text-center mb-6">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Mins', value: timeLeft.minutes },
              { label: 'Secs', value: timeLeft.seconds },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-green-800 px-4 py-3 rounded-md min-w-[70px]"
              >
                <div className="text-2xl font-semibold">{value}</div>
                <div className="text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>

          <Button
            variant="ghost"
            className="bg-[#d4f1ee] text-black text-md px-6 hover:bg-[#c0eae5]"
          >
            SHOP NOW →
          </Button>
        </div>

        {/* Product Image */}
        <div className="w-[250px] md:w-[300px] lg:w-[350px]">
          <Image
            src={offerProduct}
            alt="Offer Product"
            width={500}
            height={500}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default TimeOffer;
