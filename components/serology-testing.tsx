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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Scan,
  Upload,
  CheckCircle,
  Clock,
  FileText,
  Download,
  Lock,
  Unlock,
  Camera,
  Beaker,
  Shield,
  Truck,
  Trash2,
  Eye,
  RefreshCw,
  Settings,
} from "lucide-react"

interface SerologyUnit {
  unitNumber: string
  donorId: string
  collectionDate: string
  source: string
  sstStatus: "received" | "missing" | "hemolyzed" | "insufficient"
  edtaStatus: "received" | "missing" | "hemolyzed" | "insufficient"
  redTopStatus: "received" | "missing" | "not-required"
  scanTime?: string
  operator?: string
  notes?: string
}

interface TestResult {
  unitNumber: string
  marker: string
  rawValue: string
  cutoff: string
  interpretation: "negative" | "reactive" | "inconclusive"
  qcStatus: "pass" | "fail" | "pending"
  enteredBy?: string
  verifiedBy?: string
  source: "manual" | "csv" | "api"
  analyzerName?: string
  kitLot?: string
  expiry?: string
}

interface QuarantineUnit {
  unitNumber: string
  donorId: string
  serologyStatus: string
  confirmatoryStatus: string
  daysOnHold: number
  lockReason: string
}

export function SerologyTesting() {
  const [activeTab, setActiveTab] = useState("accessioning")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUnits, setSelectedUnits] = useState<string[]>([])
  const [scanMode, setScanMode] = useState(false)

  // Sample data
  const [serologyUnits, setSerologyUnits] = useState<SerologyUnit[]>([
    {
      unitNumber: "V240001",
      donorId: "D24010001",
      collectionDate: "2024-01-15",
      source: "MBD - Barangay Health Center",
      sstStatus: "received",
      edtaStatus: "received",
      redTopStatus: "not-required",
      scanTime: "2024-01-15 14:30",
      operator: "MT001",
    },
    {
      unitNumber: "V240002",
      donorId: "D24010002",
      collectionDate: "2024-01-15",
      source: "Bleeding Area",
      sstStatus: "received",
      edtaStatus: "missing",
      redTopStatus: "received",
      scanTime: "2024-01-15 14:35",
      operator: "MT001",
    },
  ])

  const [testResults, setTestResults] = useState<TestResult[]>([
    {
      unitNumber: "V240001",
      marker: "HIV",
      rawValue: "0.125",
      cutoff: "1.000",
      interpretation: "negative",
      qcStatus: "pass",
      enteredBy: "MT001",
      verifiedBy: "SUP001",
      source: "api",
      analyzerName: "ARCHITECT i2000SR",
      kitLot: "LOT123456",
      expiry: "2024-06-30",
    },
    {
      unitNumber: "V240002",
      marker: "HBsAg",
      rawValue: "2.150",
      cutoff: "1.000",
      interpretation: "reactive",
      qcStatus: "pass",
      enteredBy: "MT001",
      source: "api",
      analyzerName: "ARCHITECT i2000SR",
      kitLot: "LOT123457",
      expiry: "2024-06-30",
    },
  ])

  const [quarantineUnits, setQuarantineUnits] = useState<QuarantineUnit[]>([
    {
      unitNumber: "V240002",
      donorId: "D24010002",
      serologyStatus: "HBsAg Reactive",
      confirmatoryStatus: "Pending Referral",
      daysOnHold: 3,
      lockReason: "Reactive Serology",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "received":
        return "bg-green-100 text-green-800"
      case "missing":
        return "bg-red-100 text-red-800"
      case "hemolyzed":
        return "bg-orange-100 text-orange-800"
      case "insufficient":
        return "bg-yellow-100 text-yellow-800"
      case "not-required":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getInterpretationColor = (interpretation: string) => {
    switch (interpretation) {
      case "negative":
        return "bg-green-100 text-green-800"
      case "reactive":
        return "bg-red-100 text-red-800"
      case "inconclusive":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getQuarantineColor = (days: number) => {
    if (days < 7) return "bg-green-100 text-green-800"
    if (days <= 14) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="p-6 space-y-6 bg-[#e9f8e7] min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#023337]">Serology Testing & Confirmatory</h1>
          <p className="text-[#4ea674] mt-2">
            Manage serology testing workflow from sample accessioning to confirmatory referrals
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-[#4ea674] text-[#4ea674] hover:bg-[#c0e6b9] bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Export Reports
          </Button>
          <Button className="bg-[#4ea674] hover:bg-[#023337] text-white">
            <Settings className="w-4 h-4 mr-2" />
            QC Settings
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-white border border-[#c0e6b9]">
          <TabsTrigger value="accessioning" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Sample Accessioning
          </TabsTrigger>
          <TabsTrigger value="ordering" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Test Ordering
          </TabsTrigger>
          <TabsTrigger value="results" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Result Review
          </TabsTrigger>
          <TabsTrigger value="confirmatory" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Confirmatory
          </TabsTrigger>
          <TabsTrigger value="quarantine" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Quarantine
          </TabsTrigger>
          <TabsTrigger value="discard" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Discard Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="accessioning" className="space-y-6">
          <Card className="border-[#c0e6b9]">
            <CardHeader className="bg-[#c0e6b9]">
              <CardTitle className="text-[#023337] flex items-center gap-2">
                <Scan className="w-5 h-5" />
                Sample Accessioning
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search by Unit Number or Donor ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-[#c0e6b9]"
                  />
                </div>
                <Button
                  variant={scanMode ? "default" : "outline"}
                  onClick={() => setScanMode(!scanMode)}
                  className={
                    scanMode ? "bg-[#4ea674] hover:bg-[#023337]" : "border-[#4ea674] text-[#4ea674] hover:bg-[#c0e6b9]"
                  }
                >
                  <Scan className="w-4 h-4 mr-2" />
                  {scanMode ? "Stop Scanning" : "Scan Mode"}
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-[#4ea674] text-[#4ea674] hover:bg-[#c0e6b9] bg-transparent"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Import Endorsement
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Import Endorsement List</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Source</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mbd">Mobile Blood Donation</SelectItem>
                            <SelectItem value="bleeding-area">Bleeding Area</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Upload File</Label>
                        <Input type="file" accept=".csv,.xlsx" />
                      </div>
                      <Button className="w-full bg-[#4ea674] hover:bg-[#023337]">Import Units</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unit Number</TableHead>
                      <TableHead>Donor ID</TableHead>
                      <TableHead>Collection Date</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>SST Status</TableHead>
                      <TableHead>EDTA Status</TableHead>
                      <TableHead>Red Top Status</TableHead>
                      <TableHead>Scan Time</TableHead>
                      <TableHead>Operator</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serologyUnits.map((unit) => (
                      <TableRow key={unit.unitNumber}>
                        <TableCell className="font-medium">{unit.unitNumber}</TableCell>
                        <TableCell>{unit.donorId}</TableCell>
                        <TableCell>{unit.collectionDate}</TableCell>
                        <TableCell>{unit.source}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(unit.sstStatus)}>{unit.sstStatus}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(unit.edtaStatus)}>{unit.edtaStatus}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(unit.redTopStatus)}>{unit.redTopStatus}</Badge>
                        </TableCell>
                        <TableCell>{unit.scanTime}</TableCell>
                        <TableCell>{unit.operator}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#4ea674] text-[#4ea674] bg-transparent"
                            >
                              <Camera className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#4ea674] text-[#4ea674] bg-transparent"
                            >
                              <Eye className="w-4 h-4" />
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

        <TabsContent value="ordering" className="space-y-6">
          <Card className="border-[#c0e6b9]">
            <CardHeader className="bg-[#c0e6b9]">
              <CardTitle className="text-[#023337] flex items-center gap-2">
                <Beaker className="w-5 h-5" />
                Test Ordering & Panels
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <Card className="border-[#4ea674]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-[#023337]">Daily QC Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">ARCHITECT i2000SR</span>
                        <Badge className="bg-green-100 text-green-800">Pass</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">COBAS e411</span>
                        <Badge className="bg-green-100 text-green-800">Pass</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#4ea674]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-[#023337]">Kit Expiry Alerts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">HIV Kit LOT123456</span>
                        <Badge className="bg-yellow-100 text-yellow-800">15 days</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">HBsAg Kit LOT123457</span>
                        <Badge className="bg-green-100 text-green-800">45 days</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#4ea674]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-[#023337]">Calibration Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">ARCHITECT i2000SR</span>
                        <Badge className="bg-green-100 text-green-800">Current</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">COBAS e411</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Due 3 days</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-4 mb-6">
                <Button className="bg-[#4ea674] hover:bg-[#023337]">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Fetch API Results
                </Button>
                <Button variant="outline" className="border-[#4ea674] text-[#4ea674] hover:bg-[#c0e6b9] bg-transparent">
                  <Upload className="w-4 h-4 mr-2" />
                  Import CSV
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-[#4ea674] text-[#4ea674] hover:bg-[#c0e6b9] bg-transparent"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      QC Kit Log
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>QC Kit Log Entry</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Kit Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select kit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hiv">HIV Kit</SelectItem>
                              <SelectItem value="hbsag">HBsAg Kit</SelectItem>
                              <SelectItem value="hcv">HCV Kit</SelectItem>
                              <SelectItem value="syphilis">Syphilis Kit</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Lot Number</Label>
                          <Input placeholder="Enter lot number" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Expiry Date</Label>
                          <Input type="date" />
                        </div>
                        <div>
                          <Label>Analyzer ID</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select analyzer" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="architect">ARCHITECT i2000SR</SelectItem>
                              <SelectItem value="cobas">COBAS e411</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button className="w-full bg-[#4ea674] hover:bg-[#023337]">Log Kit Usage</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {serologyUnits
                  .filter((unit) => unit.sstStatus === "received" && unit.edtaStatus === "received")
                  .map((unit) => (
                    <Card key={unit.unitNumber} className="border-[#4ea674]">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-[#023337]">{unit.unitNumber}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-sm text-gray-600">Donor: {unit.donorId}</div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">SST Panel</span>
                              <Badge className="bg-blue-100 text-blue-800">Ordered</Badge>
                            </div>
                            <div className="text-xs text-gray-500">HIV, HBsAg, HCV, Syphilis</div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">EDTA Panel</span>
                              <Badge className="bg-blue-100 text-blue-800">Ordered</Badge>
                            </div>
                            <div className="text-xs text-gray-500">ABO/Rh Recheck, Malaria</div>
                          </div>
                          {unit.redTopStatus === "received" && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">NAAT Panel</span>
                                <Badge className="bg-orange-100 text-orange-800">Optional</Badge>
                              </div>
                              <div className="text-xs text-gray-500">HIV/HCV NAT</div>
                            </div>
                          )}
                          <Button size="sm" className="w-full bg-[#4ea674] hover:bg-[#023337]">
                            Release Orders
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <Card className="border-[#c0e6b9]">
            <CardHeader className="bg-[#c0e6b9]">
              <CardTitle className="text-[#023337] flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Result Review & Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search by Unit Number or Marker..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-[#c0e6b9]"
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Results</SelectItem>
                    <SelectItem value="pending">Pending Verification</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="reactive">Reactive Results</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unit Number</TableHead>
                      <TableHead>Marker</TableHead>
                      <TableHead>Raw Value</TableHead>
                      <TableHead>Cutoff</TableHead>
                      <TableHead>Interpretation</TableHead>
                      <TableHead>QC Status</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Entered By</TableHead>
                      <TableHead>Verified By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testResults.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{result.unitNumber}</TableCell>
                        <TableCell>{result.marker}</TableCell>
                        <TableCell>{result.rawValue}</TableCell>
                        <TableCell>{result.cutoff}</TableCell>
                        <TableCell>
                          <Badge className={getInterpretationColor(result.interpretation)}>
                            {result.interpretation}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              result.qcStatus === "pass" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }
                          >
                            {result.qcStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {result.source === "api" && <Lock className="w-4 h-4 text-gray-500" />}
                            <span className="capitalize">{result.source}</span>
                          </div>
                        </TableCell>
                        <TableCell>{result.enteredBy}</TableCell>
                        <TableCell>{result.verifiedBy || "Pending"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {!result.verifiedBy && (
                              <Button size="sm" className="bg-[#4ea674] hover:bg-[#023337]">
                                Verify
                              </Button>
                            )}
                            {result.interpretation === "reactive" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-orange-500 text-orange-600 bg-transparent"
                              >
                                Rerun
                              </Button>
                            )}
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

        <TabsContent value="confirmatory" className="space-y-6">
          <Card className="border-[#c0e6b9]">
            <CardHeader className="bg-[#c0e6b9]">
              <CardTitle className="text-[#023337] flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Confirmatory Endorsement
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex gap-4 mb-6">
                <Button className="bg-[#4ea674] hover:bg-[#023337]" disabled={selectedUnits.length === 0}>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Referral ({selectedUnits.length})
                </Button>
                <Button variant="outline" className="border-[#4ea674] text-[#4ea674] hover:bg-[#c0e6b9] bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-[#4ea674]">
                  <CardHeader>
                    <CardTitle className="text-[#023337]">Reactive/Inconclusive Units</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {testResults
                        .filter((r) => r.interpretation !== "negative")
                        .map((result, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 p-3 border border-[#c0e6b9] rounded-lg"
                          >
                            <Checkbox
                              checked={selectedUnits.includes(result.unitNumber)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedUnits([...selectedUnits, result.unitNumber])
                                } else {
                                  setSelectedUnits(selectedUnits.filter((u) => u !== result.unitNumber))
                                }
                              }}
                            />
                            <div className="flex-1">
                              <div className="font-medium">{result.unitNumber}</div>
                              <div className="text-sm text-gray-600">
                                {result.marker}: {result.interpretation}
                              </div>
                            </div>
                            <Badge className={getInterpretationColor(result.interpretation)}>
                              {result.interpretation}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#4ea674]">
                  <CardHeader>
                    <CardTitle className="text-[#023337]">Referral Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Destination Laboratory</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select destination lab" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ritm">RITM - Research Institute for Tropical Medicine</SelectItem>
                            <SelectItem value="nlrc">NLRC - National Laboratory Reference Center</SelectItem>
                            <SelectItem value="subnational">Sub-National Reference Laboratory</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Courier ID</Label>
                          <Input placeholder="Enter courier ID" />
                        </div>
                        <div>
                          <Label>Seal Number</Label>
                          <Input placeholder="Enter seal number" />
                        </div>
                      </div>
                      <div>
                        <Label>Dispatch Time</Label>
                        <Input type="datetime-local" />
                      </div>
                      <div>
                        <Label>Special Instructions</Label>
                        <Textarea placeholder="Enter any special handling instructions..." />
                      </div>
                      <Button className="w-full bg-[#4ea674] hover:bg-[#023337]">Mark as Dispatched</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-[#4ea674] mt-6">
                <CardHeader>
                  <CardTitle className="text-[#023337]">Chain of Custody Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium">Packed for Referral</div>
                        <div className="text-sm text-gray-600">2024-01-15 16:30 - MT001</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Dispatched to RITM</div>
                        <div className="text-sm text-gray-600">Pending - Courier: COR001, Seal: SEAL123456</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-400">Received by Reference Lab</div>
                        <div className="text-sm text-gray-400">Pending</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quarantine" className="space-y-6">
          <Card className="border-[#c0e6b9]">
            <CardHeader className="bg-[#c0e6b9]">
              <CardTitle className="text-[#023337] flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Quarantine Management
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="border-[#4ea674]">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-[#023337]">15</div>
                    <div className="text-sm text-gray-600">Units in Quarantine</div>
                  </CardContent>
                </Card>
                <Card className="border-[#4ea674]">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">8</div>
                    <div className="text-sm text-gray-600">{"< 7 Days"}</div>
                  </CardContent>
                </Card>
                <Card className="border-[#4ea674]">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-yellow-600">5</div>
                    <div className="text-sm text-gray-600">7-14 Days</div>
                  </CardContent>
                </Card>
                <Card className="border-[#4ea674]">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-red-600">2</div>
                    <div className="text-sm text-gray-600">{"> 14 Days"}</div>
                  </CardContent>
                </Card>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unit Number</TableHead>
                      <TableHead>Donor ID</TableHead>
                      <TableHead>Serology Status</TableHead>
                      <TableHead>Confirmatory Status</TableHead>
                      <TableHead>Days on Hold</TableHead>
                      <TableHead>Lock Reason</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quarantineUnits.map((unit) => (
                      <TableRow key={unit.unitNumber}>
                        <TableCell className="font-medium">{unit.unitNumber}</TableCell>
                        <TableCell>{unit.donorId}</TableCell>
                        <TableCell>{unit.serologyStatus}</TableCell>
                        <TableCell>{unit.confirmatoryStatus}</TableCell>
                        <TableCell>
                          <Badge className={getQuarantineColor(unit.daysOnHold)}>{unit.daysOnHold} days</Badge>
                        </TableCell>
                        <TableCell>{unit.lockReason}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-[#4ea674] text-[#4ea674] bg-transparent"
                                >
                                  <Unlock className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Release from Quarantine</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label>Unit Number</Label>
                                    <Input value={unit.unitNumber} disabled />
                                  </div>
                                  <div>
                                    <Label>Release Reason</Label>
                                    <Select>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select reason" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="negative-confirmatory">
                                          Negative Confirmatory Result
                                        </SelectItem>
                                        <SelectItem value="false-reactive">False Reactive - Technical Error</SelectItem>
                                        <SelectItem value="supervisor-override">Supervisor Override</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label>Supervisor Authorization</Label>
                                    <Input placeholder="Enter supervisor ID" />
                                  </div>
                                  <div>
                                    <Label>Digital Signature</Label>
                                    <Input type="password" placeholder="Enter digital signature" />
                                  </div>
                                  <Button className="w-full bg-[#4ea674] hover:bg-[#023337]">Release Unit</Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button size="sm" variant="outline" className="border-red-500 text-red-600 bg-transparent">
                              <Trash2 className="w-4 h-4" />
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

        <TabsContent value="discard" className="space-y-6">
          <Card className="border-[#c0e6b9]">
            <CardHeader className="bg-[#c0e6b9]">
              <CardTitle className="text-[#023337] flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Discard Management
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex gap-4 mb-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-[#4ea674] hover:bg-[#023337]">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Initiate Discard
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Initiate Unit Discard</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Unit Number</Label>
                        <Input placeholder="Scan or enter unit number" />
                      </div>
                      <div>
                        <Label>Discard Reason</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hiv-reactive">HIV Reactive</SelectItem>
                            <SelectItem value="hbsag-reactive">HBsAg Reactive</SelectItem>
                            <SelectItem value="hcv-reactive">HCV Reactive</SelectItem>
                            <SelectItem value="syphilis-reactive">Syphilis Reactive</SelectItem>
                            <SelectItem value="hemolyzed">Hemolyzed Sample</SelectItem>
                            <SelectItem value="labeling-error">Labeling Error</SelectItem>
                            <SelectItem value="insufficient-volume">Insufficient Volume</SelectItem>
                            <SelectItem value="qc-fail">QC Failure</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Disposal Method</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="autoclave">Autoclave</SelectItem>
                            <SelectItem value="incineration">Incineration</SelectItem>
                            <SelectItem value="biohazard">Biohazard Disposal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Notes</Label>
                        <Textarea placeholder="Additional notes..." />
                      </div>
                      <Button className="w-full bg-[#4ea674] hover:bg-[#023337]">Submit for Approval</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" className="border-[#4ea674] text-[#4ea674] hover:bg-[#c0e6b9] bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Export Discard Log
                </Button>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unit Number</TableHead>
                      <TableHead>Donor ID</TableHead>
                      <TableHead>Discard Reason</TableHead>
                      <TableHead>Disposal Method</TableHead>
                      <TableHead>Initiated By</TableHead>
                      <TableHead>Approved By</TableHead>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">V240002</TableCell>
                      <TableCell>D24010002</TableCell>
                      <TableCell>HBsAg Reactive</TableCell>
                      <TableCell>Autoclave</TableCell>
                      <TableCell>MT001</TableCell>
                      <TableCell>SUP001</TableCell>
                      <TableCell>2024-01-15 17:30</TableCell>
                      <TableCell>
                        <Badge className="bg-red-100 text-red-800">Discarded</Badge>
                      </TableCell>
                    </TableRow>
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
