"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function FormComponent() {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    mobile: "",
    email: "",
    timestamp: new Date().toISOString(),
  });

  useEffect(() => {
    const storedData = localStorage.getItem("formData");
    if (storedData) {
      setFormData(JSON.parse(storedData));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);

    try {
      const response = await fetch("http://localhost:8000/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Response from server:", result);

        // Reset form and generate new timestamp
        setFormData({
          id: "",
          name: "",
          mobile: "",
          email: "",
          timestamp: new Date().toISOString(),
        });

        // Optionally show a success message
        alert("Customer details submitted successfully!");
      } else {
        console.error("Failed to submit form:", response.statusText);
        alert("Failed to submit form. Please try again.");
      }
    } catch (error) {
      console.error("Error while submitting the form:", error);
      alert("An error occurred while submitting the form. Please check your network and try again.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" , fontSize: "30px"}}>New Customer</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {/* ID Field */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="id" style={{ marginBottom: "5px" }}>Customer ID *:</label>
          <input
            type="number"
            id="id"
            name="id"
            value={formData.id}
            onChange={handleChange}
            
            // required
            style={{ padding: "10px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "5px" }}
          />
        </div>

        {/* Name Field */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="name" style={{ marginBottom: "5px" }}>Name*:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
            style={{ padding: "10px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "5px" }}
          />
        </div>

        {/* Mobile Field */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="mobile" style={{ marginBottom: "5px" }}>Mobile No*:</label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Enter 10-digit mobile number"
            pattern="[0-9]{10}"
            required
            style={{ padding: "10px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "5px" }}
          />
        </div>

        {/* Email Field */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="email" style={{ marginBottom: "5px" }}>Email*:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            style={{ padding: "10px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "5px" }}
          />
        </div>
        <div>
          * denotes Mandatory
        </div>
        {/* Submit Button */}
        <Button
          type="submit"
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            color: "#fff",
            backgroundColor: "black",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
