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
  const [todaysActivities, setTodaysActivities] = useState(0);
  const [resolvedCases, setResolvedCases] = useState(0);
  const [pendingFollowups, setPendingFollowups] = useState(0);

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
        const customerResponse = await fetch("http://localhost:8000/customers/");
        if (!customerResponse.ok) throw new Error("Failed to fetch customers");
        const customers = await customerResponse.json();
        setTotalCustomers(customers.length);

        // Fetch Today's Activities
        const todaysActivitiesResponse = await fetch(
          "http://localhost:8000/activities/dailyfollowup"
        );
        if (!todaysActivitiesResponse.ok) {
          throw new Error("Failed to fetch today's activities");
        }
        const todaysActivitiesData = await todaysActivitiesResponse.json();
        setTodaysActivities(todaysActivitiesData.length);

        // Fetch Today's Resolved Activities
        const resolvedCasesResponse = await fetch(
          "http://localhost:8000/activities/todaysresolved"
        );
        if (!resolvedCasesResponse.ok) {
          throw new Error("Failed to fetch resolved cases");
        }
        const resolvedCasesData = await resolvedCasesResponse.json();
        setResolvedCases(resolvedCasesData[0]?.resolved_count || 0);

        // Fetch Today's Pending Follow-ups
        const pendingFollowupsResponse = await fetch(
          "http://localhost:8000/activities/remaining"
        );
        if (!pendingFollowupsResponse.ok) {
          throw new Error("Failed to fetch pending followups");
        }
        const pendingFollowupsData = await pendingFollowupsResponse.json();
        setPendingFollowups(pendingFollowupsData[0]?.remaining_count || 0);
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
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Total Customers Registered"
                  icon={<Users className="h-8 w-8 text-blue-500" />}
                  metrics={[{ label: "Customers", value: totalCustomers }]}
                />
                <MetricCard
                  title="Today's Activities"
                  icon={<UserMinus className="h-8 w-8 text-purple-500" />}
                  metrics={[{ label: "Activities", value: todaysActivities }]}
                />
                <MetricCard
                  title="Today's Resolved Activities"
                  icon={<UserCheck className="h-8 w-8 text-green-500" />}
                  metrics={[{ label: "Resolved", value: resolvedCases }]}
                />
                <MetricCard
                  title="Today's Pending Follow-ups"
                  icon={<UserCheck className="h-8 w-8 text-orange-500" />}
                  metrics={[{ label: "Pending", value: pendingFollowups }]}
                />
              </div>
            </div>
          </section>
          <section className="grid md:grid-cols-2 gap-4">
            <TodaysFollowup />
            <ActivityTable />
          </section>

          {/* Charts Section */}
          <section>
            <div className="space-y-6">
              <ResolutionChart />
              <ActivityTypeChart />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, icon, metrics }) {
  return (
    <div className="rounded-lg border text-card-foreground shadow-sm hover:shadow-md transition-shadow">
    {/* Fixed height container with consistent padding */}
    <div className="h-[200px] p-6 flex flex-col">
      {/* Header section - Takes up top 40% of space */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg">
          {icon}
        </div>
        <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
      </div>
      
      {/* Metrics section - Takes up bottom 60% of space */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {metrics.map((metric, index) => (
          <div key={index} className="text-center">
            {/* Fixed size container for value to prevent layout shift */}
            <div className="h-12 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">
                {metric.value}
              </span>
            </div>
            {/* Fixed size container for label to prevent layout shift */}
            <div className="h-6 flex items-center justify-center">
              <span className="text-sm text-gray-600">
                {metric.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
}