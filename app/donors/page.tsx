import { DashboardLayout } from "@/components/dashboard-layout"
import { DonorManagement } from "@/components/donor-management"

export default function DonorsPage() {
  return (
    <DashboardLayout>
      <DonorManagement />
    </DashboardLayout>
  )
}
