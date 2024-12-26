"use client"

import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const CreateActivityForm = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [selectedCustomerName, setSelectedCustomerName] = useState('');
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
      next_followup_date: new Date(),
    }
  });
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:8000/customers/dropdown');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch customers"
      });
    }
  };

  const filterCustomers = (searchText) => {
    setSelectedCustomerName(searchText);
    const filtered = customers.filter(customer => 
      customer.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredCustomers(filtered);
    setShowCustomerDropdown(true);
  };

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:8000/activities/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          created_by: 1,
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
        form.reset();
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
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Customer Search */}
          <FormField
            control={form.control}
            name="customer_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search customer..."
                      value={selectedCustomerName}
                      onChange={(e) => {
                        filterCustomers(e.target.value);
                      }}
                      onFocus={() => setShowCustomerDropdown(true)}
                      className="w-full"
                    />
                    {showCustomerDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-48 overflow-auto">
                        {filteredCustomers.map((customer) => (
                          <div
                            key={customer.customer_id}
                            className="p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors duration-200"
                            onClick={() => {
                              field.onChange(customer.customer_id);
                              setSelectedCustomerName(customer.name);
                              setShowCustomerDropdown(false);
                            }}
                          >
                            {customer.name}
                          </div>
                        ))}
                        {filteredCustomers.length === 0 && (
                          <div className="p-2 text-muted-foreground">
                            No customers found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          {/* Query */}
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Query</FormLabel>
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

          {/* Comments */}
          <FormField
            control={form.control}
            name="comments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comments</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Add any additional comments..." />
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
                  <Textarea {...field} placeholder="Add resolution details..." />
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

          <Button type="submit" className="w-full">Create Activity</Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateActivityForm;