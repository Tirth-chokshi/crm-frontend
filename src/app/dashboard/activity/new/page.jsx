"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

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

// Helper function for activity type background colors

const CreateActivityForm = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
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
    fetchCustomers();
  }, []);

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

  const filterCustomers = (searchText) => {
    setSelectedCustomerName(searchText);
    const filtered = customers.filter((customer) =>
      customer.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredCustomers(filtered);
    setShowCustomerDropdown(true);
  };

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        created_by: 1,
        activity_date: format(data.activity_date, "yyyy-MM-dd HH:mm:ss"),
        next_followup_date: enableFollowup && data.next_followup_date 
          ? format(data.next_followup_date, "yyyy-MM-dd HH:mm:ss")
          : null,
      };

      const response = await fetch("http://localhost:8000/activities/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Activity created successfully",
        });
        form.reset();
        setEnableFollowup(false);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create activity",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8  rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-8 text-center">Create New Activity</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Search */}
            <FormField
              control={form.control}
              name="customer_id"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Customer</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search customer..."
                        value={selectedCustomerName}
                        onChange={(e) => filterCustomers(e.target.value)}
                        onFocus={() => setShowCustomerDropdown(true)}
                        className="w-full"
                      />
                      {showCustomerDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-auto">
                          {filteredCustomers.map((customer) => (
                            <div
                              key={customer.customer_id}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
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
                            <div className="p-2 text-gray-500">
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
                      <Button variant="outline" className="w-full">
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
                        <SelectItem
                          key={type}
                          value={type}
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

          <Button type="submit" className="w-full">
            Create Activity
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateActivityForm;