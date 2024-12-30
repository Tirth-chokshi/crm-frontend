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
    <div className="rounded-lg border text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg">
          {icon}
          <h3 className="text-lg font-semibold space-y-5">{title}</h3>
        </div>
      </div>
      <div className="text-sm font-medium text-gray-600">
        {metrics.map((metric, index) => (
          <div key={index} className="text-center">
            <div className="text-2xl font-semibold">{metric.value}</div>
            <div className="text-sm text-gray-600">{metric.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}