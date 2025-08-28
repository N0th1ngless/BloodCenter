"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle,
  Scan,
  Activity,
  Shield,
  Zap,
  Eye,
  Download,
  Heart,
  Droplets,
  UserCheck,
} from "lucide-react"

interface BloodRequest {
  id: string
  episodeId: string
  patient: {
    name: string
    mrn: string
    dob: string
    ward: string
    bed: string
  }
  clinician: {
    name: string
    license: string
    contact: string
  }
  indication: string
  justification: string
  component: string
  units: number
  urgency: "Routine" | "Urgent" | "STAT"
  specialRequirements: string[]
  crossmatchSample: string
  consent: boolean
  status:
    | "Pending"
    | "Approved"
    | "Reserved"
    | "Issued"
    | "Received"
    | "Verified"
    | "In-Transfusion"
    | "Completed"
    | "Denied"
    | "Emergency"
  requestedAt: string
  requestedBy: string
  allocatedUnits?: string[]
  reservationExpiry?: string
}

interface TransfusionRecord {
  id: string
  episodeId: string
  unitNumber: string
  component: string
  startTime?: string
  endTime?: string
  preVitals?: {
    temp: string
    bp: string
    pulse: string
    rr: string
  }
  postVitals?: {
    temp: string
    bp: string
    pulse: string
    rr: string
  }
  volumeTransfused?: string
  infusionDevice?: string
  nurseInitials?: string
  adverseEvent: boolean
  adverseEventDetails?: string
  status: "Pending" | "Started" | "Completed" | "Stopped"
}

export function BloodRequestsTransfusion() {
  const [activeTab, setActiveTab] = useState("queue")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [showAllocationModal, setShowAllocationModal] = useState(false)
  const [showIssueModal, setShowIssueModal] = useState(false)
  const [showBedsideModal, setShowBedsideModal] = useState(false)
  const [showTransfusionModal, setShowTransfusionModal] = useState(false)
  const [showEmergencyModal, setShowEmergencyModal] = useState(false)
  const [scannedBarcode, setScannedBarcode] = useState("")
  const [bedsideVerification, setBedsideVerification] = useState({
    patientScanned: false,
    unitScanned: false,
    witnessScanned: false,
  })

  // Mock data
  const bloodRequests: BloodRequest[] = [
    {
      id: "REQ-2024-001",
      episodeId: "EP-2024-001",
      patient: {
        name: "Maria Santos",
        mrn: "MRN-001234",
        dob: "1985-03-15",
        ward: "ICU",
        bed: "ICU-01",
      },
      clinician: {
        name: "Dr. Juan Cruz",
        license: "LIC-12345",
        contact: "09171234567",
      },
      indication: "Severe Anemia",
      justification: "Hb: 6.2 g/dL, symptomatic anemia",
      component: "PRBC",
      units: 2,
      urgency: "STAT",
      specialRequirements: ["Leukoreduced", "CMV Negative"],
      crossmatchSample: "TUBE-001234",
      consent: true,
      status: "Approved",
      requestedAt: "2024-01-15 08:30",
      requestedBy: "Dr. Juan Cruz",
      allocatedUnits: ["PRBC-240115-001", "PRBC-240115-002"],
      reservationExpiry: "2024-01-15 12:30",
    },
    {
      id: "REQ-2024-002",
      episodeId: "EP-2024-002",
      patient: {
        name: "Jose Reyes",
        mrn: "MRN-005678",
        dob: "1978-07-22",
        ward: "Surgery",
        bed: "SUR-05",
      },
      clinician: {
        name: "Dr. Ana Lopez",
        license: "LIC-67890",
        contact: "09189876543",
      },
      indication: "Pre-operative",
      justification: "Major surgery, Hb: 8.5 g/dL",
      component: "PRBC",
      units: 1,
      urgency: "Urgent",
      specialRequirements: [],
      crossmatchSample: "TUBE-005678",
      consent: true,
      status: "Reserved",
      requestedAt: "2024-01-15 09:15",
      requestedBy: "Dr. Ana Lopez",
      allocatedUnits: ["PRBC-240115-003"],
      reservationExpiry: "2024-01-15 13:15",
    },
  ]

  const transfusionRecords: TransfusionRecord[] = [
    {
      id: "TR-001",
      episodeId: "EP-2024-001",
      unitNumber: "PRBC-240115-001",
      component: "PRBC",
      startTime: "2024-01-15 10:30",
      preVitals: {
        temp: "37.2",
        bp: "110/70",
        pulse: "88",
        rr: "18",
      },
      adverseEvent: false,
      status: "Started",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Approved":
        return "bg-blue-100 text-blue-800"
      case "Reserved":
        return "bg-purple-100 text-purple-800"
      case "Issued":
        return "bg-orange-100 text-orange-800"
      case "Received":
        return "bg-indigo-100 text-indigo-800"
      case "Verified":
        return "bg-teal-100 text-teal-800"
      case "In-Transfusion":
        return "bg-green-100 text-green-800"
      case "Completed":
        return "bg-[#4ea674] text-white"
      case "Denied":
        return "bg-red-100 text-red-800"
      case "Emergency":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "STAT":
        return <Zap className="h-4 w-4 text-red-500" />
      case "Urgent":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "Routine":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const handleBarcodeScanning = (type: "patient" | "unit" | "witness") => {
    // Simulate barcode scanning
    setBedsideVerification((prev) => ({
      ...prev,
      [`${type}Scanned`]: true,
    }))
  }

  const isBedsideVerificationComplete = () => {
    return bedsideVerification.patientScanned && bedsideVerification.unitScanned && bedsideVerification.witnessScanned
  }

  return (
    <div className="p-6 space-y-6 bg-[#e9f8e7] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#023337]">Blood Requests & Transfusion</h1>
          <p className="text-[#4ea674] mt-1">Complete workflow from request to transfusion completion</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowRequestForm(true)} className="bg-[#4ea674] hover:bg-[#023337] text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
          <Button onClick={() => setShowEmergencyModal(true)} className="bg-red-500 hover:bg-red-600 text-white">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Emergency Release
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">STAT Requests</p>
                <p className="text-2xl font-bold text-red-500">3</p>
              </div>
              <Zap className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-orange-500">7</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Transfusions</p>
                <p className="text-2xl font-bold text-blue-500">12</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[#4ea674]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-[#4ea674]">28</p>
              </div>
              <CheckCircle className="h-8 w-8 text-[#4ea674]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-[#023337]">Request Management</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="queue">Request Queue</TabsTrigger>
              <TabsTrigger value="allocation">Allocation</TabsTrigger>
              <TabsTrigger value="issue">Issue & Dispatch</TabsTrigger>
              <TabsTrigger value="bedside">Bedside Verification</TabsTrigger>
              <TabsTrigger value="transfusion">Transfusion Records</TabsTrigger>
              <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="queue" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Ward</TableHead>
                      <TableHead>Component</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time Since Request</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bloodRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.patient.name}</p>
                            <p className="text-sm text-gray-500">{request.patient.mrn}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {request.patient.ward} - {request.patient.bed}
                        </TableCell>
                        <TableCell>{request.component}</TableCell>
                        <TableCell>{request.units}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getUrgencyIcon(request.urgency)}
                            {request.urgency}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                        </TableCell>
                        <TableCell>2h 15m</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setSelectedRequest(request)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {request.status === "Pending" && (
                              <Button size="sm" className="bg-[#4ea674] hover:bg-[#023337] text-white">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            {request.status === "Approved" && (
                              <Button
                                size="sm"
                                onClick={() => setShowAllocationModal(true)}
                                className="bg-purple-500 hover:bg-purple-600 text-white"
                              >
                                Allocate
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="allocation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#023337]">Unit Allocation & Reservation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Available Units (PRBC)</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center p-2 border rounded">
                              <div>
                                <p className="font-medium">PRBC-240115-001</p>
                                <p className="text-sm text-gray-500">O+ | Expires: 2024-01-22</p>
                              </div>
                              <Button size="sm" className="bg-[#4ea674] hover:bg-[#023337] text-white">
                                Reserve
                              </Button>
                            </div>
                            <div className="flex justify-between items-center p-2 border rounded">
                              <div>
                                <p className="font-medium">PRBC-240115-002</p>
                                <p className="text-sm text-gray-500">O+ | Expires: 2024-01-23</p>
                              </div>
                              <Button size="sm" className="bg-[#4ea674] hover:bg-[#023337] text-white">
                                Reserve
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Reserved Units</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center p-2 border rounded bg-purple-50">
                              <div>
                                <p className="font-medium">PRBC-240115-001</p>
                                <p className="text-sm text-gray-500">Reserved for REQ-2024-001</p>
                                <p className="text-xs text-red-500">Expires in: 1h 45m</p>
                              </div>
                              <Button size="sm" variant="outline">
                                Release
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="issue" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#023337]">Issue & Dispatch</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <Scan className="h-8 w-8 text-[#4ea674]" />
                      <div className="flex-1">
                        <Label htmlFor="barcode">Scan Unit Barcode</Label>
                        <Input
                          id="barcode"
                          placeholder="Scan or enter unit barcode..."
                          value={scannedBarcode}
                          onChange={(e) => setScannedBarcode(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <Button
                        onClick={() => setShowIssueModal(true)}
                        className="bg-[#4ea674] hover:bg-[#023337] text-white"
                      >
                        Issue Unit
                      </Button>
                    </div>

                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Unit Number</TableHead>
                            <TableHead>Component</TableHead>
                            <TableHead>Request ID</TableHead>
                            <TableHead>Destination</TableHead>
                            <TableHead>Issued By</TableHead>
                            <TableHead>Issue Time</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">PRBC-240115-001</TableCell>
                            <TableCell>PRBC</TableCell>
                            <TableCell>REQ-2024-001</TableCell>
                            <TableCell>ICU - Bed 01</TableCell>
                            <TableCell>Tech. Maria Cruz</TableCell>
                            <TableCell>2024-01-15 10:15</TableCell>
                            <TableCell>
                              <Badge className="bg-orange-100 text-orange-800">Issued</Badge>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bedside" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#023337]">Bedside Verification</CardTitle>
                  <p className="text-sm text-gray-600">Mandatory 3-way barcode verification before transfusion</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card
                        className={`border-2 ${bedsideVerification.patientScanned ? "border-green-500 bg-green-50" : "border-gray-300"}`}
                      >
                        <CardContent className="p-4 text-center">
                          <UserCheck
                            className={`h-12 w-12 mx-auto mb-2 ${bedsideVerification.patientScanned ? "text-green-500" : "text-gray-400"}`}
                          />
                          <h3 className="font-medium">Patient Wristband</h3>
                          <Button
                            onClick={() => handleBarcodeScanning("patient")}
                            disabled={bedsideVerification.patientScanned}
                            className="mt-2 w-full"
                            variant={bedsideVerification.patientScanned ? "outline" : "default"}
                          >
                            {bedsideVerification.patientScanned ? "Verified" : "Scan Patient"}
                          </Button>
                        </CardContent>
                      </Card>

                      <Card
                        className={`border-2 ${bedsideVerification.unitScanned ? "border-green-500 bg-green-50" : "border-gray-300"}`}
                      >
                        <CardContent className="p-4 text-center">
                          <Droplets
                            className={`h-12 w-12 mx-auto mb-2 ${bedsideVerification.unitScanned ? "text-green-500" : "text-gray-400"}`}
                          />
                          <h3 className="font-medium">Blood Unit</h3>
                          <Button
                            onClick={() => handleBarcodeScanning("unit")}
                            disabled={bedsideVerification.unitScanned}
                            className="mt-2 w-full"
                            variant={bedsideVerification.unitScanned ? "outline" : "default"}
                          >
                            {bedsideVerification.unitScanned ? "Verified" : "Scan Unit"}
                          </Button>
                        </CardContent>
                      </Card>

                      <Card
                        className={`border-2 ${bedsideVerification.witnessScanned ? "border-green-500 bg-green-50" : "border-gray-300"}`}
                      >
                        <CardContent className="p-4 text-center">
                          <Shield
                            className={`h-12 w-12 mx-auto mb-2 ${bedsideVerification.witnessScanned ? "text-green-500" : "text-gray-400"}`}
                          />
                          <h3 className="font-medium">Witness/Staff ID</h3>
                          <Button
                            onClick={() => handleBarcodeScanning("witness")}
                            disabled={bedsideVerification.witnessScanned}
                            className="mt-2 w-full"
                            variant={bedsideVerification.witnessScanned ? "outline" : "default"}
                          >
                            {bedsideVerification.witnessScanned ? "Verified" : "Scan Witness"}
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="text-center">
                      <Button
                        onClick={() => setShowTransfusionModal(true)}
                        disabled={!isBedsideVerificationComplete()}
                        className={`px-8 py-3 text-lg ${isBedsideVerificationComplete() ? "bg-[#4ea674] hover:bg-[#023337]" : "bg-gray-300"} text-white`}
                      >
                        <Heart className="h-5 w-5 mr-2" />
                        Start Transfusion
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transfusion" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#023337]">Active Transfusion Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Episode ID</TableHead>
                          <TableHead>Unit Number</TableHead>
                          <TableHead>Component</TableHead>
                          <TableHead>Patient</TableHead>
                          <TableHead>Start Time</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transfusionRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">{record.episodeId}</TableCell>
                            <TableCell>{record.unitNumber}</TableCell>
                            <TableCell>{record.component}</TableCell>
                            <TableCell>Maria Santos</TableCell>
                            <TableCell>{record.startTime}</TableCell>
                            <TableCell>45 minutes</TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-800">{record.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                                  Stop
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Time Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Avg Request→Approval:</span>
                        <span className="font-medium">45 min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Avg Approval→Issue:</span>
                        <span className="font-medium">32 min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Avg Issue→Bedside:</span>
                        <span className="font-medium">18 min</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Safety Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Bedside Verification:</span>
                        <span className="font-medium text-green-600">99.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Reaction Rate:</span>
                        <span className="font-medium">0.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Emergency Overrides:</span>
                        <span className="font-medium">3</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Operational Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Reservation Expiry:</span>
                        <span className="font-medium">2.1%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Return Rate:</span>
                        <span className="font-medium">1.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Wastage Rate:</span>
                        <span className="font-medium">0.5%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-[#023337]">Export Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Button className="bg-[#4ea674] hover:bg-[#023337] text-white">
                      <Download className="h-4 w-4 mr-2" />
                      Transfusion Summary
                    </Button>
                    <Button className="bg-[#4ea674] hover:bg-[#023337] text-white">
                      <Download className="h-4 w-4 mr-2" />
                      Safety Report
                    </Button>
                    <Button className="bg-[#4ea674] hover:bg-[#023337] text-white">
                      <Download className="h-4 w-4 mr-2" />
                      Regulatory Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Request Form Modal */}
      <Dialog open={showRequestForm} onOpenChange={setShowRequestForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Blood Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="font-medium text-[#023337]">Patient Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patientName">Full Name *</Label>
                    <Input id="patientName" required />
                  </div>
                  <div>
                    <Label htmlFor="mrn">MRN/Hospital ID *</Label>
                    <Input id="mrn" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dob">Date of Birth *</Label>
                    <Input id="dob" type="date" required />
                  </div>
                  <div>
                    <Label htmlFor="ward">Ward *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ward" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="icu">ICU</SelectItem>
                        <SelectItem value="surgery">Surgery</SelectItem>
                        <SelectItem value="medicine">Medicine</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="bed">Bed Number *</Label>
                  <Input id="bed" required />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-[#023337]">Ordering Clinician</h3>
                <div>
                  <Label htmlFor="clinicianName">Clinician Name *</Label>
                  <Input id="clinicianName" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="license">License No. *</Label>
                    <Input id="license" required />
                  </div>
                  <div>
                    <Label htmlFor="contact">Contact *</Label>
                    <Input id="contact" required />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-[#023337]">Clinical Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="indication">Clinical Indication *</Label>
                  <Input id="indication" required />
                </div>
                <div>
                  <Label htmlFor="urgency">Urgency *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="stat">STAT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="justification">Clinical Justification *</Label>
                <Textarea id="justification" placeholder="Include Hb/plt values and clinical reasoning" required />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-[#023337]">Product Request</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="component">Component *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select component" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wb">Whole Blood</SelectItem>
                      <SelectItem value="prbc">PRBC</SelectItem>
                      <SelectItem value="ffp">FFP</SelectItem>
                      <SelectItem value="platelets">Platelets</SelectItem>
                      <SelectItem value="cryo">Cryoprecipitate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="units">Number of Units *</Label>
                  <Input id="units" type="number" min="1" required />
                </div>
              </div>
              <div>
                <Label>Special Requirements</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="irradiated" />
                    <Label htmlFor="irradiated">Irradiated</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="leukoreduced" />
                    <Label htmlFor="leukoreduced">Leukoreduced</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="cmv" />
                    <Label htmlFor="cmv">CMV Negative</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="washed" />
                    <Label htmlFor="washed">Washed</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="sample">Crossmatch Sample ID *</Label>
                <Input id="sample" required />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="consent" required />
                <Label htmlFor="consent">Patient consent obtained *</Label>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setShowRequestForm(false)}>
                Cancel
              </Button>
              <Button className="bg-[#4ea674] hover:bg-[#023337] text-white">Submit Request</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Emergency Release Modal */}
      <Dialog open={showEmergencyModal} onOpenChange={setShowEmergencyModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Emergency Uncrossmatched Release</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Life-Threatening Emergency</span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                This action requires two-person authorization and will be flagged for audit review.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="emergencyReason">Emergency Reason *</Label>
                <Textarea
                  id="emergencyReason"
                  placeholder="Describe the life-threatening situation requiring uncrossmatched blood"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supervisor">Supervisor Authorization *</Label>
                  <Input id="supervisor" placeholder="Supervisor name and signature" required />
                </div>
                <div>
                  <Label htmlFor="transfusionOfficer">Transfusion Officer *</Label>
                  <Input id="transfusionOfficer" placeholder="Officer name and signature" required />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setShowEmergencyModal(false)}>
                Cancel
              </Button>
              <Button className="bg-red-500 hover:bg-red-600 text-white">Authorize Emergency Release</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
