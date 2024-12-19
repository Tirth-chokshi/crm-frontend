"use client"
import { useState } from "react";
import { v4 as uuidv4 } from "uuid"; // Install with npm install uuid

export default function FormComponent() {
  const [formData, setFormData] = useState({
    id: uuidv4(),
    name: "",
    mobile: "",
    email: "",
    date: "",
    timestamp: new Date().toISOString(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // Reset form and generate new ID
    setFormData({
      id: uuidv4(),
      name: "",
      mobile: "",
      email: "",
      date: "",
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Fill up the Customers Details</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="name" style={{ marginBottom: "5px" }}>Name:</label>
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

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="mobile" style={{ marginBottom: "5px" }}>Mobile No:</label>
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

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="email" style={{ marginBottom: "5px" }}>Email:</label>
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

  
        <button
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
        </button>
      </form>
    </div>
  );
}
