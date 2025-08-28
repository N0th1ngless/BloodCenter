"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Filter, Plus, Eye, CheckCircle, XCircle, Clock, AlertTriangle, FileText, Download } from "lucide-react"
import { cn } from "@/lib/utils"

interface BloodRequest {
  id: string
  requestDate: string
  requestingWard: string
  requestingPhysician: string
  patientName: string
  patientId: string
  bloodType: string
  component: string
  unitsRequested: number
  urgency: "routine" | "urgent" | "emergency"
  status: "pending" | "approved" | "fulfilled" | "rejected" | "cancelled"
  indication: string
  crossMatchStatus: "pending" | "compatible" | "incompatible"
  allocatedUnits: string[]
  transfusionDate?: string
  notes?: string
}

interface Transfusion {
  id: string
  requestId: string
  patientName: string
  patientId: string
  bloodType: string
  component: string
  unitId: string
  transfusionDate: string
  startTime: string
  endTime?: string
  status: "in_progress" | "completed" | "adverse_reaction" | "stopped"
  vitals: {
    preTransfusion: { bp: string; pulse: string; temp: string }
    postTransfusion?: { bp: string; pulse: string; temp: string }
  }
  reactions?: string
  performedBy: string
}

const mockRequests: BloodRequest[] = [
  {
    id: "REQ001",
    requestDate: "2024-01-18",
    requestingWard: "Emergency Department",
    requestingPhysician: "Dr. Maria Santos",
    patientName: "Juan Dela Cruz",
    patientId: "P001",
    bloodType: "A+",
    component: "RBCs",
    unitsRequested: 2,
    urgency: "urgent",
    status: "approved",
    indication: "Acute blood loss due to trauma",
    crossMatchStatus: "compatible",
    allocatedUnits: ["BU001", "BU004"],
  },
  {
    id: "REQ002",
    requestDate: "2024-01-18",
    requestingWard: "Surgery",
    requestingPhysician: "Dr. Carlos Reyes",
    patientName: "Maria Garcia",
    patientId: "P002",
    bloodType: "O+",
    component: "Whole Blood",
    unitsRequested: 1,
    urgency: "routine",
    status: "pending",
    indication: "Pre-operative preparation",
    crossMatchStatus: "pending",
    allocatedUnits: [],
  },
  {
    id: "REQ003",
    requestDate: "2024-01-17",
    requestingWard: "ICU",
    requestingPhysician: "Dr. Ana Lopez",
    patientName: "Pedro Martinez",
    patientId: "P003",
    bloodType: "B+",
    component: "Platelets",
    unitsRequested: 1,
    urgency: "emergency",
    status: "fulfilled",
    indication: "Severe thrombocytopenia",
    crossMatchStatus: "compatible",
    allocatedUnits: ["BU003"],
    transfusionDate: "2024-01-17",
  },
]

const mockTransfusions: Transfusion[] = [
  {
    id: "TXN001",
    requestId: "REQ003",
    patientName: "Pedro Martinez",
    patientId: "P003",
    bloodType: "B+",
    component: "Platelets",
    unitId: "BU003",
    transfusionDate: "2024-01-17",
    startTime: "14:30",
    endTime: "16:00",
    status: "completed",
    vitals: {
      preTransfusion: { bp: "120/80", pulse: "85", temp: "37.2" },
      postTransfusion: { bp: "125/82", pulse: "88", temp: "37.0" },
    },
    performedBy: "Nurse Jane Smith",
  },
]

export function RequestManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedUrgency, setSelectedUrgency] = useState("all")
  const [selectedWard, setSelectedWard] = useState("all")
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500 text-white"
      case "approved":
        return "bg-blue-500 text-white"
      case "fulfilled":
        return "bg-[#4ea674] text-white"
      case "rejected":
        return "bg-red-500 text-white"
      case "cancelled":
        return "bg-gray-500 text-white"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return "bg-red-500 text-white"
      case "urgent":
        return "bg-yellow-500 text-white"
      case "routine":
        return "bg-[#4ea674] text-white"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  const getTransfusionStatusColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "bg-blue-500 text-white"
      case "completed":
        return "bg-[#4ea674] text-white"
      case "adverse_reaction":
        return "bg-red-500 text-white"
      case "stopped":
        return "bg-gray-500 text-white"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  const filteredRequests = mockRequests.filter((request) => {
    const matchesSearch =
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requestingPhysician.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requestingWard.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || request.status === selectedStatus
    const matchesUrgency = selectedUrgency === "all" || request.urgency === selectedUrgency
    const matchesWard = selectedWard === "all" || request.requestingWard === selectedWard

    return matchesSearch && matchesStatus && matchesUrgency && matchesWard
  })

  const requestStats = {
    total: mockRequests.length,
    pending: mockRequests.filter((r) => r.status === "pending").length,
    approved: mockRequests.filter((r) => r.status === "approved").length,
    fulfilled: mockRequests.filter((r) => r.status === "fulfilled").length,
    emergency: mockRequests.filter((r) => r.urgency === "emergency").length,
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#023337]">Request & Transfusion Management</h1>
          <p className="text-[#023337]/70">Manage blood requests, approvals, and transfusion monitoring</p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#4ea674] hover:bg-[#4ea674]/80 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-[#023337]">Create Blood Request</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName" className="text-[#023337]">
                    Patient Name
                  </Label>
                  <Input id="patientName" className="border-[#c0e6b9] focus:border-[#4ea674]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientId" className="text-[#023337]">
                    Patient ID
                  </Label>
                  <Input id="patientId" className="border-[#c0e6b9] focus:border-[#4ea674]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requestingWard" className="text-[#023337]">
                    Requesting Ward
                  </Label>
                  <Select>
                    <SelectTrigger className="border-[#c0e6b9] focus:border-[#4ea674]">
                      <SelectValue placeholder="Select ward" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emergency">Emergency Department</SelectItem>
                      <SelectItem value="surgery">Surgery</SelectItem>
                      <SelectItem value="icu">ICU</SelectItem>
                      <SelectItem value="pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="oncology">Oncology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="physician" className="text-[#023337]">
                    Requesting Physician
                  </Label>
                  <Input id="physician" className="border-[#c0e6b9] focus:border-[#4ea674]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloodType" className="text-[#023337]">
                    Blood Type
                  </Label>
                  <Select>
                    <SelectTrigger className="border-[#c0e6b9] focus:border-[#4ea674]">
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="component" className="text-[#023337]">
                    Component
                  </Label>
                  <Select>
                    <SelectTrigger className="border-[#c0e6b9] focus:border-[#4ea674]">
                      <SelectValue placeholder="Select component" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whole_blood">Whole Blood</SelectItem>
                      <SelectItem value="rbcs">RBCs</SelectItem>
                      <SelectItem value="platelets">Platelets</SelectItem>
                      <SelectItem value="ffp">FFP</SelectItem>
                      <SelectItem value="cryo">Cryo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="units" className="text-[#023337]">
                    Units Requested
                  </Label>
                  <Input id="units" type="number" min="1" className="border-[#c0e6b9] focus:border-[#4ea674]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="urgency" className="text-[#023337]">
                    Urgency
                  </Label>
                  <Select>
                    <SelectTrigger className="border-[#c0e6b9] focus:border-[#4ea674]">
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="indication" className="text-[#023337]">
                    Clinical Indication
                  </Label>
                  <Textarea id="indication" className="border-[#c0e6b9] focus:border-[#4ea674]" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsNewRequestOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-[#4ea674] hover:bg-[#4ea674]/80 text-white">Submit Request</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="border-[#4ea674] text-[#4ea674] bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { title: "Total Requests", value: requestStats.total, icon: FileText, color: "text-[#023337]" },
          { title: "Pending", value: requestStats.pending, icon: Clock, color: "text-yellow-500" },
          { title: "Approved", value: requestStats.approved, icon: CheckCircle, color: "text-blue-500" },
          { title: "Fulfilled", value: requestStats.fulfilled, icon: CheckCircle, color: "text-[#4ea674]" },
          { title: "Emergency", value: requestStats.emergency, icon: AlertTriangle, color: "text-red-500" },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-[#c0e6b9]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#023337]">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList className="bg-[#e9f8e7] text-[#023337]">
          <TabsTrigger value="requests" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Blood Requests
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Pending Approval
          </TabsTrigger>
          <TabsTrigger value="transfusions" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Active Transfusions
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Transfusion History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          {/* Filters */}
          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337] flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#023337]/50" />
                  <Input
                    placeholder="Search requests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-[#c0e6b9] focus:border-[#4ea674]"
                  />
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="border-[#c0e6b9] focus:border-[#4ea674]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="fulfilled">Fulfilled</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
                  <SelectTrigger className="border-[#c0e6b9] focus:border-[#4ea674]">
                    <SelectValue placeholder="Urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Urgency</SelectItem>
                    <SelectItem value="routine">Routine</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedWard} onValueChange={setSelectedWard}>
                  <SelectTrigger className="border-[#c0e6b9] focus:border-[#4ea674]">
                    <SelectValue placeholder="Ward" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Wards</SelectItem>
                    <SelectItem value="Emergency Department">Emergency Department</SelectItem>
                    <SelectItem value="Surgery">Surgery</SelectItem>
                    <SelectItem value="ICU">ICU</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Requests Table */}
          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337]">Blood Requests ({filteredRequests.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[#023337]">Request ID</TableHead>
                    <TableHead className="text-[#023337]">Date</TableHead>
                    <TableHead className="text-[#023337]">Patient</TableHead>
                    <TableHead className="text-[#023337]">Ward</TableHead>
                    <TableHead className="text-[#023337]">Blood Type</TableHead>
                    <TableHead className="text-[#023337]">Component</TableHead>
                    <TableHead className="text-[#023337]">Units</TableHead>
                    <TableHead className="text-[#023337]">Urgency</TableHead>
                    <TableHead className="text-[#023337]">Status</TableHead>
                    <TableHead className="text-[#023337]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium text-[#023337]">{request.id}</TableCell>
                      <TableCell className="text-[#023337]">{request.requestDate}</TableCell>
                      <TableCell className="text-[#023337]">
                        <div>
                          <div className="font-medium">{request.patientName}</div>
                          <div className="text-sm text-[#023337]/70">{request.patientId}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-[#023337]">{request.requestingWard}</TableCell>
                      <TableCell className="text-[#023337]">
                        <Badge variant="outline" className="border-[#4ea674] text-[#4ea674]">
                          {request.bloodType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#023337]">{request.component}</TableCell>
                      <TableCell className="text-[#023337]">{request.unitsRequested}</TableCell>
                      <TableCell>
                        <Badge className={cn("capitalize", getUrgencyColor(request.urgency))}>{request.urgency}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("capitalize", getStatusColor(request.status))}>{request.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#4ea674] text-[#4ea674] bg-transparent"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          {request.status === "pending" && (
                            <>
                              <Button size="sm" className="bg-[#4ea674] hover:bg-[#4ea674]/80 text-white">
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500 text-red-500 bg-transparent"
                              >
                                <XCircle className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337]">Requests Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRequests
                  .filter((request) => request.status === "pending")
                  .map((request) => (
                    <div key={request.id} className="p-4 bg-[#e9f8e7] rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium text-[#023337]">{request.id}</span>
                          </div>
                          <Badge className={cn("capitalize", getUrgencyColor(request.urgency))}>
                            {request.urgency}
                          </Badge>
                          <div className="text-[#023337]">
                            <div className="font-medium">{request.patientName}</div>
                            <div className="text-sm text-[#023337]/70">{request.requestingWard}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right text-[#023337]">
                            <div className="font-medium">
                              {request.unitsRequested} units of {request.component}
                            </div>
                            <div className="text-sm text-[#023337]/70">Blood Type: {request.bloodType}</div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" className="bg-[#4ea674] hover:bg-[#4ea674]/80 text-white">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-500 text-red-500 bg-transparent">
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-[#023337]/70">
                        <strong>Indication:</strong> {request.indication}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfusions" className="space-y-4">
          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337]">Active Transfusions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-[#e9f8e7] rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="font-medium text-[#023337]">TXN002</span>
                      </div>
                      <div className="text-[#023337]">
                        <div className="font-medium">Juan Dela Cruz (P001)</div>
                        <div className="text-sm text-[#023337]/70">Emergency Department</div>
                      </div>
                      <Badge variant="outline" className="border-[#4ea674] text-[#4ea674]">
                        A+ RBCs
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right text-[#023337]">
                        <div className="font-medium">Started: 15:30</div>
                        <div className="text-sm text-[#023337]/70">Unit: BU001</div>
                      </div>
                      <Button size="sm" className="bg-[#4ea674] hover:bg-[#4ea674]/80 text-white">
                        Monitor
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337]">Completed Transfusions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[#023337]">Transfusion ID</TableHead>
                    <TableHead className="text-[#023337]">Patient</TableHead>
                    <TableHead className="text-[#023337]">Blood Type</TableHead>
                    <TableHead className="text-[#023337]">Component</TableHead>
                    <TableHead className="text-[#023337]">Unit ID</TableHead>
                    <TableHead className="text-[#023337]">Date</TableHead>
                    <TableHead className="text-[#023337]">Duration</TableHead>
                    <TableHead className="text-[#023337]">Status</TableHead>
                    <TableHead className="text-[#023337]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTransfusions.map((transfusion) => (
                    <TableRow key={transfusion.id}>
                      <TableCell className="font-medium text-[#023337]">{transfusion.id}</TableCell>
                      <TableCell className="text-[#023337]">
                        <div>
                          <div className="font-medium">{transfusion.patientName}</div>
                          <div className="text-sm text-[#023337]/70">{transfusion.patientId}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-[#023337]">
                        <Badge variant="outline" className="border-[#4ea674] text-[#4ea674]">
                          {transfusion.bloodType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#023337]">{transfusion.component}</TableCell>
                      <TableCell className="text-[#023337]">{transfusion.unitId}</TableCell>
                      <TableCell className="text-[#023337]">{transfusion.transfusionDate}</TableCell>
                      <TableCell className="text-[#023337]">
                        {transfusion.startTime} - {transfusion.endTime}
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("capitalize", getTransfusionStatusColor(transfusion.status))}>
                          {transfusion.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" className="border-[#4ea674] text-[#4ea674] bg-transparent">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
