"use client"

import * as React from "react"
import {
  Activity,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"

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
          title: "Manage",
          url: "/dashboard/activity",
        },
        {
          title: "History", 
          url: "/dashboard/activity/history",
        },
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