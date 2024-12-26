"use client";
import ActivityTable from "@/components/ActivityTable";
import { MonthlyActivityChart } from "@/components/monthly-activity-chart";
import { MonthlySalesChart } from "@/components/monthly-sales-chart";
import { MonthlyUsersChart } from "@/components/monthly-users-chart";
import { FileDiff, Users, UserCheck, UserMinus, Section } from "lucide-react";
import { useEffect, useState } from "react";
import TodaysFollowup from "@/components/TodaysFollowup";
export default function Page() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
                title="Today's New Cases Registered"
                icon={<FileDiff className="h-6 w-6 text-green-500" />}
                metrics={[
                  { label: "Orders", value: "0" },
                  { label: "Revenue", value: "₹0" },
                ]}
              />
              <MetricCard
                title="Total Customers"
                icon={<Users className="h-6 w-6 text-blue-500" />}
                metrics={[
                  { label: "Registered", value: "0" },
                  { label: "Unique Orders", value: "0" },
                ]}
              />
              <MetricCard
                title="Today's Follow-Up Session"
                icon={<UserMinus className="h-6 w-6 text-purple-500" />}
                metrics={[
                  { label: "Orders", value: "145" },
                  { label: "Revenue", value: "₹63,807" },
                ]}
              />
              <MetricCard
                title="Total Cases ReSolved"
                icon={<UserCheck className="h-6 w-6 text-orange-500" />}
                metrics={[
                  { label: "Registered", value: "84" },
                  { label: "Unique Orders", value: "4" },
                ]}
              />
            </div>
          </section>
          <section className="grid md:grid-cols-2 gap-4">
            <TodaysFollowup />
            <ActivityTable/>
          </section>
          {/* Status Overview
          <section className="grid md:grid-cols-2 gap-4">
            <DeliveryStatus />
            <PaymentStatus />
          </section> */}

          {/* Charts Section */}
          <section>
            <div className="space-y-6">
              {/* Monthly Sales Chart */}
              <div className="border rounded-lg p-4 shadow-sm">
                <MonthlySalesChart />
              </div>

              {/* Monthly Users Chart */}
              <div className="border rounded-lg p-4 shadow-sm">
                <MonthlyUsersChart />
              </div>

              {/* Monthly Activity Chart */}
              <div className="border rounded-lg p-4 shadow-sm">
                <MonthlyActivityChart />
              </div>
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
            <div className="text-2xl font-bold ">{metric.value}</div>
            <div className="text-sm text-gray-500">{metric.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeliveryStatus() {
  const statuses = [
    { label: "Order Received", value: "0", color: "bg-red-500" },
    { label: "Processing", value: "0", color: "bg-green-500" },
    { label: "On Delivery", value: "0", color: "bg-orange-500" },
    { label: "Delivered", value: "0", color: "bg-blue-500" },
    { label: "Cancelled", value: "0", color: "bg-gray-500" },
    { label: "Delivery Pending", value: "5", color: "bg-yellow-500" },
  ];

  return (
    <div className="rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Today&aposs Delivery Status</h3>
      </div>

      <div className="space-y-3">
        {statuses.map((status, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`h-3 w-3 rounded-full ${status.color}`} />
              <span className="text-sm ">{status.label}</span>
            </div>
            <span className="font-medium ">{status.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentStatus() {
  const payments = [
    { method: "Cash Paid", value: "0", color: "bg-red-500" },
    { method: "Paytm Wallet", value: "0", color: "bg-green-500" },
    { method: "UPI Paid", value: "0", color: "bg-orange-500" },
    { method: "Mytro Wallet", value: "0", color: "bg-purple-500" },
    { method: "Online", value: "0", color: "bg-blue-500" },
    { method: "Pending", value: "0", color: "bg-yellow-500" },
  ];

  return (
    <div className="rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Today&aposs Payment Status</h3>
      </div>

      <div className="space-y-3">
        {payments.map((payment, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`h-3 w-3 rounded-full ${payment.color}`} />
              <span className="text-sm ">{payment.method}</span>
            </div>
            <span className="font-medium ">{payment.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
