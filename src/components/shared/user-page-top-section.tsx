'use client';
import Image from 'next/image';
import React from 'react';
import topSectionBg from '@/assets/images/offer-bg.png';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
// import AnimatedArrow from "@/components/animatedArrows/AnimatedArrow";
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { toast } from 'sonner';
import { ArrowRight, LogOut } from 'lucide-react';
import { logout } from '@/redux/features/auth/authSlice';
import Cookies from 'js-cookie';
import { protectedRoutes } from '@/constants';

const navLinks = [
  {
    _id: 1,
    title: 'Profile Details',
    href: '/user/profile',
  },
  {
    _id: 2,
    title: 'My Request Field',
    href: '/user/request',
  },
  {
    _id: 3,
    title: 'Message',
    href: '/user/message',
  },
  {
    _id: 4,
    title: 'Settings',
    href: '/user/settings',
  },
];

const UserPagesTopSection = () => {
  const pathName = usePathname();
  const currentPath = pathName?.split('/')[2];
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const handleLogout = () => {
    // 1. Clear redux user state
    dispatch(logout());

    // 2. Remove cookie from client
    Cookies.remove('accessToken');

    // 3. Redirect if user is on protected routes
    if (protectedRoutes.some((route) => pathname.match(route))) {
      router.push('/');
    }
  };

  return (
    <div className="relative max-h-[240px]">
      {/* Background Image */}
      <Image
        src={topSectionBg}
        alt="bg_image"
        className="w-full max-h-[240px] min-h-[150px] object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#205D67]/80 to-[#205D67]/90"></div>

      {/* Text & Buttons */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl text-center text-white lg:text-5xl md:text-3xl text-xl font-semibold lg:px-16 md:px-10 px-2 lg:py-4 py-5 rounded-lg backdrop-blur-[4px] md:backdrop-blur-[7px]"
        style={{ background: 'rgba(0,0,0,0.12)' }} // dark semi-transparent background
      >
        <div className="flex flex-wrap justify-center items-center gap-2">
          {navLinks.map((navLink) => (
            <Link href={navLink.href} key={navLink._id}>
              <Button
                className={cn(
                  'font-medium uppercase rounded border-r-3 border-b-3 md:min-w-40 md:py-5 cursor-pointer group text-black sm:m-2 m-1 text-[10px] md:text-sm px-5 md:px-3 py-0 md:h-9 h-7 flex items-center gap-1',
                  currentPath === navLink?.href?.split('/')[2]
                    ? 'bg-gradient-to-t from-green-500/70 to-green-700 text-white border-gray-800 shadow-sm shadow-gray-500'
                    : 'bg-white hover:bg-white/30 hover:text-white border-gray-800',
                )}
              >
                {navLink.title}
                <ArrowRight className="md:size-4 size-2" />
              </Button>
            </Link>
          ))}

          <Button
            onClick={handleLogout}
            className={cn(
              'rounded border-r-3 border-b-3 uppercase md:min-w-40 md:py-5 cursor-pointer group bg-white text-red-500 sm:m-2 m-1 text-[10px] md:text-sm px-2 md:px-3 py-0 md:h-9 h-7 flex items-center gap-1 hover:bg-white/30 hover:text-white',
              'border-gray-800',
            )}
          >
            <LogOut className="md:size-4 size-3" />
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserPagesTopSection;
