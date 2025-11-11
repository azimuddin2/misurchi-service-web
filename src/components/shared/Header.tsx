'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Bell,
  User,
  Menu,
  X,
  Phone,
  Mail,
  LogOut,
  LayoutDashboard,
  SendToBack,
  Store,
  NotepadText,
  ShoppingCart,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import logo from '@/assets/icons/Logo.png';
import { NavLink } from '../common/NavLink';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logout, selectCurrentUser } from '@/redux/features/auth/authSlice';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { selectCartItems } from '@/redux/features/cart/cartSlice';
import { usePathname, useRouter } from 'next/navigation';
import { protectedRoutes } from '@/constants';
import Cookies from 'js-cookie';

const TOP_NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Products', href: '/products' },
];

const MAIN_NAV_LINKS = [
  { label: 'HOME', href: '/' },
  { label: 'ABOUT US', href: '/about' },
  { label: 'CONTACT US', href: '/contact' },
  { label: 'PRICING', href: '/pricing' },
  { label: 'PROVIDERS', href: '/providers' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const cartItems = useAppSelector(selectCartItems);
  const cartCount = cartItems.length;

  const handleLogout = () => {
    dispatch(logout());
    Cookies.remove('accessToken');
    if (protectedRoutes.some((route) => pathname.match(route))) {
      router.push('/');
    }
  };

  const ICONS_LINKS = (
    <div className="flex items-center gap-4">
      {user?.email && (
        <Link href="/notifications" className="cursor-pointer">
          <Bell size={22} />
        </Link>
      )}

      {(!user || user?.role === 'user') && (
        <div
          className="relative cursor-pointer"
          onClick={() => router.push('/cart')}
        >
          <ShoppingCart size={22} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-green-700 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
      )}

      {user?.userId && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer w-8 h-8 border border-gray-300">
              <AvatarImage src={user?.image} />
              <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-xl mt-1 mr-3 w-72 p-3 shadow-lg">
            <div className="text-center">
              <Avatar className="mx-auto w-14 h-14">
                <AvatarImage src={user?.image} />
                <AvatarFallback className="bg-[#093954] text-white text-2xl">
                  {user?.name?.[0]}
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-2 text-lg font-semibold">{user?.name}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <Link href={`/${user?.role}/profile`}>
              <DropdownMenuItem className="rounded-md gap-2">
                <User size={18} /> View Profile
              </DropdownMenuItem>
            </Link>

            {user?.role === 'vendor' && (
              <>
                <Link href="/vendor/dashboard">
                  <DropdownMenuItem className="rounded-md gap-2">
                    <LayoutDashboard size={18} /> Dashboard
                  </DropdownMenuItem>
                </Link>
                <Link href="/vendor/manage-offering">
                  <DropdownMenuItem className="rounded-md gap-2">
                    <Store size={18} /> Manage Offering
                  </DropdownMenuItem>
                </Link>
              </>
            )}

            {user?.role === 'user' && (
              <>
                <Link href="/my-orders">
                  <DropdownMenuItem className="rounded-md gap-2">
                    <SendToBack size={18} /> My Orders
                  </DropdownMenuItem>
                </Link>
                <Link href="/my-bookings">
                  <DropdownMenuItem className="rounded-md gap-2">
                    <NotepadText size={18} /> My Bookings
                  </DropdownMenuItem>
                </Link>
              </>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="rounded-sm text-white bg-red-500 hover:bg-red-600 mt-2 gap-2"
            >
              <LogOut size={18} /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );

  return (
    <header className="w-full shadow border-b z-auto">
      {/* Top Contact Bar */}
      <div className="bg-[#093954] text-white text-sm py-2">
        <div className="container mx-auto px-5 lg:px-0 flex justify-between items-center">
          <div className="lg:flex gap-6">
            <p className="flex items-center gap-1">
              <Phone size={16} /> +123 (456) 789-987
            </p>
            <p className="flex items-center gap-1">
              <Mail size={16} /> contact@fashion.com
            </p>
          </div>
          {!user?.email ? (
            <div className="flex gap-4 items-center">
              <Link href="/login" className="hover:underline">
                Sign In
              </Link>
              <Link href="/user-role">
                <Button className="bg-gray-700/50 px-4 py-1 text-sm text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          ) : (
            <Button
              onClick={handleLogout}
              className="bg-[#0d3c59e9] px-3 py-1 text-sm text-white flex items-center gap-1"
            >
              <LogOut size={16} /> Logout
            </Button>
          )}
        </div>
      </div>

      {/* Main Nav */}
      <div className="flex justify-between items-center container mx-auto px-5 lg:px-0 py-3 bg-white">
        {/* Desktop Top Nav */}
        <nav className="hidden md:flex gap-6">
          {TOP_NAV_LINKS.map(({ label, href }) => (
            <NavLink key={label} label={label} href={href} />
          ))}
        </nav>

        {/* Logo Center */}
        <Link href="/" className="flex">
          <Image src={logo} alt="Logo" width={100} height={40} />
        </Link>

        {/* Right Icons Desktop */}
        <div className="hidden md:flex items-center gap-6">{ICONS_LINKS}</div>

        {/* Mobile: Icons + Menu */}
        <div className="md:hidden flex items-center gap-3">
          {ICONS_LINKS}
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="flex flex-col gap-3 text-center py-3">
            {TOP_NAV_LINKS.map(({ label, href }) => (
              <NavLink key={label} label={label} href={href} />
            ))}
            <hr />
            {MAIN_NAV_LINKS.map(({ label, href }) => (
              <NavLink key={label} label={label} href={href} />
            ))}
          </div>
        </div>
      )}

      {/* Desktop Bottom Nav */}
      <div className="hidden md:flex justify-center gap-10 bg-white py-2">
        {MAIN_NAV_LINKS.map(({ label, href }) => (
          <NavLink key={label} label={label} href={href} />
        ))}
      </div>
    </header>
  );
}
