"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export default function CRMActivityTable() {
  const router = useRouter();

  const [activities, setActivities] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentActivityId, setCurrentActivityId] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: "Date",
    direction: "descending",
  }); // Default sort by date
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("http://localhost:8000/activities/main");
        const data = await response.json();
        // Sort activities by date immediately after fetching
        const sortedData = [...data].sort(
          (a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime()
        );
        setActivities(sortedData);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };
    fetchActivities();
  }, []);

  const openDeleteDialog = (activityId) => {
    setCurrentActivityId(activityId);
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/activities/delete/${currentActivityId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete the activity");
      }
      setActivities((prev) =>
        prev.filter((activity) => activity["Activity ID"] !== currentActivityId)
      );
    } catch (error) {
      console.error("Error deleting activity:", error);
    } finally {
      setIsDialogOpen(false);
      setCurrentActivityId(null);
    }
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      const newDirection =
        prevConfig.key === key && prevConfig.direction === "ascending"
          ? "descending"
          : "ascending";
      return { key, direction: newDirection };
    });
  };

  // Improved filtering logic
  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      searchTerm === "" ||
      Object.values(activity).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "All" ||
      activity.Status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Improved sorting logic
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    const aValue =
      sortConfig.key === "Date"
        ? new Date(a[sortConfig.key]).getTime()
        : a[sortConfig.key];
    const bValue =
      sortConfig.key === "Date"
        ? new Date(b[sortConfig.key]).getTime()
        : b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const paginatedActivities = sortedActivities.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );
  const totalPages = Math.ceil(sortedActivities.length / entriesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNewActivity = () => {
    router.push("/dashboard/activity/new");
  };

  const handleView = (activityId) => {
    router.push(`/dashboard/activity/view/${activityId}`);
  };

  const handleUpdate = (activityId) => {
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

  const getActivityTypeBadgeStyle = (type) =>
    ({
      "Support Call": "bg-blue-100 text-blue-800",
      "Sales Call": "bg-blue-100 text-blue-800",
      "Follow-Up Call": "bg-yellow-100 text-yellow-800",
      "Complaint": "bg-red-100 text-red-800",
      "New Reg. User": "bg-green-100 text-green-800",
      "Support": "bg-green-100 text-green-800",
      "Abandoned Cart Call": "bg-orange-100 text-orange-800",
      "Old Cust. Inactive": "bg-gray-100 text-gray-800",
      "Outbound Feedback": "bg-purple-100 text-purple-800",
      "Inquiry": "bg-purple-100 text-purple-800",
    }[type] || "bg-gray-100 text-gray-800");

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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="w-64"
          />
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1); // Reset to first page on filter change
            }}
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
            {[
              "Activity ID",
              "Customer Name",
              "Activity Type",
              "Date",
              "Status",
              "Actions",
            ].map((header) => (
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
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedActivities.map((activity) => (
            <TableRow key={activity["Activity ID"]}>
              <TableCell>{activity["Activity ID"]}</TableCell>
              <TableCell>{activity["Customer Name"]}</TableCell>
              <TableCell>
                <Badge
                  className={getActivityTypeBadgeStyle(
                    activity["Activity Type"]
                  )}
                >
                  {activity["Activity Type"]}
                </Badge>
              </TableCell>
              <TableCell>{new Date(activity.Date).toLocaleString()}</TableCell>
              <TableCell>
                <Badge className={getStatusBadgeStyle(activity.Status)}>
                  {activity.Status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2 align-middle">
                  <button
                    onClick={() => handleView(activity["Activity ID"])}
                    className="flex items-center bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button
                    onClick={() => handleUpdate(activity["Activity ID"])}
                    className="flex items-center bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 focus:outline-none"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => openDeleteDialog(activity["Activity ID"])}
                    className="flex items-center bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>

                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this activity? This
                          action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <button
                          onClick={() => setIsDialogOpen(false)}
                          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleDelete}
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
  );
}
