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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'

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
  const [loading, setLoading] = useState(false);
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
  const handleDelete = async (customerId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8000/customers/${customerId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      // Remove the deleted customer from the UI
      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer.customer_id !== customerId)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
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
                    <div className="space-y-1" >
                      <p>{customer.action}</p>
                      <div className="grid space-y-2">
      {/* View Button */}
      <button className="flex items-center bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none">
        <FontAwesomeIcon icon={faEye} className="mr-2" />
        View
      </button>

      {/* Update Button */}
      <button className="flex items-center bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 focus:outline-none">
        <FontAwesomeIcon icon={faEdit} className="mr-2" />
        Update
      </button>

      {/* Delete Button */}
      <button className="flex items-center bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none  " onClick={() => handleDelete(customer.customer_id)}
                          disabled={loading}>
        <FontAwesomeIcon icon={faTrash} className="mr-2" />
        Delete
      </button>
    </div>

                     
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