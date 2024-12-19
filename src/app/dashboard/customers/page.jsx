"use client"
import React from 'react'
import DataTable from './Table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink,BreadcrumbList,BreadcrumbSeparator,BreadcrumbPage } from '@/components/ui/breadcrumb'
export default function CustomerPage() {
  return (
   
    <div className="space-y-6 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <h1 className="text-2xl font-bold ">Manage Customers</h1>
      <div style={{ position: "relative", bottom:"35px",  width: "100%" }}>
        <Link href="/dashboard/customers/new">
        <Button style={{
      position: "absolute",
      top: "50%",
      right: "20px",
      transform: "translateY(-50%)",
      padding: "10px 20px",
      fontSize: "16px",
      
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",

      }}>+ Add New Customer</Button></Link>
      </div>
      <DataTable/>
    </div>
  )
}