"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Settings,
  FileText,
  ShoppingCart,
  Users,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Plus,
  Send,
  Shield,
  Database,
  Calendar,
  BarChart3,
  Building,
  Key,
  Save,
  RefreshCw,
} from "lucide-react"

export function AdministrativeUI() {
  const [selectedTab, setSelectedTab] = useState("dashboard")
  const [memoContent, setMemoContent] = useState("")
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])

  // Mock data
  const globalStats = {
    totalDonations: 2847,
    totalTransfusions: 2156,
    wastagePercentage: 3.2,
    activeBSFs: 12,
    pendingPurchaseRequests: 8,
  }

  const purchaseRequests = [
    {
      id: "PR-2024-001",
      item: "Anti-A Reagent",
      quantity: 50,
      cost: 25000,
      supplier: "Bio-Rad Laboratories",
      requestedBy: "Lab Supervisor",
      status: "Pending",
      date: "2024-01-15",
    },
    {
      id: "PR-2024-002",
      item: "Blood Collection Bags",
      quantity: 200,
      cost: 45000,
      supplier: "Terumo BCT",
      requestedBy: "Collection Manager",
      status: "Approved",
      date: "2024-01-14",
    },
  ]

  const memos = [
    {
      id: "MEMO-2024-001",
      title: "Updated Blood Collection Protocols",
      content: "New DOH guidelines for blood collection procedures...",
      author: "Medical Director",
      date: "2024-01-15",
      recipients: 45,
      acknowledged: 38,
      status: "Active",
    },
  ]

  const organizationSettings = {
    name: "Bicol Transfusion Science Centre",
    address: "123 Medical Center Drive, Legazpi City, Albay",
    dohLicense: "DOH-BTSC-2024-001",
    aabbAccreditation: "AABB-PH-001",
    whoAccreditation: "WHO-BSF-PH-001",
  }

  const roles = [
    { name: "Administrator", users: 2, permissions: ["All Modules"] },
    { name: "Medical Officer", users: 3, permissions: ["Donor Screening", "Haemovigilance", "Clearance"] },
    { name: "Lab Technician", users: 8, permissions: ["Serology", "Blood Processing", "Inventory"] },
    { name: "Nurse", users: 12, permissions: ["Bleeding Area", "MBD", "Ward Stations"] },
    { name: "Encoder", users: 5, permissions: ["Data Entry", "Reports"] },
  ]

  return (
    <div className="p-6 space-y-6 bg-[#e9f8e7] min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#023337]">Administrative Management</h1>
          <p className="text-[#4ea674] mt-1">Central oversight and system configuration</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-[#4ea674] text-[#4ea674] hover:bg-[#c0e6b9] bg-transparent">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-white border border-[#c0e6b9]">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="memos" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            <FileText className="w-4 h-4 mr-2" />
            Memos
          </TabsTrigger>
          <TabsTrigger value="purchases" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Purchases
          </TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            <Settings className="w-4 h-4 mr-2" />
            System
          </TabsTrigger>
          <TabsTrigger value="exports" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            <Download className="w-4 h-4 mr-2" />
            Exports
          </TabsTrigger>
          <TabsTrigger value="audit" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            <Shield className="w-4 h-4 mr-2" />
            Audit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Global KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className="border-[#c0e6b9]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[#023337]">Total Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#4ea674]">{globalStats.totalDonations.toLocaleString()}</div>
                <p className="text-xs text-gray-600 mt-1">This year</p>
              </CardContent>
            </Card>
            <Card className="border-[#c0e6b9]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[#023337]">Total Transfusions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#4ea674]">
                  {globalStats.totalTransfusions.toLocaleString()}
                </div>
                <p className="text-xs text-gray-600 mt-1">This year</p>
              </CardContent>
            </Card>
            <Card className="border-[#c0e6b9]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[#023337]">Wastage Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{globalStats.wastagePercentage}%</div>
                <p className="text-xs text-gray-600 mt-1">Within WHO limits</p>
              </CardContent>
            </Card>
            <Card className="border-[#c0e6b9]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[#023337]">Active BSFs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#4ea674]">{globalStats.activeBSFs}</div>
                <p className="text-xs text-gray-600 mt-1">Connected facilities</p>
              </CardContent>
            </Card>
            <Card className="border-[#c0e6b9]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[#023337]">Pending Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{globalStats.pendingPurchaseRequests}</div>
                <p className="text-xs text-gray-600 mt-1">Purchase requests</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337]">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  onClick={() => setSelectedTab("memos")}
                  className="bg-[#4ea674] hover:bg-[#023337] text-white h-20 flex-col"
                >
                  <FileText className="w-6 h-6 mb-2" />
                  Create Memo
                </Button>
                <Button
                  onClick={() => setSelectedTab("purchases")}
                  className="bg-[#4ea674] hover:bg-[#023337] text-white h-20 flex-col"
                >
                  <ShoppingCart className="w-6 h-6 mb-2" />
                  Review Purchases
                </Button>
                <Button
                  onClick={() => setSelectedTab("system")}
                  className="bg-[#4ea674] hover:bg-[#023337] text-white h-20 flex-col"
                >
                  <Users className="w-6 h-6 mb-2" />
                  Manage Users
                </Button>
                <Button
                  onClick={() => setSelectedTab("exports")}
                  className="bg-[#4ea674] hover:bg-[#023337] text-white h-20 flex-col"
                >
                  <Download className="w-6 h-6 mb-2" />
                  Generate Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="memos" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Memo */}
            <Card className="border-[#c0e6b9]">
              <CardHeader>
                <CardTitle className="text-[#023337]">Create New Memo</CardTitle>
                <CardDescription>Draft and distribute official announcements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="memo-title">Memo Title</Label>
                  <Input id="memo-title" placeholder="Enter memo title" className="border-[#c0e6b9]" />
                </div>
                <div>
                  <Label htmlFor="memo-content">Content</Label>
                  <Textarea
                    id="memo-content"
                    placeholder="Enter memo content..."
                    value={memoContent}
                    onChange={(e) => setMemoContent(e.target.value)}
                    className="min-h-32 border-[#c0e6b9]"
                  />
                </div>
                <div>
                  <Label>Recipients</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {["All Staff", "Medical Officers", "Lab Technicians", "Nurses", "Administrators"].map((role) => (
                      <div key={role} className="flex items-center space-x-2">
                        <Checkbox
                          id={role}
                          checked={selectedRecipients.includes(role)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedRecipients([...selectedRecipients, role])
                            } else {
                              setSelectedRecipients(selectedRecipients.filter((r) => r !== role))
                            }
                          }}
                        />
                        <Label htmlFor={role} className="text-sm">
                          {role}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="bg-[#4ea674] hover:bg-[#023337] text-white">
                    <Send className="w-4 h-4 mr-2" />
                    Send Memo
                  </Button>
                  <Button variant="outline" className="border-[#4ea674] text-[#4ea674] bg-transparent">
                    Save Draft
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Memo History */}
            <Card className="border-[#c0e6b9]">
              <CardHeader>
                <CardTitle className="text-[#023337]">Recent Memos</CardTitle>
                <CardDescription>Track memo acknowledgments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {memos.map((memo) => (
                    <div key={memo.id} className="border border-[#c0e6b9] rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-[#023337]">{memo.title}</h4>
                        <Badge variant="outline" className="border-[#4ea674] text-[#4ea674]">
                          {memo.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{memo.content}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>
                          By {memo.author} • {memo.date}
                        </span>
                        <span>
                          {memo.acknowledged}/{memo.recipients} acknowledged
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#4ea674] h-2 rounded-full"
                            style={{ width: `${(memo.acknowledged / memo.recipients) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="purchases" className="space-y-6">
          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337]">Purchase Request Review</CardTitle>
              <CardDescription>Approve or reject purchase requisitions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Cost (₱)</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>{request.item}</TableCell>
                      <TableCell>{request.quantity}</TableCell>
                      <TableCell>{request.cost.toLocaleString()}</TableCell>
                      <TableCell>{request.supplier}</TableCell>
                      <TableCell>{request.requestedBy}</TableCell>
                      <TableCell>
                        <Badge
                          variant={request.status === "Approved" ? "default" : "secondary"}
                          className={request.status === "Approved" ? "bg-[#4ea674]" : ""}
                        >
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {request.status === "Pending" && (
                            <>
                              <Button size="sm" className="bg-[#4ea674] hover:bg-[#023337] text-white">
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500 text-red-500 bg-transparent"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Organization Settings */}
            <Card className="border-[#c0e6b9]">
              <CardHeader>
                <CardTitle className="text-[#023337]">Organization Profile</CardTitle>
                <CardDescription>Update facility information and accreditations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input id="org-name" value={organizationSettings.name} className="border-[#c0e6b9]" />
                </div>
                <div>
                  <Label htmlFor="org-address">Address</Label>
                  <Textarea id="org-address" value={organizationSettings.address} className="border-[#c0e6b9]" />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="doh-license">DOH License Number</Label>
                    <Input id="doh-license" value={organizationSettings.dohLicense} className="border-[#c0e6b9]" />
                  </div>
                  <div>
                    <Label htmlFor="aabb-accred">AABB Accreditation</Label>
                    <Input
                      id="aabb-accred"
                      value={organizationSettings.aabbAccreditation}
                      className="border-[#c0e6b9]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="who-accred">WHO Accreditation</Label>
                    <Input id="who-accred" value={organizationSettings.whoAccreditation} className="border-[#c0e6b9]" />
                  </div>
                </div>
                <div>
                  <Label>Organization Logo</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#c0e6b9] rounded-lg flex items-center justify-center">
                      <Building className="w-8 h-8 text-[#4ea674]" />
                    </div>
                    <Button variant="outline" className="border-[#4ea674] text-[#4ea674] bg-transparent">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Logo
                    </Button>
                  </div>
                </div>
                <Button className="bg-[#4ea674] hover:bg-[#023337] text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            {/* Role Management */}
            <Card className="border-[#c0e6b9]">
              <CardHeader>
                <CardTitle className="text-[#023337]">Role & Access Management</CardTitle>
                <CardDescription>Configure user roles and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roles.map((role) => (
                    <div key={role.name} className="border border-[#c0e6b9] rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h4 className="font-medium text-[#023337]">{role.name}</h4>
                          <p className="text-sm text-gray-600">{role.users} users assigned</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#4ea674] text-[#4ea674] bg-transparent"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#4ea674] text-[#4ea674] bg-transparent"
                          >
                            <Key className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.map((permission) => (
                          <Badge key={permission} variant="outline" className="border-[#4ea674] text-[#4ea674] text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-[#4ea674] hover:bg-[#023337] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Role
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* System Configuration */}
          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337]">System Configuration</CardTitle>
              <CardDescription>Backup, security, and system settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-[#023337]">Backup & Archive</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-backup">Auto Backup</Label>
                      <Switch id="auto-backup" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="backup-freq">Frequency</Label>
                      <Select defaultValue="daily">
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-[#4ea674] text-[#4ea674] bg-transparent">
                    <Database className="w-4 h-4 mr-2" />
                    Backup Now
                  </Button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-[#023337]">Security Settings</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="2fa">Two-Factor Auth</Label>
                      <Switch id="2fa" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="session-timeout">Session Timeout</Label>
                      <Select defaultValue="30">
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15m</SelectItem>
                          <SelectItem value="30">30m</SelectItem>
                          <SelectItem value="60">1h</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-[#023337]">System Maintenance</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full border-[#4ea674] text-[#4ea674] bg-transparent">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Clear Cache
                    </Button>
                    <Button variant="outline" className="w-full border-[#4ea674] text-[#4ea674] bg-transparent">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Maintenance
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Regulatory Reports */}
            <Card className="border-[#c0e6b9]">
              <CardHeader>
                <CardTitle className="text-[#023337]">Regulatory Reports</CardTitle>
                <CardDescription>Generate compliance reports for DOH, AABB, WHO</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Report Type</Label>
                  <Select>
                    <SelectTrigger className="border-[#c0e6b9]">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="doh-monthly">DOH Monthly BSF Report</SelectItem>
                      <SelectItem value="aabb-annual">AABB Annual Report</SelectItem>
                      <SelectItem value="who-haemovigilance">WHO Haemovigilance Report</SelectItem>
                      <SelectItem value="donation-summary">Donation Summary Report</SelectItem>
                      <SelectItem value="wastage-analysis">Wastage Analysis Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input type="date" id="start-date" className="border-[#c0e6b9]" />
                  </div>
                  <div>
                    <Label htmlFor="end-date">End Date</Label>
                    <Input type="date" id="end-date" className="border-[#c0e6b9]" />
                  </div>
                </div>
                <div>
                  <Label>Export Format</Label>
                  <div className="flex gap-2 mt-2">
                    {["PDF", "Excel", "CSV"].map((format) => (
                      <Button key={format} variant="outline" className="border-[#4ea674] text-[#4ea674] bg-transparent">
                        {format}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button className="w-full bg-[#4ea674] hover:bg-[#023337] text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            {/* Data Exports */}
            <Card className="border-[#c0e6b9]">
              <CardHeader>
                <CardTitle className="text-[#023337]">Data Exports</CardTitle>
                <CardDescription>Export raw or aggregated datasets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Dataset</Label>
                  <Select>
                    <SelectTrigger className="border-[#c0e6b9]">
                      <SelectValue placeholder="Select dataset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="donors">Donor Database</SelectItem>
                      <SelectItem value="inventory">Inventory Records</SelectItem>
                      <SelectItem value="transfusions">Transfusion Records</SelectItem>
                      <SelectItem value="haemovigilance">Haemovigilance Cases</SelectItem>
                      <SelectItem value="audit-logs">Audit Logs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Filters</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-personal" />
                      <Label htmlFor="include-personal" className="text-sm">
                        Include Personal Data
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="anonymize" defaultChecked />
                      <Label htmlFor="anonymize" className="text-sm">
                        Anonymize Data
                      </Label>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="export-start">Start Date</Label>
                    <Input type="date" id="export-start" className="border-[#c0e6b9]" />
                  </div>
                  <div>
                    <Label htmlFor="export-end">End Date</Label>
                    <Input type="date" id="export-end" className="border-[#c0e6b9]" />
                  </div>
                </div>
                <Button className="w-full bg-[#4ea674] hover:bg-[#023337] text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Scheduled Reports */}
          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337]">Scheduled Reports</CardTitle>
              <CardDescription>Automated report generation and distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Next Run</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Monthly DOH Report</TableCell>
                    <TableCell>Regulatory</TableCell>
                    <TableCell>Monthly</TableCell>
                    <TableCell>DOH Regional Office</TableCell>
                    <TableCell>2024-02-01</TableCell>
                    <TableCell>
                      <Badge className="bg-[#4ea674]">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-[#4ea674] text-[#4ea674] bg-transparent">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-[#4ea674] text-[#4ea674] bg-transparent">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337]">Audit Trail</CardTitle>
              <CardDescription>System activity and administrative action logs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Select>
                    <SelectTrigger className="w-48 border-[#c0e6b9]">
                      <SelectValue placeholder="Filter by action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="login">User Login</SelectItem>
                      <SelectItem value="approval">Purchase Approval</SelectItem>
                      <SelectItem value="config">System Configuration</SelectItem>
                      <SelectItem value="export">Data Export</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-48 border-[#c0e6b9]">
                      <SelectValue placeholder="Filter by user" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="medical">Medical Officer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="date" className="border-[#c0e6b9]" />
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>2024-01-15 14:30:25</TableCell>
                      <TableCell>Dr. Maria Santos</TableCell>
                      <TableCell>Purchase Approval</TableCell>
                      <TableCell>Supply Management</TableCell>
                      <TableCell>Approved PR-2024-002 (Blood Bags)</TableCell>
                      <TableCell>192.168.1.100</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2024-01-15 13:45:12</TableCell>
                      <TableCell>Admin User</TableCell>
                      <TableCell>System Configuration</TableCell>
                      <TableCell>Administrative</TableCell>
                      <TableCell>Updated organization profile</TableCell>
                      <TableCell>192.168.1.50</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2024-01-15 12:20:08</TableCell>
                      <TableCell>Lab Supervisor</TableCell>
                      <TableCell>Data Export</TableCell>
                      <TableCell>Reports</TableCell>
                      <TableCell>Exported monthly inventory report</TableCell>
                      <TableCell>192.168.1.75</TableCell>
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
