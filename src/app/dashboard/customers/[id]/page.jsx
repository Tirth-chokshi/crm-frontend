"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ViewCustomer() {
  const [customer, setCustomer] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    const fetchCustomerAndActivities = async () => {
      try {
        setLoading(true);

        // Fetch customer details
        const customerResponse = await fetch(`http://localhost:8000/customers/${id}`);
        if (!customerResponse.ok) {
          throw new Error("Failed to fetch customer details");
        }
        const customerData = await customerResponse.json();

        // Fetch activity details
        const activitiesResponse = await fetch(`http://localhost:8000/activities/customer/${id}`);
        if (!activitiesResponse.ok) {
          throw new Error("Failed to fetch activity details");
        }
        const activitiesData = await activitiesResponse.json();

        setCustomer(customerData);
        setActivities(activitiesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerAndActivities();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!customer) return <div>Customer not found</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Customer Details</h1>
      <div className="border rounded-lg shadow-md p-4 bg-white">
        <table className="table-auto w-full mb-4">
          <tbody>
            <tr>
              <td className="font-medium border px-4 py-2">ID</td>
              <td className="border px-4 py-2">{customer.customer_id}</td>
            </tr>
            <tr>
              <td className="font-medium border px-4 py-2">Name</td>
              <td className="border px-4 py-2">{customer.name}</td>
            </tr>
            <tr>
              <td className="font-medium border px-4 py-2">Email</td>
              <td className="border px-4 py-2">{customer.email}</td>
            </tr>
            <tr>
              <td className="font-medium border px-4 py-2">Mobile</td>
              <td className="border px-4 py-2">{customer.mobile}</td>
            </tr>
            <tr>
              <td className="font-medium border px-4 py-2">Status</td>
              <td className="border px-4 py-2">{customer.activity_status}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-4">Activity Details</h2>
      <div className="border rounded-lg shadow-md p-4 bg-white">
        {activities.length > 0 ? (
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="border px-4 py-2">Activity ID</th>
                <th className="border px-4 py-2">Activity Name</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.customer_activity_id}>
                  <td className="border px-4 py-2">{activity.customer_activity_id}</td>
                  <td className="border px-4 py-2">{activity.activity_type}</td>
                  <td className="border px-4 py-2">{activity.activity_date}</td>
                  <td className="border px-4 py-2">{activity.case_resolved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No activities found for this customer.</p>
        )}
      </div>

      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => router.back()}
      >
        Back
      </button>
    </div>
  );
}
