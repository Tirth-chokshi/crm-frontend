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
      title: "Mytro Deals",
      url: "",
      icon: Gift,
      isActive: true,
      items: [
        {
          title: "Deal Home Banners",
          url: "/dashboard/mytro-deals/deal_banners",
        },
        {
          title: "Shops Categories",
          url: "/dashboard/mytro-deals/shops_categories",
        },
        {
          title: "Shops List",
          url: "/dashboard/mytro-deals/shops/list",
        },
        {
          title: "Deals List",
          url: "/dashboard/mytro-deals/deals/list",
        },
        {
          title: "Purchased Deals",
          url: "/dashboard/mytro-deals/purchased_deals",
        },
      ],
    },
    {
      title: "Mytro Admin",
      icon: HousePlus,
      items: [
        {
          title: "City Zones",
          url: "/dashboard/mytro-admin/city-zones",
        },
        {
          title: "Stores",
          url: "/dashboard/mytro-admin/stores",
        },
        {
          title: "Catergories",
          url: "/dashboard/mytro-admin/categories",
        },
        {
          title: "Sub-Catergories",
          url: "/dashboard/mytro-admin/sub-categories",
        },
        {
          title: "Products",
          url: "/dashboard/mytro-admin/products",
        },
        {
          title: "Products Bulk Upload",
          url: "/dashboard/mytro-admin/products-bulk-upload",
        },
        {
          title: "Home Banners",
          url: "/dashboard/mytro-admin/home-banners",
        },
        {
          title: "Home Block Banners",
          url: "/dashboard/mytro-admin/home-block-banners",
        },
        {
          title: "Discount Coupons",
          url: "/dashboard/mytro-admin/discount-coupons",
        },
        {
          title: "Abandoned Cart",
          url: "/dashboard/mytro-admin/abandoned-cart",
        },
        {
          title: "Brands",
          url: "/dashboard/mytro-admin/brands",
        },
      ],
    },
    {
      title: "Mytro Broadcast",
      icon: Bell,
      items: [
        {
          title: "Send SMS",
          url: "/dashboard/mytro-broadcast/send-sms",
        },
        {
          title: "Notifications",
          url: "/dashboard/mytro-broadcast/notification",
        },
        {
          title: "Whatsapp Notifications",
          url: "/dashboard/mytro-broadcast/whatsapp-notifications",
        },
      ],
    },
    {
      title: "Reporting",
      icon: ClipboardMinus,
      items: [
        {
          title: "Reports 01",
          url: "/dashboard/",
          icon: ClipboardMinus,
          items: [
            {
              title: "Purchase Stock",
              url: "/dashboard/",
              icons: Settings2,
            },
            {
              title: "Sales Stock",
              url: "/dashboard/",
              icons: Settings2,
            },
            {
              title: "Sales Refund",
              url: "/dashboard/",
              icons: Settings2,
            },
            {
              title: "Expired Items",
              url: "/dashboard/",
              icons: Settings2,
            },
            {
              title: "Out of Stock Report",
              url: "/dashboard/",
              icons: Settings2,
            },
            {
              title: "Payment Collection",
              url: "/dashboard/",
              icons: Settings2,
            },
            {
              title: "Customer Reviews",
              url: "/dashboard/",
              icons: Settings2,
            },
            {
              title: "Order Report",
              url: "/dashboard/",
              icons: Settings2,
            },
            {
              title: "Couopn Code Report",
              url: "/dashboard/",
              icons: Settings2,
            },
            {
              title: "Sale Return Report",
              url: "/dashboard/",
              icons: Settings2,
            },
          ]
        },
        {
          title: "Reports 02",
          url: "/dashboard/",
          icon: ClipboardMinus,
          items: [
            {
              title: "Datawise Analytics",
              url: "/dashboard/",
              icons: Settings2,
            },
            {
              title: "Prouduct Analytics",
              url: "/dashboard/",
              icons: Settings2,
            },
            {
              title: "Monthwise Analytics",
              url: "/dashboard/",
              icons: Settings2,
            },
            {
              title: "Monthwise Sales > &quot N &quot",
              url: "/dashboard/",
              icons: Settings2,
            },
            {
              title: "Userwise Sales > &quot N &quot",
              url: "/dashboard/",
              icons: Settings2,
            },
            {
              title: "Userwise Analytics",
              url: "/dashboard/",
              icons: Settings2,
            },
            {
              title: "1st Order in Last 30 Days",
              url: "/dashboard/",
              icons: Settings2,
            },
            {
              title: "Refferal Reports",
              url: "/dashboard/",
              icons: Settings2,
            },
            {
              title: "Month & Areawise Sales",
              url: "/dashboard/",
              icons: Settings2,
            },
            {
              title: "User Activity",
              url: "/dashboard/",
              icons: Settings2,
            },
            {
              title: "Timewise Statistics",
              url: "/dashboard/",
              icons: Settings2,
            },
            {
              title: "Master Reports",
              url: "/dashboard/",
              icons: Settings2,
            },
          ]
        },
      ],
    },
    {
      title: "Wallet",
      url: "/dashboard/",
      icon: Wallet,
      items: [
        {
          title: "Cash Credit",
          url: "/dashboard/",
        },
        {
          title: "Cash Debit",
          url: "/dashboard/",
        },
        {
          title: "Ecoin Credit",
          url: "/dashboard/",
        },
        {
          title: "Ecoin Debit",
          url: "/dashboard/",
        },
      ],
    },
    {
      title: "Subscription",
      url: "/dashboard/",
      icon: CreditCard,
      items: [
        {
          title: "Reports 01",
          url: "/dashboard/",
        },
        {
          title: "Reports 02",
          url: "/dashboard/",
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