"use client";
import React, { useEffect, useState } from "react";
 import {
Select,
   SelectContent,
   SelectItem,
  SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
 import {
   Table,
   TableHead,
  TableHeader,
   TableRow,
   TableCell,
   TableBody,
 } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
//import { Switch } from "@/components/ui/switch";
import {
  Wallet2,
  BarChart3,
  Bell,
  Eye,
  Search,
  Coins,
  Map,
} from "lucide-react";
// import {
//   Tooltip,
//   TooltipTrigger,
//   TooltipContent,
// } from "@/components/ui/tooltip";
// import AddCashDialog, {
//   AddCashBtn,
//   AddCoinBtn,
//   Addresbtn,
//   NotiBtn,
// } from "./buttons";
import Link from "next/link";
import { AwardIcon } from "lucide-react";

const columns = [
  "id",
  "Name",
  "Mobile No",
  "E-mail",
  "Activity Status",
  "Action",
];

export default function DataTable() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://localhost:8000/customers/");
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCustomers();
  });

  return (
    <section>
      {/* Search and Controls */}
      <div className="rounded-lg border p-4 shadow-sm space-y-4 md:space-y-0 md:flex md:justify-between md:items-center ">
        <div className="flex items-center gap-2">
          <span className="text-sm ">Show</span>
          <Select>
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm ">entries</span>
        </div>

        <div className="relative flex-1 md:max-w-xs">
          <Input
            type="search"
            placeholder="Search orders..."
            className="w-full pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 " />
        </div>
      </div>

      {/* Responsive Table/Card View */}
      <div className="hidden md:block rounded-lg border overflow-hidden ">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead key={index}>{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer, index) => (
                <TableRow key={customer.customer_id || index}>
                  <TableCell>{customer.customer_id}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="text-sm">
                          {customer.name}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p>{customer.mobile}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p>{customer.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p>{customer.activity_status}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p>{customer.action}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <p className="text-sm  text-center sm:text-left">
          Showing 1 of 50 entries
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button variant="outline">Previous</Button>
          {[1, 2, 3].map((page) => (
            <Button key={page} variant="outline">
              {page}
            </Button>
          ))}
          <Button variant="outline">Next</Button>
        </div>
      </div>
    </section>
  );
}