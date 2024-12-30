"use client"

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

// UI Components
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
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
import { useToast } from '@/hooks/use-toast';

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

const CASE_STATUS = [
  "Resolved",
  "Not Resolved",
  "Pending"
];

// Helper function for response type styling
const getResponseTypeStyle = (type) => {
  const styles = {
    "Positive": "bg-green-100 text-green-800",
    "Negative": "bg-red-100 text-red-800",
    "Neutral": "bg-gray-100 text-gray-800",
    "Pending": "bg-yellow-100 text-yellow-800",
    "Escalated": "bg-orange-100 text-orange-800"
  };
  return styles[type] || "";
};

const CustomerActivityForm = () => {
  const { id } = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [enableFollowup, setEnableFollowup] = useState(false);
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      activity_date: new Date(),
      activity_type: "",
      query: "",
      customer_response: "",
      overall_response: "",
      comments: "",
      case_resolved: "Not Resolved",
      resolution: "",
      next_followup_date: null,
    }
  });

  useEffect(() => {
    fetchCustomerDetails();
  }, [id]);

  const fetchCustomerDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8000/customers/${id}`);
      const data = await response.json();
      setCustomer(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch customer details"
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        customer_id: id,
        created_by: 1, // Replace with actual user ID
        activity_date: format(data.activity_date, "yyyy-MM-dd HH:mm:ss"),
        next_followup_date: enableFollowup && data.next_followup_date
          ? format(data.next_followup_date, "yyyy-MM-dd HH:mm:ss")
          : null
      };

      const response = await fetch('http://localhost:8000/activities/customer/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Activity created successfully"
        });
        router.push(`/dashboard/customers/${id}`);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create activity"
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-8 text-center"> New Activity</h1>
      
      {customer && (
        <div className="mb-8 p-6 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Customer Details*</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name*</p>
              <p className="font-medium">{customer.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email*</p>
              <p className="font-medium">{customer.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Mobile*</p>
              <p className="font-medium">{customer.mobile}</p>
            </div>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Activity Date */}
            <FormField
              control={form.control}
              name="activity_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Date*</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(field.value, "PPP")}
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
                  <FormLabel>Activity Type*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <FormLabel>Query Type*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <FormLabel>Customer Response*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer response" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {RESPONSE_TYPES.map((type) => (
                        <SelectItem 
                          key={type} 
                          value={type}
                          className={getResponseTypeStyle(type)}
                        >
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
                  <FormLabel>Overall Response*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select overall response" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {RESPONSE_TYPES.map((type) => (
                        <SelectItem 
                          key={type} 
                          value={type}
                          className={getResponseTypeStyle(type)}
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Case Status */}
            <FormField
              control={form.control}
              name="case_resolved"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case Status*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select case status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CASE_STATUS.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
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
                  <FormLabel>Comments*</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Add any additional comments..."
                      className="min-h-[100px] resize-none"
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
                      className="min-h-[100px] resize-none"
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
                        <Button variant="outline" className="w-full justify-start">
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
<div>
  * denotes Mandatory
</div>
          <div className="flex gap-4 justify-end pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push(`/dashboard/customers/${id}`)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Activity</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CustomerActivityForm;