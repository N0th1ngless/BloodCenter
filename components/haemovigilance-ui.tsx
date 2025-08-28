"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  AlertTriangle,
  Clock,
  FileText,
  Activity,
  Bell,
  Plus,
  Eye,
  Edit,
  Download,
  FilePenLineIcon as Signature,
  AlertCircle,
} from "lucide-react"

interface HaemovigilanceCase {
  caseId: string
  episodeId: string
  patientName: string
  mrn: string
  ward: string
  bed: string
  unitNumbers: string[]
  donorIds: string[]
  reactionType: string
  severity: "Mild" | "Moderate" | "Severe" | "Life-Threatening"
  status: "Reported" | "Under Review" | "Investigations Ordered" | "Interim Outcome" | "Final Outcome" | "Closed"
  dateReported: string
  investigator: string
  onsetTime: string
  timeFromStart: string
  reporter: string
  outcome?: string
  imputability?: string
}

export function HaemovigilanceUI() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedCase, setSelectedCase] = useState<HaemovigilanceCase | null>(null)
  const [showQuickReport, setShowQuickReport] = useState(false)
  const [showFullCase, setShowFullCase] = useState(false)
  const [filterSeverity, setFilterSeverity] = useState("All Severities")
  const [filterStatus, setFilterStatus] = useState("All Statuses")
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data
  const cases: HaemovigilanceCase[] = [
    {
      caseId: "HV2025001",
      episodeId: "EP240815001",
      patientName: "Maria Santos",
      mrn: "MRN123456",
      ward: "ICU",
      bed: "ICU-01",
      unitNumbers: ["V240815001", "V240815002"],
      donorIds: ["D240700123", "D240700124"],
      reactionType: "Febrile Non-Hemolytic",
      severity: "Moderate",
      status: "Under Review",
      dateReported: "2025-01-18 14:30",
      investigator: "Dr. Cruz",
      onsetTime: "2025-01-18 13:45",
      timeFromStart: "45 minutes",
      reporter: "Nurse Garcia",
    },
    {
      caseId: "HV2025002",
      episodeId: "EP240815002",
      patientName: "Juan Dela Cruz",
      mrn: "MRN789012",
      ward: "Surgery",
      bed: "SUR-05",
      unitNumbers: ["V240815003"],
      donorIds: ["D240700125"],
      reactionType: "Allergic",
      severity: "Mild",
      status: "Closed",
      dateReported: "2025-01-17 09:15",
      investigator: "Dr. Reyes",
      onsetTime: "2025-01-17 08:30",
      timeFromStart: "15 minutes",
      reporter: "Nurse Lopez",
      outcome: "Recovered",
      imputability: "Probable",
    },
  ]

  const kpis = {
    newCases24h: 2,
    severeEvents7d: 1,
    openCases: 5,
    avgTimeToReport: "2.3 hours",
    avgTimeToClose: "4.2 days",
  }

  const alerts = [
    { type: "severe", message: "Severe TRALI case reported - ICU Ward", time: "10 min ago" },
    { type: "overdue", message: "Case HV2025003 investigation overdue", time: "2 hours ago" },
    { type: "cluster", message: "Cluster detection: 3 febrile reactions from same MBD event", time: "4 hours ago" },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Mild":
        return "bg-green-100 text-green-800"
      case "Moderate":
        return "bg-yellow-100 text-yellow-800"
      case "Severe":
        return "bg-orange-100 text-orange-800"
      case "Life-Threatening":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Reported":
        return "bg-blue-100 text-blue-800"
      case "Under Review":
        return "bg-yellow-100 text-yellow-800"
      case "Investigations Ordered":
        return "bg-purple-100 text-purple-800"
      case "Interim Outcome":
        return "bg-orange-100 text-orange-800"
      case "Final Outcome":
        return "bg-green-100 text-green-800"
      case "Closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredCases = cases.filter((case_) => {
    const matchesSearch =
      case_.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.mrn.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = !filterSeverity || case_.severity === filterSeverity
    const matchesStatus = !filterStatus || case_.status === filterStatus
    return matchesSearch && matchesSeverity && matchesStatus
  })

  return (
    <div className="p-6 space-y-6 bg-[#e9f8e7] min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#023337]">Haemovigilance System</h1>
          <p className="text-[#4ea674] mt-1">Patient Safety Monitoring & Adverse Event Management</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowQuickReport(true)} className="bg-red-600 hover:bg-red-700 text-white">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Quick Report
          </Button>
          <Button onClick={() => setShowFullCase(true)} className="bg-[#4ea674] hover:bg-[#3d8c5a] text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Case
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-white">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="cases">Case Management</TabsTrigger>
          <TabsTrigger value="investigation">Investigation</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">New Cases (24h)</p>
                    <p className="text-2xl font-bold text-[#023337]">{kpis.newCases24h}</p>
                  </div>
                  <Bell className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Severe Events (7d)</p>
                    <p className="text-2xl font-bold text-[#023337]">{kpis.severeEvents7d}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Open Cases</p>
                    <p className="text-2xl font-bold text-[#023337]">{kpis.openCases}</p>
                  </div>
                  <FileText className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Time to Report</p>
                    <p className="text-2xl font-bold text-[#023337]">{kpis.avgTimeToReport}</p>
                  </div>
                  <Clock className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Time to Close</p>
                    <p className="text-2xl font-bold text-[#023337]">{kpis.avgTimeToClose}</p>
                  </div>
                  <Activity className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#023337]">
                <AlertCircle className="w-5 h-5" />
                Critical Alerts & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-l-4 ${
                      alert.type === "severe"
                        ? "border-l-red-500 bg-red-50"
                        : alert.type === "overdue"
                          ? "border-l-yellow-500 bg-yellow-50"
                          : "border-l-blue-500 bg-blue-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-[#023337]">{alert.message}</p>
                      <span className="text-sm text-gray-500">{alert.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Cases */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#023337]">Recent Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Ward</TableHead>
                    <TableHead>Reaction Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Reported</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cases.slice(0, 5).map((case_) => (
                    <TableRow key={case_.caseId}>
                      <TableCell className="font-medium">{case_.caseId}</TableCell>
                      <TableCell>{case_.patientName}</TableCell>
                      <TableCell>{case_.ward}</TableCell>
                      <TableCell>{case_.reactionType}</TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(case_.severity)}>{case_.severity}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(case_.status)}>{case_.status}</Badge>
                      </TableCell>
                      <TableCell>{case_.dateReported}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cases" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <Input
                    placeholder="Search cases, patients, MRN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Severities">All Severities</SelectItem>
                    <SelectItem value="Mild">Mild</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Severe">Severe</SelectItem>
                    <SelectItem value="Life-Threatening">Life-Threatening</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Statuses">All Statuses</SelectItem>
                    <SelectItem value="Reported">Reported</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Investigations Ordered">Investigations Ordered</SelectItem>
                    <SelectItem value="Interim Outcome">Interim Outcome</SelectItem>
                    <SelectItem value="Final Outcome">Final Outcome</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Cases Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#023337]">Haemovigilance Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>MRN</TableHead>
                    <TableHead>Ward/Bed</TableHead>
                    <TableHead>Unit Numbers</TableHead>
                    <TableHead>Reaction Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Investigator</TableHead>
                    <TableHead>Date Reported</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCases.map((case_) => (
                    <TableRow key={case_.caseId}>
                      <TableCell className="font-medium">{case_.caseId}</TableCell>
                      <TableCell>{case_.patientName}</TableCell>
                      <TableCell>{case_.mrn}</TableCell>
                      <TableCell>
                        {case_.ward}-{case_.bed}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {case_.unitNumbers.map((unit, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {unit}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{case_.reactionType}</TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(case_.severity)}>{case_.severity}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(case_.status)}>{case_.status}</Badge>
                      </TableCell>
                      <TableCell>{case_.investigator}</TableCell>
                      <TableCell>{case_.dateReported}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => setSelectedCase(case_)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setShowFullCase(true)}>
                            <Edit className="w-4 h-4" />
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

        <TabsContent value="investigation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#023337]">Investigation Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <h3 className="font-semibold text-[#023337] mb-2">Batch/Lot Lookup</h3>
                  <p className="text-sm text-gray-600 mb-3">Find all units from same donation batch</p>
                  <Input placeholder="Enter batch/lot number" className="mb-2" />
                  <Button className="w-full bg-[#4ea674] hover:bg-[#3d8c5a] text-white">Search Batch</Button>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold text-[#023337] mb-2">MBD Event Linkage</h3>
                  <p className="text-sm text-gray-600 mb-3">View donors from same mobile drive</p>
                  <Input placeholder="Enter MBD event ID" className="mb-2" />
                  <Button className="w-full bg-[#4ea674] hover:bg-[#3d8c5a] text-white">View Event</Button>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold text-[#023337] mb-2">Cluster Detection</h3>
                  <p className="text-sm text-gray-600 mb-3">Statistical analysis for event clusters</p>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time window" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">Last 24 hours</SelectItem>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="w-full mt-2 bg-[#4ea674] hover:bg-[#3d8c5a] text-white">Analyze Clusters</Button>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#023337]">Regulatory Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <h3 className="font-semibold text-[#023337] mb-2">DOH Report</h3>
                  <p className="text-sm text-gray-600 mb-3">Department of Health compliance report</p>
                  <Button className="w-full bg-[#4ea674] hover:bg-[#3d8c5a] text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Generate DOH Report
                  </Button>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold text-[#023337] mb-2">AABB Report</h3>
                  <p className="text-sm text-gray-600 mb-3">American Association of Blood Banks report</p>
                  <Button className="w-full bg-[#4ea674] hover:bg-[#3d8c5a] text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Generate AABB Report
                  </Button>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold text-[#023337] mb-2">WHO Report</h3>
                  <p className="text-sm text-gray-600 mb-3">World Health Organization surveillance report</p>
                  <Button className="w-full bg-[#4ea674] hover:bg-[#3d8c5a] text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Generate WHO Report
                  </Button>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#023337]">Haemovigilance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="font-semibold text-[#023337] mb-4">Reaction Trends by Type</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Febrile Non-Hemolytic</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#4ea674] h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-2 mt-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Allergic</span>
                      <span className="text-sm font-medium">30%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "30%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-2 mt-3">
                    <div className="flex justify-between">
                      <span className="text-sm">TRALI</span>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: "15%" }}></div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold text-[#023337] mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Time to Report (Avg)</span>
                      <span className="font-medium">2.3 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Time to Investigation (Avg)</span>
                      <span className="font-medium">6.8 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Case Closure Rate</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Donor Recall Rate</span>
                      <span className="font-medium">3.2%</span>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#023337]">System Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-[#023337]">Alert Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Severe Event Alerts</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Overdue Investigation Alerts</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Cluster Detection Alerts</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-[#023337]">SLA Configuration</h3>
                  <div className="space-y-3">
                    <div>
                      <Label>Quick Report Window (hours)</Label>
                      <Input type="number" defaultValue="48" className="mt-1" />
                    </div>
                    <div>
                      <Label>Investigation Assignment (hours)</Label>
                      <Input type="number" defaultValue="4" className="mt-1" />
                    </div>
                    <div>
                      <Label>Final Report to DOH (days)</Label>
                      <Input type="number" defaultValue="7" className="mt-1" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Report Dialog */}
      <Dialog open={showQuickReport} onOpenChange={setShowQuickReport}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#023337] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Quick Adverse Event Report
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Episode ID</Label>
                <Input placeholder="Auto-filled from transfusion" />
              </div>
              <div>
                <Label>Unit Number (Scan)</Label>
                <Input placeholder="Scan barcode" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Reaction Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="allergic">Allergic</SelectItem>
                    <SelectItem value="febrile">Febrile Non-Hemolytic</SelectItem>
                    <SelectItem value="hemolytic">Acute Hemolytic</SelectItem>
                    <SelectItem value="trali">TRALI</SelectItem>
                    <SelectItem value="taco">TACO</SelectItem>
                    <SelectItem value="sepsis">Sepsis</SelectItem>
                    <SelectItem value="anaphylaxis">Anaphylaxis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Severity</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                    <SelectItem value="life-threatening">Life-Threatening</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Onset Date/Time</Label>
              <Input type="datetime-local" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="stop-transfusion" />
              <Label htmlFor="stop-transfusion">Transfusion stopped immediately</Label>
            </div>
            <div>
              <Label>Immediate Actions Taken</Label>
              <Textarea placeholder="Describe immediate actions..." />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={() => setShowQuickReport(false)}
              >
                Submit Quick Report
              </Button>
              <Button variant="outline" onClick={() => setShowQuickReport(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full Case Dialog */}
      <Dialog open={showFullCase} onOpenChange={setShowFullCase}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#023337]">Full Case Management</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="clinical">Clinical</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
              <TabsTrigger value="labs">Labs</TabsTrigger>
              <TabsTrigger value="donor">Donor Link</TabsTrigger>
              <TabsTrigger value="investigation">Investigation</TabsTrigger>
              <TabsTrigger value="followup">Follow-up</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Case ID</Label>
                  <Input value="HV2025003" disabled />
                </div>
                <div>
                  <Label>Episode ID</Label>
                  <Input placeholder="Auto-filled" />
                </div>
                <div>
                  <Label>Patient Name</Label>
                  <Input placeholder="Auto-filled from transfusion" />
                </div>
                <div>
                  <Label>MRN</Label>
                  <Input placeholder="Auto-filled" />
                </div>
                <div>
                  <Label>Ward/Bed</Label>
                  <Input placeholder="Auto-filled" />
                </div>
                <div>
                  <Label>Ordering Physician</Label>
                  <Input placeholder="Auto-filled" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="clinical" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Onset Time</Label>
                  <Input type="datetime-local" />
                </div>
                <div>
                  <Label>Time from Start</Label>
                  <Input placeholder="e.g., 45 minutes" />
                </div>
              </div>
              <div>
                <Label>Symptoms & Clinical Presentation</Label>
                <Textarea placeholder="Describe symptoms, vital signs, clinical findings..." />
              </div>
              <div>
                <Label>Medications Given</Label>
                <Textarea placeholder="List medications and dosages..." />
              </div>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              <div>
                <Label>Immediate Actions Taken</Label>
                <Textarea placeholder="Describe immediate response actions..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="transfusion-stopped" />
                  <Label htmlFor="transfusion-stopped">Transfusion stopped</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="icu-transfer" />
                  <Label htmlFor="icu-transfer">ICU transfer</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="labs" className="space-y-4">
              <div>
                <Label>Lab Orders Placed</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="dat" />
                    <Label htmlFor="dat">Direct Antiglobulin Test (DAT)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="blood-culture" />
                    <Label htmlFor="blood-culture">Blood Culture</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="cbc" />
                    <Label htmlFor="cbc">Complete Blood Count</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="crossmatch" />
                    <Label htmlFor="crossmatch">Repeat Crossmatch</Label>
                  </div>
                </div>
              </div>
              <div>
                <Label>Lab Results</Label>
                <Textarea placeholder="Enter or attach lab results..." />
              </div>
            </TabsContent>

            <TabsContent value="donor" className="space-y-4">
              <div>
                <Label>Implicated Unit Numbers</Label>
                <Input placeholder="V240815001, V240815002" />
              </div>
              <div>
                <Label>Donor IDs</Label>
                <Input placeholder="D240700123, D240700124" />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="donor-recall" />
                <Label htmlFor="donor-recall">Donor recall required</Label>
              </div>
            </TabsContent>

            <TabsContent value="investigation" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Assigned Investigator</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select investigator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dr-cruz">Dr. Cruz</SelectItem>
                      <SelectItem value="dr-reyes">Dr. Reyes</SelectItem>
                      <SelectItem value="dr-santos">Dr. Santos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Imputability/Causality</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select causality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="definite">Definite</SelectItem>
                      <SelectItem value="probable">Probable</SelectItem>
                      <SelectItem value="possible">Possible</SelectItem>
                      <SelectItem value="unlikely">Unlikely</SelectItem>
                      <SelectItem value="excluded">Excluded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Investigation Notes</Label>
                <Textarea placeholder="Investigation findings and conclusions..." />
              </div>
            </TabsContent>

            <TabsContent value="followup" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Follow-up Date</Label>
                  <Input type="date" />
                </div>
                <div>
                  <Label>Follow-up Method</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="clinic">Clinic Visit</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Patient Outcome</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select outcome" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recovered">Fully Recovered</SelectItem>
                    <SelectItem value="ongoing">Ongoing Treatment</SelectItem>
                    <SelectItem value="sequelae">Recovered with Sequelae</SelectItem>
                    <SelectItem value="death">Death</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Follow-up Notes</Label>
                <Textarea placeholder="Follow-up findings and patient status..." />
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex gap-2 pt-4">
            <Button className="bg-[#4ea674] hover:bg-[#3d8c5a] text-white" onClick={() => setShowFullCase(false)}>
              <Signature className="w-4 h-4 mr-2" />
              Save & Sign
            </Button>
            <Button variant="outline" onClick={() => setShowFullCase(false)}>
              Save Draft
            </Button>
            <Button variant="outline" onClick={() => setShowFullCase(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
