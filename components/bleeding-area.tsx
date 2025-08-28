"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Plus, QrCode, AlertTriangle, CheckCircle, FileText, Download, Printer } from "lucide-react"

export function BleedingArea() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedDonor, setSelectedDonor] = useState(null)
  const [showNewDonorDialog, setShowNewDonorDialog] = useState(false)

  // Mock data for demonstration
  const todayDonors = [
    {
      id: "D202412001",
      name: "Maria Santos",
      type: "Voluntary Non-remunerated",
      status: "Pre-Screening",
      nurse: "Nurse Rodriguez",
      time: "09:30 AM",
      bloodType: "O+",
      clearanceLinked: false,
    },
    {
      id: "D202412002",
      name: "Juan Dela Cruz",
      type: "Family/Replacement Donor",
      status: "Doctor Screening",
      nurse: "Nurse Garcia",
      time: "10:15 AM",
      bloodType: "A+",
      clearanceLinked: true,
      patientRef: "P2024-001",
    },
    {
      id: "D202412003",
      name: "Ana Reyes",
      type: "Walk-In Donor",
      status: "Blood Collection",
      nurse: "Nurse Lopez",
      time: "11:00 AM",
      bloodType: "B+",
      unitNumber: "BU240001",
      segmentNumber: "SG240001",
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "Registration":
        return "bg-blue-100 text-blue-800"
      case "Pre-Screening":
        return "bg-yellow-100 text-yellow-800"
      case "Doctor Screening":
        return "bg-orange-100 text-orange-800"
      case "Bag Issuance":
        return "bg-purple-100 text-purple-800"
      case "Blood Collection":
        return "bg-green-100 text-green-800"
      case "Post-Care":
        return "bg-teal-100 text-teal-800"
      case "Completed":
        return "bg-gray-100 text-gray-800"
      case "Deferred":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6 bg-[#e9f8e7] min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#023337]">Bleeding Area - Facility-Based Donations</h1>
          <p className="text-[#4ea674] mt-1">Manage walk-in and facility-based donor processing</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-[#4ea674] hover:bg-[#023337] text-white">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Dialog open={showNewDonorDialog} onOpenChange={setShowNewDonorDialog}>
            <DialogTrigger asChild>
              <Button className="bg-[#023337] hover:bg-[#4ea674] text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Donor Registration
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-[#023337]">New Donor Registration</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nurse">Assign Nurse on Duty</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select nurse" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nurse1">Nurse Rodriguez</SelectItem>
                        <SelectItem value="nurse2">Nurse Garcia</SelectItem>
                        <SelectItem value="nurse3">Nurse Lopez</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="donorId">Donor ID (Auto-generated)</Label>
                    <Input value="D202412004" disabled className="bg-gray-50" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input placeholder="Enter first name" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input placeholder="Enter last name" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="sex">Sex</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sex" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input type="number" placeholder="Enter age" />
                  </div>
                  <div>
                    <Label htmlFor="donorType">Donor Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="voluntary">Voluntary Non-remunerated</SelectItem>
                        <SelectItem value="family">Family/Replacement Donor</SelectItem>
                        <SelectItem value="walkin">Walk-In Donor</SelectItem>
                        <SelectItem value="inhouse">In-House (Facility Staff)</SelectItem>
                        <SelectItem value="directed">Directed Donor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea placeholder="Enter complete address" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact">Contact Number</Label>
                    <Input placeholder="Enter contact number" />
                  </div>
                  <div>
                    <Label htmlFor="bloodType">Blood Type (Placeholder)</Label>
                    <Input placeholder="To be updated after serology" disabled className="bg-gray-50" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowNewDonorDialog(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-[#4ea674] hover:bg-[#023337] text-white">Register Donor</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-white border border-[#c0e6b9]">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="registration" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Registration
          </TabsTrigger>
          <TabsTrigger value="screening" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Screening
          </TabsTrigger>
          <TabsTrigger value="collection" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Collection
          </TabsTrigger>
          <TabsTrigger value="postcare" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Post-Care
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Today's Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-[#c0e6b9] bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-[#023337]">Today's Donors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#4ea674]">12</div>
                <p className="text-xs text-gray-600">+3 from yesterday</p>
              </CardContent>
            </Card>
            <Card className="border-[#c0e6b9] bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-[#023337]">Successful Collections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">8</div>
                <p className="text-xs text-gray-600">66.7% success rate</p>
              </CardContent>
            </Card>
            <Card className="border-[#c0e6b9] bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-[#023337]">Deferrals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">2</div>
                <p className="text-xs text-gray-600">1 temporary, 1 permanent</p>
              </CardContent>
            </Card>
            <Card className="border-[#c0e6b9] bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-[#023337]">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">2</div>
                <p className="text-xs text-gray-600">Currently processing</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card className="border-[#c0e6b9] bg-white">
            <CardHeader>
              <CardTitle className="text-[#023337]">Donor Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input placeholder="Search by Donor ID, Name, or QR Code" className="border-[#c0e6b9]" />
                </div>
                <Button className="bg-[#4ea674] hover:bg-[#023337] text-white">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" className="border-[#c0e6b9] bg-transparent">
                  <QrCode className="w-4 h-4 mr-2" />
                  Scan QR
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Today's Donors List */}
          <Card className="border-[#c0e6b9] bg-white">
            <CardHeader>
              <CardTitle className="text-[#023337]">Today's Donors</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Nurse</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayDonors.map((donor) => (
                    <TableRow key={donor.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-[#c0e6b9] text-[#023337]">
                              {donor.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-[#023337]">{donor.name}</div>
                            <div className="text-sm text-gray-600">{donor.id}</div>
                            {donor.clearanceLinked && (
                              <Badge variant="outline" className="text-xs mt-1">
                                Clearance: {donor.patientRef}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {donor.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(donor.status)}>{donor.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{donor.nurse}</TableCell>
                      <TableCell className="text-sm">{donor.time}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#c0e6b9] hover:bg-[#c0e6b9] bg-transparent"
                          onClick={() => setSelectedDonor(donor)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="screening" className="space-y-6">
          <Card className="border-[#c0e6b9] bg-white">
            <CardHeader>
              <CardTitle className="text-[#023337]">Pre-Screening (Nurse/Donor Screener)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input type="number" placeholder="Enter weight" />
                </div>
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input type="number" placeholder="Enter height" />
                </div>
                <div>
                  <Label htmlFor="bp">Blood Pressure</Label>
                  <Input placeholder="e.g., 120/80" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="pulse">Pulse Rate</Label>
                  <Input type="number" placeholder="Enter pulse rate" />
                </div>
                <div>
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <Input type="number" step="0.1" placeholder="Enter temperature" />
                </div>
                <div>
                  <Label htmlFor="hemoglobin">Hemoglobin (g/dL)</Label>
                  <Input type="number" step="0.1" placeholder="Enter Hb level" />
                </div>
              </div>

              <div className="bg-[#e9f8e7] p-4 rounded-lg">
                <h4 className="font-medium text-[#023337] mb-2">Auto-Eligibility Check</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Weight: ≥50kg (Pass)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span>Hemoglobin: Check required</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="bg-[#4ea674] hover:bg-[#023337] text-white">Approve for Doctor Screening</Button>
                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent">
                  Temporary Deferral
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collection" className="space-y-6">
          <Card className="border-[#c0e6b9] bg-white">
            <CardHeader>
              <CardTitle className="text-[#023337]">Blood Bag Issuance & Collection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Bag Issuance Section */}
              <div className="border-b pb-4">
                <h4 className="font-medium text-[#023337] mb-3">Bag Issuance (by Endorser)</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="bagType">Blood Bag Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bag type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="double">Double</SelectItem>
                        <SelectItem value="triple">Triple</SelectItem>
                        <SelectItem value="quadruple">Quadruple</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="unitNumber">Unit Number</Label>
                    <Input placeholder="Auto-generated" value="BU240004" />
                  </div>
                  <div>
                    <Label htmlFor="segmentNumber">Segment Number</Label>
                    <Input placeholder="Auto-generated" value="SG240004" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="donationType">Donation Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conventional">Conventional Collection</SelectItem>
                        <SelectItem value="apheresis">Apheresis Collection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button variant="outline" className="border-[#c0e6b9] bg-transparent">
                      Print CUE Form
                    </Button>
                  </div>
                </div>
              </div>

              {/* Collection Section */}
              <div>
                <h4 className="font-medium text-[#023337] mb-3">Bleeding/Collection (by Phlebotomist)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input type="time" />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input type="time" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="volume">Volume Collected (mL)</Label>
                    <Input type="number" placeholder="Enter volume" />
                  </div>
                  <div>
                    <Label htmlFor="outcome">Collection Outcome</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select outcome" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="successful">Successful</SelectItem>
                        <SelectItem value="qns">QNS (Quantity Not Sufficient)</SelectItem>
                        <SelectItem value="qns-reaction">QNS with Reaction</SelectItem>
                        <SelectItem value="fp">FP (Failed Phlebotomy)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="remarks">Remarks</Label>
                  <Textarea placeholder="Enter any additional remarks" />
                </div>

                <div className="flex gap-3 mt-4">
                  <Button className="bg-[#4ea674] hover:bg-[#023337] text-white">Complete Collection</Button>
                  <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent">
                    Report Adverse Event
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card className="border-[#c0e6b9] bg-white">
            <CardHeader>
              <CardTitle className="text-[#023337]">Endorsement & Reporting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="reportDate">Report Date</Label>
                  <Input type="date" />
                </div>
                <div>
                  <Label htmlFor="venue">Venue</Label>
                  <Input placeholder="Facility location" />
                </div>
                <div>
                  <Label htmlFor="endorser">Endorser</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select endorser" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="staff1">Dr. Martinez</SelectItem>
                      <SelectItem value="staff2">Nurse Supervisor Garcia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-[#e9f8e7] p-4 rounded-lg">
                <h4 className="font-medium text-[#023337] mb-3">Today's Collection Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Total Units Collected:</span> 8
                  </div>
                  <div>
                    <span className="font-medium">QNS Cases:</span> 2
                  </div>
                  <div>
                    <span className="font-medium">Failed Phlebotomy:</span> 1
                  </div>
                  <div>
                    <span className="font-medium">Adverse Reactions:</span> 1
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="bg-[#4ea674] hover:bg-[#023337] text-white">
                  <Printer className="w-4 h-4 mr-2" />
                  Print Report
                </Button>
                <Button variant="outline" className="border-[#c0e6b9] bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline" className="border-[#c0e6b9] bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Export Excel
                </Button>
                <Button className="bg-[#023337] hover:bg-[#4ea674] text-white">Forward to Blood Processing</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
