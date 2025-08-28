"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Plus,
  Search,
  Edit,
  Eye,
  FileText,
  Package,
  Truck,
  RotateCcw,
  Download,
  QrCode,
  Scan,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  Activity,
} from "lucide-react"

interface Facility {
  id: string
  code: string
  name: string
  address: string
  type: string
  accreditationExpiry: string
  status: "Active" | "Inactive"
  contactPerson: string
  phone: string
  email: string
  dohLicense: string
}

interface StockRequest {
  id: string
  facilityCode: string
  facilityName: string
  component: string
  bloodGroup: string
  units: number
  patientCategory: string
  justification: string
  status: "Pending" | "Approved" | "Packed" | "Dispatched" | "Rejected"
  requestDate: string
  approvedBy?: string
  dispatchDate?: string
}

interface DispatchRecord {
  id: string
  requestId: string
  unitNumbers: string[]
  barcodes: string[]
  expiryDates: string[]
  courier: string
  dispatchDate: string
  signature: string
}

const mockFacilities: Facility[] = [
  {
    id: "1",
    code: "BSF001",
    name: "Bicol Medical Center",
    address: "Naga City, Camarines Sur",
    type: "Hospital",
    accreditationExpiry: "2025-12-31",
    status: "Active",
    contactPerson: "Dr. Maria Santos",
    phone: "054-123-4567",
    email: "bmc@email.com",
    dohLicense: "DOH-V-001",
  },
  {
    id: "2",
    code: "BSF002",
    name: "Camarines Sur Provincial Hospital",
    address: "Pili, Camarines Sur",
    type: "Hospital",
    accreditationExpiry: "2025-06-30",
    status: "Active",
    contactPerson: "Dr. Juan Cruz",
    phone: "054-987-6543",
    email: "csph@email.com",
    dohLicense: "DOH-V-002",
  },
]

const mockRequests: StockRequest[] = [
  {
    id: "REQ001",
    facilityCode: "BSF001",
    facilityName: "Bicol Medical Center",
    component: "Packed RBC",
    bloodGroup: "O+",
    units: 5,
    patientCategory: "Emergency",
    justification: "Multiple trauma patient requiring immediate transfusion",
    status: "Pending",
    requestDate: "2024-01-15",
  },
  {
    id: "REQ002",
    facilityCode: "BSF002",
    facilityName: "Camarines Sur Provincial Hospital",
    component: "Fresh Frozen Plasma",
    bloodGroup: "AB+",
    units: 3,
    patientCategory: "Scheduled",
    justification: "Elective surgery with anticipated blood loss",
    status: "Approved",
    requestDate: "2024-01-14",
    approvedBy: "Dr. Admin",
  },
]

const bloodComponents = ["Packed RBC", "Fresh Frozen Plasma", "Platelets", "Whole Blood", "Cryoprecipitate"]
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const patientCategories = ["Emergency", "Scheduled", "Routine"]
const facilityTypes = ["Hospital", "Clinic", "Diagnostic Center"]

export function BSFManagement() {
  const [activeTab, setActiveTab] = useState("registry")
  const [facilities, setFacilities] = useState<Facility[]>(mockFacilities)
  const [requests, setRequests] = useState<StockRequest[]>(mockRequests)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<StockRequest | null>(null)
  const [showAddFacility, setShowAddFacility] = useState(false)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [showDispatchForm, setShowDispatchForm] = useState(false)

  const generateFacilityCode = () => {
    const nextNumber = facilities.length + 1
    return `BSF${nextNumber.toString().padStart(3, "0")}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Approved":
        return "bg-blue-100 text-blue-800"
      case "Packed":
        return "bg-purple-100 text-purple-800"
      case "Dispatched":
        return "bg-green-100 text-green-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      case "Active":
        return "bg-green-100 text-green-800"
      case "Inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredFacilities = facilities.filter(
    (facility) =>
      facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.code.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredRequests = requests.filter(
    (request) =>
      request.facilityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.component.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#023337]">Blood Service Facility Management</h1>
          <p className="text-gray-600">Manage external hospitals and clinics requesting blood products</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-[#4ea674] hover:bg-[#4ea674]/80">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-[#4ea674]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Facilities</p>
                <p className="text-2xl font-bold text-[#023337]">
                  {facilities.filter((f) => f.status === "Active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-[#023337]">
                  {requests.filter((r) => r.status === "Pending").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Dispatched Today</p>
                <p className="text-2xl font-bold text-[#023337]">
                  {requests.filter((r) => r.status === "Dispatched").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expiring Accreditations</p>
                <p className="text-2xl font-bold text-[#023337]">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="registry">Facility Registry</TabsTrigger>
          <TabsTrigger value="requests">Stock Requests</TabsTrigger>
          <TabsTrigger value="dispatch">Dispatch & Returns</TabsTrigger>
          <TabsTrigger value="history">Supply History</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Facility Registry */}
        <TabsContent value="registry" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search facilities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            </div>
            <Dialog open={showAddFacility} onOpenChange={setShowAddFacility}>
              <DialogTrigger asChild>
                <Button className="bg-[#4ea674] hover:bg-[#4ea674]/80">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Facility
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Register New Facility</DialogTitle>
                  <DialogDescription>Add a new blood service facility to the registry</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facilityCode">Facility Code</Label>
                    <Input id="facilityCode" value={generateFacilityCode()} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facilityName">Facility Name</Label>
                    <Input id="facilityName" placeholder="Enter facility name" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="Enter complete address" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facilityType">Facility Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {facilityTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dohLicense">DOH License</Label>
                    <Input id="dohLicense" placeholder="DOH-V-XXX" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input id="contactPerson" placeholder="Dr. Name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="054-XXX-XXXX" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="facility@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accreditationExpiry">Accreditation Expiry</Label>
                    <Input id="accreditationExpiry" type="date" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="active" defaultChecked />
                    <Label htmlFor="active">Active Status</Label>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setShowAddFacility(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-[#4ea674] hover:bg-[#4ea674]/80">Register Facility</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Facility Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Accreditation Expiry</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFacilities.map((facility) => (
                    <TableRow key={facility.id}>
                      <TableCell className="font-medium">{facility.code}</TableCell>
                      <TableCell>{facility.name}</TableCell>
                      <TableCell>{facility.type}</TableCell>
                      <TableCell>{facility.address}</TableCell>
                      <TableCell>{facility.accreditationExpiry}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(facility.status)}>{facility.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock Requests */}
        <TabsContent value="requests" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            </div>
            <Dialog open={showRequestForm} onOpenChange={setShowRequestForm}>
              <DialogTrigger asChild>
                <Button className="bg-[#4ea674] hover:bg-[#4ea674]/80">
                  <Plus className="h-4 w-4 mr-2" />
                  New Request
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Stock Request Form</DialogTitle>
                  <DialogDescription>Submit a new blood product request</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="requestFacility">Facility</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select facility" />
                      </SelectTrigger>
                      <SelectContent>
                        {facilities.map((facility) => (
                          <SelectItem key={facility.id} value={facility.code}>
                            {facility.name} ({facility.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="component">Blood Component</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select component" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodComponents.map((component) => (
                          <SelectItem key={component} value={component}>
                            {component}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodGroups.map((group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="units">Units Requested</Label>
                    <Input id="units" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientCategory">Patient Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {patientCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="justification">Justification (Required for Traceability)</Label>
                    <Textarea
                      id="justification"
                      placeholder="Provide detailed justification for the blood request..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Current Inventory Snapshot */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Current Inventory Snapshot</h4>
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    <div>O+: 25 units</div>
                    <div>O-: 12 units</div>
                    <div>A+: 18 units</div>
                    <div>A-: 8 units</div>
                    <div>B+: 15 units</div>
                    <div>B-: 6 units</div>
                    <div>AB+: 10 units</div>
                    <div>AB-: 4 units</div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setShowRequestForm(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-[#4ea674] hover:bg-[#4ea674]/80">Submit Request</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Facility</TableHead>
                    <TableHead>Component</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>{request.facilityName}</TableCell>
                      <TableCell>{request.component}</TableCell>
                      <TableCell>{request.bloodGroup}</TableCell>
                      <TableCell>{request.units}</TableCell>
                      <TableCell>{request.patientCategory}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {request.status === "Pending" && (
                            <>
                              <Button variant="outline" size="sm" className="text-green-600 bg-transparent">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 bg-transparent">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {request.status === "Approved" && (
                            <Button variant="outline" size="sm" className="text-blue-600 bg-transparent">
                              <Package className="h-4 w-4" />
                            </Button>
                          )}
                          {request.status === "Packed" && (
                            <Button variant="outline" size="sm" className="text-purple-600 bg-transparent">
                              <Truck className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dispatch & Returns */}
        <TabsContent value="dispatch" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dispatch Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Dispatch Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Request ID</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select packed request" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="REQ001">REQ001 - Bicol Medical Center</SelectItem>
                      <SelectItem value="REQ002">REQ002 - CSPH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Unit Numbers & Barcodes</Label>
                  <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Unit: RBC240115001</span>
                      <Button variant="outline" size="sm">
                        <Scan className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Unit: RBC240115002</span>
                      <Button variant="outline" size="sm">
                        <Scan className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Assigned Courier</Label>
                  <Input placeholder="Enter courier name" />
                </div>

                <Button className="w-full bg-[#4ea674] hover:bg-[#4ea674]/80">
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate Dispatch Form & QR Code
                </Button>
              </CardContent>
            </Card>

            {/* Returns Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Returns Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Unit Number</Label>
                  <Input placeholder="Scan or enter unit number" />
                </div>

                <div className="space-y-2">
                  <Label>Return Condition</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="acceptable">Acceptable - Return to Stock</SelectItem>
                      <SelectItem value="damaged">Damaged - Discard</SelectItem>
                      <SelectItem value="expired">Expired - Discard</SelectItem>
                      <SelectItem value="contaminated">Contaminated - Discard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Return Reason</Label>
                  <Textarea placeholder="Provide reason for return..." rows={3} />
                </div>

                <div className="space-y-2">
                  <Label>QA Review Status</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="qaApproved" />
                    <Label htmlFor="qaApproved">QA Approved</Label>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">Process Return</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Supply History */}
        <TabsContent value="history" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Summary Cards */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Requests</span>
                    <span className="font-medium">45</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Fulfilled</span>
                    <span className="font-medium text-green-600">42</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Rejected</span>
                    <span className="font-medium text-red-600">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Fulfillment Rate</span>
                    <span className="font-medium">93.3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Returns & Discards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Units Returned</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Restocked</span>
                    <span className="font-medium text-green-600">6</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Discarded</span>
                    <span className="font-medium text-red-600">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Return Rate</span>
                    <span className="font-medium">4.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Requesting Facilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Bicol Medical Center</span>
                    <span className="font-medium">28 units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">CSPH</span>
                    <span className="font-medium">15 units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Naga City Hospital</span>
                    <span className="font-medium">12 units</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle>Export Reports</CardTitle>
              <CardDescription>Generate compliance reports for DOH/AABB requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Monthly Supply Report (PDF)
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Facility Performance (Excel)
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Audit Trail Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance */}
        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Trail</CardTitle>
                <CardDescription>Complete traceability from facility to patient</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">REQ001 - Bicol Medical Center</span>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>• Request submitted: 2024-01-15 08:30</div>
                      <div>• Approved by: Dr. Admin - 2024-01-15 09:15</div>
                      <div>• Units packed: RBC240115001, RBC240115002</div>
                      <div>• Dispatched: 2024-01-15 14:20</div>
                      <div>• Digital signature: Dr. Santos (BMC)</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Digital Signatures</CardTitle>
                <CardDescription>Authorized personnel signatures for releases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium">Dr. Admin</div>
                      <div className="text-sm text-gray-600">Blood Bank Manager</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Authorized</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium">Nurse Jane</div>
                      <div className="text-sm text-gray-600">Senior Technologist</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Authorized</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Stock Reconciliation</CardTitle>
              <CardDescription>DOH template-aligned reconciliation reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component</TableHead>
                      <TableHead>Opening Stock</TableHead>
                      <TableHead>Received</TableHead>
                      <TableHead>Issued</TableHead>
                      <TableHead>Returned</TableHead>
                      <TableHead>Discarded</TableHead>
                      <TableHead>Closing Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Packed RBC O+</TableCell>
                      <TableCell>30</TableCell>
                      <TableCell>15</TableCell>
                      <TableCell>18</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>28</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>FFP AB+</TableCell>
                      <TableCell>12</TableCell>
                      <TableCell>8</TableCell>
                      <TableCell>5</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>15</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Request Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <p>Monthly request trends chart</p>
                    <p className="text-sm">Integration with charting library needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Facility Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bicol Medical Center</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "95%" }}></div>
                      </div>
                      <span className="text-sm font-medium">95%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">CSPH</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "88%" }}></div>
                      </div>
                      <span className="text-sm font-medium">88%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Naga City Hospital</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "72%" }}></div>
                      </div>
                      <span className="text-sm font-medium">72%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">93.3%</div>
                  <div className="text-sm text-gray-600">Average Fulfillment Rate</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">2.1 hrs</div>
                  <div className="text-sm text-gray-600">Average Response Time</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">4.2%</div>
                  <div className="text-sm text-gray-600">Return Rate</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">98.5%</div>
                  <div className="text-sm text-gray-600">Compliance Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
