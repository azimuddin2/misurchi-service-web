'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';

type Props = { children: React.ReactNode };

const ProtectedRoute = ({ children }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector(selectCurrentUser);

  useEffect(() => {
    if (!user) {
      router.push(`/login?redirectTo=${encodeURIComponent(pathname)}`);
    }
  }, [user, pathname, router]);

  if (!user) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
