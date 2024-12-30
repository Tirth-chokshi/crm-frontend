"use client"

import { useEffect, useState } from "react"
import { ChevronDown, ChevronUp, Plus, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge } from "@/components/ui/badge"
const ITEMS_PER_PAGE = 10

export default function CRMActivityTable() {
  const router = useRouter()

  const [activities, setActivities] = useState([])
  const [entriesPerPage, setEntriesPerPage] = useState(10); // Default entries per page
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [sortConfig, setSortConfig] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("http://localhost:8000/activities/main")
        const data = await response.json()
        setActivities(data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchActivities()
  },[])
  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig && prevConfig.key === key) {
        return {
          ...prevConfig,
          direction:
            prevConfig.direction === "ascending" ? "descending" : "ascending",
        }
        
      }
      return { key, direction: "ascending" }
    })
  }

  const filteredActivities = activities
    .filter(
      (activity) =>
        activity["Customer Name"].toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity["Activity Type"].toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (activity) => statusFilter === "All" || activity.Status === statusFilter
    )

  const sortedActivities = sortConfig
    ? [...filteredActivities].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    : filteredActivities

  // Pagination logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const paginatedActivities = filteredActivities.slice(indexOfFirstEntry, indexOfLastEntry);

  const totalPages = Math.ceil(filteredActivities.length / entriesPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleNewActivity = () => {
    router.push("/dashboard/activity/new")
  }
  const handleView = (activityId) => {
    router.push(`/dashboard/activity/view/${activityId}`);
    console.log(customer);
  };

  // const handleUpdate = (activity_id) => {
  //   router.push(`/update/${activity_id}`);
  // };
  const handleUpdate = (activityId) => {
    console.log("Activity ID being passed:", activityId);
    router.push(`/dashboard/activity/update/${activityId}`);
  };
  const getStatusBadgeStyle = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-200 text-yellow-700";
      case "not resolved":
        return "bg-red-200 text-red-700";
      case "resolved":
        return "bg-green-200 text-green-700";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">CRM Activity Table</h1>
        <Button onClick={handleNewActivity}>
          <Plus className="mr-2 h-4 w-4" /> New Activity
        </Button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Not Resolved">Not Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {["Activity ID", "Customer Name", "Activity Type", "Date", "Status", "Updation"].map(
              (header) => (
                <TableHead
                  key={header}
                  className="cursor-pointer"
                  onClick={() => handleSort(header)}
                >
                  <div className="flex items-center">
                    {header}
                    {sortConfig?.key === header && (
                      <span className="ml-1">
                        {sortConfig.direction === "ascending" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
              )
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedActivities.map((activity) => (
            <TableRow key={activity["Activity ID"]}>
              <TableCell>{activity["Activity ID"]}</TableCell>
              <TableCell>{activity["Customer Name"]}</TableCell>
              <TableCell>{activity["Activity Type"]}</TableCell>
              <TableCell>{new Date(activity.Date).toLocaleString()}</TableCell>
              <TableCell>
                <Badge
                  className={getStatusBadgeStyle(activity.Status)}
                >
                  {activity.Status}
                </Badge>
                {/* {activity.Status} */}
              </TableCell>
              <TableCell> 
               <div className="flex space-x-2 align-middle">
                                       <button
                                         onClick={() => handleView(activity["Activity ID"])}
                                         className="flex items-center bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none"
                                       >
                                         <FontAwesomeIcon icon={faEye} className="mr-2" />
                                         
                                       </button>
                                       <button
                                         onClick={() => handleUpdate(activity["Activity ID"])}
                                         className="flex items-center bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 focus:outline-none"
                                       >
                                         <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                         
                                       </button>
                                      
                                     </div>
               </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
    </div>
  )
}

