"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertTriangle,
  Package,
  Calendar,
  TrendingDown,
  Plus,
  Search,
  Download,
  QrCode,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react"

interface SupplyItem {
  id: string
  itemCode: string
  name: string
  category: string
  lotNumber: string
  expiryDate: string
  quantity: number
  minThreshold: number
  supplier: string
  storageCondition: string
  status: "active" | "expired" | "low-stock" | "recalled"
  lastUsed?: string
  usedBy?: string
}

interface PurchaseRequest {
  id: string
  itemCode: string
  itemName: string
  requestedQuantity: number
  requestedBy: string
  requestDate: string
  status: "pending" | "approved" | "rejected" | "ordered" | "delivered"
  priority: "low" | "medium" | "high" | "critical"
  justification: string
  approvedBy?: string
  supplier?: string
  estimatedCost?: number
}

interface UsageRecord {
  id: string
  itemCode: string
  itemName: string
  lotNumber: string
  quantityUsed: number
  usedBy: string
  usedDate: string
  linkedModule: string
  linkedRecord: string
  purpose: string
}

export function SupplyReagentManagement() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  // Mock data
  const supplyItems: SupplyItem[] = [
    {
      id: "1",
      itemCode: "BB-450-001",
      name: "Blood Bag 450ml CPDA-1",
      category: "Blood Bags",
      lotNumber: "BB240815001",
      expiryDate: "2025-08-15",
      quantity: 150,
      minThreshold: 50,
      supplier: "Terumo BCT",
      storageCondition: "Room Temperature",
      status: "active",
      lastUsed: "2024-12-18",
      usedBy: "Maria Santos",
    },
    {
      id: "2",
      itemCode: "RG-HBV-001",
      name: "HBsAg Screening Kit",
      category: "Reagents",
      lotNumber: "HBV241201",
      expiryDate: "2025-01-15",
      quantity: 8,
      minThreshold: 10,
      supplier: "Abbott Diagnostics",
      storageCondition: "2-8°C",
      status: "low-stock",
      lastUsed: "2024-12-17",
      usedBy: "Dr. Rodriguez",
    },
    {
      id: "3",
      itemCode: "PPE-GLV-001",
      name: "Nitrile Gloves Size M",
      category: "PPE",
      lotNumber: "GLV241120",
      expiryDate: "2024-12-20",
      quantity: 25,
      minThreshold: 100,
      supplier: "Ansell Healthcare",
      storageCondition: "Room Temperature",
      status: "expired",
      lastUsed: "2024-12-16",
      usedBy: "Ana Cruz",
    },
  ]

  const purchaseRequests: PurchaseRequest[] = [
    {
      id: "PR-001",
      itemCode: "RG-HBV-001",
      itemName: "HBsAg Screening Kit",
      requestedQuantity: 20,
      requestedBy: "Dr. Rodriguez",
      requestDate: "2024-12-18",
      status: "pending",
      priority: "high",
      justification: "Current stock below minimum threshold, critical for serology testing",
      estimatedCost: 15000,
    },
    {
      id: "PR-002",
      itemCode: "BB-450-001",
      itemName: "Blood Bag 450ml CPDA-1",
      requestedQuantity: 100,
      requestedBy: "Maria Santos",
      requestDate: "2024-12-17",
      status: "approved",
      priority: "medium",
      justification: "Routine stock replenishment for upcoming mobile drives",
      approvedBy: "Admin Manager",
      supplier: "Terumo BCT",
      estimatedCost: 25000,
    },
  ]

  const usageRecords: UsageRecord[] = [
    {
      id: "UR-001",
      itemCode: "RG-HBV-001",
      itemName: "HBsAg Screening Kit",
      lotNumber: "HBV241201",
      quantityUsed: 1,
      usedBy: "Dr. Rodriguez",
      usedDate: "2024-12-17 14:30",
      linkedModule: "Serology Testing",
      linkedRecord: "ST-20241217-001",
      purpose: "Hepatitis B screening for donor D241217001",
    },
    {
      id: "UR-002",
      itemCode: "BB-450-001",
      itemName: "Blood Bag 450ml CPDA-1",
      lotNumber: "BB240815001",
      quantityUsed: 1,
      usedBy: "Maria Santos",
      usedDate: "2024-12-18 09:15",
      linkedModule: "Bleeding Area",
      linkedRecord: "BA-20241218-001",
      purpose: "Blood collection for donor D241218001",
    },
  ]

  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24))

    if (daysUntilExpiry < 0) return { status: "expired", color: "bg-red-500", days: Math.abs(daysUntilExpiry) }
    if (daysUntilExpiry <= 30) return { status: "critical", color: "bg-red-500", days: daysUntilExpiry }
    if (daysUntilExpiry <= 60) return { status: "warning", color: "bg-yellow-500", days: daysUntilExpiry }
    return { status: "good", color: "bg-green-500", days: daysUntilExpiry }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "expired":
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>
      case "low-stock":
        return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>
      case "recalled":
        return <Badge className="bg-red-100 text-red-800">Recalled</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>
      case "high":
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{priority}</Badge>
    }
  }

  const getRequestStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case "ordered":
        return <Badge className="bg-blue-100 text-blue-800">Ordered</Badge>
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  const filteredItems = supplyItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lotNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || item.category === filterCategory
    const matchesStatus = filterStatus === "all" || item.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalItems = supplyItems.length
  const expiredItems = supplyItems.filter((item) => item.status === "expired").length
  const lowStockItems = supplyItems.filter((item) => item.status === "low-stock").length
  const expiringItems = supplyItems.filter((item) => {
    const expiry = getExpiryStatus(item.expiryDate)
    return expiry.status === "critical" || expiry.status === "warning"
  }).length

  return (
    <div className="p-6 space-y-6 bg-[#e9f8e7] min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#023337]">Supply & Reagent Management</h1>
          <p className="text-[#4ea674] mt-2">Manage laboratory supplies, reagents, and consumables</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#4ea674] hover:bg-[#023337] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Supply Item</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <Label htmlFor="itemCode">Item Code</Label>
                  <Input id="itemCode" placeholder="e.g., BB-450-001" />
                </div>
                <div>
                  <Label htmlFor="itemName">Item Name</Label>
                  <Input id="itemName" placeholder="e.g., Blood Bag 450ml" />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blood-bags">Blood Bags</SelectItem>
                      <SelectItem value="reagents">Reagents</SelectItem>
                      <SelectItem value="ppe">PPE</SelectItem>
                      <SelectItem value="consumables">Lab Consumables</SelectItem>
                      <SelectItem value="cold-chain">Cold Chain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="lotNumber">Lot/Batch Number</Label>
                  <Input id="lotNumber" placeholder="e.g., BB240815001" />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="minThreshold">Minimum Threshold</Label>
                  <Input id="minThreshold" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input id="expiryDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input id="supplier" placeholder="e.g., Terumo BCT" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="storageCondition">Storage Condition</Label>
                  <Input id="storageCondition" placeholder="e.g., Room Temperature, 2-8°C" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-[#4ea674] hover:bg-[#023337] text-white">Add Item</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="border-[#4ea674] text-[#4ea674] hover:bg-[#c0e6b9] bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="inventory" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Inventory
          </TabsTrigger>
          <TabsTrigger value="requests" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Purchase Requests
          </TabsTrigger>
          <TabsTrigger value="audit" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Usage Audit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white border-l-4 border-l-[#4ea674]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#023337]">Total Items</CardTitle>
                <Package className="h-4 w-4 text-[#4ea674]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#023337]">{totalItems}</div>
                <p className="text-xs text-[#4ea674]">Active inventory items</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-l-4 border-l-red-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#023337]">Expired Items</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{expiredItems}</div>
                <p className="text-xs text-red-500">Require immediate attention</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-l-4 border-l-yellow-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#023337]">Low Stock</CardTitle>
                <TrendingDown className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{lowStockItems}</div>
                <p className="text-xs text-yellow-500">Below minimum threshold</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#023337]">Expiring Soon</CardTitle>
                <Calendar className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{expiringItems}</div>
                <p className="text-xs text-orange-500">Within 60 days</p>
              </CardContent>
            </Card>
          </div>

          {/* Alerts Panel */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-[#023337] flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Critical Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {supplyItems
                  .filter((item) => item.status === "expired" || item.status === "low-stock")
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
                    >
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <div>
                          <p className="font-medium text-[#023337]">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            {item.status === "expired" ? "Expired" : "Low Stock"} - Lot: {item.lotNumber}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(item.status)}
                        <Button size="sm" className="bg-[#4ea674] hover:bg-[#023337] text-white">
                          Action Required
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-[#023337]">Supply Category Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {["Blood Bags", "Reagents", "PPE", "Lab Consumables", "Cold Chain"].map((category) => {
                  const count = supplyItems.filter((item) => item.category === category).length
                  return (
                    <div key={category} className="text-center p-4 bg-[#c0e6b9] rounded-lg">
                      <div className="text-2xl font-bold text-[#023337]">{count}</div>
                      <div className="text-sm text-[#4ea674]">{category}</div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          {/* Search and Filters */}
          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by name, code, or lot number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Blood Bags">Blood Bags</SelectItem>
                    <SelectItem value="Reagents">Reagents</SelectItem>
                    <SelectItem value="PPE">PPE</SelectItem>
                    <SelectItem value="Lab Consumables">Lab Consumables</SelectItem>
                    <SelectItem value="Cold Chain">Cold Chain</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="low-stock">Low Stock</SelectItem>
                    <SelectItem value="recalled">Recalled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Table */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-[#023337]">Inventory Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Lot Number</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const expiryStatus = getExpiryStatus(item.expiryDate)
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.itemCode}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.lotNumber}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={item.quantity <= item.minThreshold ? "text-red-600 font-bold" : ""}>
                              {item.quantity}
                            </span>
                            {item.quantity <= item.minThreshold && <AlertTriangle className="w-4 h-4 text-red-500" />}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${expiryStatus.color}`}></div>
                            <span className={expiryStatus.status === "expired" ? "text-red-600 font-bold" : ""}>
                              {item.expiryDate}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <QrCode className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 bg-transparent">
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          {/* Purchase Requests */}
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[#023337]">Purchase Requests</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-[#4ea674] hover:bg-[#023337] text-white">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    New Request
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Purchase Request</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div>
                      <Label htmlFor="requestItem">Item</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select item" />
                        </SelectTrigger>
                        <SelectContent>
                          {supplyItems.map((item) => (
                            <SelectItem key={item.id} value={item.itemCode}>
                              {item.name} ({item.itemCode})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="requestQuantity">Quantity</Label>
                      <Input id="requestQuantity" type="number" placeholder="0" />
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="estimatedCost">Estimated Cost (₱)</Label>
                      <Input id="estimatedCost" type="number" placeholder="0.00" />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="justification">Justification</Label>
                      <Textarea id="justification" placeholder="Explain why this purchase is needed..." />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button className="bg-[#4ea674] hover:bg-[#023337] text-white">Submit Request</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>{request.itemName}</TableCell>
                      <TableCell>{request.requestedQuantity}</TableCell>
                      <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                      <TableCell>{request.requestedBy}</TableCell>
                      <TableCell>{request.requestDate}</TableCell>
                      <TableCell>{getRequestStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                          {request.status === "pending" && (
                            <>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600 bg-transparent">
                                <X className="w-4 h-4" />
                              </Button>
                            </>
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

        <TabsContent value="audit" className="space-y-6">
          {/* Usage Records */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-[#023337]">Usage Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date/Time</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Lot Number</TableHead>
                    <TableHead>Quantity Used</TableHead>
                    <TableHead>Used By</TableHead>
                    <TableHead>Linked Module</TableHead>
                    <TableHead>Purpose</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usageRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.usedDate}</TableCell>
                      <TableCell>{record.itemName}</TableCell>
                      <TableCell>{record.lotNumber}</TableCell>
                      <TableCell>{record.quantityUsed}</TableCell>
                      <TableCell>{record.usedBy}</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800">{record.linkedModule}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{record.purpose}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
