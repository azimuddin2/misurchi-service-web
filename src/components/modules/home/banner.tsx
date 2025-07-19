'use client'

import Image from "next/image";
import socialGroupIconLift from '@/assets/images/social-group-left-icon.png';
import socialGroupIconRight from '@/assets/images/social-group-right-icon.png';
import teams from '@/assets/images/teams.png';
import { Search } from "lucide-react";

const Banner = () => {
    return (
        <div className="text-center overflow-hidden mb-16 mt-8">
            {/* Heading */}
            <div className="container mx-auto">
                <div className="relative">
                    <h2 className="text-4xl md:text-6xl font-bold">
                        Explore Featured Services <br className="hidden md:block" />
                        & Exclusive Products
                    </h2>
                    <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                        No Matter How Big or Small. Whether You're Looking for Premium Products to Enhance
                        Your Lifestyle or Expert Services to Support Your Business
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative mt-5">
                        <div className="flex items-center border rounded-full overflow-hidden shadow-sm">
                            <input
                                type="text"
                                placeholder="Search Service or Products"
                                className="w-full px-6 py-3 outline-none"
                            />
                            <button className="bg-sky-950 text-white p-3 rounded-full absolute right-0">
                                <Search className="h-5 w-5" />
                            </button>
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
            <div className="bg-[#052F4A] text-white py-4 w-full font-semibold tracking-wide overflow-hidden">
                <div className="animate-marquee whitespace-nowrap text-base sm:text-lg md:text-xl">
                    {Array(12).fill(
                        <>
                            CRYSTAL CLEANERS <span className="text-[#FF7D00] text-2xl mx-2">•</span>
                        </>
                    ).map((item, i) => (
                        <span key={i}>{item}</span>
                    ))}
                </div>

                <style jsx>{`
    .animate-marquee {
      display: inline-block;
      animation: marquee 15s linear infinite;
      white-space: nowrap;
    }

    @keyframes marquee {
      0% {
        transform: translateX(100%);
      }
      100% {
        transform: translateX(-100%);
      }
    }

    @media (max-width: 640px) {
      .animate-marquee {
        animation-duration: 25s; /* slower on small screens */
      }
    }
  `}</style>
            </div>
        </div>
    );
};

export default Banner;