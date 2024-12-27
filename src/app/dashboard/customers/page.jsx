"use client"
import React from 'react'
import DataTable from './Table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink,BreadcrumbList,BreadcrumbSeparator,BreadcrumbPage } from '@/components/ui/breadcrumb'
export default function CustomerPage() {



  const router = useRouter();

  const handleRedirect = () => {
    router.push('/dashboard/customers/bulk'); // Replace '/newpage' with your desired route
  };

  const handleNewcust = () => {
    router.push('/dashboard/customers/new'); // Replace '/newpage' with your desired route
  };

  return (
   
    <div className=" space-y-6 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <h1 className="text-2xl font-bold ">Manage Customers</h1>
      <div style={{ position: "relative", bottom:"35px",  width: "100%" }}>
     
        <Button 
        onClick={handleRedirect}
        style={{
      position: "absolute",
      top: "50%",
      right: "250px",
      transform: "translateY(-50%)",
      padding: "10px 20px",
      fontSize: "16px",
      
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",

      }}>+ Add Bulk Customer</Button>
      <Button 
        onClick={handleNewcust}
          style={{
      position: "absolute",
      top: "50%",
      right: "20px",
      transform: "translateY(-50%)",
      padding: "10px 20px",
      fontSize: "16px",
      
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",

      }}>+ Add New Customer</Button>
      </div>
      <DataTable/>
    </div>
  )
}