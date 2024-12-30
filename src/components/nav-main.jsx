"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LayoutDashboard, UserRound, Activity } from "lucide-react";
import Link from "next/link";

export function NavMain() {
  return (
    <TooltipProvider>
      <SidebarGroup>
        <SidebarGroupLabel className="text-xl">
          <Link href={"/dashboard"}>CRM</Link>
        </SidebarGroupLabel>
        <Separator orientation="horizontal" />
        <SidebarMenu>
          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger>
                <Link href={"/dashboard"}>
                  <SidebarMenuButton>
                    <LayoutDashboard />
                    Dashboard
                  </SidebarMenuButton>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go to Dashboard</p>
              </TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger>
                <Link href={"/dashboard/customers"}>
                  <SidebarMenuButton>
                    <UserRound />
                    Customers
                  </SidebarMenuButton>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Manage your customers</p>
              </TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger>
                <Link href={"/dashboard/activity"}>
                  <SidebarMenuButton>
                    <Activity />
                    Activities
                  </SidebarMenuButton>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>View recent activities</p>
              </TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </TooltipProvider>
  );
}
