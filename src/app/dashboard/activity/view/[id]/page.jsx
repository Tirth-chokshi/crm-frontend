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
        const activityResponse = await fetch(
          `http://localhost:8000/activities/main/${id}`
        );
        if (!activityResponse.ok) {
          throw new Error("Failed to fetch activity data");
        }
        const activityData = await activityResponse.json();
        setActivity(activityData);

        // Fetch customer details using customer_id from activity data
        const customerResponse = await fetch(
          `http://localhost:8000/customers/${activityData.customer_id}`
        );
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
    return <div className="text-center text-lg font-medium">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Activity Details
      </h1>
      <div className="bg-gray-50 shadow-lg p-6 rounded-lg space-y-6">
        {/* Customer Info */}
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-700">Customer Info</h2>
          <p className="text-gray-600">
            <strong>Customer Name:</strong> {customerName}
          </p>
        </div>

        {/* Activity Details */}
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Activity Details
          </h2>
          <div className="grid grid-cols-2 gap-4 text-gray-600">
            <p>
              <strong>Activity ID:</strong> {activity.customer_activity_id}
            </p>
            <p>
              <strong>Activity Date:</strong>{" "}
              {new Date(activity.activity_date).toLocaleString()}
            </p>
            <p>
              <strong>Activity Type:</strong> {activity.activity_type}
            </p>
            <p>
              <strong>Query:</strong> {activity.query}
            </p>
          </div>
        </div>

        {/* Responses */}
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-700">Responses</h2>
          <p className="text-gray-600">
            <strong>Customer Response:</strong> {activity.customer_response}
          </p>
          <p className="text-gray-600">
            <strong>Overall Response:</strong> {activity.overall_response}
          </p>
          <p className="text-gray-600">
            <strong>Comments:</strong> {activity.comments}
          </p>
        </div>

        {/* Resolution */}
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-700">Resolution</h2>
          <p className="text-gray-600">
            <strong>Case Resolved Status:</strong>{" "}
            {activity.case_resolved}
          </p>
          <p className="text-gray-600">
            <strong>Resolution Details:</strong> {activity.resolution}
          </p>
          <p className="text-gray-600">
            <strong>Next Follow-Up Date:</strong>{" "}
            {activity.next_followup_date === null
              ? "Not Set"
              : new Date(activity.next_followup_date).toLocaleDateString()}
          </p>
        </div>

        {/* Audit Info */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700">Audit Info</h2>
          <div className="grid grid-cols-2 gap-4 text-gray-600">
            <p>
              <strong>Created By:</strong> {activity.created_by}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(activity.created_at).toLocaleString()}
            </p>
            {activity.modified_by && (
              <>
                <p>
                  <strong>Modified By:</strong> {activity.modified_by}
                </p>
                <p>
                  <strong>Modified At:</strong>{" "}
                  {new Date(activity.modified_at).toLocaleString()}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-6 text-left">
        <Button
          onClick={() => router.push(`/dashboard/customers/`)}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Back to Customers 
        </Button>
      </div>
      <div className="mt-6 text-right">
        <Button
          onClick={() => router.push("/dashboard/activity")}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Back to Activities List 
        </Button>
      </div>
    </div>
  );
}
