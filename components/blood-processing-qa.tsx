"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Thermometer,
  Beaker,
  Package,
  Download,
  Eye,
  Plus,
  RefreshCw,
} from "lucide-react"

interface BloodUnit {
  id: string
  unitNumber: string
  segmentNumber: string
  bagType: string
  endorser: string
  verifier: string
  validator: string
  date: string
  venue: string
  qcStatus: "pending" | "pass" | "irregular" | "discard"
  qcRemarks?: string
  components?: Component[]
  quarantineStatus: "awaiting" | "cleared" | "reactive" | "confirmatory"
}

interface Component {
  id: string
  type: string
  barcode: string
  yield: number
  status: string
}

interface QALog {
  id: string
  type: "equipment" | "temperature" | "corrective"
  equipment: string
  reading: string
  timestamp: string
  operator: string
  remarks?: string
}

export function BloodProcessingQA() {
  const [activeTab, setActiveTab] = useState("endorsement")
  const [selectedUnits, setSelectedUnits] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Sample data
  const [bloodUnits, setBloodUnits] = useState<BloodUnit[]>([
    {
      id: "1",
      unitNumber: "V123456",
      segmentNumber: "S001",
      bagType: "Triple",
      endorser: "Dr. Santos",
      verifier: "Nurse Cruz",
      validator: "Tech Lopez",
      date: "2024-01-15",
      venue: "Naga City Hall",
      qcStatus: "pass",
      quarantineStatus: "awaiting",
      components: [
        { id: "c1", type: "PRBC", barcode: "V123456-01", yield: 280, status: "quarantine" },
        { id: "c2", type: "FFP", barcode: "V123456-02", yield: 250, status: "quarantine" },
      ],
    },
    {
      id: "2",
      unitNumber: "V123457",
      segmentNumber: "S002",
      bagType: "Double",
      endorser: "Dr. Reyes",
      verifier: "Nurse Garcia",
      validator: "Tech Martinez",
      date: "2024-01-15",
      venue: "Legazpi Convention Center",
      qcStatus: "irregular",
      qcRemarks: "Minor hemolysis detected",
      quarantineStatus: "awaiting",
    },
  ])

  const [qaLogs, setQALogs] = useState<QALog[]>([
    {
      id: "1",
      type: "temperature",
      equipment: "Refrigerator Unit A",
      reading: "4.2°C",
      timestamp: "2024-01-15 08:00",
      operator: "Tech Lopez",
    },
    {
      id: "2",
      type: "equipment",
      equipment: "Centrifuge CF-1",
      reading: "3400 RPM - 15 min",
      timestamp: "2024-01-15 09:30",
      operator: "Tech Santos",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass":
        return "bg-green-100 text-green-800"
      case "irregular":
        return "bg-yellow-100 text-yellow-800"
      case "discard":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      case "awaiting":
        return "bg-yellow-100 text-yellow-800"
      case "cleared":
        return "bg-green-100 text-green-800"
      case "reactive":
        return "bg-red-100 text-red-800"
      case "confirmatory":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
      case "cleared":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "irregular":
      case "awaiting":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "discard":
      case "reactive":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "confirmatory":
        return <AlertTriangle className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredUnits = bloodUnits.filter((unit) => {
    const matchesSearch =
      unit.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.endorser.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.venue.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || unit.qcStatus === filterStatus
    return matchesSearch && matchesFilter
  })

  const quarantineUnits = bloodUnits.filter((unit) => unit.components && unit.components.length > 0)

  return (
    <div className="p-6 space-y-6 bg-[#e9f8e7] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#023337]">Blood Processing & QA</h1>
          <p className="text-[#4ea674] mt-1">Complete quality control and component processing system</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-[#4ea674] hover:bg-[#023337]">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-[#4ea674]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Units in QC</p>
                <p className="text-2xl font-bold text-[#023337]">24</p>
              </div>
              <Beaker className="h-8 w-8 text-[#4ea674]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Quarantine</p>
                <p className="text-2xl font-bold text-[#023337]">18</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cleared Today</p>
                <p className="text-2xl font-bold text-[#023337]">12</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">QC Irregularities</p>
                <p className="text-2xl font-bold text-[#023337]">3</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6 bg-white">
          <TabsTrigger value="endorsement" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Endorsement Intake
          </TabsTrigger>
          <TabsTrigger value="validation" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Validation & QC
          </TabsTrigger>
          <TabsTrigger value="components" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Component Prep
          </TabsTrigger>
          <TabsTrigger value="quarantine" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Quarantine
          </TabsTrigger>
          <TabsTrigger value="qa-logs" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            QA Logs
          </TabsTrigger>
          <TabsTrigger value="release" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Stock Release
          </TabsTrigger>
        </TabsList>

        {/* Endorsement Intake */}
        <TabsContent value="endorsement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#023337] flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Endorsement Intake
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button className="bg-[#4ea674] hover:bg-[#023337]">
                  <Upload className="h-4 w-4 mr-2" />
                  Import from MBD
                </Button>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import from Bleeding Area
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Import CSV
                </Button>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by unit number, endorser, or venue..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="pass">Pass</SelectItem>
                    <SelectItem value="irregular">Irregular</SelectItem>
                    <SelectItem value="discard">Discard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unit Number</TableHead>
                      <TableHead>Segment</TableHead>
                      <TableHead>Bag Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Venue</TableHead>
                      <TableHead>Endorser</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUnits.map((unit) => (
                      <TableRow key={unit.id}>
                        <TableCell className="font-mono">{unit.unitNumber}</TableCell>
                        <TableCell>{unit.segmentNumber}</TableCell>
                        <TableCell>{unit.bagType}</TableCell>
                        <TableCell>{unit.date}</TableCell>
                        <TableCell>{unit.venue}</TableCell>
                        <TableCell>{unit.endorser}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(unit.qcStatus)}>
                            {getStatusIcon(unit.qcStatus)}
                            <span className="ml-1 capitalize">{unit.qcStatus}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
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

        {/* Validation & QC */}
        <TabsContent value="validation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#023337] flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Validation & Quality Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unit Number</TableHead>
                      <TableHead>Bag Type</TableHead>
                      <TableHead>QC Checklist</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Remarks</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bloodUnits.map((unit) => (
                      <TableRow key={unit.id}>
                        <TableCell className="font-mono">{unit.unitNumber}</TableCell>
                        <TableCell>{unit.bagType}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Beaker className="h-3 w-3 mr-1" />
                                QC Check
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Quality Control Checklist - {unit.unitNumber}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Unit Number Verification</Label>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox id="unit-verify" />
                                      <Label htmlFor="unit-verify">Correct format (V123456)</Label>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Segment Number</Label>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox id="segment-verify" />
                                      <Label htmlFor="segment-verify">Matches unit</Label>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Bag Integrity</Label>
                                    <Select>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select condition" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="intact">Intact</SelectItem>
                                        <SelectItem value="leak">Leak Detected</SelectItem>
                                        <SelectItem value="clot">Clotting Present</SelectItem>
                                        <SelectItem value="hemolysis">Hemolysis</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Collection Volume</Label>
                                    <Select>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Volume status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="adequate">Adequate (450±45ml)</SelectItem>
                                        <SelectItem value="under">Under Collection</SelectItem>
                                        <SelectItem value="over">Over Collection</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label>Overall QC Result</Label>
                                  <Select>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select result" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pass">Pass</SelectItem>
                                      <SelectItem value="irregular">Irregular - Requires Review</SelectItem>
                                      <SelectItem value="discard">Discard</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Remarks</Label>
                                  <Textarea placeholder="Enter any observations or notes..." />
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline">Cancel</Button>
                                  <Button className="bg-[#4ea674] hover:bg-[#023337]">Save QC Result</Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(unit.qcStatus)}>
                            {getStatusIcon(unit.qcStatus)}
                            <span className="ml-1 capitalize">{unit.qcStatus}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{unit.qcRemarks}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
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

        {/* Component Preparation */}
        <TabsContent value="components" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#023337] flex items-center gap-2">
                <Package className="h-5 w-5" />
                Component Preparation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Units Ready for Processing</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {bloodUnits
                          .filter((unit) => unit.qcStatus === "pass")
                          .map((unit) => (
                            <div key={unit.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <p className="font-mono font-medium">{unit.unitNumber}</p>
                                <p className="text-sm text-gray-600">{unit.bagType} Bag</p>
                              </div>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" className="bg-[#4ea674] hover:bg-[#023337]">
                                    <Plus className="h-3 w-3 mr-1" />
                                    Process
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Component Processing - {unit.unitNumber}</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>Bag Type</Label>
                                        <Input value={unit.bagType} disabled />
                                      </div>
                                      <div>
                                        <Label>Processing Date</Label>
                                        <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                                      </div>
                                    </div>

                                    <div className="space-y-3">
                                      <Label className="text-base font-medium">Suggested Components</Label>
                                      <div className="space-y-2">
                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                          <div className="flex items-center space-x-2">
                                            <Checkbox id="prbc" defaultChecked />
                                            <Label htmlFor="prbc">Packed Red Blood Cells (PRBC)</Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Label>Yield (mL):</Label>
                                            <Input className="w-20" defaultValue="280" />
                                          </div>
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                          <div className="flex items-center space-x-2">
                                            <Checkbox id="ffp" defaultChecked />
                                            <Label htmlFor="ffp">Fresh Frozen Plasma (FFP)</Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Label>Yield (mL):</Label>
                                            <Input className="w-20" defaultValue="250" />
                                          </div>
                                        </div>
                                        {unit.bagType === "Triple" && (
                                          <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center space-x-2">
                                              <Checkbox id="platelets" />
                                              <Label htmlFor="platelets">Platelet Concentrate</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                              <Label>Yield (mL):</Label>
                                              <Input className="w-20" defaultValue="50" />
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <Label>Processing Notes</Label>
                                      <Textarea placeholder="Enter processing notes and observations..." />
                                    </div>

                                    <div className="flex justify-end gap-2">
                                      <Button variant="outline">Cancel</Button>
                                      <Button className="bg-[#4ea674] hover:bg-[#023337]">Process Components</Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Processing</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {bloodUnits
                          .filter((unit) => unit.components)
                          .map((unit) => (
                            <div key={unit.id} className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-mono font-medium">{unit.unitNumber}</p>
                                <Badge className="bg-blue-100 text-blue-800">Processed</Badge>
                              </div>
                              <div className="space-y-1">
                                {unit.components?.map((component) => (
                                  <div key={component.id} className="flex items-center justify-between text-sm">
                                    <span>{component.type}</span>
                                    <span className="font-mono">{component.barcode}</span>
                                    <span>{component.yield}mL</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quarantine Dashboard */}
        <TabsContent value="quarantine" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#023337] flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Digital Quarantine Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="border-l-4 border-l-yellow-500">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-[#023337]">18</p>
                      <p className="text-sm text-gray-600">Awaiting Serology</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-[#023337]">12</p>
                      <p className="text-sm text-gray-600">Cleared</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-[#023337]">2</p>
                      <p className="text-sm text-gray-600">Reactive</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <AlertTriangle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-[#023337]">3</p>
                      <p className="text-sm text-gray-600">Confirmatory</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component</TableHead>
                      <TableHead>Parent Unit</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Yield</TableHead>
                      <TableHead>Quarantine Status</TableHead>
                      <TableHead>Days in Quarantine</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quarantineUnits.flatMap(
                      (unit) =>
                        unit.components?.map((component) => (
                          <TableRow key={component.id}>
                            <TableCell className="font-mono">{component.barcode}</TableCell>
                            <TableCell className="font-mono">{unit.unitNumber}</TableCell>
                            <TableCell>{component.type}</TableCell>
                            <TableCell>{component.yield}mL</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(unit.quarantineStatus)}>
                                {getStatusIcon(unit.quarantineStatus)}
                                <span className="ml-1 capitalize">{unit.quarantineStatus}</span>
                              </Badge>
                            </TableCell>
                            <TableCell>3 days</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )) || [],
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* QA Logs */}
        <TabsContent value="qa-logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#023337] flex items-center gap-2">
                <Thermometer className="h-5 w-5" />
                Quality Assurance Logs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-[#4ea674] hover:bg-[#023337]">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Equipment Log
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Equipment Log</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Equipment</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select equipment" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="centrifuge-1">Centrifuge CF-1</SelectItem>
                              <SelectItem value="centrifuge-2">Centrifuge CF-2</SelectItem>
                              <SelectItem value="fridge-a">Refrigerator Unit A</SelectItem>
                              <SelectItem value="fridge-b">Refrigerator Unit B</SelectItem>
                              <SelectItem value="freezer-1">Freezer Unit 1</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Log Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="temperature">Temperature Reading</SelectItem>
                              <SelectItem value="equipment">Equipment Operation</SelectItem>
                              <SelectItem value="corrective">Corrective Action</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Reading/Value</Label>
                        <Input placeholder="Enter reading or value..." />
                      </div>
                      <div className="space-y-2">
                        <Label>Remarks</Label>
                        <Textarea placeholder="Enter any additional notes..." />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button className="bg-[#4ea674] hover:bg-[#023337]">Save Log</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import CSV
                </Button>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync API Data
                </Button>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Equipment</TableHead>
                      <TableHead>Reading</TableHead>
                      <TableHead>Operator</TableHead>
                      <TableHead>Remarks</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {qaLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.timestamp}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              log.type === "temperature"
                                ? "bg-blue-100 text-blue-800"
                                : log.type === "equipment"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-orange-100 text-orange-800"
                            }
                          >
                            {log.type === "temperature" && <Thermometer className="h-3 w-3 mr-1" />}
                            {log.type === "equipment" && <Beaker className="h-3 w-3 mr-1" />}
                            {log.type === "corrective" && <AlertTriangle className="h-3 w-3 mr-1" />}
                            {log.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.equipment}</TableCell>
                        <TableCell>{log.reading}</TableCell>
                        <TableCell>{log.operator}</TableCell>
                        <TableCell>{log.remarks}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock Release */}
        <TabsContent value="release" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#023337] flex items-center gap-2">
                <Package className="h-5 w-5" />
                Stock Release Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button className="bg-[#4ea674] hover:bg-[#023337]">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Release to Transfusion Stock
                </Button>
                <Button variant="outline">
                  <Package className="h-4 w-4 mr-2" />
                  Release to Distribution
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Release Report
                </Button>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Checkbox />
                      </TableHead>
                      <TableHead>Component</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Blood Group</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Release Option</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quarantineUnits.flatMap(
                      (unit) =>
                        unit.components
                          ?.filter((component) => unit.quarantineStatus === "cleared")
                          .map((component) => (
                            <TableRow key={component.id}>
                              <TableCell>
                                <Checkbox />
                              </TableCell>
                              <TableCell className="font-mono">{component.barcode}</TableCell>
                              <TableCell>{component.type}</TableCell>
                              <TableCell>O+</TableCell>
                              <TableCell>2024-02-15</TableCell>
                              <TableCell>
                                <Badge className="bg-green-100 text-green-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Cleared
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Select>
                                  <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Select release type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="transfusion">Transfusion Stock</SelectItem>
                                    <SelectItem value="distribution">Distribution</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            </TableRow>
                          )) || [],
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
