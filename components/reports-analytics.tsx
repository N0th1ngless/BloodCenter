"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Users,
  Activity,
  Shield,
} from "lucide-react"

// Sample data for charts
const donationTrends = [
  { month: "Jan", walkIn: 120, replacement: 80, mobile: 200 },
  { month: "Feb", walkIn: 140, replacement: 90, mobile: 180 },
  { month: "Mar", walkIn: 160, replacement: 100, mobile: 220 },
  { month: "Apr", walkIn: 130, replacement: 85, mobile: 190 },
  { month: "May", walkIn: 150, replacement: 95, mobile: 210 },
  { month: "Jun", walkIn: 170, replacement: 110, mobile: 240 },
]

const bloodTypeDistribution = [
  { type: "O+", count: 450, color: "#023337" },
  { type: "A+", count: 320, color: "#4ea674" },
  { type: "B+", count: 280, color: "#c0e6b9" },
  { type: "AB+", count: 120, color: "#e9f8e7" },
  { type: "O-", count: 80, color: "#2d5a5e" },
  { type: "A-", count: 60, color: "#6bb085" },
  { type: "B-", count: 50, color: "#d4edc7" },
  { type: "AB-", count: 30, color: "#f0faf0" },
]

const wastageData = [
  { reason: "Expiry", count: 45, percentage: 35 },
  { reason: "Storage Issue", count: 25, percentage: 20 },
  { reason: "Damage", count: 20, percentage: 15 },
  { reason: "Return QA Fail", count: 15, percentage: 12 },
  { reason: "Other", count: 23, percentage: 18 },
]

const haemovigilanceData = [
  { month: "Jan", mild: 2, severe: 0, delayed: 1 },
  { month: "Feb", mild: 3, severe: 1, delayed: 0 },
  { month: "Mar", mild: 1, severe: 0, delayed: 2 },
  { month: "Apr", mild: 4, severe: 0, delayed: 1 },
  { month: "May", mild: 2, severe: 1, delayed: 0 },
  { month: "Jun", mild: 3, severe: 0, delayed: 1 },
]

const facilityPerformance = [
  { facility: "Bicol Medical Center", requests: 145, approved: 138, rejected: 7, fulfillment: 95.2 },
  { facility: "Camarines Sur Provincial Hospital", requests: 89, approved: 82, rejected: 7, fulfillment: 92.1 },
  { facility: "Naga City Hospital", requests: 67, approved: 59, rejected: 8, fulfillment: 88.1 },
  { facility: "Iriga District Hospital", requests: 45, approved: 38, rejected: 7, fulfillment: 84.4 },
  { facility: "Legazpi City Medical Center", requests: 78, approved: 65, rejected: 13, fulfillment: 83.3 },
]

const stakeholderEvents = [
  { event: "BMC Blood Drive", date: "2024-01-15", stakeholder: "Bicol Medical Center", collected: 85, passedQA: 82 },
  { event: "University Blood Drive", date: "2024-01-20", stakeholder: "Ateneo de Naga", collected: 120, passedQA: 115 },
  { event: "Corporate Drive", date: "2024-01-25", stakeholder: "SM City Naga", collected: 95, passedQA: 90 },
  {
    event: "Community Drive",
    date: "2024-02-01",
    stakeholder: "Barangay Concepcion Grande",
    collected: 65,
    passedQA: 62,
  },
  {
    event: "School Drive",
    date: "2024-02-05",
    stakeholder: "University of Nueva Caceres",
    collected: 110,
    passedQA: 105,
  },
]

export function ReportsAnalytics() {
  const [selectedDateRange, setSelectedDateRange] = useState("last-30-days")
  const [exportFormat, setExportFormat] = useState("pdf")
  const [reportType, setReportType] = useState("doh")

  const getFulfillmentColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600 bg-green-50"
    if (percentage >= 75) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  return (
    <div className="p-6 space-y-6 bg-[#e9f8e7] min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#023337]">Reports & Analytics</h1>
          <p className="text-[#4ea674] mt-1">Comprehensive reporting and data visualization</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 Days</SelectItem>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="last-6-months">Last 6 Months</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-[#4ea674] hover:bg-[#023337]">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7 bg-white">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="fulfillment">Fulfillment</TabsTrigger>
          <TabsTrigger value="wastage">Wastage</TabsTrigger>
          <TabsTrigger value="haemovigilance">Haemovigilance</TabsTrigger>
          <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
          <TabsTrigger value="exports">Exports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-[#4ea674]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#023337]">Total Donations</CardTitle>
                <Users className="h-4 w-4 text-[#4ea674]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#023337]">1,247</div>
                <p className="text-xs text-[#4ea674] flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.5% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#4ea674]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#023337]">Requests Fulfilled</CardTitle>
                <CheckCircle className="h-4 w-4 text-[#4ea674]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#023337]">424</div>
                <p className="text-xs text-[#4ea674] flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  91.2% fulfillment rate
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#023337]">Current Wastage</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#023337]">3.2%</div>
                <p className="text-xs text-yellow-600 flex items-center">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  Within WHO threshold (5%)
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#023337]">Haemovigilance</CardTitle>
                <Shield className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#023337]">7</div>
                <p className="text-xs text-blue-600 flex items-center">
                  <Activity className="w-3 h-3 mr-1" />
                  1.6 per 1,000 transfusions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#023337]">Monthly Donation Trends</CardTitle>
                <CardDescription>Breakdown by donation type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={donationTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="walkIn" stackId="a" fill="#023337" name="Walk-in" />
                    <Bar dataKey="replacement" stackId="a" fill="#4ea674" name="Replacement" />
                    <Bar dataKey="mobile" stackId="a" fill="#c0e6b9" name="Mobile Drive" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[#023337]">Blood Type Distribution</CardTitle>
                <CardDescription>Current inventory by blood type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={bloodTypeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, percentage }) => `${type} (${percentage}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {bloodTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="donations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#023337]">Donation Trends Analysis</CardTitle>
              <CardDescription>Detailed breakdown of donation patterns and demographics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="grid grid-cols-3 gap-4 flex-1">
                  <div>
                    <Label htmlFor="donor-type">Donor Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="walk-in">Walk-in</SelectItem>
                        <SelectItem value="replacement">Replacement</SelectItem>
                        <SelectItem value="mobile">Mobile Drive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="venue">Venue</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All Venues" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Venues</SelectItem>
                        <SelectItem value="btsc">BTSC Main</SelectItem>
                        <SelectItem value="mobile">Mobile Units</SelectItem>
                        <SelectItem value="partner">Partner Sites</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="blood-type">Blood Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="o-pos">O+</SelectItem>
                        <SelectItem value="a-pos">A+</SelectItem>
                        <SelectItem value="b-pos">B+</SelectItem>
                        <SelectItem value="ab-pos">AB+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={donationTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="walkIn" stroke="#023337" strokeWidth={2} name="Walk-in" />
                  <Line type="monotone" dataKey="replacement" stroke="#4ea674" strokeWidth={2} name="Replacement" />
                  <Line type="monotone" dataKey="mobile" stroke="#c0e6b9" strokeWidth={2} name="Mobile Drive" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fulfillment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#023337]">Request Fulfillment Analysis</CardTitle>
              <CardDescription>Facility-wise and ward-wise performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Facility/Ward</TableHead>
                    <TableHead>Requests Made</TableHead>
                    <TableHead>Approved</TableHead>
                    <TableHead>Rejected</TableHead>
                    <TableHead>Fulfillment Rate</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {facilityPerformance.map((facility, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{facility.facility}</TableCell>
                      <TableCell>{facility.requests}</TableCell>
                      <TableCell>{facility.approved}</TableCell>
                      <TableCell>{facility.rejected}</TableCell>
                      <TableCell>{facility.fulfillment}%</TableCell>
                      <TableCell>
                        <Badge className={getFulfillmentColor(facility.fulfillment)}>
                          {facility.fulfillment >= 90
                            ? "Excellent"
                            : facility.fulfillment >= 75
                              ? "Good"
                              : "Needs Attention"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wastage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#023337]">Wastage & Expiry Analysis</CardTitle>
              <CardDescription>Breakdown of discarded units and compliance monitoring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#023337] mb-4">Wastage by Reason</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={wastageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="reason" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#4ea674" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#023337] mb-4">Component-wise Breakdown</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={wastageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ reason, percentage }) => `${reason} (${percentage}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {wastageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={bloodTypeDistribution[index]?.color || "#023337"} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                  <h4 className="text-sm font-medium text-yellow-800">WHO/DOH Compliance Status</h4>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Current wastage rate: 3.2% (Within acceptable threshold of 5%)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="haemovigilance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#023337]">Haemovigilance Outcomes</CardTitle>
              <CardDescription>Transfusion reaction monitoring and WHO benchmark comparison</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={haemovigilanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="mild" stroke="#4ea674" strokeWidth={2} name="Mild Reactions" />
                  <Line type="monotone" dataKey="severe" stroke="#ff6b6b" strokeWidth={2} name="Severe Reactions" />
                  <Line type="monotone" dataKey="delayed" stroke="#ffa726" strokeWidth={2} name="Delayed Reactions" />
                </LineChart>
              </ResponsiveContainer>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-blue-600 mr-2" />
                  <h4 className="text-sm font-medium text-blue-800">WHO Benchmark Comparison</h4>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Current rate: 1.6 reactions per 1,000 transfusions (Below WHO threshold of 3.0)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stakeholders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#023337]">Stakeholder Event Reports</CardTitle>
              <CardDescription>Mobile blood drives and partnership performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Stakeholder</TableHead>
                    <TableHead>Units Collected</TableHead>
                    <TableHead>Units Passed QA</TableHead>
                    <TableHead>Success Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stakeholderEvents.map((event, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{event.event}</TableCell>
                      <TableCell>{event.date}</TableCell>
                      <TableCell>{event.stakeholder}</TableCell>
                      <TableCell>{event.collected}</TableCell>
                      <TableCell>{event.passedQA}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          {((event.passedQA / event.collected) * 100).toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#023337]">Export & Regulatory Compliance</CardTitle>
              <CardDescription>Generate official reports with digital signatures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="export-format">Export Format</Label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="report-type">Report Template</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="doh">DOH Monthly Report</SelectItem>
                      <SelectItem value="aabb">AABB Traceability Log</SelectItem>
                      <SelectItem value="who">WHO Haemovigilance Summary</SelectItem>
                      <SelectItem value="custom">Custom Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date-range">Date Range</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current-month">Current Month</SelectItem>
                      <SelectItem value="last-month">Last Month</SelectItem>
                      <SelectItem value="quarter">Current Quarter</SelectItem>
                      <SelectItem value="year">Current Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button className="bg-[#4ea674] hover:bg-[#023337]">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate & Sign Report
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </Button>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-800 mb-2">Compliance Features</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Digital signatures embedded in all official exports</li>
                  <li>• Audit trail logging for every report generation</li>
                  <li>• 10-year data retention for regulatory compliance</li>
                  <li>• Patient identifiers pseudonymized in exported datasets</li>
                  <li>• Automatic WHO benchmark comparisons included</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
