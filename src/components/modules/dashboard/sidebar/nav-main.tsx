'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, type LucideIcon } from 'lucide-react';

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
import { cn } from '@/lib/utils'; // Your class merging utility
import { Badge } from '@/components/ui/badge';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  currentPath: string; // ✅ Add this line
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="mb-8">
        <div>
          <h2 className="text-lg font-semibold mb-1">Fashion_Makeup</h2>
          <Badge className="capitalize rounded-full text-blue-500 border border-blue-300 bg-blue-100 hover:bg-blue-100">
            Advance Plan
          </Badge>
        </div>
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isParentActive =
            pathname === item.url ||
            item.items?.some((sub) => pathname === sub.url);

          return (
            <Collapsible key={item.title} asChild defaultOpen={isParentActive}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={cn(
                    'py-5 rounded-sm w-full text-left transition-colors',
                    isParentActive
                      ? 'hover:text-white bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 text-white font-medium'
                      : 'hover:bg-muted text-[#165940]',
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
                                    ? 'bg-gradient-to-t to-green-800 from-green-500/70 text-white font-medium'
                                    : 'hover:bg-muted text-muted-foreground',
                                )}
                              >
                                <Link href={subItem.url}>
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
