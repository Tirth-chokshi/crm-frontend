import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";
import { Eye, Pencil, Trash } from 'lucide-react';
const ActivityTable = ({ heading }) => {
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("http://localhost:8000/activities/dailyfollowup");
        if (!response.ok) {
          throw new Error("Failed to fetch activities");
        }
        const data = await response.json();

        // Transform API data to match our table structure
        const transformedData = data.map((item) => ({
          id: item["Activity ID"],
          activityType: item["Activity Type"],
          customerName: item["Customer Name"],
          date: item["Next followup Date"],
          status: item["Status"],
        }));

        setActivities(transformedData);
        setError(null);
      } catch (err) {
        setError("Failed to load activities. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Status badge styling
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

  // Filter activities based on search and status
  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.customerName.toLowerCase().includes(search.toLowerCase()) ||
      activity.activityType.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      activity.status.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="p-4">Loading activities...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold mb-4">{heading || "Today's Follow-Up"}</h2>
      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Search by customer or activity type..."
          className="max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="not resolved">Not Resolved</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Activity Type</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Next Follow-up Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredActivities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>{activity.activityType}</TableCell>
                <TableCell>{activity.customerName}</TableCell>
                <TableCell>
                  {new Date(activity.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                 
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeStyle(activity.status)}>
                    {activity.status}
                  </Badge>
                </TableCell>
                <TableCell>
                <div className="flex space-x-2">
  <button
    className="flex items-center justify-center p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
    aria-label="View"
  >
    <Eye className="h-4 w-4" />
  </button>
  <button
    className="flex items-center justify-center p-2 text-white bg-yellow-500 rounded hover:bg-yellow-600"
    aria-label="Edit"
  >
    <Pencil className="h-4 w-4" />
  </button>
  <button
    className="flex items-center justify-center p-2 text-white bg-red-500 rounded hover:bg-red-600"
    aria-label="Delete"
  >
    <Trash className="h-4 w-4" />
  </button>
</div>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ActivityTable;
