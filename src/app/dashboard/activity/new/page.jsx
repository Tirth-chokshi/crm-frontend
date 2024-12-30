"use client";

import React, { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";

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

const CreateActivityForm = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [selectedCustomerName, setSelectedCustomerName] = useState("");
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
      const response = await fetch("http://localhost:8000/activities/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          created_by: 1,
          activity_date: format(data.activity_date, "yyyy-MM-dd HH:mm:ss"),
          next_followup_date: format(
            data.next_followup_date,
            "yyyy-MM-dd HH:mm:ss"
          ),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Activity created successfully",
        });
        form.reset();
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="grid grid-cols-1 gap-1">
                    {ACTIVITY_TYPES.map((type, index) => (
                      <SelectItem
                        key={type}
                        value={type}
                        className={`${
                          type === "Support Call"
                            ? "bg-green-100"
                            : type === "Follow-Up Call"
                            ? "bg-blue-100"
                            : type === "Complaint"
                            ? "bg-red-100"
                            : type === "New Reg. User"
                            ? "bg-yellow-100"
                            : type === "Abandoned Cart Call"
                            ? "bg-purple-100"
                            : type === "Old Cust. Inactive"
                            ? "bg-gray-100"
                            : type === "Outbound Feedback"
                            ? "bg-teal-100"
                            : ""
                        }`}
                      >
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                  {/* <SelectContent>
                    {ACTIVITY_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent> */}
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select query type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {QUERY_TYPES.map((type) => (
                      <SelectItem key={type} value={type}
                      className={
                        type === "Payment Issue"
                          ? "bg-red-100"
                          : type === "Delivery Time Concerns"
                          ? "bg-yellow-100"
                          : type === "App Navigation Issues"
                          ? "bg-blue-100"
                          : type === "Product Availability"
                          ? "bg-green-100"
                          : type === "Higher Item Prices"
                          ? "bg-purple-100"
                          : type === "Higher Delivery Price"
                          ? "bg-pink-100"
                          : type === "Fewer Restaurant Options"
                          ? "bg-gray-100"
                          : type === "Late Order Delivery"
                          ? "bg-teal-100"
                          : type === "Missing Items in Order"
                          ? "bg-orange-100"
                          : type === "Return Issue"
                          ? "bg-indigo-100"
                          : type === "Refund Issue"
                          ? "bg-light-blue-100"
                          : type === "Brand Trust Issue"
                          ? "bg-brown-100"
                          : type === "Bad Item Quality"
                          ? "bg-dark-gray-100"
                          : type === "Not Interested"
                          ? "bg-gray-100"
                          : type === "Technical Issue"
                          ? "bg-cyan-100"
                          : type === "No Requirement"
                          ? "bg-light-gray-100"
                          : type === "No Feedback"
                          ? "bg-transparent"
                          : type === "Search Issue"
                          ? "bg-blue-gray-100"
                          : type === "Delivery Not Available"
                          ? "bg-dark-blue-100"
                          : ""}
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

          {/* Customer Response */}
          <FormField
            control={form.control}
            name="customer_response"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Response</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className={
                    field.value === "Positive"
                      ? "bg-green-100 text-green-800"
                      : field.value === "Negative"
                      ? "bg-red-100 text-red-800"
                      : field.value === "Neutral"
                      ? "bg-yellow-100 text-yellow-800"
                      : ""
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer response" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {RESPONSE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}
                      className={
                        field.value === "Positive"
                          ? "bg-green-100 text-green-800"
                          : field.value === "Negative"
                          ? "bg-red-100 text-red-800"
                          : field.value === "Neutral"
                          ? "bg-yellow-100 text-yellow-800"
                          : ""
                      }>
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
                  <Textarea
                    {...field}
                    placeholder="Add any additional comments..."
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

          <Button type="submit" className="w-full">
            Create Activity
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateActivityForm;
