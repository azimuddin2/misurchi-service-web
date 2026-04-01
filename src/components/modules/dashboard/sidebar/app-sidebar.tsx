'use client';

import { usePathname } from 'next/navigation';
import {
  Settings,
  LayoutDashboard,
  StoreIcon,
  UserRound,
  ListTodo,
  UsersRound,
  Calendar,
  SquareActivity,
  BadgeDollarSign,
  MessageCircleMore,
  Home,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetUserProfileQuery } from '@/redux/features/user/userApi';
import { IUser } from '@/types';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAppSelector(selectCurrentUser);
  const pathname = usePathname();

  const { data: userData } = useGetUserProfileQuery(user?.email as string);
  const userInfo: IUser | undefined = userData?.data;

  const isAdvance = userInfo?.subscribed === 'advance';

  const navMain = [];

  if (user?.role === 'vendor') {
    navMain.push(
      {
        title: 'Dashboard',
        url: `/vendor/dashboard`,
        icon: LayoutDashboard,
        disabled: false,
        lockIcon: false,
      },
      {
        title: 'Profile',
        url: `/vendor/profile`,
        icon: UserRound,
        disabled: false,
        lockIcon: false,
      },
      {
        title: 'Manage Offering',
        url: `/vendor/manage-offering`,
        icon: StoreIcon,
        disabled: false,
        lockIcon: false,
      },
      {
        title: 'Activity Center',
        url: `/vendor/activity-center`,
        icon: SquareActivity,
        disabled: false,
        lockIcon: false,
      },
      {
        title: 'Transaction History',
        url: `/vendor/transaction-history`,
        icon: BadgeDollarSign,
        disabled: false,
        lockIcon: false,
      },
      {
        title: 'Refer and Earn',
        url: `/vendor/refer-and-earn`,
        icon: BadgeDollarSign,
        disabled: false,
        lockIcon: false,
      },
      {
        title: 'Messages',
        url: `/vendor/messages`,
        icon: MessageCircleMore,
        disabled: false,
        lockIcon: false,
      },
      {
        title: 'Shared Calendar',
        url: `/vendor/shared-calendar`,
        icon: Calendar,
        disabled: !isAdvance, // 🔒
        lockIcon: !isAdvance,
      },
      {
        title: 'Task Hub',
        url: `/vendor/task-hub`,
        icon: ListTodo,
        disabled: !isAdvance, // 🔒
        lockIcon: !isAdvance,
      },
      {
        title: 'Team Members',
        url: `/vendor/team-members`,
        icon: UsersRound,
        disabled: !isAdvance, // 🔒
        lockIcon: !isAdvance,
      },
      {
        title: 'Settings',
        url: '/vendor/settings',
        icon: Settings,
        disabled: false,
        lockIcon: false,
      },
      {
        title: 'Back Home',
        url: '/',
        icon: Home,
        disabled: false,
        lockIcon: false,
      },
    );
  }

  return (
    <Sidebar className="h-full" collapsible="icon" {...props}>
      <SidebarHeader />
      <SidebarContent>
        <NavMain items={navMain} currentPath={pathname} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
