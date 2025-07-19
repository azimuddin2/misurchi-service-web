'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx'; // Optional, for cleaner conditional classes

export function NavLink({ label, href }: { label: string; href: string }) {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={clsx(
        'transition-colors text-base',
        isActive ? 'text-[#093954] font-semibold border-b-2 border-[#093954] px-2' : 'text-gray-500'
      )}
    >
      {label}
    </Link>
  );
}
