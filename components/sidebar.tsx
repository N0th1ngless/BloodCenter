"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ChevronLeft,
  ChevronRight,
  Search,
  LayoutDashboard,
  Users,
  Truck,
  Droplets,
  FlaskConical,
  TestTube,
  Package,
  FileText,
  CheckCircle,
  Building2,
  Shield,
  UserCheck,
  Warehouse,
  Settings,
  BarChart3,
  UsersRound,
  Bell,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const menuGroups = [
  {
    title: "Core Operations",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", route: "/" },
      { icon: Users, label: "Donor Management", route: "/donors" },
      { icon: Truck, label: "Mobile Blood Donation (MBD)", route: "/mbd" },
      { icon: Droplets, label: "Bleeding Area", route: "/bleeding-area" },
      { icon: FlaskConical, label: "Blood Processing & QA", route: "/blood-processing" },
      { icon: TestTube, label: "Serology Testing & Confirmatory", route: "/serology" },
      { icon: Package, label: "Blood Inventory & Distribution", route: "/inventory-distribution" },
      { icon: FileText, label: "Blood Requests & Transfusion", route: "/blood-requests" },
      { icon: CheckCircle, label: "Clearance", route: "/clearance" },
      { icon: Building2, label: "Ward Stations", route: "/ward-stations" },
    ],
  },
  {
    title: "Safety & Monitoring",
    items: [
      { icon: Shield, label: "Haemovigilance", route: "/haemovigilance" },
      { icon: Bell, label: "Notifications & Alerts", route: "/notifications" },
    ],
  },
  {
    title: "Partner & Facility Management",
    items: [
      { icon: UserCheck, label: "Stakeholders Management", route: "/stakeholders" },
      { icon: Building2, label: "Blood Service Facility (BSF) Management", route: "/bsf" },
    ],
  },
  {
    title: "Resources",
    items: [{ icon: Warehouse, label: "Supply & Reagents Management", route: "/supply-management" }],
  },
  {
    title: "People & Access",
    items: [
      { icon: UsersRound, label: "User & Staff Management", route: "/users" },
      { icon: Settings, label: "Administrative Panel", route: "/admin" },
    ],
  },
  {
    title: "Oversight & Configuration",
    items: [
      { icon: BarChart3, label: "Reports & Analytics", route: "/reports" },
      { icon: Settings, label: "Settings", route: "/settings" },
    ],
  },
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Core Operations"])
  const router = useRouter()
  const pathname = usePathname()

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupTitle) ? prev.filter((title) => title !== groupTitle) : [...prev, groupTitle],
    )
  }

  const filteredGroups = menuGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase())),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full bg-[#023337] text-white transition-all duration-300 z-50",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#4ea674]/20">
        {!collapsed && (
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-[#c0e6b9]">BTSC</h1>
            <p className="text-xs text-[#c0e6b9]/70">Bicol Transfusion Science Centre</p>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={onToggle} className="text-[#c0e6b9] hover:bg-[#4ea674]/20">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#c0e6b9]/50" />
            <Input
              placeholder="Search modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#4ea674]/10 border-[#4ea674]/30 text-white placeholder:text-[#c0e6b9]/50 focus:border-[#4ea674]"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-2 pb-4">
          {filteredGroups.map((group) => (
            <div key={group.title}>
              {!collapsed && (
                <Button
                  variant="ghost"
                  onClick={() => toggleGroup(group.title)}
                  className="w-full justify-start text-[#c0e6b9]/80 hover:bg-[#4ea674]/20 mb-1"
                >
                  <span className="text-xs font-medium">{group.title}</span>
                </Button>
              )}

              {(collapsed || expandedGroups.includes(group.title)) && (
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.route
                    return (
                      <Button
                        key={item.label}
                        variant="ghost"
                        onClick={() => router.push(item.route)}
                        className={cn(
                          "w-full justify-start text-white hover:bg-[#4ea674]/20",
                          collapsed ? "px-3" : "px-4",
                          isActive && "bg-[#4ea674] hover:bg-[#4ea674]/80",
                        )}
                      >
                        <Icon className={cn("h-4 w-4", collapsed ? "" : "mr-3")} />
                        {!collapsed && <span className="text-sm">{item.label}</span>}
                      </Button>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
