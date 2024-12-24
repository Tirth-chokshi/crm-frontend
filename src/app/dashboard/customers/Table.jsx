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
import { Search } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import {useRouter} from "next/navigation";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
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
  }, [])
  const handleView = (customerId) => {
    router.push(`/dashboard/customers/${customerId}`);
  };
  
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

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.mobile.includes(searchQuery)
  );

  return (
    <section>
      {/* Search and Controls */}
      <div className="rounded-lg border p-4 shadow-sm space-y-4 md:space-y-0 md:flex md:justify-between md:items-center ">
        <div className="flex items-center gap-2">
          <span className="text-sm">Show</span>
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
          <span className="text-sm">entries</span>
        </div>

        <div className="relative flex-1 md:max-w-xs">
          <Input
            type="search"
            placeholder="Search customers..."
            className="w-full pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
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
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer, index) => (
                  <TableRow key={customer.customer_id || index}>
                    <TableCell>{customer.customer_id}</TableCell>
                    <TableCell>
                      <div className="text-sm">{customer.name}</div>
                    </TableCell>
                    <TableCell>
                      <div>{customer.mobile}</div>
                    </TableCell>
                    <TableCell>
                      <div>{customer.email}</div>
                    </TableCell>
                    <TableCell>
                      <div>{customer.activity_status}</div>
                    </TableCell>
                    <TableCell>
                      <div className="grid space-y-2">
                        <button 
                        
                        onClick={() => handleView(customer.customer_id)}
                        className="flex items-center bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none">
                          <FontAwesomeIcon icon={faEye} className="mr-2" />
                          View
                        </button>
                        <button className="flex items-center bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 focus:outline-none">
                          <FontAwesomeIcon icon={faEdit} className="mr-2" />
                          Update
                        </button>
                        <button
                          className="flex items-center bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none"
                          onClick={() => handleDelete(customer.customer_id)}
                          disabled={loading}
                        >
                          <FontAwesomeIcon icon={faTrash} className="mr-2" />
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No matching customers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}