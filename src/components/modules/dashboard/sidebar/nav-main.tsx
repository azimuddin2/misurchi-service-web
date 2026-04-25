'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Lock, type LucideIcon } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetVendorProfileQuery } from '@/redux/features/vendor/vendorApi';
import { useGetUserProfileQuery } from '@/redux/features/user/userApi';
import { IUser } from '@/types';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    disabled?: boolean;
    lockIcon?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
    }[];
  }[];
  currentPath: string;
}) {
  const pathname = usePathname();
  const user = useAppSelector(selectCurrentUser);
  const email = user?.vendorEmail as string;

  const { data } = useGetVendorProfileQuery(email);
  const vendor = data?.data;

  const { data: userData } = useGetUserProfileQuery(email);
  const userInfo: IUser | undefined = userData?.data;

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="mb-8">
        <div>
          <h2 className="text-lg font-semibold mb-1 capitalize">
            {vendor?.businessName}
          </h2>
          {userInfo?.subscribed ? (
            <Badge className="capitalize rounded-full text-blue-500 border border-blue-300 bg-blue-100 hover:bg-blue-100">
              {userInfo?.subscribed} Plan
            </Badge>
          ) : (
            <Badge className="capitalize rounded-full text-blue-500 border border-blue-300 bg-blue-100 hover:bg-blue-100">
              Basic Plan
            </Badge>
          )}
        </div>
      </SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => {
          const isParentActive =
            pathname === item.url ||
            item.items?.some((sub) => pathname === sub.url);

          // 🔒 Disabled item (locked for basic plan)
          if (item.disabled) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  className="py-5 rounded-sm w-full text-left opacity-50 cursor-not-allowed hover:bg-transparent text-[#165940] my-1"
                  onClick={(e) => e.preventDefault()}
                >
                  <item.icon />
                  <span className="flex-1">{item.title}</span>
                  {item.lockIcon && (
                    <Lock className="h-4 w-4 ml-auto text-muted-foreground" />
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          // ✅ Normal item
          return (
            <Collapsible key={item.title} asChild defaultOpen={true}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={cn(
                    'py-5 rounded-sm w-full text-left transition-colors',
                    isParentActive
                      ? 'hover:text-white bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 text-white font-medium'
                      : 'hover:bg-muted text-[#165940] my-1',
                  )}
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>

                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction
                        className={cn(
                          'transition-transform',
                          isParentActive && 'rotate-90',
                        )}
                      >
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => {
                          const isSubActive = pathname === subItem.url;
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                className={cn(
                                  isSubActive
                                    ? 'bg-[#ebf7ee] text-[#000000] font-medium'
                                    : 'hover:bg-muted text-muted-foreground',
                                )}
                              >
                                <Link href={subItem.url} className="mt-1">
                                  {subItem.icon && (
                                    <subItem.icon className="mr-2" />
                                  )}
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
