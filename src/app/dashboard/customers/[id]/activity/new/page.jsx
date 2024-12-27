"use client"

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
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
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';

const ACTIVITY_TYPES = [
  "Sales Call",
  "Support",
  "Follow-up",
  "Complaint",
  "Inquiry"
];

const QUERY_TYPES = [
  "Product Information",
  "Price Quote",
  "Technical Support",
  "Billing Issue",
  "General Inquiry"
];

const RESPONSE_TYPES = [
  "Positive",
  "Negative",
  "Neutral",
  "Pending",
  "Escalated"
];

const CASE_STATUS = [
  "Resolved",
  "Not Resolved",
  "In Progress",
  "Pending"
];

const CustomerActivityForm = () => {
  const { id } = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
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
      next_followup_date: new Date(),
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
      const response = await fetch('http://localhost:8000/activities/customer/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          customer_id: id,
          created_by: 1, // Replace with actual user ID
          activity_date: format(data.activity_date, "yyyy-MM-dd HH:mm:ss"),
          next_followup_date: format(data.next_followup_date, "yyyy-MM-dd HH:mm:ss")
        }),
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
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Activity</h1>
      
      {customer && (
        <div className="mb-6 p-4 border rounded-md bg-muted">
          <h2 className="font-semibold mb-2">Customer Details</h2>
          <p>Name: {customer.name}</p>
          <p>Email: {customer.email}</p>
          <p>Mobile: {customer.mobile}</p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Activity Date */}
          <FormField
            control={form.control}
            name="activity_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Activity Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
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
                <FormLabel>Activity Type</FormLabel>
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
                <FormLabel>Query Type</FormLabel>
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
                <FormLabel>Customer Response</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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

          {/* Case Status */}
          <FormField
            control={form.control}
            name="case_resolved"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Case Status</FormLabel>
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
              <FormItem>
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
              <FormItem>
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

          {/* Next Follow-up Date */}
          <FormField
            control={form.control}
            name="next_followup_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Next Follow-up Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
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

          <div className="flex gap-4 justify-end">
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