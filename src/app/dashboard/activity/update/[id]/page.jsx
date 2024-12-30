"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";

// UI Components
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

// Constants
const ACTIVITY_TYPES = [
  "Support Call",
  "Follow-Up Call",
  "Complaint",
  "New Reg. User",
  "Abandoned Cart Call",
  "Old Cust. Inactive",
  "Outbound Feedback",
];

const QUERY_TYPES = [
  "Payment Issue",
  "Delivery Time Concerns",
  "App Navigation Issues",
  "Product Availability",
  "Higher Item Prices",
  "Higher Delivery Price",
  "Fewer Restaurant Options",
  "Late Order Delivery",
  "Missing Items in Order",
  "Return Issue",
  "Refund Issue",
  "Brand Trust Issue",
  "Bad Item Quality",
  "Not Interested",
  "Technical Issue",
  "No Requirement",
  "No Feedback",
  "Search Issue",
  "Delivery Not Available",
];

const RESPONSE_TYPES = ["Positive", "Negative", "Neutral"];

const CASE_RESOLUTION_TYPES = ["Pending", "Resolved", "Not Resolved"];

export default function UpdateActivityPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerName, setSelectedCustomerName] = useState("");
  const [enableFollowup, setEnableFollowup] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      customer_id: "",
      activity_date: new Date(),
      activity_type: "",
      query: "",
      customer_response: "",
      overall_response: "",
      comments: "",
      case_resolved: "Not Resolved",
      resolution: "",
      next_followup_date: null,
    },
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://localhost:8000/customers/dropdown");
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch customers",
        });
      }
    };

    fetchCustomers();
  }, [toast]);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/activities/main/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch activity data");
        }

        const data = await response.json();
        
        // Set selected customer name
        const customer = customers.find(c => c.customer_id === data.customer_id);
        if (customer) {
          setSelectedCustomerName(customer.name);
        }

        // Set follow-up state
        setEnableFollowup(!!data.next_followup_date);

        // Set form values
        form.reset({
          ...data,
          activity_date: data.activity_date ? new Date(data.activity_date) : new Date(),
          next_followup_date: data.next_followup_date ? new Date(data.next_followup_date) : null,
        });
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchActivity();
    }
  }, [id, customers, form, toast]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formattedData = {
        ...data,
        activity_date: format(data.activity_date, "yyyy-MM-dd HH:mm:ss"),
        next_followup_date: enableFollowup && data.next_followup_date 
          ? format(data.next_followup_date, "yyyy-MM-dd HH:mm:ss")
          : null,
      };

      const response = await fetch(`http://localhost:8000/activities/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update activity");
      }

      toast({
        title: "Success",
        description: "Activity updated successfully",
      });

      router.push("/dashboard/activity");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-8 text-center">Update Activity</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Info (Read-only) */}
            <FormItem className="col-span-2">
              <FormLabel>Customer</FormLabel>
              <Input
                type="text"
                value={selectedCustomerName}
                disabled
                className="w-full"
              />
            </FormItem>

            {/* Activity Date */}
            <FormField
              control={form.control}
              name="activity_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Activity Type */}
            <FormField
              control={form.control}
              name="activity_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ACTIVITY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Query Type */}
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Query Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select query type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {QUERY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Customer Response */}
            <FormField
              control={form.control}
              name="customer_response"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Response</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer response" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {RESPONSE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Overall Response */}
            <FormField
              control={form.control}
              name="overall_response"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overall Response</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select overall response" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {RESPONSE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Case Resolution Status */}
            <FormField
              control={form.control}
              name="case_resolved"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case Resolution Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select resolution status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CASE_RESOLUTION_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Comments */}
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Comments</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Add any additional comments..."
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Resolution */}
            <FormField
              control={form.control}
              name="resolution"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Resolution</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Add resolution details..."
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Follow-up Date Checkbox */}
            <FormItem className="col-span-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="followup"
                  checked={enableFollowup}
                  onCheckedChange={setEnableFollowup}
                />
                <label
                  htmlFor="followup"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Schedule Follow-up
                </label>
              </div>
            </FormItem>

            {/* Next Follow-up Date */}
            {enableFollowup && (
              <FormField
                control={form.control}
                name="next_followup_date"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Next Follow-up Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Activity
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}