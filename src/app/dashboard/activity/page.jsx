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


const ITEMS_PER_PAGE = 10

export default function CRMActivityTable() {
  const router = useRouter()

  const [activities, setActivities] = useState([])

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

  const paginatedActivities = sortedActivities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const totalPages = Math.ceil(sortedActivities.length / ITEMS_PER_PAGE)

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
                <span
                  className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    activity.Status === "Resolved" ? "bg-green-500" : activity.Status === "Not Resolved" ? "bg-red-500" : "bg-yellow-500"
                  }`}
                ></span>
                {activity.Status}
              </TableCell>
              <TableCell> 
                <Button onClick={() => handleView(activity["Activity ID"])}
                  style={{
                    marginRight: '10px',
                    right:"10px",
                    cursor: "pointer",

                  }}>View</Button>
                <Button onClick={() => handleUpdate(activity["Activity ID"])}>Update</Button>
               </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <div>
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
          {Math.min(currentPage * ITEMS_PER_PAGE, sortedActivities.length)} of{" "}
          {sortedActivities.length} activities
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

