"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Bell,
  AlertTriangle,
  Info,
  Clock,
  CheckCircle,
  X,
  Settings,
  Filter,
  Search,
  Mail,
  Smartphone,
} from "lucide-react"

interface Alert {
  id: string
  type: string
  module: string
  title: string
  description: string
  priority: "Critical" | "Moderate" | "Informational"
  timestamp: string
  status: "Pending" | "Acknowledged" | "Snoozed"
  assignedTo?: string
  acknowledgedBy?: string
  acknowledgedAt?: string
}

interface NotificationSettings {
  lowStockThreshold: number
  expiryWarningDays: number
  emailEnabled: boolean
  smsEnabled: boolean
  inAppEnabled: boolean
  subscriptions: {
    [key: string]: boolean
  }
}

export function NotificationsAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "ALT001",
      type: "Low Stock",
      module: "Inventory",
      title: "Critical Stock Level - O Negative",
      description: "O Negative RBC units below critical threshold (2 units remaining)",
      priority: "Critical",
      timestamp: "2024-01-15 14:30:00",
      status: "Pending",
    },
    {
      id: "ALT002",
      type: "Expiring Units",
      module: "Inventory",
      title: "Units Expiring Soon",
      description: "5 units of A Positive FFP expiring in 2 days",
      priority: "Moderate",
      timestamp: "2024-01-15 13:45:00",
      status: "Pending",
    },
    {
      id: "ALT003",
      type: "Donor Replacement",
      module: "Clearance",
      title: "Pending Donor Replacement",
      description: "Patient MRN-12345 requires 2 replacement donors",
      priority: "Critical",
      timestamp: "2024-01-15 12:15:00",
      status: "Acknowledged",
      acknowledgedBy: "Nurse Coordinator",
      acknowledgedAt: "2024-01-15 12:20:00",
    },
    {
      id: "ALT004",
      type: "Ward Request",
      module: "Blood Requests",
      title: "Request Ready for Pickup",
      description: "Request REQ-2024-001 approved and ready for collection",
      priority: "Informational",
      timestamp: "2024-01-15 11:30:00",
      status: "Pending",
    },
    {
      id: "ALT005",
      type: "Haemovigilance",
      module: "Haemovigilance",
      title: "Adverse Event Reported",
      description: "Mild allergic reaction reported for transfusion TR-2024-045",
      priority: "Critical",
      timestamp: "2024-01-15 10:45:00",
      status: "Pending",
    },
  ])

  const [settings, setSettings] = useState<NotificationSettings>({
    lowStockThreshold: 5,
    expiryWarningDays: 3,
    emailEnabled: true,
    smsEnabled: true,
    inAppEnabled: true,
    subscriptions: {
      "Low Stock": true,
      "Expiring Units": true,
      "Donor Replacement": true,
      "Ward Request": false,
      Haemovigilance: true,
      Equipment: true,
      System: false,
    },
  })

  const [filterModule, setFilterModule] = useState("All")
  const [filterPriority, setFilterPriority] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "Moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Informational":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "Critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "Moderate":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "Informational":
        return <Info className="h-4 w-4 text-blue-600" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Acknowledged":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Snoozed":
        return <Clock className="h-4 w-4 text-orange-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredAlerts = alerts.filter((alert) => {
    const matchesModule = filterModule === "All" || alert.module === filterModule
    const matchesPriority = filterPriority === "All" || alert.priority === filterPriority
    const matchesStatus = filterStatus === "All" || alert.status === filterStatus
    const matchesSearch =
      searchTerm === "" ||
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesModule && matchesPriority && matchesStatus && matchesSearch
  })

  const handleAcknowledge = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: "Acknowledged" as const,
              acknowledgedBy: "Current User",
              acknowledgedAt: new Date().toISOString().slice(0, 19).replace("T", " "),
            }
          : alert,
      ),
    )
  }

  const handleSnooze = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, status: "Snoozed" as const } : alert)))
  }

  const handleDismiss = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
  }

  const criticalAlertsCount = alerts.filter((a) => a.priority === "Critical" && a.status === "Pending").length
  const pendingAlertsCount = alerts.filter((a) => a.status === "Pending").length

  return (
    <div className="p-6 space-y-6 bg-[#e9f8e7] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#023337]">Notifications & Alerts</h1>
          <p className="text-[#4ea674] mt-1">Centralized alert management and monitoring</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            {criticalAlertsCount} Critical
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {pendingAlertsCount} Pending
          </Badge>
          <Button
            onClick={() => setShowSettings(true)}
            variant="outline"
            className="border-[#4ea674] text-[#4ea674] hover:bg-[#c0e6b9]"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white">
          <TabsTrigger value="dashboard">Alert Dashboard</TabsTrigger>
          <TabsTrigger value="history">Alert History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">Critical Alerts</p>
                    <p className="text-2xl font-bold text-red-700">{criticalAlertsCount}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">Moderate Alerts</p>
                    <p className="text-2xl font-bold text-yellow-700">
                      {alerts.filter((a) => a.priority === "Moderate" && a.status === "Pending").length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Informational</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {alerts.filter((a) => a.priority === "Informational" && a.status === "Pending").length}
                    </p>
                  </div>
                  <Info className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Acknowledged</p>
                    <p className="text-2xl font-bold text-green-700">
                      {alerts.filter((a) => a.status === "Acknowledged").length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#023337] flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search alerts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Module</Label>
                  <Select value={filterModule} onValueChange={setFilterModule}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Modules</SelectItem>
                      <SelectItem value="Inventory">Inventory</SelectItem>
                      <SelectItem value="Blood Requests">Blood Requests</SelectItem>
                      <SelectItem value="Clearance">Clearance</SelectItem>
                      <SelectItem value="Haemovigilance">Haemovigilance</SelectItem>
                      <SelectItem value="Serology">Serology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Priorities</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Informational">Informational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Status</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Acknowledged">Acknowledged</SelectItem>
                      <SelectItem value="Snoozed">Snoozed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilterModule("All")
                      setFilterPriority("All")
                      setFilterStatus("All")
                      setSearchTerm("")
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#023337]">Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Priority</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.map((alert) => (
                    <TableRow key={alert.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Badge className={getPriorityColor(alert.priority)}>
                          <div className="flex items-center gap-1">
                            {getPriorityIcon(alert.priority)}
                            {alert.priority}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{alert.type}</TableCell>
                      <TableCell>{alert.module}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{alert.title}</p>
                          <p className="text-sm text-gray-600 truncate max-w-xs">{alert.description}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{alert.timestamp}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          {getStatusIcon(alert.status)}
                          {alert.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setSelectedAlert(alert)}>
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  {getPriorityIcon(alert.priority)}
                                  {alert.title}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Alert ID</Label>
                                    <p className="font-mono text-sm">{alert.id}</p>
                                  </div>
                                  <div>
                                    <Label>Module</Label>
                                    <p>{alert.module}</p>
                                  </div>
                                  <div>
                                    <Label>Type</Label>
                                    <p>{alert.type}</p>
                                  </div>
                                  <div>
                                    <Label>Priority</Label>
                                    <Badge className={getPriorityColor(alert.priority)}>{alert.priority}</Badge>
                                  </div>
                                </div>
                                <div>
                                  <Label>Description</Label>
                                  <p className="mt-1">{alert.description}</p>
                                </div>
                                <div>
                                  <Label>Timestamp</Label>
                                  <p>{alert.timestamp}</p>
                                </div>
                                {alert.acknowledgedBy && (
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Acknowledged By</Label>
                                      <p>{alert.acknowledgedBy}</p>
                                    </div>
                                    <div>
                                      <Label>Acknowledged At</Label>
                                      <p>{alert.acknowledgedAt}</p>
                                    </div>
                                  </div>
                                )}
                                <div className="flex gap-2 pt-4">
                                  {alert.status === "Pending" && (
                                    <>
                                      <Button
                                        onClick={() => handleAcknowledge(alert.id)}
                                        className="bg-[#4ea674] hover:bg-[#023337]"
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Acknowledge
                                      </Button>
                                      <Button variant="outline" onClick={() => handleSnooze(alert.id)}>
                                        <Clock className="h-4 w-4 mr-2" />
                                        Snooze
                                      </Button>
                                    </>
                                  )}
                                  <Button
                                    variant="outline"
                                    onClick={() => handleDismiss(alert.id)}
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Dismiss
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          {alert.status === "Pending" && (
                            <Button
                              size="sm"
                              onClick={() => handleAcknowledge(alert.id)}
                              className="bg-[#4ea674] hover:bg-[#023337]"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#023337]">Alert History & Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Alert history and audit trail will be displayed here</p>
                  <p className="text-sm">Full logging of alert generation, acknowledgment, and resolution</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#023337]">Alert Analytics & Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Alert analytics and trend analysis will be displayed here</p>
                  <p className="text-sm">Response times, alert frequency, and performance metrics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Notification Settings
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <Tabs defaultValue="thresholds" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
                <TabsTrigger value="channels">Delivery Channels</TabsTrigger>
                <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
              </TabsList>

              <TabsContent value="thresholds" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Low Stock Threshold (units)</Label>
                    <Input
                      type="number"
                      value={settings.lowStockThreshold}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          lowStockThreshold: Number.parseInt(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Expiry Warning (days)</Label>
                    <Input
                      type="number"
                      value={settings.expiryWarningDays}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          expiryWarningDays: Number.parseInt(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="channels" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-[#4ea674]" />
                      <Label>In-App Notifications</Label>
                    </div>
                    <Switch
                      checked={settings.inAppEnabled}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({
                          ...prev,
                          inAppEnabled: checked,
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-[#4ea674]" />
                      <Label>Email Notifications</Label>
                    </div>
                    <Switch
                      checked={settings.emailEnabled}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({
                          ...prev,
                          emailEnabled: checked,
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-[#4ea674]" />
                      <Label>SMS Notifications</Label>
                    </div>
                    <Switch
                      checked={settings.smsEnabled}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({
                          ...prev,
                          smsEnabled: checked,
                        }))
                      }
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="subscriptions" className="space-y-4">
                <div className="space-y-4">
                  {Object.entries(settings.subscriptions).map(([alertType, subscribed]) => (
                    <div key={alertType} className="flex items-center justify-between">
                      <Label>{alertType}</Label>
                      <Switch
                        checked={subscribed}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            subscriptions: {
                              ...prev.subscriptions,
                              [alertType]: checked,
                            },
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowSettings(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowSettings(false)} className="bg-[#4ea674] hover:bg-[#023337]">
                Save Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
