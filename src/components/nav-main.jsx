"use client"

import { 
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Separator } from "./ui/separator"
import { LayoutDashboard } from 'lucide-react'
import { UserRound } from "lucide-react"
import Link from "next/link"

export function NavMain({ items }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xl">
        <Link href={"/dashboard"}>
          CRM
        </Link>
      </SidebarGroupLabel>
      <Separator orientation="horizontal" />
      <SidebarMenu>
        <SidebarMenuItem>
          <Link href={"/dashboard"}>
            <SidebarMenuButton>
              <LayoutDashboard />
              Dashboard
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href={"/dashboard/customers"}>
            <SidebarMenuButton>
              <UserRound />
              Customers
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <Link href={item.url}>
              <SidebarMenuButton>
                {item.icon && <item.icon />}
                {item.title}
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}