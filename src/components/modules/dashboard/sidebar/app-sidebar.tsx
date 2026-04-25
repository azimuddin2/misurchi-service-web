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
  MessageSquareText,
  ShieldCheck,
  FileCheck,
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

  const isVendor = user?.role === 'vendor';

  // ✅ শুধু vendor এর জন্য — team_member এর জন্য call করবে না
  const { data: userData } = useGetUserProfileQuery(user?.email as string, {
    skip: !isVendor,
  });
  const userInfo: IUser | undefined = userData?.data;
  const isAdvance = userInfo?.subscribed === 'advance';

  // ✅ permission check helper
  const can = (permission: string) =>
    user?.permissions?.includes(permission) ?? false;

  const navMain = [];

  if (isVendor) {
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
        title: 'Messages',
        url: `/vendor/messages`,
        icon: MessageCircleMore,
        disabled: false,
        lockIcon: false,
      },
      {
        title: 'Feedback History',
        url: `/vendor/feedback-history`,
        icon: MessageSquareText,
        disabled: false,
        lockIcon: false,
      },
      {
        title: 'Shared Calendar',
        url: `/vendor/shared-calendar`,
        icon: Calendar,
        disabled: !isAdvance,
        lockIcon: !isAdvance,
      },
      {
        title: 'Task Hub',
        url: `/vendor/task-hub`,
        icon: ListTodo,
        disabled: !isAdvance,
        lockIcon: !isAdvance,
      },
      {
        title: 'Team Members',
        url: `/vendor/team-members`,
        icon: UsersRound,
        disabled: !isAdvance,
        lockIcon: !isAdvance,
      },
      {
        title: 'Settings',
        url: '/vendor/settings',
        icon: Settings,
        disabled: false,
        lockIcon: false,
        items: [
          {
            title: 'Return Policy',
            url: '/vendor/settings/return-policy',
            icon: ShieldCheck,
          },
          {
            title: 'Cancellation Policy',
            url: '/vendor/settings/cancellation-policy',
            icon: FileCheck,
          },
        ],
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

  // ─────────────────────────────────────────
  // Team member menu — permissions দিয়ে filter
  // ─────────────────────────────────────────
  if (user?.role === 'team_member') {
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
    );

    if (can('create_edit_offerings')) {
      navMain.push({
        title: 'Manage Offering',
        url: `/vendor/manage-offering`,
        icon: StoreIcon,
        disabled: false,
        lockIcon: false,
      });
    }

    if (can('cancel_reschedule_appointments')) {
      navMain.push({
        title: 'Activity Center',
        url: `/vendor/activity-center`,
        icon: SquareActivity,
        disabled: false,
        lockIcon: false,
      });
    }

    if (can('respond_to_messages')) {
      navMain.push({
        title: 'Messages',
        url: `/vendor/messages`,
        icon: MessageCircleMore,
        disabled: false,
        lockIcon: false,
      });
    }

    if (can('filter_transactions')) {
      navMain.push({
        title: 'Transaction History',
        url: `/vendor/transaction-history`,
        icon: BadgeDollarSign,
        disabled: false,
        lockIcon: false,
      });
    }

    if (can('assign_tasks')) {
      navMain.push({
        title: 'Task Hub',
        url: `/vendor/task-hub`,
        icon: ListTodo,
        disabled: false,
        lockIcon: false,
      });
    }

    if (can('add_edit_users')) {
      navMain.push({
        title: 'Team Members',
        url: `/vendor/team-members`,
        icon: UsersRound,
        disabled: false,
        lockIcon: false,
      });
    }

    navMain.push({
      title: 'Back Home',
      url: '/',
      icon: Home,
      disabled: false,
      lockIcon: false,
    });
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
