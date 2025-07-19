'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bell, ShoppingBag, User, Menu, X, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/icons/Logo.png';
import { NavLink } from '../common/NavLink';

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

const ICONS = [
  { icon: <Bell size={20} />, label: 'Notifications', href: '/notifications' },
  { icon: <ShoppingBag size={20} />, label: 'Cart', href: '/cart' },
  { icon: <User size={20} />, label: 'Account', href: '/account' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="w-full shadow border-b">
      {/* Top Bar */}
      <div className="bg-[#093954] text-white text-sm  py-2">
        <div className="container mx-auto px-5 lg:px-0 flex justify-between items-center">
          <div className="lg:flex gap-6">
            <p className='flex items-center'>
              <Phone size={16} /> <span className='ml-1'>+123 (456) 789-987</span>
            </p>
            <p className='flex items-center'> <Mail size={16} /> <span className='ml-1'>contact@fashion.com</span> </p>
          </div>
          <div className="flex justify-center items-center gap-4 ml-auto sm:ml-0">
            <Link href="/login" className="hover:underline">
              Sign In
            </Link>
            <Link href="/user-role">
              <Button
                className="text-[#fff] bg-[#0d3c59e9] px-3 py-5 text-sm"
              >
                Sign Up
              </Button>
            </Link>
          </div>
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
        <div className="hidden md:flex gap-6 text-gray-600">
          {ICONS.map(({ icon, label, href }) => (
            <IconLink key={label} icon={icon} label={label} href={href} />
          ))}
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
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
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
          <div className="flex justify-center gap-6 text-gray-600 mt-2">
            {ICONS.map(({ icon, label, href }) => (
              <IconLink key={label} icon={icon} label={label} href={href} />
            ))}
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
