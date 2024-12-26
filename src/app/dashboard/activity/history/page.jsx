"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ActivityHistory = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterResponse, setFilterResponse] = useState("all");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/activities/history"
        );
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getResponseBadgeColor = (response) => {
    switch (response.toLowerCase()) {
      case "positive":
        return "bg-green-100 text-green-800";
      case "neutral":
        return "bg-yellow-100 text-yellow-800";
      case "negative":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get unique activity types and responses for filters
  const activityTypes = [
    "all",
    ...new Set(activities.map((a) => a.activity_type)),
  ];
  const responseTypes = [
    "all",
    ...new Set(activities.map((a) => a.customer_response)),
  ];

  // Filter and search logic
  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.comments.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.resolution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.customer_id.toString().includes(searchQuery);

    const matchesType =
      filterType === "all" || activity.activity_type === filterType;
    const matchesResponse =
      filterResponse === "all" || activity.customer_response === filterResponse;

    return matchesSearch && matchesType && matchesResponse;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="container p-5 mx-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Activity History</CardTitle>
          <div className="flex flex-col gap-4 md:flex-row md:items-center mt-4">
            <div className="flex-1">
              <Input
                placeholder="Search by query, comments, resolution, or customer ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Activity Type" />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "all" ? "All Types" : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterResponse} onValueChange={setFilterResponse}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Response Type" />
                </SelectTrigger>
                <SelectContent>
                  {responseTypes.map((response) => (
                    <SelectItem key={response} value={response}>
                      {response === "all" ? "All Responses" : response}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Query</TableHead>
                  <TableHead>Response</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead>Resolution</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-4">
                      No activities found matching your search criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredActivities.map((activity) => (
                    <TableRow key={activity.customer_activity_id}>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(activity.activity_date)}
                      </TableCell>
                      <TableCell>{activity.customer_id}</TableCell>
                      <TableCell>{activity.activity_type}</TableCell>
                      <TableCell>{activity.query}</TableCell>
                      <TableCell>
                        <Badge
                          className={getResponseBadgeColor(
                            activity.customer_response
                          )}
                        >
                          {activity.customer_response}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            activity.case_resolved === "Resolved"
                              ? "success"
                              : "secondary"
                          }
                        >
                          {activity.case_resolved}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {activity.comments}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {activity.resolution}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityHistory;
