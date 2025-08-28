"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, AlertTriangle, Clock, Plus, ArrowRightLeft, QrCode, Download, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface BloodUnit {
  id: string
  bloodType: string
  component: string
  donationDate: string
  expiryDate: string
  status: "available" | "reserved" | "expired" | "used"
  donorId: string
  location: string
  volume: number
}

const bloodComponents = ["Whole Blood", "RBCs", "Platelets", "FFP", "Cryo", "SDP"]
const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

const mockInventory: BloodUnit[] = [
  {
    id: "BU001",
    bloodType: "A+",
    component: "RBCs",
    donationDate: "2024-01-15",
    expiryDate: "2024-02-15",
    status: "available",
    donorId: "D001",
    location: "Fridge-A1",
    volume: 450,
  },
  {
    id: "BU002",
    bloodType: "O+",
    component: "Whole Blood",
    donationDate: "2024-01-10",
    expiryDate: "2024-02-10",
    status: "available",
    donorId: "D002",
    location: "Fridge-B2",
    volume: 500,
  },
  {
    id: "BU003",
    bloodType: "B+",
    component: "Platelets",
    donationDate: "2024-01-18",
    expiryDate: "2024-01-23",
    status: "reserved",
    donorId: "D003",
    location: "Fridge-C1",
    volume: 300,
  },
]

export function InventoryManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedComponent, setSelectedComponent] = useState("all")
  const [selectedBloodType, setSelectedBloodType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-[#4ea674] text-white"
      case "reserved":
        return "bg-yellow-500 text-white"
      case "expired":
        return "bg-red-500 text-white"
      case "used":
        return "bg-gray-500 text-white"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  const getStockLevel = (count: number) => {
    if (count < 10) return { level: "low", color: "bg-red-500" }
    if (count < 20) return { level: "approaching", color: "bg-yellow-500" }
    return { level: "adequate", color: "bg-[#4ea674]" }
  }

  const stockSummary = bloodTypes.map((type) => {
    const count = mockInventory.filter((unit) => unit.bloodType === type && unit.status === "available").length
    const { level, color } = getStockLevel(count)
    return { type, count, level, color }
  })

  const filteredInventory = mockInventory.filter((unit) => {
    const matchesSearch =
      unit.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.bloodType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.component.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesComponent = selectedComponent === "all" || unit.component === selectedComponent
    const matchesBloodType = selectedBloodType === "all" || unit.bloodType === selectedBloodType
    const matchesStatus = selectedStatus === "all" || unit.status === selectedStatus

    return matchesSearch && matchesComponent && matchesBloodType && matchesStatus
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#023337]">Blood Inventory Management</h1>
          <p className="text-[#023337]/70">Track and manage blood units, components, and stock levels</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="bg-[#4ea674] hover:bg-[#4ea674]/80 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Unit
          </Button>
          <Button variant="outline" className="border-[#4ea674] text-[#4ea674] bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stock Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {stockSummary.map((stock) => (
          <Card key={stock.type} className="border-[#c0e6b9] hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#023337] text-center">{stock.type}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-[#023337]">{stock.count}</div>
              <div className="flex items-center justify-center space-x-1 mt-2">
                <div className={`w-2 h-2 rounded-full ${stock.color}`}></div>
                <span className="text-xs text-[#023337]/60 capitalize">{stock.level}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList className="bg-[#e9f8e7] text-[#023337]">
          <TabsTrigger value="inventory" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Current Inventory
          </TabsTrigger>
          <TabsTrigger value="expiring" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Expiring Units
          </TabsTrigger>
          <TabsTrigger value="traceability" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Unit Traceability
          </TabsTrigger>
          <TabsTrigger value="movements" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Stock Movements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          {/* Filters */}
          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337] flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#023337]/50" />
                  <Input
                    placeholder="Search units..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-[#c0e6b9] focus:border-[#4ea674]"
                  />
                </div>
                <Select value={selectedComponent} onValueChange={setSelectedComponent}>
                  <SelectTrigger className="border-[#c0e6b9] focus:border-[#4ea674]">
                    <SelectValue placeholder="Component" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Components</SelectItem>
                    {bloodComponents.map((component) => (
                      <SelectItem key={component} value={component}>
                        {component}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
                  <SelectTrigger className="border-[#c0e6b9] focus:border-[#4ea674]">
                    <SelectValue placeholder="Blood Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Blood Types</SelectItem>
                    {bloodTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="border-[#c0e6b9] focus:border-[#4ea674]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="used">Used</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Table */}
          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337]">Blood Units ({filteredInventory.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[#023337]">Unit ID</TableHead>
                    <TableHead className="text-[#023337]">Blood Type</TableHead>
                    <TableHead className="text-[#023337]">Component</TableHead>
                    <TableHead className="text-[#023337]">Volume (ml)</TableHead>
                    <TableHead className="text-[#023337]">Donation Date</TableHead>
                    <TableHead className="text-[#023337]">Expiry Date</TableHead>
                    <TableHead className="text-[#023337]">Location</TableHead>
                    <TableHead className="text-[#023337]">Status</TableHead>
                    <TableHead className="text-[#023337]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((unit) => (
                    <TableRow key={unit.id}>
                      <TableCell className="font-medium text-[#023337]">{unit.id}</TableCell>
                      <TableCell className="text-[#023337]">{unit.bloodType}</TableCell>
                      <TableCell className="text-[#023337]">{unit.component}</TableCell>
                      <TableCell className="text-[#023337]">{unit.volume}</TableCell>
                      <TableCell className="text-[#023337]">{unit.donationDate}</TableCell>
                      <TableCell className="text-[#023337]">{unit.expiryDate}</TableCell>
                      <TableCell className="text-[#023337]">{unit.location}</TableCell>
                      <TableCell>
                        <Badge className={cn("capitalize", getStatusColor(unit.status))}>{unit.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#4ea674] text-[#4ea674] bg-transparent"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#4ea674] text-[#4ea674] bg-transparent"
                          >
                            <QrCode className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#4ea674] text-[#4ea674] bg-transparent"
                          >
                            <ArrowRightLeft className="h-3 w-3" />
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

        <TabsContent value="expiring" className="space-y-4">
          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337] flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
                Units Expiring Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockInventory
                  .filter((unit) => {
                    const expiryDate = new Date(unit.expiryDate)
                    const today = new Date()
                    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                    return daysUntilExpiry <= 7 && daysUntilExpiry > 0
                  })
                  .map((unit) => {
                    const expiryDate = new Date(unit.expiryDate)
                    const today = new Date()
                    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

                    return (
                      <div key={unit.id} className="flex items-center justify-between p-4 bg-[#e9f8e7] rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium text-[#023337]">{unit.id}</span>
                          </div>
                          <Badge variant="outline" className="border-[#4ea674] text-[#4ea674]">
                            {unit.bloodType}
                          </Badge>
                          <span className="text-[#023337]">{unit.component}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-[#023337]/70">
                            Expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? "s" : ""}
                          </span>
                          <Button size="sm" className="bg-[#4ea674] hover:bg-[#4ea674]/80 text-white">
                            Priority Use
                          </Button>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traceability" className="space-y-4">
          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337]">Unit Traceability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Input
                    placeholder="Enter Unit ID or Donor ID..."
                    className="flex-1 border-[#c0e6b9] focus:border-[#4ea674]"
                  />
                  <Button className="bg-[#4ea674] hover:bg-[#4ea674]/80 text-white">
                    <Search className="h-4 w-4 mr-2" />
                    Trace
                  </Button>
                </div>

                {/* Sample traceability chain */}
                <div className="bg-[#e9f8e7] p-4 rounded-lg">
                  <h4 className="font-medium text-[#023337] mb-3">Traceability Chain for Unit BU001</h4>
                  <div className="space-y-3">
                    {[
                      { step: "Donation", date: "2024-01-15 09:30", location: "Mobile Unit A", status: "completed" },
                      { step: "Processing", date: "2024-01-15 14:20", location: "Lab Station 2", status: "completed" },
                      {
                        step: "Serology Testing",
                        date: "2024-01-16 08:15",
                        location: "Serology Lab",
                        status: "completed",
                      },
                      {
                        step: "Inventory Storage",
                        date: "2024-01-16 16:45",
                        location: "Fridge-A1",
                        status: "completed",
                      },
                      { step: "Distribution", date: "Pending", location: "N/A", status: "pending" },
                    ].map((step, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div
                          className={`w-3 h-3 rounded-full ${step.status === "completed" ? "bg-[#4ea674]" : "bg-gray-300"}`}
                        ></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-[#023337]">{step.step}</span>
                            <span className="text-sm text-[#023337]/70">{step.date}</span>
                          </div>
                          <span className="text-sm text-[#023337]/60">{step.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337]">Recent Stock Movements</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[#023337]">Date/Time</TableHead>
                    <TableHead className="text-[#023337]">Unit ID</TableHead>
                    <TableHead className="text-[#023337]">Movement Type</TableHead>
                    <TableHead className="text-[#023337]">From</TableHead>
                    <TableHead className="text-[#023337]">To</TableHead>
                    <TableHead className="text-[#023337]">User</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      datetime: "2024-01-18 14:30",
                      unitId: "BU003",
                      type: "Transfer",
                      from: "Fridge-A1",
                      to: "Fridge-C1",
                      user: "Tech001",
                    },
                    {
                      datetime: "2024-01-18 10:15",
                      unitId: "BU002",
                      type: "Reservation",
                      from: "Available",
                      to: "Reserved",
                      user: "Nurse002",
                    },
                  ].map((movement, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-[#023337]">{movement.datetime}</TableCell>
                      <TableCell className="font-medium text-[#023337]">{movement.unitId}</TableCell>
                      <TableCell className="text-[#023337]">{movement.type}</TableCell>
                      <TableCell className="text-[#023337]">{movement.from}</TableCell>
                      <TableCell className="text-[#023337]">{movement.to}</TableCell>
                      <TableCell className="text-[#023337]">{movement.user}</TableCell>
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
