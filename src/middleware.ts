import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from './services/Auth';

type Role = keyof typeof roleBasedPrivateRoutes;

const authRoutes = ['/login', '/register'];

const roleBasedPrivateRoutes = {
  user: [
    /^\/user/,
    /^\/cart/,
    /^\/my-orders/,
    /^\/my-bookings/,
    /^\/schedule(\/.*)?$/,
    /^\/booking(\/.*)?$/,
    /^\/shipping-address(\/.*)?$/,
  ],
  vendor: [/^\/vendor/, /^\/pricing/],
};

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const user = await getCurrentUser();

  if (!user) {
    if (authRoutes.includes(pathname)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(
        new URL(
          `/login?redirectPath=${encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search)}`,
          request.url,
        ),
      );
    }
  }

  if (user?.role && roleBasedPrivateRoutes[user?.role as Role]) {
    const routes = roleBasedPrivateRoutes[user?.role as Role];
    if (routes.some((route) => pathname.match(route))) {
      return NextResponse.next();
    }
  }

  return NextResponse.redirect(new URL('/', request.url));
};

export const config = {
  matcher: [
    '/cart',
    '/pricing',
    '/my-orders',
    '/my-bookings',
    '/schedule/:path*',
    '/booking',
    '/shipping-address',
    '/vendor',
    '/vendor/:page*',
    '/user',
    '/user/:page',
  ],
};
