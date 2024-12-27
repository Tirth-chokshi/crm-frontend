"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Plus, Search } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Link from "next/link";
export default function ViewCustomer() {
  const [customer, setCustomer] = useState(null);
  const [activities, setActivities] = useState([]);
  const [customerLoading, setCustomerLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [customerError, setCustomerError] = useState(null);
  const [activitiesError, setActivitiesError] = useState(null);
  const router = useRouter();
  const { id } = useParams();
 const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!id) return;

    const fetchCustomer = async () => {
      try {
        setCustomerLoading(true);
        const response = await fetch(`http://localhost:8000/customers/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch customer details");
        }
        const data = await response.json();
        setCustomer(data);
      } catch (err) {
        setCustomerError(err.message);
      } finally {
        setCustomerLoading(false);
      }
    };

    const fetchActivities = async () => {
      try {
        setActivitiesLoading(true);
        const response = await fetch(`http://localhost:8000/activities/customer/${id}`);
        if (!response.ok) {
          // throw new Error("Failed to fetch activity details");
        }
        const data = await response.json();
        setActivities(data);
      } catch (err) {
        setActivitiesError(err.message);
        setActivities([]);
      } finally {
        setActivitiesLoading(false);
      }
    };

    // Fetch customer and activities separately
    fetchCustomer();
    fetchActivities();
  }, [id]);

  // Show loading state while customer data is being fetched
  if (customerLoading) return <div>Loading customer details...</div>;
  
  // Show error if customer data couldn't be fetched
  if (customerError) return <div>Error loading customer: {customerError}</div>;
  
  // Show error if customer doesn't exist
  if (!customer) return <div>Customer not found</div>;
  const handleNewActivity = () => {
    router.push(`/dashboard/customers/${id}/activity/new`);
  }


  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Customer Details</h1>
      
      {/* Customer Details Section */}
      <div className="border rounded-lg shadow-md p-4">
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
          </tbody>
        </table>
      </div>

      {/* Activities Section */}
      
      <div className="flex items-center justify-between flex-wrap gap-4 mt-6 mb-4">
  <h2 className="text-xl font-semibold">Activity Details</h2>
  <Button onClick={handleNewActivity} className="flex items-center">
    <Plus className="mr-2 h-4 w-4" /> New Activity
  </Button>
</div>
      <div className="border rounded-lg shadow-md p-4">
        {activitiesLoading ? (
          <div>Loading activities...</div>
        ) : activitiesError ? (
          <div className="text-red-500">Error loading activities: {activitiesError}</div>
        ) : activities.length > 0 ? (
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="border px-4 py-2">Activity ID</th>
                <th className="border px-4 py-2">Activity Name</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Updation</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.customer_activity_id}>
                  <td className="border px-4 py-2">{activity.customer_activity_id}</td>
                  <td className="border px-4 py-2">{activity.activity_type}</td>
                  <td className="border px-4 py-2">{new Date(activity.activity_date).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">{activity.case_resolved}</td>
                  <td className="border px-4 py-2">
                    <div className="flex space-x-2 align-middle">
                                           <Link href={`/dashboard/activity/view/${activity.customer_activity_id}`}>
                                            <button
                                              
                                              className="flex items-center bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none"
                                            >
                                              <FontAwesomeIcon icon={faEye} className="mr-2" />
                                              
                                            </button>
                                            </Link>
                                          <Link href={`/dashboard/activity/update/${activity.customer_activity_id}`}> <button
                                            
                                              className="flex items-center bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 focus:outline-none"
                                            >
                                              <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                              
                                            </button>
                                            </Link> 
                                          
                                          </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No activities found for this customer.</p>
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