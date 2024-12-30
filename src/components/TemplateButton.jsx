"use client"
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import * as XLSX from 'xlsx';

const DownloadTemplateButton = () => {
  const downloadTemplate = () => {
    // Sample data
    const data = [
      {
        id: "1001",
        name: "John Doe",
        mobile: "1234567890",
        email: "john@example.com"
      },
      {
        id: "1002",
        name: "Jane Smith",
        mobile: "9876543210",
        email: "jane@example.com"
      }
    ];

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Customers");

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, "CRM_Customers.xlsx");
  };

  return (
    <Button
      onClick={downloadTemplate}
      variant="outline"
      className="flex items-center gap-2"
    >
      <FileDown className="h-4 w-4" />
      Download Template
    </Button>
  );
};

export default DownloadTemplateButton;