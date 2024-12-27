"use client";
import ActivityTable from "@/components/ActivityTable";
import { MonthlyActivityChart } from "@/components/monthly-activity-chart";
import { MonthlySalesChart } from "@/components/monthly-sales-chart";
import { MonthlyUsersChart } from "@/components/monthly-users-chart";
import { FileDiff, Users, UserCheck, UserMinus } from "lucide-react";
import { useEffect, useState } from "react";
import TodaysFollowup from "@/components/TodaysFollowup";
import TopCustomersChart from "@/components/TopCustomers";
import ActivityTypeChart from "@/components/ActivityTypeChart";
import ResolutionChart from "@/components/ResolutionChart";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [todaysFollowups, setTodaysFollowups] = useState(0);
  const [resolvedCases, setResolvedCases] = useState(0);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch Customers
        const customerResponse = await fetch(
          "http://localhost:8000/customers/"
        );
        if (!customerResponse.ok) throw new Error("Failed to fetch customers");
        const customers = await customerResponse.json();
        setTotalCustomers(customers.length);

        // Fetch Today's Followup
        const followupResponse = await fetch(
          "http://localhost:8000/activities/dailyfollowup"
        );
        if (!followupResponse.ok) throw new Error("Failed to fetch follow-ups");
        const followups = await followupResponse.json();
        setTodaysFollowups(followups.length);

        // Fetch Resolved Cases
        const resolvedResponse = await fetch(
          "http://localhost:8000/activities/resolved"
        );
        if (!resolvedResponse.ok) {
          throw new Error("Failed to fetch resolved cases");
        }
        const data = await resolvedResponse.json();
        const resolvedCount = data[0]?.resolved_count || 0; // Extract the resolved_count value
        setResolvedCases(resolvedCount); // Store the count in state
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchCounts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-6 space-y-6">
          {/* Key Metrics Grid */}
          <section>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Total Customers"
                icon={<Users className="h-6 w-6 text-blue-500" />}
                metrics={[{ label: "Customers", value: totalCustomers }]}
              />
              <MetricCard
                title="Today's Follow-Up Session"
                icon={<UserMinus className="h-6 w-6 text-purple-500" />}
                metrics={[{ label: "Followups", value: todaysFollowups }]}
              />
              <MetricCard
                title="Total Cases Resolved"
                icon={<UserCheck className="h-6 w-6 text-orange-500" />}
                metrics={[{ label: "Resolved", value: resolvedCases }]}
              />
            </div>
          </section>
          <section className="grid md:grid-cols-2 gap-4">
            <TodaysFollowup />
            <ActivityTable />
          </section>

          {/* Charts Section */}
          <section>
            <div className="space-y-6">
              {/* <div className="border rounded-lg p-4 shadow-sm">
                <MonthlySalesChart />
              </div>
              <div className="border rounded-lg p-4 shadow-sm">
                <MonthlyUsersChart />
              </div> */}
              <div className="border rounded-lg p-4 shadow-sm">
                <ResolutionChart />
              </div>
              <div className="border rounded-lg p-4 shadow-sm">
                <ActivityTypeChart />
              </div>
              {/* <div className="border rounded-lg p-4 shadow-sm">
                <MonthlyActivityChart />
              </div> */}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, icon, metrics }) {
  return (
    <div className="rounded-lg border text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {icon}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      </div>
      <div className="flex justify-between">
        {metrics.map((metric, index) => (
          <div key={index} className="text-center">
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="text-sm text-gray-500">{metric.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
