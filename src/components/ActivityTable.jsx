import { useState, useEffect } from 'react';
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

const ActivityTable = ({heading}) => {
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('http://localhost:8000/activities/upcoming');
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        const data = await response.json();
        
        // Transform API data to match our table structure
        const transformedData = data.map((item, index) => ({
          id: index + 1,
          activityType: item["Activity type"],
          customerName: item["Customer name"],
          date: new Date(item.Date).toISOString(),
          status: determineStatus(new Date(item.Date)),
          query: item.query || '',
          caseResolved: item.case_resolved || 'Not Resolved',
          comments: item.comments || ''
        }));
        
        setActivities(transformedData);
        setError(null);
      } catch (err) {
        setError('Failed to load activities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Determine status based on date
  const determineStatus = (activityDate) => {
    const now = new Date();
    const date = new Date(activityDate);
    
    if (date < now) {
      return "Completed";
    } else if (date.toDateString() === now.toDateString()) {
      return "In Progress";
    }
    return "Pending";
  };

  // Status badge styling
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-200 text-yellow-700";
      case "In Progress":
        return "bg-blue-200 text-blue-700";
      case "Completed":
        return "bg-green-200 text-green-700";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  // Filter activities based on search and status
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.customerName.toLowerCase().includes(search.toLowerCase()) ||
      activity.activityType.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      activity.status.toLowerCase().replace(" ", "-") === statusFilter;

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
      <h2 className="text-xl font-semibold mb-4">{heading}</h2>
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
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Activity Type</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Case Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredActivities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>{activity.activityType}</TableCell>
                <TableCell>{activity.customerName}</TableCell>
                <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeStyle(activity.status)}>
                    {activity.status}
                  </Badge>
                </TableCell>
                <TableCell>{activity.caseResolved}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {activity.comments}
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