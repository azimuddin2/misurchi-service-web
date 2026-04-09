'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { logout } from '@/redux/features/auth/authSlice';
import Cookies from 'js-cookie';
import { protectedRoutes } from '@/constants';
import {
  User,
  ClipboardList,
  MessageCircle,
  Star,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { _id: 1, title: 'Profile Details', href: '/user/profile', icon: User },
  {
    _id: 2,
    title: 'My Request Field',
    href: '/user/request',
    icon: ClipboardList,
  },
  { _id: 3, title: 'Message', href: '/user/message', icon: MessageCircle },
  {
    _id: 4,
    title: 'Feedback History',
    href: '/user/feedback-history',
    icon: Star,
  },
  { _id: 5, title: 'Settings', href: '/user/settings', icon: Settings },
];

const UserPagesTopSection = () => {
  const pathName = usePathname();
  const currentPath = pathName?.split('/')[2];
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    Cookies.remove('accessToken');
    if (protectedRoutes.some((route) => pathName.match(route))) {
      router.push('/');
    }
  };

  return (
    <div className="relative w-full h-[220px] overflow-hidden">
      {/* bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d3d46] via-[#1a6b7a] to-[#205D67]" />
      {/* dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* bottom fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/25" />

      {/* content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6">
        {/* label */}
        <p className="text-[10px] tracking-[3px] uppercase text-white/50 font-medium flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]" />
          My Account
        </p>

        {/* nav pills */}
        <nav className="flex flex-wrap justify-center gap-2">
          {navLinks.map(({ _id, title, href, icon: Icon }) => {
            const isActive = currentPath === href.split('/')[2];
            return (
              <Link key={_id} href={href}>
                <span
                  className={cn(
                    'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm cursor-pointer transition-all duration-200 border backdrop-blur-sm uppercase font-medium',
                    isActive
                      ? 'bg-white border-green-500 text-[#0d3d46]'
                      : 'bg-white/10 text-white/85 border-white/20 hover:bg-white/22 hover:border-white/40 hover:text-white hover:-translate-y-px',
                  )}
                >
                  <Icon
                    size={14}
                    className={isActive ? 'opacity-100' : 'opacity-70'}
                  />
                  {title}
                </span>
              </Link>
            );
          })}

          {/* logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium border border-red-400/50 bg-red-500/15 text-red-300 backdrop-blur-sm transition-all duration-200 hover:bg-red-500/30 hover:border-red-400/80 hover:text-white hover:-translate-y-px uppercase"
          >
            <LogOut size={12} />
            Log Out
          </button>
        </nav>
      </div>
    </div>
  );
};

export default UserPagesTopSection;
