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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Plus,
  Eye,
  FileText,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  Phone,
  Mail,
  Calendar,
  User,
  Activity,
  Download,
  QrCode,
  Shield,
  Bell,
} from "lucide-react"

interface ClearanceCase {
  id: string
  caseId: string
  patientName: string
  mrn: string
  ward: string
  bed: string
  episodeId: string
  unitsRequired: number
  component: string
  clinician: string
  urgency: "Low" | "Medium" | "High" | "Emergency"
  status: "New" | "Donor Required" | "Cleared" | "Exempt" | "Awaiting Replacement" | "Failed"
  createdAt: string
  assignedStaff: string
  exemptionReason?: string
  donorInfo?: {
    name: string
    donorId: string
    relationship: string
    contact: string
    status: "Scheduled" | "Pre-screening" | "Donated" | "Deferred" | "No-show"
  }
  unitInfo?: {
    unitNumber: string
    segmentNumber: string
    bagType: string
    outcome: "Accepted" | "QNS" | "FP" | "Reactive"
  }
}

export function ClearanceUI() {
  const [activeTab, setActiveTab] = useState("queue")
  const [selectedCase, setSelectedCase] = useState<ClearanceCase | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [urgencyFilter, setUrgencyFilter] = useState("all")
  const [showNewCaseDialog, setShowNewCaseDialog] = useState(false)

  // Mock data for clearance cases
  const clearanceCases: ClearanceCase[] = [
    {
      id: "1",
      caseId: "CLR-2024-001",
      patientName: "Maria Santos",
      mrn: "MRN-2024-001",
      ward: "ICU",
      bed: "ICU-01",
      episodeId: "EP-2024-001",
      unitsRequired: 2,
      component: "Packed RBC",
      clinician: "Dr. Rodriguez",
      urgency: "High",
      status: "Donor Required",
      createdAt: "2024-01-15 08:30",
      assignedStaff: "Nurse Garcia",
      donorInfo: {
        name: "Juan Santos",
        donorId: "D24010001",
        relationship: "Son",
        contact: "+63 917 123 4567",
        status: "Scheduled",
      },
    },
    {
      id: "2",
      caseId: "CLR-2024-002",
      patientName: "Pedro Dela Cruz",
      mrn: "MRN-2024-002",
      ward: "Surgery",
      bed: "SUR-05",
      episodeId: "EP-2024-002",
      unitsRequired: 1,
      component: "FFP",
      clinician: "Dr. Mendoza",
      urgency: "Medium",
      status: "Cleared",
      createdAt: "2024-01-14 14:20",
      assignedStaff: "Nurse Lopez",
      unitInfo: {
        unitNumber: "UN-2024-001",
        segmentNumber: "SN-2024-001",
        bagType: "450ml Triple",
        outcome: "Accepted",
      },
    },
    {
      id: "3",
      caseId: "CLR-2024-003",
      patientName: "Ana Reyes",
      mrn: "MRN-2024-003",
      ward: "Emergency",
      bed: "ER-03",
      episodeId: "EP-2024-003",
      unitsRequired: 3,
      component: "Whole Blood",
      clinician: "Dr. Torres",
      urgency: "Emergency",
      status: "Awaiting Replacement",
      createdAt: "2024-01-15 16:45",
      assignedStaff: "Nurse Ramos",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800"
      case "Donor Required":
        return "bg-yellow-100 text-yellow-800"
      case "Cleared":
        return "bg-green-100 text-green-800"
      case "Exempt":
        return "bg-purple-100 text-purple-800"
      case "Awaiting Replacement":
        return "bg-orange-100 text-orange-800"
      case "Failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Emergency":
        return "bg-red-100 text-red-800"
      case "High":
        return "bg-orange-100 text-orange-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredCases = clearanceCases.filter((case_) => {
    const matchesSearch =
      case_.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.mrn.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || case_.status === statusFilter
    const matchesUrgency = urgencyFilter === "all" || case_.urgency === urgencyFilter
    return matchesSearch && matchesStatus && matchesUrgency
  })

  const ClearanceCaseDetail = ({ case_: clearanceCase }: { case_: ClearanceCase }) => (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="coordination">Coordination</TabsTrigger>
          <TabsTrigger value="endorsements">Endorsements</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Name:</span>
                  <span className="text-sm font-medium">{clearanceCase.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">MRN:</span>
                  <span className="text-sm font-medium">{clearanceCase.mrn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ward/Bed:</span>
                  <span className="text-sm font-medium">
                    {clearanceCase.ward}/{clearanceCase.bed}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Episode ID:</span>
                  <span className="text-sm font-medium">{clearanceCase.episodeId}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Request Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Units Required:</span>
                  <span className="text-sm font-medium">{clearanceCase.unitsRequired}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Component:</span>
                  <span className="text-sm font-medium">{clearanceCase.component}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Clinician:</span>
                  <span className="text-sm font-medium">{clearanceCase.clinician}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Urgency:</span>
                  <Badge className={getUrgencyColor(clearanceCase.urgency)}>{clearanceCase.urgency}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Triage Decision Panel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  No Donor Required (Clear)
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <User className="w-4 h-4 mr-2" />
                  Donor Replacement Required
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Shield className="w-4 h-4 mr-2" />
                  Mark Exempt (Medical Officer)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Automated Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Bleeding Area Notified</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Sent</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm">SMS to Relatives</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Email Instructions Sent</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Delivered</Badge>
                </div>
              </div>
              <Button className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Send Reminder Notifications
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coordination" className="space-y-4">
          {clearanceCase.donorInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Donor Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-600">Donor Name</Label>
                    <p className="text-sm font-medium">{clearanceCase.donorInfo.name}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Donor ID</Label>
                    <p className="text-sm font-medium">{clearanceCase.donorInfo.donorId}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Relationship</Label>
                    <p className="text-sm font-medium">{clearanceCase.donorInfo.relationship}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Contact</Label>
                    <p className="text-sm font-medium">{clearanceCase.donorInfo.contact}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge className="bg-blue-100 text-blue-800">{clearanceCase.donorInfo.status}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Donor
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Appointment
                  </Button>
                  <Button size="sm" variant="outline">
                    <QrCode className="w-4 h-4 mr-2" />
                    Generate QR Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="endorsements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Bleeding Endorsements</CardTitle>
            </CardHeader>
            <CardContent>
              {clearanceCase.unitInfo ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-600">Unit Number</Label>
                      <p className="text-sm font-medium">{clearanceCase.unitInfo.unitNumber}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Segment Number</Label>
                      <p className="text-sm font-medium">{clearanceCase.unitInfo.segmentNumber}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Bag Type</Label>
                      <p className="text-sm font-medium">{clearanceCase.unitInfo.bagType}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Outcome</Label>
                      <Badge className="bg-green-100 text-green-800">{clearanceCase.unitInfo.outcome}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Activity className="w-4 h-4 mr-2" />
                      View Unit Trace
                    </Button>
                    <Button size="sm" variant="outline">
                      <Bell className="w-4 h-4 mr-2" />
                      Notify Ward
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No endorsements available yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Inventory Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm">Low Stock Alert: {clearanceCase.component}</span>
                  </div>
                  <Badge className="bg-red-100 text-red-800">Critical</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">2</p>
                    <p className="text-xs text-gray-600">Available Units</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">5</p>
                    <p className="text-xs text-gray-600">Reserved Units</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">3</p>
                    <p className="text-xs text-gray-600">Incoming Units</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Case Created</p>
                    <p className="text-xs text-gray-600">By: Dr. Rodriguez | 2024-01-15 08:30</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Donor Replacement Required</p>
                    <p className="text-xs text-gray-600">By: Nurse Garcia | 2024-01-15 08:45</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Bleeding Area Notified</p>
                    <p className="text-xs text-gray-600">System | 2024-01-15 08:46</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Documents & Certificates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Clearance Certificate</span>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Donor Consent Form</span>
                </div>
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </div>
              <Button className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Generate Clearance Certificate
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )

  return (
    <div className="p-6 space-y-6 bg-[#e9f8e7] min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#023337]">Clearance UI</h1>
          <p className="text-sm text-gray-600">Patient Blood Clearance & Replacement-Donor Coordination</p>
        </div>
        <Dialog open={showNewCaseDialog} onOpenChange={setShowNewCaseDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#4ea674] hover:bg-[#4ea674]/90">
              <Plus className="w-4 h-4 mr-2" />
              New Clearance Case
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Clearance Case</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient-name">Patient Name</Label>
                <Input id="patient-name" placeholder="Enter patient name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mrn">MRN</Label>
                <Input id="mrn" placeholder="Enter MRN" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ward">Ward</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ward" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="icu">ICU</SelectItem>
                    <SelectItem value="surgery">Surgery</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bed">Bed</Label>
                <Input id="bed" placeholder="Enter bed number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="episode-id">Episode ID</Label>
                <Input id="episode-id" placeholder="Enter episode ID" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="units-required">Units Required</Label>
                <Input id="units-required" type="number" placeholder="Enter number of units" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="component">Component</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select component" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="packed-rbc">Packed RBC</SelectItem>
                    <SelectItem value="ffp">FFP</SelectItem>
                    <SelectItem value="platelets">Platelets</SelectItem>
                    <SelectItem value="whole-blood">Whole Blood</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinician">Requesting Clinician</Label>
              <Input id="clinician" placeholder="Enter clinician name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Clearance</Label>
              <Textarea id="reason" placeholder="Enter reason for clearance requirement" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewCaseDialog(false)}>
                Cancel
              </Button>
              <Button className="bg-[#4ea674] hover:bg-[#4ea674]/90">Create Case</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="queue">Clearance Queue</TabsTrigger>
          <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings & Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Clearance Case Management</CardTitle>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search by patient name, case ID, or MRN..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Donor Required">Donor Required</SelectItem>
                    <SelectItem value="Cleared">Cleared</SelectItem>
                    <SelectItem value="Exempt">Exempt</SelectItem>
                    <SelectItem value="Awaiting Replacement">Awaiting Replacement</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Urgency</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Ward/Bed</TableHead>
                    <TableHead>Units Required</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Assigned Staff</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCases.map((case_) => (
                    <TableRow key={case_.id}>
                      <TableCell className="font-medium">{case_.caseId}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{case_.patientName}</p>
                          <p className="text-xs text-gray-500">{case_.mrn}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {case_.ward}/{case_.bed}
                      </TableCell>
                      <TableCell>
                        {case_.unitsRequired} {case_.component}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(case_.status)}>{case_.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getUrgencyColor(case_.urgency)}>{case_.urgency}</Badge>
                      </TableCell>
                      <TableCell>{case_.createdAt}</TableCell>
                      <TableCell>{case_.assignedStaff}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => setSelectedCase(case_)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-6xl max-h-[90vh]">
                            <DialogHeader>
                              <DialogTitle>Clearance Case: {case_.caseId}</DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="h-[80vh]">
                              {selectedCase && <ClearanceCaseDetail case_={selectedCase} />}
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-[#023337]">24</p>
                    <p className="text-sm text-gray-600">Active Cases</p>
                  </div>
                  <Activity className="w-8 h-8 text-[#4ea674]" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-[#023337]">18</p>
                    <p className="text-sm text-gray-600">Cleared Today</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-[#023337]">92%</p>
                    <p className="text-sm text-gray-600">Success Rate</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-[#4ea674]" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-[#023337]">2.4h</p>
                    <p className="text-sm text-gray-600">Avg Resolution</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Clearance Activity Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Daily Clearance Report
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Donor Failure Analysis
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Resolution Time Report
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Exemption Summary
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SMS/Email Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Donor Notification Template</Label>
                <Textarea
                  placeholder="Dear [DONOR_NAME], your relative [PATIENT_NAME] requires blood donation. Please visit Bicol Transfusion Science Centre with valid ID. Fasting required: [FASTING_STATUS]. Contact: [CONTACT_NUMBER]"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Reminder Template</Label>
                <Textarea
                  placeholder="Reminder: Blood donation appointment for [PATIENT_NAME] scheduled today at [TIME]. Please bring valid ID and follow fasting instructions."
                  rows={3}
                />
              </div>
              <Button className="bg-[#4ea674] hover:bg-[#4ea674]/90">Save Templates</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Auto-escalation Timeout (hours)</Label>
                  <Input type="number" defaultValue="24" />
                </div>
                <div className="space-y-2">
                  <Label>Reminder Frequency (hours)</Label>
                  <Input type="number" defaultValue="6" />
                </div>
              </div>
              <Button className="bg-[#4ea674] hover:bg-[#4ea674]/90">Save Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
