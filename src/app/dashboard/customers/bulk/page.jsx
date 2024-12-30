"use client"
import React, { useState, useCallback } from "react"
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"
import * as XLSX from "xlsx"
import { AlertCircle, Upload, FileSpreadsheet } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import DownloadTemplateButton from "@/components/TemplateButton"

export default function UploadExcelPage() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0] 
    setSelectedFile(file)
    setError("")
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  })

  const validateData = (data) => {
    return data.every(row => 
      row.id && 
      row.name && 
      row.mobile && 
      row.email &&
      (typeof row.id === 'string' || typeof row.id === 'number')
    )
  }

  const uploadData = async () => {
    if (!selectedFile) {
      setError("Please upload an Excel file.")
      return
    }

    setUploading(true)
    setError("")

    try {
      // First parse the Excel file
      const reader = new FileReader()
      
      const parseResult = await new Promise((resolve, reject) => {
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result)
            const workbook = XLSX.read(data, { type: "array" })
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]
            const jsonData = XLSX.utils.sheet_to_json(worksheet)

            if (jsonData.length === 0) {
              reject(new Error("The Excel file is empty."))
              return
            }

            if (!validateData(jsonData)) {
              reject(new Error("Invalid data format. Please ensure all records have id, name, mobile, and email fields."))
              return
            }

            resolve(jsonData)
          } catch (err) {
            reject(new Error("Failed to parse Excel file. Please check the file format."))
          }
        }

        reader.onerror = () => {
          reject(new Error("Failed to read the file."))
        }

        reader.readAsArrayBuffer(selectedFile)
      })

      // Then upload the parsed data
      const response = await fetch("http://localhost:8000/customers/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parseResult),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to upload customer data")
      }

      setSelectedFile(null)
      alert("Customer data uploaded successfully!")
    } catch (err) {
      setError(err.message || "An error occurred during the process")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto font-sans">
      <h1 className="text-2xl font-bold text-center mb-6">Upload Excel File</h1>
      
      <div className="flex flex-col gap-4">
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-500">Drop the Excel file here...</p>
          ) : (
            <div>
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">Drag and drop an Excel file here, or click to select a file</p>
              <p className="text-sm text-gray-400 mt-2">Supported formats: .xlsx, .xls</p>
            </div>
          )}
        </div>

        {selectedFile && (
          <div className="flex items-center p-2 bg-green-50 rounded">
            <FileSpreadsheet className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-700">Selected file: {selectedFile.name}</p>
          </div>
        )}
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={uploadData}
          disabled={uploading || !selectedFile}
          className="flex items-center justify-center gap-2"
        >
          {uploading ? (
            "Processing..."
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload Data
            </>
          )}
        </Button>
        <DownloadTemplateButton/>
      </div>
    </div>
  )
}

