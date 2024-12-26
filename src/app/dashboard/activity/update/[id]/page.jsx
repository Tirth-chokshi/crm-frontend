"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useParams } from "next/navigation";

export default function UpdateActivityPage({ params }) {
  const router = useRouter();
  const {id} = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activity, setActivity] = useState({
    customer_response: "",
    overall_response: "",
    comments: "",
    resolution: "",
    case_resolved: false,
    next_followup_date: ""
  });

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/activities/main/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch activity data');
        }
        
        const data = await response.json();
        
        // Transform the data to match our form structure
        setActivity({
          customer_response: data.customer_response || "",
          overall_response: data.overall_response || "",
          comments: data.comments || "",
          resolution: data.resolution || "",
          case_resolved: data.case_resolved || false,
          next_followup_date: data.next_followup_date ? 
            new Date(data.next_followup_date).toISOString().split('T')[0] : 
            ""
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchActivity();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActivity(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCaseStatusChange = (newStatus) => {
    const resolved = newStatus === "Resolved";
    setActivity((prevState) => ({
      ...prevState,
      case_status: newStatus,
      case_resolved: resolved,
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Create update payload with only the fields that have values
    const updatePayload = {};
    Object.entries(activity).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        updatePayload[key] = value;
      }
    });

    try {
      const response = await fetch(`http://localhost:8000/activities/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update activity');
      }

      router.push('/dashboard/activity');
      router.refresh();
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Update Activity Details</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Customer Response</label>
            <Textarea
              name="customer_response"
              value={activity.customer_response}
              onChange={handleChange}
              placeholder="Enter customer response"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Overall Response</label>
            <Textarea
              name="overall_response"
              value={activity.overall_response}
              onChange={handleChange}
              placeholder="Enter overall response"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Comments</label>
            <Textarea
              name="comments"
              value={activity.comments}
              onChange={handleChange}
              placeholder="Enter comments"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Resolution</label>
            <Textarea
              name="resolution"
              value={activity.resolution}
              onChange={handleChange}
              placeholder="Enter resolution details"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
  <label className="text-sm font-medium">Case Status</label>
  <Select
    value={activity.case_status || ""} // Ensure "case_status" is used to store the state
    onValueChange={handleCaseStatusChange} // Update the handler name
  >
    <SelectTrigger>
      <SelectValue placeholder="Select status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="Resolved">Resolved</SelectItem>
      <SelectItem value="Not Resolved">Not Resolved</SelectItem>
      <SelectItem value="Pending">Pending</SelectItem>
    </SelectContent>
  </Select>
</div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Next Follow-up Date</label>
            <Input
              type="date"
              name="next_followup_date"
              value={activity.next_followup_date}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Activity
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}