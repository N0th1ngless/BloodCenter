"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { DashboardContent } from "@/components/dashboard-content"
import { DonorManagement } from "@/components/donor-management"
import { UserManagement } from "@/components/user-management"
import { MobileBloodDonation } from "@/components/mobile-blood-donation"
import { StakeholderManagement } from "@/components/stakeholder-management"
import { BSFManagement } from "@/components/bsf-management"
import { BleedingArea } from "@/components/bleeding-area"
import { BloodProcessingQA } from "@/components/blood-processing-qa"
import { SerologyTesting } from "@/components/serology-testing"
import { BloodInventoryDistribution } from "@/components/blood-inventory-distribution"
import { BloodRequestsTransfusion } from "@/components/blood-requests-transfusion"
import { ClearanceUI } from "@/components/clearance-ui"
import { WardStations } from "@/components/ward-stations"
import { HaemovigilanceUI } from "@/components/haemovigilance-ui"
import { ReportsAnalytics } from "@/components/reports-analytics"
import { NotificationsAlerts } from "@/components/notifications-alerts"
import { SupplyReagentManagement } from "@/components/supply-reagent-management"
import { AdministrativeUI } from "@/components/administrative-ui"

export function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const pathname = usePathname()

  const renderContent = () => {
    switch (pathname) {
      case "/inventory-distribution":
        return <BloodInventoryDistribution />
      case "/donors":
        return <DonorManagement />
      case "/blood-requests":
        return <BloodRequestsTransfusion />
      case "/users":
        return <UserManagement />
      case "/mbd":
        return <MobileBloodDonation />
      case "/stakeholders":
        return <StakeholderManagement />
      case "/bsf":
        return <BSFManagement />
      case "/bleeding-area":
        return <BleedingArea />
      case "/blood-processing":
        return <BloodProcessingQA />
      case "/serology":
        return <SerologyTesting />
      case "/clearance":
        return <ClearanceUI />
      case "/ward-stations":
        return <WardStations />
      case "/haemovigilance":
        return <HaemovigilanceUI />
      case "/reports":
        return <ReportsAnalytics />
      case "/notifications":
        return <NotificationsAlerts />
      case "/supply-management":
        return <SupplyReagentManagement />
      case "/admin":
        return <AdministrativeUI />
      case "/settings":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-[#023337]">Settings</h1>
            <p className="text-gray-600 mt-2">System settings and configuration options will be available here.</p>
          </div>
        )
      default:
        return <DashboardContent />
    }
  }

  return (
    <div className="flex h-screen bg-[#e9f8e7]">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
        <div className="h-full overflow-auto">{renderContent()}</div>
      </main>
    </div>
  )
}
