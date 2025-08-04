'use client';

import { usePathname } from 'next/navigation';
import {
  Store,
  Settings,
  LayoutDashboard,
  SendToBack,
  StoreIcon,
  UserRound,
  ListTodo,
  UsersRound,
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAppSelector(selectCurrentUser);
  const pathname = usePathname();

  const navMain = [];

  // User-only routes
  if (user?.role === 'user') {
    navMain.push(
      {
        title: 'My Order',
        url: '/user/my-order',
        icon: SendToBack,
      },
      {
        title: 'Products',
        url: '/user/listings',
        icon: Store,
        items: [
          {
            title: 'Manage Listings',
            url: '/user/listings',
          },
        ],
      },
      {
        title: 'Settings',
        url: '/user/edit-profile',
        icon: Settings,
        items: [
          {
            title: 'Edit Profile',
            url: '/user/edit-profile',
          },
          {
            title: 'View Profile',
            url: '/user/view-profile',
          },
        ],
      },
    );
  }

  // Vendor-only routes
  if (user?.role === 'vendor') {
    navMain.push(
      {
        title: 'Dashboard',
        url: `/vendor/dashboard`,
        icon: LayoutDashboard,
      },
      {
        title: 'Profile',
        url: `/vendor/profile`,
        icon: UserRound,
      },
      {
        title: 'Manage Offering',
        url: `/vendor/manage-offering`,
        icon: StoreIcon,
      },
      {
        title: 'Task Hub',
        url: `/vendor/task-hub`,
        icon: ListTodo,
      },
      {
        title: 'Team Members',
        url: `/vendor/team-members`,
        icon: UsersRound,
      },
      {
        title: 'Settings',
        url: '/vendor/edit-profile',
        icon: Settings,
        items: [
          {
            title: 'Edit Profile',
            url: '/vendor/edit-profile',
          },
          {
            title: 'View Profile',
            url: '/vendor/view-profile',
          },
        ],
      },
    );
  }

  return (
    <Sidebar className="h-full" collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <Image src={Logo} alt="Logo" width={100} height={100} />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu> */}
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} currentPath={pathname} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
