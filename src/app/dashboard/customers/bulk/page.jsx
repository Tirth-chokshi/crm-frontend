"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

export default function UploadExcelPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const parseExcel = async () => {
    if (!selectedFile) {
      alert("Please upload an Excel file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      setParsedData(jsonData);
      console.log("Parsed Data:", jsonData);
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const uploadData = async () => {
    if (parsedData.length === 0) {
      alert("No data to upload. Please parse the Excel file first.");
      return;
    }

    setUploading(true);
    try {
      const response = await fetch("http://localhost:8000/customers/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedData),
      });

      if (response.ok) {
        alert("Customer data uploaded successfully!");
        setParsedData([]);
        setSelectedFile(null);
      } else {
        const error = await response.json();
        console.error("Failed to upload data:", error);
        alert("Failed to upload customer data. Please try again.");
      }
    } catch (err) {
      console.error("Error while uploading data:", err);
      alert("An error occurred during the upload. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Upload Excel File</h1>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {/* File Upload */}
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        
        <Button
          onClick={parseExcel}>
          Parse Excel
        </Button>
        
        {parsedData.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h2>Parsed Data</h2>
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", background: "#f7f7f7", padding: "10px" }}>
              {JSON.stringify(parsedData, null, 2)}
            </pre>
          </div>
        )}

        <Button
          onClick={uploadData}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Data"}
        </Button>
      </div>
    </div>
  );
}
