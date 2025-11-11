'use client';

import Image from 'next/image';
import socialGroupIconLift from '@/assets/images/social-group-left-icon.png';
import socialGroupIconRight from '@/assets/images/social-group-right-icon.png';
import teams from '@/assets/images/teams.png';
import { Search } from 'lucide-react';
import Link from 'next/link';

const Banner = () => {
  return (
    <div className="text-center overflow-hidden mb-8 lg:mb-16 mt-8">
      {/* Heading */}
      <div className="container mx-auto px-4 lg:px-0">
        <div className="relative">
          <h2 className="text-3xl md:text-6xl font-bold">
            Explore Featured Services <br className="hidden md:block" />&
            Exclusive Products
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            {
              'No Matter How Big or Small. Whether You&apos;re Looking for Premium Products to Enhance Your Lifestyle or Expert Services to Support Your Business'
            }
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative mt-5">
            <div className="flex items-center border rounded-full overflow-hidden shadow-sm">
              <input
                type="text"
                placeholder="Search Service or Products"
                className="w-full px-6 py-3 outline-none"
              />
              <Link href={'/all-products-services'}>
                <button className="bg-sky-950 text-white p-3 rounded-full absolute right-0 top-1">
                  <Search className="h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>

          {/* Brand Logos */}
          <div className="lg:block hidden">
            <div className="absolute left-4 top-10 flex flex-col items-center">
              <Image src={socialGroupIconLift} alt="Behance" />
            </div>

            <div className="absolute right-4 top-10 flex flex-col items-center">
              <Image src={socialGroupIconRight} alt="Apple" />
            </div>
          </div>

          {/* People Image */}
          <div className="relative mt-5 flex justify-center items-center">
            <Image
              src={teams}
              alt="Team"
              width={1000}
              height={900}
              className="z-10"
            />
          </div>
        </div>
      </div>

      {/* Marquee Footer */}
      <div className="w-full overflow-hidden bg-[#052F4A] py-4 relative">
        <div className="marquee flex">
          {/** Duplicate content for seamless scroll */}
          {Array(2)
            .fill(0)
            .map((_, idx) => (
              <div key={idx} className="flex whitespace-nowrap">
                {Array(12)
                  .fill(0)
                  .map((_, i) => (
                    <span
                      key={i}
                      className="flex items-center mx-4 text-base sm:text-lg md:text-xl font-semibold text-white"
                    >
                      CRYSTAL CLEANERS
                      <span className="text-[#FF7D00] text-2xl mx-2">•</span>
                    </span>
                  ))}
              </div>
            ))}
        </div>

        <style jsx>{`
          .marquee {
            display: flex;
            width: max-content;
            animation: marquee 60s linear infinite;
          }

          @keyframes marquee {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          @media (max-width: 1024px) {
            .marquee {
              animation-duration: 40s;
            }
          }

          @media (max-width: 640px) {
            .marquee {
              animation-duration: 25s;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Banner;
