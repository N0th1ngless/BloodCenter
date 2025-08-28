"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Calendar,
  MapPin,
  Users,
  Target,
  Plus,
  Search,
  QrCode,
  UserPlus,
  Stethoscope,
  Package,
  Droplets,
  Heart,
  FileText,
  Download,
  Send,
  AlertTriangle,
  CheckCircle,
  User,
  Activity,
  Thermometer,
  Weight,
  Ruler,
  TestTube2,
  Shield,
  CalendarIcon,
  Filter,
} from "lucide-react"
import { cn } from "@/lib/utils"

type MobileBloodDonationProps = {}

// Mock data
const mockEvents = [
  {
    id: "MBD001",
    venue: "Barangay San Roque Community Center",
    date: "2024-01-15",
    time: "08:00 AM - 04:00 PM",
    stakeholder: "Barangay San Roque LGU",
    targetUnits: 50,
    achievedUnits: 42,
    status: "Completed",
    coordinator: "Nurse Maria Santos",
    district: "Legazpi City",
    staff: {
      teamLeader: "Dr. Juan Cruz",
      screeners: ["Nurse Ana Lopez", "Nurse Pedro Reyes"],
      endorser: "Tech Sarah Kim",
      phlebotomists: ["Tech Mike Johnson", "Tech Lisa Wong"],
      coldChain: "Tech Robert Brown",
      driver: "Mr. Carlos Mendez",
      verifier: "Dr. Elena Rodriguez",
      encoder: "Staff Jenny Lee",
      donorCare: ["Volunteer Mary Jane", "Volunteer Tom Wilson"],
    },
  },
  {
    id: "MBD002",
    venue: "Albay Provincial Capitol",
    date: "2024-01-20",
    time: "09:00 AM - 05:00 PM",
    stakeholder: "Provincial Government of Albay",
    targetUnits: 100,
    achievedUnits: 0,
    status: "Scheduled",
    coordinator: "Nurse Roberto Garcia",
    district: "Legazpi City",
    staff: {},
  },
]

const mockDonors = [
  {
    id: "D240100001",
    name: "Juan Dela Cruz",
    age: 28,
    bloodType: "O+",
    status: "Regular",
    lastDonation: "2023-10-15",
    phone: "09171234567",
    address: "Brgy. San Roque, Legazpi City",
    weight: 65,
    bp: "120/80",
    temp: 36.5,
    hb: 14.2,
    eligibility: "Fit",
    unitNumber: "LGZ240115001",
    segmentNumber: "001",
    bagType: "Single",
    volume: 450,
    duration: 8,
    outcome: "Successful",
  },
]

const staffRoles = [
  "Team Leader (TL)",
  "Donor Screener",
  "Blood Bag Endorser",
  "Donor Care Staff",
  "Phlebotomist",
  "Cold Chain Officer",
  "Driver",
  "Verifier",
  "Encoder",
]

const bagTypes = ["Single", "Double", "Triple", "Quadruple"]
const donorStatuses = ["New", "Repeat", "Regular", "Lapsed"]
const deferralTypes = ["Temporary", "Permanent"]
const collectionOutcomes = ["Successful", "QNS", "QNS with Reaction", "FP"]

export function MobileBloodDonation({}: MobileBloodDonationProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [currentWorkflow, setCurrentWorkflow] = useState("registration")
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewEventDialog, setShowNewEventDialog] = useState(false)
  const [showDonorDialog, setShowDonorDialog] = useState(false)

  const workflowSteps = [
    { id: "registration", label: "Registration", icon: UserPlus, color: "bg-blue-500" },
    { id: "prescreening", label: "Pre-Screening", icon: Stethoscope, color: "bg-yellow-500" },
    { id: "doctor", label: "Doctor Screening", icon: Shield, color: "bg-purple-500" },
    { id: "bagissue", label: "Bag Issuance", icon: Package, color: "bg-green-500" },
    { id: "collection", label: "Collection", icon: Droplets, color: "bg-red-500" },
    { id: "postcare", label: "Post-Care", icon: Heart, color: "bg-pink-500" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#023337]">Mobile Blood Donation</h1>
          <p className="text-[#023337]/70">Manage field blood drives and donor processing workflow</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowNewEventDialog(true)} className="bg-[#4ea674] hover:bg-[#4ea674]/80">
            <Plus className="h-4 w-4 mr-2" />
            New Blood Drive
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="events">Event Management</TabsTrigger>
          <TabsTrigger value="workflow">Donor Workflow</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week's Drives</CardTitle>
                <CalendarIcon className="h-4 w-4 text-[#4ea674]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#023337]">3</div>
                <p className="text-xs text-[#023337]/70">2 scheduled, 1 ongoing</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Target Units</CardTitle>
                <Target className="h-4 w-4 text-[#4ea674]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#023337]">200</div>
                <p className="text-xs text-[#023337]/70">This week's target</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Achieved Units</CardTitle>
                <Droplets className="h-4 w-4 text-[#4ea674]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#023337]">142</div>
                <p className="text-xs text-green-600">71% of target</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
                <Users className="h-4 w-4 text-[#4ea674]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#023337]">24</div>
                <p className="text-xs text-[#023337]/70">Assigned to drives</p>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Drives */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#023337]">Upcoming Blood Drives This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockEvents
                  .filter((event) => event.status !== "Completed")
                  .map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-[#4ea674]" />
                            <span className="font-medium text-[#023337]">{event.venue}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-[#023337]/70 mt-1">
                            <span>{event.date}</span>
                            <span>{event.time}</span>
                            <span>Target: {event.targetUnits} units</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={event.status === "Scheduled" ? "secondary" : "default"}>{event.status}</Badge>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Event Management Tab */}
        <TabsContent value="events" className="space-y-6">
          {/* Calendar View */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#023337]">Blood Drive Calendar</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Calendar View
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockEvents.map((event) => (
                  <Card key={event.id} className="border-l-4 border-l-[#4ea674]">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{event.id}</Badge>
                            <Badge
                              variant={
                                event.status === "Completed"
                                  ? "default"
                                  : event.status === "Ongoing"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {event.status}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-[#023337]">{event.venue}</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-[#023337]/70">
                            <div>
                              <span className="font-medium">Date:</span> {event.date}
                            </div>
                            <div>
                              <span className="font-medium">Time:</span> {event.time}
                            </div>
                            <div>
                              <span className="font-medium">Stakeholder:</span> {event.stakeholder}
                            </div>
                            <div>
                              <span className="font-medium">Coordinator:</span> {event.coordinator}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-sm">
                              <span className="font-medium">Target:</span> {event.targetUnits} units
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Achieved:</span> {event.achievedUnits} units
                            </div>
                            {event.achievedUnits > 0 && (
                              <div className="text-sm">
                                <span className="font-medium">Progress:</span>{" "}
                                {Math.round((event.achievedUnits / event.targetUnits) * 100)}%
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button
                            size="sm"
                            onClick={() => setSelectedEvent(event.id)}
                            className="bg-[#4ea674] hover:bg-[#4ea674]/80"
                          >
                            Manage Event
                          </Button>
                          <Button size="sm" variant="outline">
                            View Report
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Donor Workflow Tab */}
        <TabsContent value="workflow" className="space-y-6">
          {/* Event Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#023337]">Select Active Blood Drive</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedEvent || ""} onValueChange={setSelectedEvent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an active blood drive" />
                </SelectTrigger>
                <SelectContent>
                  {mockEvents
                    .filter((e) => e.status !== "Completed")
                    .map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.venue} - {event.date}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedEvent && (
            <>
              {/* Workflow Steps */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#023337]">Donor Processing Workflow</CardTitle>
                  <CardDescription>Step-by-step donor processing with role-based access</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-6">
                    {workflowSteps.map((step, index) => {
                      const Icon = step.icon
                      const isActive = step.id === currentWorkflow
                      const isCompleted = workflowSteps.findIndex((s) => s.id === currentWorkflow) > index

                      return (
                        <div key={step.id} className="flex items-center">
                          <div
                            className={cn(
                              "flex items-center justify-center w-10 h-10 rounded-full cursor-pointer transition-colors",
                              isActive ? step.color : isCompleted ? "bg-green-500" : "bg-gray-300",
                            )}
                            onClick={() => setCurrentWorkflow(step.id)}
                          >
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="ml-2 text-sm font-medium text-[#023337]">{step.label}</div>
                          {index < workflowSteps.length - 1 && <div className="w-8 h-0.5 bg-gray-300 mx-4" />}
                        </div>
                      )
                    })}
                  </div>

                  {/* Workflow Content */}
                  {currentWorkflow === "registration" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-[#023337]">Donor Registration</h3>
                        <Button onClick={() => setShowDonorDialog(true)} className="bg-[#4ea674] hover:bg-[#4ea674]/80">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Register New Donor
                        </Button>
                      </div>

                      {/* Search Existing Donor */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Search Existing Donor</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Search by name, Donor ID, or scan QR code"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="flex-1"
                            />
                            <Button variant="outline">
                              <Search className="h-4 w-4" />
                            </Button>
                            <Button variant="outline">
                              <QrCode className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Registered Donors Today */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Registered Donors Today</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Donor ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Blood Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {mockDonors.map((donor) => (
                                <TableRow key={donor.id}>
                                  <TableCell className="font-mono">{donor.id}</TableCell>
                                  <TableCell>{donor.name}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline">{donor.bloodType}</Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant={
                                        donor.status === "New"
                                          ? "secondary"
                                          : donor.status === "Regular"
                                            ? "default"
                                            : "outline"
                                      }
                                    >
                                      {donor.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Button size="sm" variant="outline">
                                      Proceed to Screening
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {currentWorkflow === "prescreening" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-[#023337]">Pre-Screening (Donor Screener)</h3>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Vital Signs & Basic Screening</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                              <Label>Weight (kg)</Label>
                              <div className="flex items-center space-x-2">
                                <Weight className="h-4 w-4 text-[#4ea674]" />
                                <Input placeholder="65" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Height (cm)</Label>
                              <div className="flex items-center space-x-2">
                                <Ruler className="h-4 w-4 text-[#4ea674]" />
                                <Input placeholder="170" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Blood Pressure</Label>
                              <div className="flex items-center space-x-2">
                                <Activity className="h-4 w-4 text-[#4ea674]" />
                                <Input placeholder="120/80" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Temperature (°C)</Label>
                              <div className="flex items-center space-x-2">
                                <Thermometer className="h-4 w-4 text-[#4ea674]" />
                                <Input placeholder="36.5" />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Hemoglobin (g/dL)</Label>
                            <div className="flex items-center space-x-2">
                              <TestTube2 className="h-4 w-4 text-[#4ea674]" />
                              <Input placeholder="14.2" className="w-32" />
                            </div>
                          </div>

                          {/* Eligibility Status */}
                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span className="font-medium text-green-800">Donor is FIT for donation</span>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button className="bg-[#4ea674] hover:bg-[#4ea674]/80">Proceed to Doctor Screening</Button>
                            <Button variant="outline">Mark as Deferred</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {currentWorkflow === "doctor" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-[#023337]">Doctor Screening (Medical Officer Only)</h3>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Medical Assessment & Clearance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Shield className="h-5 w-5 text-blue-600" />
                              <span className="font-medium text-blue-800">Restricted Access: Medical Officer Only</span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <Label>Medical History Review</Label>
                              <Textarea placeholder="Review donor's medical history and previous donations..." />
                            </div>

                            <div>
                              <Label>Counseling Notes</Label>
                              <Textarea placeholder="Counseling provided and donor education..." />
                            </div>

                            <div className="space-y-2">
                              <Label>Medical Clearance</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select clearance status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="cleared">Cleared for Donation</SelectItem>
                                  <SelectItem value="temp-defer">Temporary Deferral</SelectItem>
                                  <SelectItem value="perm-defer">Permanent Deferral</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button className="bg-[#4ea674] hover:bg-[#4ea674]/80">Clear for Bag Issuance</Button>
                            <Button variant="outline">Defer Donor</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {currentWorkflow === "bagissue" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-[#023337]">
                        Bag Issuance & Unit Assignment (Endorser)
                      </h3>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Blood Bag Assignment</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>Bag Type</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select bag type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {bagTypes.map((type) => (
                                    <SelectItem key={type} value={type.toLowerCase()}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Unit Number *</Label>
                              <Input placeholder="LGZ240115001" />
                            </div>

                            <div className="space-y-2">
                              <Label>Segment Number *</Label>
                              <Input placeholder="001" />
                            </div>
                          </div>

                          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="h-5 w-5 text-yellow-600" />
                              <span className="font-medium text-yellow-800">
                                CUE Form handed to donor - Confidential Unit Exclusion
                              </span>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button className="bg-[#4ea674] hover:bg-[#4ea674]/80">
                              Issue Bag & Proceed to Collection
                            </Button>
                            <Button variant="outline">Cancel Assignment</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {currentWorkflow === "collection" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-[#023337]">Blood Collection (Phlebotomist)</h3>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Collection Process</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>Volume Collected (mL)</Label>
                              <Input placeholder="450" />
                            </div>

                            <div className="space-y-2">
                              <Label>Duration (minutes)</Label>
                              <Input placeholder="8" />
                            </div>

                            <div className="space-y-2">
                              <Label>Collection Outcome</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select outcome" />
                                </SelectTrigger>
                                <SelectContent>
                                  {collectionOutcomes.map((outcome) => (
                                    <SelectItem key={outcome} value={outcome.toLowerCase()}>
                                      {outcome}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Collection Remarks</Label>
                            <Textarea placeholder="Any observations or issues during collection..." />
                          </div>

                          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="h-5 w-5 text-red-600" />
                              <span className="font-medium text-red-800">
                                Report any adverse events immediately to Medical Officer
                              </span>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button className="bg-[#4ea674] hover:bg-[#4ea674]/80">Complete Collection</Button>
                            <Button variant="outline">Report Adverse Event</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {currentWorkflow === "postcare" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-[#023337]">Post-Donation Care (Donor Care Staff)</h3>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Donor Monitoring & Care</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="snack" />
                              <Label htmlFor="snack">Snack provided to donor</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox id="monitoring" />
                              <Label htmlFor="monitoring">15-minute monitoring completed</Label>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Adverse Events (if any)</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select if adverse event occurred" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">No adverse events</SelectItem>
                                <SelectItem value="dizziness">Dizziness</SelectItem>
                                <SelectItem value="fainting">Fainting</SelectItem>
                                <SelectItem value="hematoma">Hematoma</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Care Notes</Label>
                            <Textarea placeholder="Post-donation care provided and donor condition..." />
                          </div>

                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span className="font-medium text-green-800">
                                Donor cleared for discharge - Thank you message sent
                              </span>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button className="bg-[#4ea674] hover:bg-[#4ea674]/80">Complete Process</Button>
                            <Button variant="outline">Extend Monitoring</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#023337]">Field Reports & Endorsement</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Export Excel
                  </Button>
                  <Button className="bg-[#4ea674] hover:bg-[#4ea674]/80">
                    <Send className="h-4 w-4 mr-2" />
                    Send to Processing
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Report Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-[#023337]">42</div>
                      <p className="text-sm text-[#023337]/70">Total Units Collected</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-[#023337]">38</div>
                      <p className="text-sm text-[#023337]/70">Successful Collections</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-[#023337]">4</div>
                      <p className="text-sm text-[#023337]/70">QNS/Failed</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Report Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Collection Report Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Venue</TableHead>
                          <TableHead>Unit Number</TableHead>
                          <TableHead>Segment Number</TableHead>
                          <TableHead>Bag Type</TableHead>
                          <TableHead>Remarks</TableHead>
                          <TableHead>Endorser</TableHead>
                          <TableHead>Verifier</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>2024-01-15</TableCell>
                          <TableCell>Brgy. San Roque</TableCell>
                          <TableCell className="font-mono">LGZ240115001</TableCell>
                          <TableCell className="font-mono">001</TableCell>
                          <TableCell>Single</TableCell>
                          <TableCell>
                            <Badge variant="default">Successful</Badge>
                          </TableCell>
                          <TableCell>Tech Sarah Kim</TableCell>
                          <TableCell>Dr. Elena Rodriguez</TableCell>
                        </TableRow>
                        {/* More rows would be populated from data */}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Endorsement Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Report Endorsement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Endorser</Label>
                        <Input value="Tech Sarah Kim" readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label>Verifier</Label>
                        <Input value="Dr. Elena Rodriguez" readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label>Validator</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select validator" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dr-cruz">Dr. Juan Cruz</SelectItem>
                            <SelectItem value="dr-santos">Dr. Maria Santos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Final Remarks</Label>
                      <Textarea placeholder="Final validation remarks and recommendations..." />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Event Dialog */}
      <Dialog open={showNewEventDialog} onOpenChange={setShowNewEventDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule New Blood Drive</DialogTitle>
            <DialogDescription>Create a new mobile blood donation event and assign staff roles</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Venue</Label>
                <Input placeholder="Event venue location" />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Stakeholder Partner</Label>
                <Input placeholder="Partner organization" />
              </div>
              <div className="space-y-2">
                <Label>Target Units</Label>
                <Input type="number" placeholder="50" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Nurse Coordinator</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Assign coordinator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maria-santos">Nurse Maria Santos</SelectItem>
                  <SelectItem value="roberto-garcia">Nurse Roberto Garcia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Staff Assignments</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {staffRoles.map((role) => (
                  <div key={role} className="space-y-1">
                    <Label className="text-sm">{role}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${role.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="staff1">Staff Member 1</SelectItem>
                        <SelectItem value="staff2">Staff Member 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowNewEventDialog(false)}>
                Cancel
              </Button>
              <Button className="bg-[#4ea674] hover:bg-[#4ea674]/80">Schedule Event</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Donor Dialog */}
      <Dialog open={showDonorDialog} onOpenChange={setShowDonorDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Register New Donor</DialogTitle>
            <DialogDescription>Register a new donor with auto-generated Donor ID</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">Auto-generated Donor ID: D240100042</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input placeholder="Juan" />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input placeholder="Dela Cruz" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Age</Label>
                <Input type="number" placeholder="28" />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Blood Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Contact Number</Label>
              <Input placeholder="09171234567" />
            </div>

            <div className="space-y-2">
              <Label>Complete Address</Label>
              <Textarea placeholder="Barangay, Municipality/City, Province" />
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">
                  Automatically marked as Voluntary Non-Remunerated Donor
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDonorDialog(false)}>
                Cancel
              </Button>
              <Button className="bg-[#4ea674] hover:bg-[#4ea674]/80">Register & Generate QR Code</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
