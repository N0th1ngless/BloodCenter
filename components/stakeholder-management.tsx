"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Plus,
  Building2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Users,
  Send,
  Eye,
  Download,
  ExternalLink,
  Target,
  TrendingUp,
  CheckCircle,
} from "lucide-react"

// Fixed categories as per requirements
const STAKEHOLDER_CATEGORIES = [
  "Camarines Norte (All LGU and Barangay's)",
  "District 1 (All Brgy in Camarines Sur)",
  "District 2 (All Brgy in Camarines Sur)",
  "District 3 (All Brgy in Camarines Sur except City of Naga)",
  "District 4 (All Brgy in Camarines Sur)",
  "District 5 (All Brgy in Camarines Sur except Iriga City)",
  "City of Naga",
  "City of Iriga",
  "Camarines Norte BSF",
  "Camarines Sur BSF",
  "Camarines Norte NGO's & Gov't Agencies",
  "Camarines Sur NGO's & Gov't Agencies",
]

const EVENT_STATUS = ["Planned", "Confirmed", "Completed", "Cancelled"]
const STAKEHOLDER_STATUS = ["Active", "Inactive", "Prospect"]
const ACTIVITY_TYPES = ["Seminar", "Awareness Campaign", "School Drive", "Community Outreach", "Training"]

// Mock data
const mockStakeholders = [
  {
    id: "STK001",
    name: "Barangay San Francisco",
    category: "District 1 (All Brgy in Camarines Sur)",
    address: "San Francisco, Naga City, Camarines Sur",
    primaryCoordinator: { name: "Maria Santos", designation: "Barangay Captain", contact: "09171234567" },
    secondaryCoordinator: { name: "Juan Dela Cruz", designation: "Kagawad", contact: "09181234567" },
    email: "sanfrancisco.brgy@naga.gov.ph",
    phone: "(054) 123-4567",
    website: "www.naga.gov.ph",
    assignedNurses: ["Nurse Ana Reyes", "Nurse Carlos Lopez"],
    status: "Active",
    upcomingEvent: "Dec 15, 2024",
    totalDonations: 245,
    lastActivity: "Nov 20, 2024",
  },
  {
    id: "STK002",
    name: "Bicol University",
    category: "Camarines Sur NGO's & Gov't Agencies",
    address: "Rizal Street, Legazpi City, Albay",
    primaryCoordinator: { name: "Dr. Elena Rodriguez", designation: "VP for Student Affairs", contact: "09191234567" },
    secondaryCoordinator: {
      name: "Prof. Miguel Torres",
      designation: "Health Services Director",
      contact: "09201234567",
    },
    email: "health@bicol-u.edu.ph",
    phone: "(052) 820-6101",
    website: "www.bicol-u.edu.ph",
    assignedNurses: ["Nurse Patricia Cruz", "Nurse Roberto Santos"],
    status: "Active",
    upcomingEvent: "Jan 10, 2025",
    totalDonations: 892,
    lastActivity: "Dec 1, 2024",
  },
  {
    id: "STK003",
    name: "Camarines Sur Provincial Hospital",
    category: "Camarines Sur BSF",
    address: "Cadlan, Pili, Camarines Sur",
    primaryCoordinator: { name: "Dr. Carmen Villanueva", designation: "Chief of Hospital", contact: "09211234567" },
    secondaryCoordinator: {
      name: "Nurse Supervisor Rosa Martinez",
      designation: "Blood Bank Supervisor",
      contact: "09221234567",
    },
    email: "bloodbank@camsurph.gov.ph",
    phone: "(054) 477-2531",
    website: "www.camsurph.gov.ph",
    assignedNurses: ["Nurse Diana Flores", "Nurse Antonio Garcia"],
    status: "Active",
    upcomingEvent: "Dec 20, 2024",
    totalDonations: 1456,
    lastActivity: "Dec 3, 2024",
  },
]

const mockEvents = [
  {
    id: "EVT001",
    date: "2024-12-15",
    time: "08:00 AM",
    venue: "Barangay San Francisco Hall",
    targetDonors: 50,
    stakeholder: "Barangay San Francisco",
    coordinator: "Nurse Ana Reyes",
    encoder: "Staff John Doe",
    coldChain: "Staff Jane Smith",
    status: "Confirmed",
    actualCollected: null,
    attendance: null,
  },
  {
    id: "EVT002",
    date: "2024-11-20",
    time: "09:00 AM",
    venue: "Bicol University Gymnasium",
    targetDonors: 100,
    stakeholder: "Bicol University",
    coordinator: "Nurse Patricia Cruz",
    encoder: "Staff Mark Johnson",
    coldChain: "Staff Lisa Brown",
    status: "Completed",
    actualCollected: 87,
    attendance: 120,
  },
]

const mockAdvocacy = [
  {
    id: "ADV001",
    date: "2024-11-15",
    stakeholder: "Bicol University",
    venue: "BU Auditorium",
    activityType: "Seminar",
    targetAudience: "Students and Faculty",
    attendance: 150,
    outcome: "High engagement, 45 new donor registrations",
    staffInvolved: ["Nurse Patricia Cruz", "Dr. Medical Officer"],
  },
  {
    id: "ADV002",
    date: "2024-10-28",
    stakeholder: "Barangay San Francisco",
    venue: "Barangay Hall",
    activityType: "Awareness Campaign",
    targetAudience: "Community Members",
    attendance: 80,
    outcome: "Good response, scheduled follow-up blood drive",
    staffInvolved: ["Nurse Ana Reyes", "Community Health Worker"],
  },
]

export function StakeholderManagement() {
  const [activeTab, setActiveTab] = useState("stakeholders")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isAddStakeholderOpen, setIsAddStakeholderOpen] = useState(false)
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [isAddAdvocacyOpen, setIsAddAdvocacyOpen] = useState(false)
  const [selectedStakeholder, setSelectedStakeholder] = useState<any>(null)
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")

  const filteredStakeholders = mockStakeholders.filter((stakeholder) => {
    const matchesSearch =
      stakeholder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stakeholder.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || stakeholder.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || stakeholder.status.toLowerCase() === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "prospect":
        return "bg-blue-100 text-blue-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "planned":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#023337]">Stakeholder Management</h1>
          <p className="text-gray-600">Manage partnerships and relationships across the Bicol region</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddStakeholderOpen(true)} className="bg-[#4ea674] hover:bg-[#4ea674]/80">
            <Plus className="h-4 w-4 mr-2" />
            Add Stakeholder
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Stakeholders</p>
                <p className="text-2xl font-bold text-[#023337]">{mockStakeholders.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-[#4ea674]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Partners</p>
                <p className="text-2xl font-bold text-[#023337]">
                  {mockStakeholders.filter((s) => s.status === "Active").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming Events</p>
                <p className="text-2xl font-bold text-[#023337]">
                  {mockEvents.filter((e) => e.status === "Confirmed" || e.status === "Planned").length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Donations</p>
                <p className="text-2xl font-bold text-[#023337]">
                  {mockStakeholders.reduce((sum, s) => sum + s.totalDonations, 0)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-[#4ea674]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          <TabsTrigger value="advocacy">Advocacy Tracking</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Stakeholders Tab */}
        <TabsContent value="stakeholders" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search stakeholders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue placeholder="Filter by Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {STAKEHOLDER_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {STAKEHOLDER_STATUS.map((status) => (
                      <SelectItem key={status} value={status.toLowerCase()}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Stakeholders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Stakeholder Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Coordinator</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Upcoming Event</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStakeholders.map((stakeholder) => (
                    <TableRow key={stakeholder.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-[#c0e6b9] text-[#023337]">
                              {stakeholder.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{stakeholder.name}</p>
                            <p className="text-sm text-gray-500">{stakeholder.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {stakeholder.category.split("(")[0].trim()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{stakeholder.primaryCoordinator.name}</p>
                          <p className="text-xs text-gray-500">{stakeholder.primaryCoordinator.designation}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{stakeholder.address.split(",")[0]}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(stakeholder.status)}>{stakeholder.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {stakeholder.upcomingEvent ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-blue-500" />
                            <span className="text-sm">{stakeholder.upcomingEvent}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">None scheduled</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => setSelectedStakeholder(stakeholder)}>
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Send className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Calendar className="h-3 w-3" />
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

        {/* Scheduling Tab */}
        <TabsContent value="scheduling" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
                size="sm"
              >
                List View
              </Button>
              <Button
                variant={viewMode === "calendar" ? "default" : "outline"}
                onClick={() => setViewMode("calendar")}
                size="sm"
              >
                Calendar View
              </Button>
            </div>
            <Button onClick={() => setIsAddEventOpen(true)} className="bg-[#4ea674] hover:bg-[#4ea674]/80">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Event
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Scheduled Events</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Stakeholder</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Staff Assigned</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{event.date}</p>
                          <p className="text-sm text-gray-500">{event.time}</p>
                        </div>
                      </TableCell>
                      <TableCell>{event.stakeholder}</TableCell>
                      <TableCell>{event.venue}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3 text-blue-500" />
                          <span>{event.targetDonors} donors</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>Coord: {event.coordinator}</p>
                          <p className="text-gray-500">Encoder: {event.encoder}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {event.actualCollected !== null ? (
                          <div className="text-sm">
                            <p className="font-medium">
                              {event.actualCollected}/{event.targetDonors}
                            </p>
                            <p className="text-gray-500">
                              {Math.round((event.actualCollected / event.targetDonors) * 100)}% achieved
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Pending</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advocacy Tracking Tab */}
        <TabsContent value="advocacy" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Advocacy Activities</h3>
            <Button onClick={() => setIsAddAdvocacyOpen(true)} className="bg-[#4ea674] hover:bg-[#4ea674]/80">
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Stakeholder</TableHead>
                    <TableHead>Activity Type</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Outcome</TableHead>
                    <TableHead>Staff</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAdvocacy.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>{activity.date}</TableCell>
                      <TableCell>{activity.stakeholder}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{activity.activityType}</Badge>
                      </TableCell>
                      <TableCell>{activity.venue}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-blue-500" />
                          <span>{activity.attendance}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm truncate">{activity.outcome}</p>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {activity.staffInvolved.map((staff, index) => (
                            <p key={index} className="text-gray-600">
                              {staff}
                            </p>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Stakeholders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockStakeholders
                    .sort((a, b) => b.totalDonations - a.totalDonations)
                    .slice(0, 5)
                    .map((stakeholder, index) => (
                      <div key={stakeholder.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#4ea674] text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <span className="font-medium">{stakeholder.name}</span>
                        </div>
                        <Badge className="bg-[#c0e6b9] text-[#023337]">{stakeholder.totalDonations} donations</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Stakeholder Directory (CSV)
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Event Schedule (PDF)
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Advocacy Activities (Excel)
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Performance Summary (PDF)
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Stakeholder Profile Dialog */}
      {selectedStakeholder && (
        <Dialog open={!!selectedStakeholder} onOpenChange={() => setSelectedStakeholder(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-[#c0e6b9] text-[#023337]">
                    {selectedStakeholder.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {selectedStakeholder.name}
                <Badge className={getStatusColor(selectedStakeholder.status)}>{selectedStakeholder.status}</Badge>
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="advocacy">Advocacy</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Organization Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{selectedStakeholder.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{selectedStakeholder.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{selectedStakeholder.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{selectedStakeholder.email}</span>
                      </div>
                      {selectedStakeholder.website && (
                        <div className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{selectedStakeholder.website}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Coordinators</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm font-medium">Primary Coordinator</p>
                        <p className="text-sm text-gray-600">{selectedStakeholder.primaryCoordinator.name}</p>
                        <p className="text-xs text-gray-500">{selectedStakeholder.primaryCoordinator.designation}</p>
                        <p className="text-xs text-gray-500">{selectedStakeholder.primaryCoordinator.contact}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Secondary Coordinator</p>
                        <p className="text-sm text-gray-600">{selectedStakeholder.secondaryCoordinator.name}</p>
                        <p className="text-xs text-gray-500">{selectedStakeholder.secondaryCoordinator.designation}</p>
                        <p className="text-xs text-gray-500">{selectedStakeholder.secondaryCoordinator.contact}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Assigned Nurse Coordinators</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedStakeholder.assignedNurses.map((nurse: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {nurse}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="events">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Event History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      Event history for {selectedStakeholder.name} will be displayed here.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="advocacy">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Advocacy Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      Advocacy activities for {selectedStakeholder.name} will be displayed here.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-[#4ea674]">{selectedStakeholder.totalDonations}</p>
                        <p className="text-sm text-gray-600">Total Donations</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-[#023337]">12</p>
                        <p className="text-sm text-gray-600">Events Hosted</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Stakeholder Dialog */}
      <Dialog open={isAddStakeholderOpen} onOpenChange={setIsAddStakeholderOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Stakeholder</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name</Label>
              <Input id="orgName" placeholder="Enter organization name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {STAKEHOLDER_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="Complete address" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryName">Primary Coordinator Name</Label>
              <Input id="primaryName" placeholder="Full name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryDesignation">Designation</Label>
              <Input id="primaryDesignation" placeholder="Position/Title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryContact">Contact Number</Label>
              <Input id="primaryContact" placeholder="Phone number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="organization@email.com" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsAddStakeholderOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-[#4ea674] hover:bg-[#4ea674]/80">Add Stakeholder</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventDate">Date</Label>
                <Input id="eventDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventTime">Time</Label>
                <Input id="eventTime" type="time" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stakeholderSelect">Stakeholder</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select stakeholder" />
                </SelectTrigger>
                <SelectContent>
                  {mockStakeholders.map((stakeholder) => (
                    <SelectItem key={stakeholder.id} value={stakeholder.id}>
                      {stakeholder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Input id="venue" placeholder="Event venue" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetDonors">Target Donors</Label>
              <Input id="targetDonors" type="number" placeholder="Number of expected donors" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-[#4ea674] hover:bg-[#4ea674]/80">Schedule Event</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Advocacy Activity Dialog */}
      <Dialog open={isAddAdvocacyOpen} onOpenChange={setIsAddAdvocacyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Advocacy Activity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="activityDate">Date</Label>
              <Input id="activityDate" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="activityStakeholder">Stakeholder</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select stakeholder" />
                </SelectTrigger>
                <SelectContent>
                  {mockStakeholders.map((stakeholder) => (
                    <SelectItem key={stakeholder.id} value={stakeholder.id}>
                      {stakeholder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="activityType">Activity Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="activityVenue">Venue</Label>
              <Input id="activityVenue" placeholder="Activity venue" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input id="targetAudience" placeholder="Who is the target audience?" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attendance">Attendance</Label>
              <Input id="attendance" type="number" placeholder="Number of attendees" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="outcome">Outcome/Remarks</Label>
              <Textarea id="outcome" placeholder="Describe the outcome and key results" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsAddAdvocacyOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-[#4ea674] hover:bg-[#4ea674]/80">Add Activity</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
