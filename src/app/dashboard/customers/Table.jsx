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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";

const columns = [
  "ID",
  "Name",
  "Mobile No",
 
  "Email",
  "Updation",
];

export default function DataTable() {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState(""); // For filtering by activity_status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10); // Default entries per page
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
  }, []);

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
      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer.customer_id !== customerId)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (customerId) => {
    router.push(`/dashboard/customers/update/${customerId}`);
  };

  // Filter customers based on search query and status
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.mobile.includes(searchQuery);
    const matchesFilter = filterStatus === "all" || filterStatus === ""
      ? true // Show all when "all" or "" is selected
      : customer.activity_status === filterStatus;
    return matchesSearch && matchesFilter;
  });
  

  // Pagination logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredCustomers.slice(indexOfFirstEntry, indexOfLastEntry);

  const totalPages = Math.ceil(filteredCustomers.length / entriesPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section>
      {/* Search and Controls */}
      <div className="rounded-lg border p-4 shadow-sm space-y-4 md:space-y-0 md:flex md:justify-between md:items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm">Show</span>
          <Select
            value={String(entriesPerPage)}
            onValueChange={(value) => setEntriesPerPage(Number(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm">entries</span>
        </div>

        <div className="flex gap-4 items-center">
        <Select
  value={filterStatus}
  onValueChange={(value) => setFilterStatus(value)}
>
  <SelectTrigger className="w-[150px]">
    <SelectValue placeholder="Filter by status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All</SelectItem>
    <SelectItem value="Active">Active</SelectItem>
    <SelectItem value="Inactive">Inactive</SelectItem>
  </SelectContent>
</Select>


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
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden mt-4">
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
              {currentEntries.length > 0 ? (
                currentEntries.map((customer, index) => (
                  <TableRow key={customer.customer_id || index}>
                    <TableCell>{customer.customer_id}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.mobile}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                   
                    <TableCell>
                      <div className="flex space-x-2 align-middle">
                        <button
                          onClick={() => handleView(customer.customer_id)}
                          className="flex items-center bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none"
                        >
                          <FontAwesomeIcon icon={faEye}  />
                          
                        </button>
                        <button
                          onClick={() => handleUpdate(customer.customer_id)}
                          className="flex items-center bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 focus:outline-none"
                        >
                          <FontAwesomeIcon icon={faEdit}  />
                          
                        </button>
                        <button
                          onClick={() => handleDelete(customer.customer_id)}
                          className="flex items-center bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none"
                          disabled={loading}
                        >
                          <FontAwesomeIcon icon={faTrash}  />
                        
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

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </section>
  );
}
