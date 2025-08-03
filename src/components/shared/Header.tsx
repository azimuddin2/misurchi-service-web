'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Bell,
  ShoppingBag,
  User,
  Menu,
  X,
  Phone,
  Mail,
  LogOut,
  LayoutDashboard,
  SendToBack,
  Store,
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

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
  };

  const ICONS_LINKS = (
    <>
      <Link href="/notifications">
        <Bell size={20} />
      </Link>
      <Link href="/cart">
        <ShoppingBag size={20} />
      </Link>
      <div>
        {user?.userId ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="cursor-pointer">
                <AvatarImage src={user?.image} />
                <AvatarFallback>{user.name?.slice(0, 1)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-[10px] mt-2 w-80 mr-3 p-3">
              <div>
                <Avatar className="mx-auto w-12 h-12">
                  <AvatarFallback className="bg-[#093954] text-white text-2xl">
                    {user?.name?.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center my-2">
                  <h2 className="text-lg">{user?.name}</h2>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <Link href={`/${user?.role}/profile`}>
                <DropdownMenuItem className="rounded-[5px] cursor-pointer">
                  <User />
                  <span>View Profile</span>
                </DropdownMenuItem>
              </Link>

              {user?.role === 'vendor' && (
                <>
                  <Link href="/vendor/dashboard">
                    <DropdownMenuItem className="rounded-[5px] cursor-pointer">
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/vendor/manage-offering">
                    <DropdownMenuItem className="rounded-[5px] cursor-pointer">
                      <Store />
                      <span>Manage Offerings</span>
                    </DropdownMenuItem>
                  </Link>
                </>
              )}

              {user?.role === 'user' && (
                <>
                  <Link href="/user/my-order">
                    <DropdownMenuItem className="rounded-[5px] cursor-pointer">
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/user/my-order">
                    <DropdownMenuItem className="rounded-[5px] cursor-pointer">
                      <SendToBack />
                      <span>My Order</span>
                    </DropdownMenuItem>
                  </Link>
                </>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="rounded-[5px] text-white bg-[#FF4D4F] cursor-pointer mt-2"
              >
                <LogOut />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <User className="cursor-pointer" size={20} />
        )}
      </div>
    </>
  );

  return (
    <header className="w-full shadow border-b z-auto">
      {/* Top Bar */}
      <div className="bg-[#093954] text-white text-sm  py-2">
        <div className="container mx-auto px-5 lg:px-0 flex justify-between items-center">
          <div className="lg:flex gap-6">
            <p className="flex items-center">
              <Phone size={16} />{' '}
              <span className="ml-1">+123 (456) 789-987</span>
            </p>
            <p className="flex items-center">
              {' '}
              <Mail size={16} />{' '}
              <span className="ml-1">contact@fashion.com</span>{' '}
            </p>
          </div>
          {user?.email ? (
            <div>
              <Button
                onClick={handleLogout}
                className="text-[#fff] bg-[#0d3c59e9] px-3 py-5 text-sm cursor-pointer"
              >
                <LogOut />
                <span>Sign Out</span>
              </Button>
            </div>
          ) : (
            <div className="flex justify-center items-center gap-4 ml-auto sm:ml-0">
              <Link href="/login" className="hover:underline">
                Sign In
              </Link>
              <Link href="/user-role">
                <Button className="text-[#fff] bg-[#0d3c59e9] px-3 py-5 text-sm cursor-pointer">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Nav */}
      <div className="py-3 flex justify-between items-center relative container mx-auto px-5 lg:px-0">
        {/* Left Nav (Desktop) */}
        <nav className="hidden md:flex gap-6 text-gray-600">
          {TOP_NAV_LINKS.map(({ label, href }) => (
            <NavLink key={label} label={label} href={href} />
          ))}
        </nav>

        {/* Logo */}
        <Link href="/" className="flex-shrink-0 mx-auto md:mx-0">
          <Image src={logo} alt="Logo" width={100} height={40} priority />
        </Link>

        {/* Right Icons (Desktop) */}
        <div className="hidden md:flex items-center gap-6 text-gray-600">
          {ICONS_LINKS}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Mobile Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-4 text-center text-sm font-medium px-4 py-4">
          {/* Top Nav */}
          <div className="flex flex-col gap-2 text-gray-700">
            {TOP_NAV_LINKS.map(({ label, href }) => (
              <NavLink key={label} label={label} href={href} />
            ))}
          </div>

          <hr />

          {/* Main Nav */}
          <div className="flex flex-col gap-2 text-gray-800">
            {MAIN_NAV_LINKS.map(({ label, href }) => (
              <NavLink key={label} label={label} href={href} />
            ))}
          </div>

          <hr />

          {/* Icons */}
          <div className="flex justify-center items-center gap-6 text-gray-600 mt-2">
            {ICONS_LINKS}
          </div>
        </div>
      </div>

      {/* Bottom Nav (Desktop) */}
      <div className="bg-white text-black px-4 pt-2 hidden md:block">
        <nav className="flex justify-center gap-10 font-medium text-sm">
          {MAIN_NAV_LINKS.map(({ label, href }) => (
            <NavLink key={label} label={label} href={href} />
          ))}
        </nav>
      </div>
    </header>
  );
}

// Reusable Icon Link
function IconLink({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="hover:text-black transition-colors"
    >
      {icon}
    </Link>
  );
}
