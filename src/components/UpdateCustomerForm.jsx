
// "use client"
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { AlertCircle, Loader2 } from "lucide-react";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// const UpdateCustomerForm = ({ params }) => {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [customer, setCustomer] = useState({
//     name: "",
//     email: "",
//     mobile: "",
//     activity_status: "active"
//   });

//   // Fetch customer data when component mounts
//   useEffect(() => {
//     const fetchCustomer = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`http://localhost:8000/customers/${params.id}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch customer data');
//         }
//         const data = await response.json();
//         setCustomer(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (params.id) {
//       fetchCustomer();
//     }
//   }, [params.id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCustomer(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleStatusChange = (value) => {
//     setCustomer(prev => ({
//       ...prev,
//       activity_status: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(`http://localhost:8000/customers/${params.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(customer),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update customer');
//       }

//       router.push('/dashboard/customers');
//       router.refresh();
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && !customer.name) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <Card className="max-w-2xl mx-auto">
//       <CardHeader>
//         <CardTitle>Update Customer Details</CardTitle>
//       </CardHeader>
//       <CardContent>
//         {error && (
//           <Alert variant="destructive" className="mb-6">
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle>Error</AlertTitle>
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="space-y-2">
//             <label className="text-sm font-medium">Name</label>
//             <Input
//               name="name"
//               value={customer.name}
//               onChange={handleChange}
//               placeholder="Customer name"
//               required
//             />
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-medium">Email</label>
//             <Input
//               name="email"
//               type="email"
//               value={customer.email}
//               onChange={handleChange}
//               placeholder="customer@example.com"
//               required
//             />
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-medium">Mobile Number</label>
//             <Input
//               name="mobile"
//               value={customer.mobile}
//               onChange={handleChange}
//               placeholder="Mobile number"
//               required
//             />
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-medium">Activity Status</label>
//             <Select
//               value={customer.activity_status}
//               onValueChange={handleStatusChange}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="active">Active</SelectItem>
//                 <SelectItem value="inactive">Inactive</SelectItem>
//                 <SelectItem value="pending">Pending</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="flex gap-4">
//             <Button
//               type="submit"
//               disabled={loading}
//               className="w-full"
//             >
//               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               Update Customer
//             </Button>
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => router.back()}
//               className="w-full"
//             >
//               Cancel
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   );
// };

// export default UpdateCustomerForm;