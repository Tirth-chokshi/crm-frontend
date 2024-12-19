"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Bell,
  Gift,
  Activity,
  HousePlus,
  UsersRound
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { CreditCard } from "lucide-react"
import { Wallet } from "lucide-react"
import { ClipboardMinus } from "lucide-react"

const data = {
  user: {
    name: "Mr. Master Admin",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Activities",
      url: "",
      icon: Activity,
      isActive: true,
      items: [
        {
          title: "Complaints",
          url: "/dashboard/customers/complaints",
        },
        // {
        //   title: "Shops Categories",
        //   url: "/dashboard/mytro-deals/shops_categories",
        // },
        // {
        //   title: "Shops List",
        //   url: "/dashboard/mytro-deals/shops/list",
        // },
        // {
        //   title: "Deals List",
        //   url: "/dashboard/mytro-deals/deals/list",
        // },
        // {
        //   title: "Purchased Deals",
        //   url: "/dashboard/mytro-deals/purchased_deals",
        // },
      ],
    },
    
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    (<Sidebar collapsible="icon" {...props}>
      {/* <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader> */}
      <SidebarContent>
        <NavMain items={data.navMain} />        
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>  
      <SidebarRail />
    </Sidebar>)
  );
}