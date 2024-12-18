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
  "No",
  "User Info",
  "App Info",
  "Mobile",
  "CustCode",
  "RefCode",
  "Coin/Cash",
  "Registerd On",
  "Block",
  "Action",
];

export default function DataTable() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://localhost:8000/customers/all");
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
                <TableRow key={customer._id || index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-bold">
                          {customer.userInfo.name}
                        </div>
                        <div className="text-sm opacity-50">
                          {customer.userInfo.email}
                        </div>
                        <div className="text-sm">
                          {customer.userInfo.gender},{" "}
                          {customer.userInfo.age || "N/A"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p>Platform: {customer.appInfo.platform}</p>
                      <p>OS Version: {customer.appInfo.osVersion}</p>
                      <p>App Version: {customer.appInfo.appVersion}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{customer.mobile.phone}</div>
                    <div className="text-sm opacity-50">
                      {customer.mobile.whatsApp || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>{customer.custCode}</TableCell>
                  <TableCell>{customer.refCode || "N/A"}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Coins className="mr-2 h-4 w-4" /> {customer.coin}
                      <Wallet2 className="ml-4 mr-2 h-4 w-4" /> {customer.cash}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p>Coin: {customer.coin}</p>
                      <p>Cash: {customer.cash}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={customer.block}
                      onCheckedChange={() => {
                        /* Implement block toggle */
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <AddCashBtn />
                      <AddCoinBtn />
                      <NotiBtn />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={`/dashboard/customers/view/${customer._id}`}>
                            <Button
                              variant="outline"
                              className="bg-cyan-500 hover:bg-cyan-600 text-white w-8 h-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>View Details</TooltipContent>
                      </Tooltip>
                      <Addresbtn />
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