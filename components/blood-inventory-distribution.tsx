"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, Truck, Trash2, Search, Download, Eye, Scan, CheckCircle, XCircle } from "lucide-react"

export function BloodInventoryDistribution() {
  const [selectedTab, setSelectedTab] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [barcodeInput, setBarcodeInput] = useState("")

  // Mock data for blood inventory
  const bloodStock = [
    {
      bloodType: "A+",
      wholeBlood: 15,
      rbc: 45,
      platelets: 8,
      plasma: 22,
      total: 90,
      threshold: 30,
      status: "sufficient",
    },
    { bloodType: "A-", wholeBlood: 5, rbc: 12, platelets: 2, plasma: 8, total: 27, threshold: 25, status: "normal" },
    {
      bloodType: "B+",
      wholeBlood: 8,
      rbc: 25,
      platelets: 4,
      plasma: 15,
      total: 52,
      threshold: 30,
      status: "sufficient",
    },
    { bloodType: "B-", wholeBlood: 2, rbc: 8, platelets: 1, plasma: 5, total: 16, threshold: 20, status: "critical" },
    {
      bloodType: "AB+",
      wholeBlood: 3,
      rbc: 10,
      platelets: 2,
      plasma: 7,
      total: 22,
      threshold: 15,
      status: "sufficient",
    },
    { bloodType: "AB-", wholeBlood: 1, rbc: 4, platelets: 0, plasma: 3, total: 8, threshold: 10, status: "critical" },
    {
      bloodType: "O+",
      wholeBlood: 20,
      rbc: 55,
      platelets: 12,
      plasma: 30,
      total: 117,
      threshold: 40,
      status: "sufficient",
    },
    { bloodType: "O-", wholeBlood: 6, rbc: 18, platelets: 3, plasma: 12, total: 39, threshold: 35, status: "normal" },
  ]

  const inventoryUnits = [
    {
      unitNumber: "WB240101001",
      component: "Whole Blood",
      bloodType: "O+",
      collectionDate: "2024-01-15",
      expiry: "2024-02-19",
      status: "Available",
      location: "Fridge-A1",
    },
    {
      unitNumber: "RBC240101002",
      component: "RBC",
      bloodType: "A+",
      collectionDate: "2024-01-14",
      expiry: "2024-03-15",
      status: "Reserved",
      location: "Fridge-B2",
    },
    {
      unitNumber: "PLT240101003",
      component: "Platelets",
      bloodType: "B-",
      collectionDate: "2024-01-16",
      expiry: "2024-01-21",
      status: "Quarantined",
      location: "Quarantine-Q1",
    },
    {
      unitNumber: "FFP240101004",
      component: "FFP",
      bloodType: "AB+",
      collectionDate: "2024-01-13",
      expiry: "2024-01-18",
      status: "Expired",
      location: "Freezer-F1",
    },
    {
      unitNumber: "RBC240101005",
      component: "RBC",
      bloodType: "O-",
      collectionDate: "2024-01-17",
      expiry: "2024-03-18",
      status: "Distributed",
      location: "Issued",
    },
  ]

  const quarantinedUnits = [
    {
      unitNumber: "PLT240101003",
      component: "Platelets",
      bloodType: "B-",
      reason: "Pending Confirmatory",
      quarantineDate: "2024-01-16",
      supervisor: "Dr. Santos",
    },
    {
      unitNumber: "RBC240101006",
      component: "RBC",
      bloodType: "A+",
      reason: "Reactive Serology",
      quarantineDate: "2024-01-15",
      supervisor: "Dr. Cruz",
    },
    {
      unitNumber: "WB240101007",
      component: "Whole Blood",
      bloodType: "O+",
      reason: "Damaged Label",
      quarantineDate: "2024-01-14",
      supervisor: "Dr. Reyes",
    },
  ]

  const pendingRequests = [
    {
      requestId: "REQ-2024-001",
      facility: "Bicol Medical Center",
      component: "RBC",
      bloodType: "O-",
      units: 2,
      urgency: "Emergency",
      requestDate: "2024-01-18",
      status: "Pending",
    },
    {
      requestId: "REQ-2024-002",
      facility: "ADRM Hospital",
      component: "Platelets",
      bloodType: "A+",
      units: 1,
      urgency: "Routine",
      requestDate: "2024-01-17",
      status: "Allocated",
    },
    {
      requestId: "REQ-2024-003",
      facility: "Camarines Sur Provincial Hospital",
      component: "FFP",
      bloodType: "AB+",
      units: 3,
      urgency: "Urgent",
      requestDate: "2024-01-18",
      status: "Ready",
    },
  ]

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "normal":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "sufficient":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Available":
        return <Badge className="bg-green-100 text-green-800">Available</Badge>
      case "Reserved":
        return <Badge className="bg-blue-100 text-blue-800">Reserved</Badge>
      case "Quarantined":
        return <Badge className="bg-red-100 text-red-800">Quarantined</Badge>
      case "Distributed":
        return <Badge className="bg-purple-100 text-purple-800">Distributed</Badge>
      case "Expired":
        return <Badge className="bg-gray-100 text-gray-800">Expired</Badge>
      case "Returned":
        return <Badge className="bg-orange-100 text-orange-800">Returned</Badge>
      case "Discarded":
        return <Badge className="bg-red-100 text-red-800">Discarded</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "Emergency":
        return <Badge className="bg-red-100 text-red-800">Emergency</Badge>
      case "Urgent":
        return <Badge className="bg-orange-100 text-orange-800">Urgent</Badge>
      case "Routine":
        return <Badge className="bg-green-100 text-green-800">Routine</Badge>
      default:
        return <Badge>{urgency}</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6 bg-[#e9f8e7] min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#023337]">Blood Inventory & Distribution</h1>
          <p className="text-[#4ea674] mt-1">Real-time stock management with end-to-end traceability</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-[#4ea674] hover:bg-[#023337]">
            <Download className="w-4 h-4 mr-2" />
            Export Reports
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-8 bg-white">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="stock">Stock Table</TabsTrigger>
          <TabsTrigger value="quarantine">Quarantine</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="returns">Returns</TabsTrigger>
          <TabsTrigger value="traceability">Traceability</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-[#c0e6b9]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[#023337]">Total Units</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#4ea674]">371</div>
                <p className="text-xs text-gray-600">All components</p>
              </CardContent>
            </Card>
            <Card className="border-[#c0e6b9]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[#023337]">Critical Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">2</div>
                <p className="text-xs text-gray-600">Below threshold</p>
              </CardContent>
            </Card>
            <Card className="border-[#c0e6b9]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[#023337]">Expiring Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">5</div>
                <p className="text-xs text-gray-600">Within 3 days</p>
              </CardContent>
            </Card>
            <Card className="border-[#c0e6b9]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[#023337]">Quarantined</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">3</div>
                <p className="text-xs text-gray-600">Pending review</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337]">Blood Stock Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Blood Type</TableHead>
                      <TableHead>Whole Blood</TableHead>
                      <TableHead>RBC</TableHead>
                      <TableHead>Platelets</TableHead>
                      <TableHead>Plasma</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Threshold</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bloodStock.map((stock) => (
                      <TableRow key={stock.bloodType}>
                        <TableCell className="font-medium">{stock.bloodType}</TableCell>
                        <TableCell>{stock.wholeBlood}</TableCell>
                        <TableCell>{stock.rbc}</TableCell>
                        <TableCell>{stock.platelets}</TableCell>
                        <TableCell>{stock.plasma}</TableCell>
                        <TableCell className="font-semibold">{stock.total}</TableCell>
                        <TableCell>{stock.threshold}</TableCell>
                        <TableCell>
                          <Badge className={getStockStatusColor(stock.status)}>
                            {stock.status === "critical" && <AlertTriangle className="w-3 h-3 mr-1" />}
                            {stock.status.charAt(0).toUpperCase() + stock.status.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock" className="space-y-4">
          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337]">Stock Inventory</CardTitle>
              <div className="flex gap-4 mt-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by unit number, blood type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Reserved">Reserved</SelectItem>
                    <SelectItem value="Quarantined">Quarantined</SelectItem>
                    <SelectItem value="Distributed">Distributed</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unit Number</TableHead>
                      <TableHead>Component</TableHead>
                      <TableHead>Blood Type</TableHead>
                      <TableHead>Collection Date</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryUnits.map((unit) => (
                      <TableRow key={unit.unitNumber}>
                        <TableCell className="font-medium">{unit.unitNumber}</TableCell>
                        <TableCell>{unit.component}</TableCell>
                        <TableCell>{unit.bloodType}</TableCell>
                        <TableCell>{unit.collectionDate}</TableCell>
                        <TableCell>{unit.expiry}</TableCell>
                        <TableCell>{getStatusBadge(unit.status)}</TableCell>
                        <TableCell>{unit.location}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Scan className="w-4 h-4" />
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

        <TabsContent value="quarantine" className="space-y-4">
          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337]">Quarantine Management</CardTitle>
              <p className="text-sm text-gray-600">Units requiring supervisor approval for release or discard</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unit Number</TableHead>
                      <TableHead>Component</TableHead>
                      <TableHead>Blood Type</TableHead>
                      <TableHead>Quarantine Reason</TableHead>
                      <TableHead>Quarantine Date</TableHead>
                      <TableHead>Supervisor</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quarantinedUnits.map((unit) => (
                      <TableRow key={unit.unitNumber}>
                        <TableCell className="font-medium">{unit.unitNumber}</TableCell>
                        <TableCell>{unit.component}</TableCell>
                        <TableCell>{unit.bloodType}</TableCell>
                        <TableCell>{unit.reason}</TableCell>
                        <TableCell>{unit.quarantineDate}</TableCell>
                        <TableCell>{unit.supervisor}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Release
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Release Unit from Quarantine</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label>Unit Number</Label>
                                    <Input value={unit.unitNumber} disabled />
                                  </div>
                                  <div>
                                    <Label>Release Reason</Label>
                                    <Textarea placeholder="Enter reason for release..." />
                                  </div>
                                  <div>
                                    <Label>Supervisor Digital Signature</Label>
                                    <Input placeholder="Enter supervisor credentials..." type="password" />
                                  </div>
                                  <Button className="w-full bg-[#4ea674] hover:bg-[#023337]">Confirm Release</Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="destructive">
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Discard
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Discard Unit</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label>Unit Number</Label>
                                    <Input value={unit.unitNumber} disabled />
                                  </div>
                                  <div>
                                    <Label>Discard Reason</Label>
                                    <Select>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select reason" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="reactive">Reactive Serology</SelectItem>
                                        <SelectItem value="damaged">Damaged</SelectItem>
                                        <SelectItem value="expired">Expired</SelectItem>
                                        <SelectItem value="temp">Temperature Excursion</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label>Supervisor Digital Signature</Label>
                                    <Input placeholder="Enter supervisor credentials..." type="password" />
                                  </div>
                                  <Button className="w-full" variant="destructive">
                                    Confirm Discard
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
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

        <TabsContent value="requests" className="space-y-4">
          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337]">Blood Requests & Allocation</CardTitle>
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-600">Manage incoming blood requests and allocate units</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-[#4ea674] hover:bg-[#023337]">New Request</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>New Blood Request</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Requesting Facility</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select facility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bmc">Bicol Medical Center</SelectItem>
                            <SelectItem value="adrm">ADRM Hospital</SelectItem>
                            <SelectItem value="csph">Camarines Sur Provincial Hospital</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Patient ID</Label>
                        <Input placeholder="Enter patient ID..." />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Component</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Component" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="wb">Whole Blood</SelectItem>
                              <SelectItem value="rbc">RBC</SelectItem>
                              <SelectItem value="plt">Platelets</SelectItem>
                              <SelectItem value="ffp">FFP</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Blood Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="a+">A+</SelectItem>
                              <SelectItem value="a-">A-</SelectItem>
                              <SelectItem value="b+">B+</SelectItem>
                              <SelectItem value="b-">B-</SelectItem>
                              <SelectItem value="ab+">AB+</SelectItem>
                              <SelectItem value="ab-">AB-</SelectItem>
                              <SelectItem value="o+">O+</SelectItem>
                              <SelectItem value="o-">O-</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Units Needed</Label>
                          <Input type="number" placeholder="1" />
                        </div>
                        <div>
                          <Label>Urgency</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Urgency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="emergency">Emergency</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                              <SelectItem value="routine">Routine</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button className="w-full bg-[#4ea674] hover:bg-[#023337]">Submit Request</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Facility</TableHead>
                      <TableHead>Component</TableHead>
                      <TableHead>Blood Type</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRequests.map((request) => (
                      <TableRow key={request.requestId}>
                        <TableCell className="font-medium">{request.requestId}</TableCell>
                        <TableCell>{request.facility}</TableCell>
                        <TableCell>{request.component}</TableCell>
                        <TableCell>{request.bloodType}</TableCell>
                        <TableCell>{request.units}</TableCell>
                        <TableCell>{getUrgencyBadge(request.urgency)}</TableCell>
                        <TableCell>{request.requestDate}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-[#4ea674] hover:bg-[#023337]">
                              Allocate
                            </Button>
                            <Button size="sm" variant="outline">
                              View
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

        <TabsContent value="distribution" className="space-y-4">
          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337]">Distribution Management</CardTitle>
              <p className="text-sm text-gray-600">Barcode scanning required for all distributions</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#023337]">Barcode Scanner</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Scan Unit Barcode</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Scan or enter unit barcode..."
                          value={barcodeInput}
                          onChange={(e) => setBarcodeInput(e.target.value)}
                        />
                        <Button className="bg-[#4ea674] hover:bg-[#023337]">
                          <Scan className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>Request ID</Label>
                      <Input placeholder="Enter request ID..." />
                    </div>
                    <div>
                      <Label>Receiving Facility/Ward</Label>
                      <Input placeholder="Enter destination..." />
                    </div>
                    <div>
                      <Label>Courier/Transport</Label>
                      <Input placeholder="Enter courier details..." />
                    </div>
                    <Button className="w-full bg-[#4ea674] hover:bg-[#023337]">
                      <Truck className="w-4 h-4 mr-2" />
                      Process Distribution
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#023337]">Recent Distributions</h3>
                  <div className="space-y-2">
                    {[
                      {
                        unit: "RBC240101005",
                        facility: "BMC Ward 3",
                        time: "10:30 AM",
                        courier: "Red Cross Transport",
                      },
                      { unit: "PLT240101008", facility: "ADRM ICU", time: "09:15 AM", courier: "Hospital Ambulance" },
                      {
                        unit: "FFP240101009",
                        facility: "CSPH Emergency",
                        time: "08:45 AM",
                        courier: "Private Courier",
                      },
                    ].map((dist, index) => (
                      <div key={index} className="p-3 bg-white rounded-lg border border-[#c0e6b9]">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-[#023337]">{dist.unit}</p>
                            <p className="text-sm text-gray-600">{dist.facility}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-[#4ea674]">{dist.time}</p>
                            <p className="text-xs text-gray-500">{dist.courier}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="returns" className="space-y-4">
          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337]">Blood Product Returns</CardTitle>
              <p className="text-sm text-gray-600">Process returned units with barcode verification</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#023337]">Return Processing</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Scan Returned Unit</Label>
                      <div className="flex gap-2">
                        <Input placeholder="Scan unit barcode..." />
                        <Button className="bg-[#4ea674] hover:bg-[#023337]">
                          <Scan className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>Return Reason</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unused">Unused</SelectItem>
                          <SelectItem value="incorrect">Incorrect Issue</SelectItem>
                          <SelectItem value="broken">Broken Seal</SelectItem>
                          <SelectItem value="temperature">Temperature Excursion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Condition Assessment</Label>
                      <Textarea placeholder="Describe unit condition..." />
                    </div>
                    <div>
                      <Label>Returning Facility</Label>
                      <Input placeholder="Enter facility name..." />
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Reinstate
                      </Button>
                      <Button className="flex-1" variant="destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Discard
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#023337]">Recent Returns</h3>
                  <div className="space-y-2">
                    {[
                      { unit: "RBC240101010", reason: "Unused", status: "Reinstated", facility: "BMC" },
                      { unit: "PLT240101011", reason: "Temperature Excursion", status: "Discarded", facility: "ADRM" },
                      { unit: "FFP240101012", reason: "Incorrect Issue", status: "Reinstated", facility: "CSPH" },
                    ].map((ret, index) => (
                      <div key={index} className="p-3 bg-white rounded-lg border border-[#c0e6b9]">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-[#023337]">{ret.unit}</p>
                            <p className="text-sm text-gray-600">{ret.reason}</p>
                          </div>
                          <div className="text-right">
                            <Badge
                              className={
                                ret.status === "Reinstated" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }
                            >
                              {ret.status}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">{ret.facility}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traceability" className="space-y-4">
          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337]">Unit Traceability Chain</CardTitle>
              <div className="flex gap-4 mt-4">
                <Input placeholder="Enter unit number to trace..." className="max-w-sm" />
                <Button className="bg-[#4ea674] hover:bg-[#023337]">
                  <Search className="w-4 h-4 mr-2" />
                  Trace Unit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-[#c0e6b9]">
                  <h3 className="font-semibold text-[#023337] mb-4">Unit: RBC240101002</h3>
                  <div className="space-y-4">
                    {[
                      {
                        stage: "Collection",
                        date: "2024-01-14 08:30",
                        operator: "Nurse Santos",
                        location: "MBD Site - Barangay Hall",
                        status: "Completed",
                      },
                      {
                        stage: "Processing",
                        date: "2024-01-14 14:15",
                        operator: "Tech Cruz",
                        location: "Processing Lab",
                        status: "Completed",
                      },
                      {
                        stage: "Serology",
                        date: "2024-01-15 09:00",
                        operator: "Lab Tech Reyes",
                        location: "Serology Lab",
                        status: "Completed",
                      },
                      {
                        stage: "Inventory",
                        date: "2024-01-15 16:30",
                        operator: "Staff Garcia",
                        location: "Fridge-B2",
                        status: "Current",
                      },
                      {
                        stage: "Reserved",
                        date: "2024-01-18 10:00",
                        operator: "Staff Lopez",
                        location: "Fridge-B2",
                        status: "Current",
                      },
                    ].map((step, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div
                          className={`w-4 h-4 rounded-full ${step.status === "Current" ? "bg-[#4ea674]" : "bg-gray-300"}`}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-[#023337]">{step.stage}</p>
                              <p className="text-sm text-gray-600">
                                {step.operator} • {step.location}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-[#4ea674]">{step.date}</p>
                              <Badge
                                className={
                                  step.status === "Current"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                                }
                              >
                                {step.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border-[#c0e6b9]">
              <CardHeader>
                <CardTitle className="text-[#023337]">Stock Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Current stock levels with threshold warnings</p>
                <Button className="w-full bg-[#4ea674] hover:bg-[#023337]">
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
            <Card className="border-[#c0e6b9]">
              <CardHeader>
                <CardTitle className="text-[#023337]">Distribution Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Detailed distribution history by facility and date</p>
                <Button className="w-full bg-[#4ea674] hover:bg-[#023337]">
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
            <Card className="border-[#c0e6b9]">
              <CardHeader>
                <CardTitle className="text-[#023337]">Expiry Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Units expiring within specified timeframes</p>
                <Button className="w-full bg-[#4ea674] hover:bg-[#023337]">
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
            <Card className="border-[#c0e6b9]">
              <CardHeader>
                <CardTitle className="text-[#023337]">Discard Report</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Comprehensive discard statistics and reasons</p>
                <Button className="w-full bg-[#4ea674] hover:bg-[#023337]">
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
            <Card className="border-[#c0e6b9]">
              <CardHeader>
                <CardTitle className="text-[#023337]">Return Report</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Blood product returns and reinstatement logs</p>
                <Button className="w-full bg-[#4ea674] hover:bg-[#023337]">
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
            <Card className="border-[#c0e6b9]">
              <CardHeader>
                <CardTitle className="text-[#023337]">Traceability Report</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Complete chain-of-custody audit logs</p>
                <Button className="w-full bg-[#4ea674] hover:bg-[#023337]">
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
