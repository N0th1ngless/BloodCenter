"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Droplets, AlertTriangle, TrendingUp, Users, Package, Clock, CheckCircle } from "lucide-react"

export function DashboardContent() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#023337]">Dashboard</h1>
          <p className="text-[#023337]/70">Bicol Transfusion Science Centre - Real-time Overview</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-[#4ea674] border-[#4ea674]">
            <div className="w-2 h-2 bg-[#4ea674] rounded-full mr-2"></div>
            System Online
          </Badge>
        </div>
      </div>

      {/* Blood Stock Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { type: "A+", count: 45, status: "adequate", color: "bg-[#4ea674]" },
          { type: "O+", count: 12, status: "low", color: "bg-red-500" },
          { type: "B+", count: 28, status: "adequate", color: "bg-[#4ea674]" },
          { type: "AB+", count: 8, status: "approaching", color: "bg-yellow-500" },
        ].map((blood) => (
          <Card key={blood.type} className="border-[#c0e6b9] hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#023337]">Blood Type {blood.type}</CardTitle>
              <Droplets className="h-4 w-4 text-[#023337]/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#023337]">{blood.count}</div>
              <div className="flex items-center space-x-2 mt-2">
                <div className={`w-3 h-3 rounded-full ${blood.color}`}></div>
                <p className="text-xs text-[#023337]/60 capitalize">{blood.status} Stock</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Access Panel */}
        <div className="lg:col-span-2">
          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337]">Quick Access</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { icon: Users, label: "Donor Management", color: "bg-[#4ea674]" },
                  { icon: Droplets, label: "Bleeding Area", color: "bg-[#4ea674]" },
                  { icon: Package, label: "Blood Inventory", color: "bg-[#4ea674]" },
                  { icon: CheckCircle, label: "Requests", color: "bg-[#4ea674]" },
                  { icon: TrendingUp, label: "Analytics", color: "bg-[#4ea674]" },
                  { icon: AlertTriangle, label: "Alerts", color: "bg-[#4ea674]" },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <Button
                      key={item.label}
                      variant="outline"
                      className="h-20 flex-col space-y-2 border-[#c0e6b9] hover:bg-[#e9f8e7] text-[#023337] bg-transparent"
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-xs text-center">{item.label}</span>
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications Panel */}
        <div>
          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337] flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { type: "Low Stock", message: "O+ blood type below threshold", priority: "high", time: "5 min ago" },
                {
                  type: "Expiring Units",
                  message: "3 units expiring in 2 days",
                  priority: "medium",
                  time: "1 hour ago",
                },
                {
                  type: "Pending Request",
                  message: "Ward 3 requesting 2 units A+",
                  priority: "medium",
                  time: "2 hours ago",
                },
              ].map((notification, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-[#e9f8e7]">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      notification.priority === "high" ? "bg-red-500" : "bg-yellow-500"
                    }`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#023337]">{notification.type}</p>
                    <p className="text-xs text-[#023337]/70">{notification.message}</p>
                    <p className="text-xs text-[#023337]/50 mt-1">{notification.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Today's Donations", value: "24", change: "+12%", icon: TrendingUp },
          { title: "Pending Requests", value: "8", change: "-5%", icon: Clock },
          { title: "Completed Transfusions", value: "156", change: "+8%", icon: CheckCircle },
          { title: "Active Donors", value: "1,247", change: "+3%", icon: Users },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-[#c0e6b9]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#023337]">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-[#023337]/60" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#023337]">{stat.value}</div>
                <p className="text-xs text-[#4ea674] mt-1">{stat.change} from last month</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
