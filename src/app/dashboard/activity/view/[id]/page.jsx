"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ActivityView() {
  const router = useRouter();
  const { id } = useParams(); // Fetch activity ID from URL
  const [activity, setActivity] = useState(null); // State for activity data
  const [customerName, setCustomerName] = useState(""); // State for customer name
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Activity ID is missing!");
      return;
    }

    const fetchActivityAndCustomer = async () => {
      try {
        // Fetch activity details
        const activityResponse = await fetch(`http://localhost:8000/activities/main/${id}`);
        if (!activityResponse.ok) {
          throw new Error("Failed to fetch activity data");
        }
        const activityData = await activityResponse.json();
        setActivity(activityData);

        // Fetch customer details using customer_id from activity data
        const customerResponse = await fetch(`http://localhost:8000/customers/${activityData.customer_id}`);
        if (!customerResponse.ok) {
          throw new Error("Failed to fetch customer data");
        }
        const customerData = await customerResponse.json();
        setCustomerName(customerData.name);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchActivityAndCustomer();
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!activity) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">View Activity Details</h1>
      <div className="bg-white shadow-md p-6 rounded-md">
        <p><strong>Activity ID:</strong> {activity.customer_activity_id}</p>
        <p><strong>Customer Name:</strong> {customerName}</p>
        <p><strong>Activity Date:</strong> {new Date(activity.activity_date).toLocaleString()}</p>
        <p><strong>Activity Type:</strong> {activity.activity_type}</p>
        <p><strong>Query:</strong> {activity.query}</p>
        <p><strong>Customer Response:</strong> {activity.customer_response}</p>
        <p><strong>Overall Response:</strong> {activity.overall_response}</p>
        <p><strong>Comments:</strong> {activity.comments}</p>
        <p><strong>Case Resolved:</strong> {activity.case_resolved}</p>
        <p><strong>Resolution:</strong> {activity.resolution}</p>
        <p><strong>Next Follow-Up Date:</strong> {new Date(activity.next_followup_date).toLocaleString()}</p>
        <p><strong>Created By:</strong> {activity.created_by}</p>
        <p><strong>Created At:</strong> {new Date(activity.created_at).toLocaleString()}</p>
        {activity.modified_by && (
          <>
            <p><strong>Modified By:</strong> {activity.modified_by}</p>
            <p><strong>Modified At:</strong> {new Date(activity.modified_at).toLocaleString()}</p>
          </>
        )}
      </div>
      <div className="mt-4">
        <Button onClick={() => router.push("/dashboard/activity")}>
          Back to List
        </Button>
      </div>
    </div>
  );
}
