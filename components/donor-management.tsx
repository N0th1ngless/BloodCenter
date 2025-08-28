"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Filter,
  Plus,
  Eye,
  Heart,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Download,
  QrCode,
  Calendar,
  Upload,
  FileText,
  Activity,
  Shield,
  Users,
  Printer,
} from "lucide-react"

interface Donor {
  id: string
  firstName: string
  lastName: string
  bloodType: string
  email: string
  phone: string
  address: {
    province: string
    city: string
    barangay: string
    street: string
  }
  dateOfBirth: string
  age: number
  gender: string
  civilStatus: "Single" | "Single with Partner" | "Married" | "Widow" | "Separated"
  donorType: "Voluntary" | "Replacement" | "Walk-in" | "Repeat"
  bagType: "450mL" | "350mL" | "Apheresis"
  isFirstTime: boolean
  status: "active" | "deferred" | "inactive"
  lastDonation: string
  nextEligibleDate: string
  totalDonations: number
  eligibilityStatus: "eligible" | "temporarily_deferred" | "permanently_deferred"
  deferralReason?: string
  deferralUntil?: string
  deferralType?: "temporary" | "permanent"
  registrationDate: string
  qrCode: string
  photo?: string
  donationHistory: DonationRecord[]
  testResults: TestResult[]
  documents: Document[]
}

interface DonationRecord {
  id: string
  date: string
  venue: string
  unitNumber: string
  bagType: string
  outcome: "Accepted" | "QNS" | "Deferred"
  notes?: string
}

interface TestResult {
  id: string
  date: string
  testType: string
  result: "Reactive" | "Non-Reactive" | "Pending"
  notes?: string
}

interface Document {
  id: string
  name: string
  type: string
  uploadDate: string
  url: string
}

const mockDonors: Donor[] = [
  {
    id: "D2508012345",
    firstName: "Juan",
    lastName: "Cruz",
    bloodType: "A+",
    email: "juan.cruz@email.com",
    phone: "+63 912 345 6789",
    address: {
      province: "Albay",
      city: "Legazpi City",
      barangay: "Rizal",
      street: "123 Rizal St",
    },
    dateOfBirth: "1985-03-15",
    age: 39,
    gender: "Male",
    civilStatus: "Married",
    donorType: "Repeat",
    bagType: "450mL",
    isFirstTime: false,
    status: "active",
    lastDonation: "2024-01-10",
    nextEligibleDate: "2024-04-10",
    totalDonations: 12,
    eligibilityStatus: "eligible",
    registrationDate: "2020-05-15",
    qrCode: "QR_D2508012345",
    photo: "/professional-male-avatar.png",
    donationHistory: [
      {
        id: "DON001",
        date: "2024-01-10",
        venue: "BMC Blood Bank",
        unitNumber: "BU240110001",
        bagType: "450mL",
        outcome: "Accepted",
      },
    ],
    testResults: [
      {
        id: "TEST001",
        date: "2024-01-10",
        testType: "HIV",
        result: "Non-Reactive",
      },
    ],
    documents: [],
  },
  {
    id: "D2507023456",
    firstName: "Maria",
    lastName: "Santos",
    bloodType: "O+",
    email: "maria.santos@email.com",
    phone: "+63 917 234 5678",
    address: {
      province: "Albay",
      city: "Daraga",
      barangay: "Mayon",
      street: "456 Mayon Ave",
    },
    dateOfBirth: "1990-07-22",
    age: 34,
    gender: "Female",
    civilStatus: "Single",
    donorType: "Voluntary",
    bagType: "350mL",
    isFirstTime: false,
    status: "deferred",
    lastDonation: "2023-12-05",
    nextEligibleDate: "2024-02-05",
    totalDonations: 8,
    eligibilityStatus: "temporarily_deferred",
    deferralReason: "Low hemoglobin (11.2 g/dL)",
    deferralUntil: "2024-02-05",
    deferralType: "temporary",
    registrationDate: "2021-03-10",
    qrCode: "QR_D2507023456",
    photo: "/female-nurse-avatar.png",
    donationHistory: [
      {
        id: "DON002",
        date: "2023-12-05",
        venue: "Mobile Blood Drive - Daraga",
        unitNumber: "BU231205002",
        bagType: "350mL",
        outcome: "Deferred",
        notes: "Low hemoglobin",
      },
    ],
    testResults: [],
    documents: [],
  },
]

export function DonorManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBloodType, setSelectedBloodType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedEligibility, setSelectedEligibility] = useState("all")
  const [selectedBarangay, setSelectedBarangay] = useState("all")
  const [selectedDonorType, setSelectedDonorType] = useState("all")
  const [isAddDonorOpen, setIsAddDonorOpen] = useState(false)
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null)
  const [isDonorProfileOpen, setIsDonorProfileOpen] = useState(false)
  const [registrationStep, setRegistrationStep] = useState(1)

  const generateDonorId = () => {
    const now = new Date()
    const year = now.getFullYear().toString().slice(-2)
    const month = (now.getMonth() + 1).toString().padStart(2, "0")
    const sequential = Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, "0")
    return `D${year}${month}${sequential}`
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const calculateNextEligibleDate = (lastDonation: string) => {
    const lastDate = new Date(lastDonation)
    const nextDate = new Date(lastDate)
    nextDate.setDate(nextDate.getDate() + 56) // 8 weeks interval
    return nextDate.toISOString().split("T")[0]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-[#4ea674] text-white"
      case "deferred":
        return "bg-yellow-500 text-white"
      case "inactive":
        return "bg-gray-500 text-white"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  const getEligibilityColor = (eligibility: string) => {
    switch (eligibility) {
      case "eligible":
        return "bg-[#4ea674] text-white"
      case "temporarily_deferred":
        return "bg-yellow-500 text-white"
      case "permanently_deferred":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  const filteredDonors = mockDonors.filter((donor) => {
    const matchesSearch =
      donor.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesBloodType = selectedBloodType === "all" || donor.bloodType === selectedBloodType
    const matchesStatus = selectedStatus === "all" || donor.status === selectedStatus
    const matchesEligibility = selectedEligibility === "all" || donor.eligibilityStatus === selectedEligibility
    const matchesBarangay = selectedBarangay === "all" || donor.address.barangay === selectedBarangay
    const matchesDonorType = selectedDonorType === "all" || donor.donorType === selectedDonorType

    return (
      matchesSearch && matchesBloodType && matchesStatus && matchesEligibility && matchesBarangay && matchesDonorType
    )
  })

  const donorStats = {
    total: mockDonors.length,
    active: mockDonors.filter((d) => d.status === "active").length,
    deferred: mockDonors.filter((d) => d.status === "deferred").length,
    eligible: mockDonors.filter((d) => d.eligibilityStatus === "eligible").length,
    repeatDonors: mockDonors.filter((d) => !d.isFirstTime).length,
    temporaryDeferrals: mockDonors.filter((d) => d.eligibilityStatus === "temporarily_deferred").length,
    permanentDeferrals: mockDonors.filter((d) => d.eligibilityStatus === "permanently_deferred").length,
  }

  const DonorProfileView = ({ donor }: { donor: Donor }) => (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start space-x-6 p-6 bg-[#e9f8e7] rounded-lg">
        <Avatar className="h-24 w-24">
          <AvatarImage src={donor.photo || "/placeholder.svg"} alt={`${donor.firstName} ${donor.lastName}`} />
          <AvatarFallback className="bg-[#4ea674] text-white text-lg">
            {donor.firstName[0]}
            {donor.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#023337]">
                {donor.firstName} {donor.lastName}
              </h2>
              <p className="text-[#023337]/70">Donor ID: {donor.id}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <QrCode className="h-16 w-16 text-[#023337] mx-auto mb-2" />
                <p className="text-xs text-[#023337]">QR Code</p>
              </div>
              <Button size="sm" variant="outline" className="border-[#4ea674] text-[#4ea674] bg-transparent">
                <Printer className="h-4 w-4 mr-2" />
                Print ID Card
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
              <p className="text-sm text-[#023337]/70">Blood Type</p>
              <Badge className="bg-[#4ea674] text-white">{donor.bloodType}</Badge>
            </div>
            <div>
              <p className="text-sm text-[#023337]/70">Age</p>
              <p className="font-medium text-[#023337]">{donor.age} years</p>
            </div>
            <div>
              <p className="text-sm text-[#023337]/70">Status</p>
              <Badge className={getStatusColor(donor.status)}>{donor.status}</Badge>
            </div>
            <div>
              <p className="text-sm text-[#023337]/70">Total Donations</p>
              <p className="font-medium text-[#023337]">{donor.totalDonations}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for detailed information */}
      <Tabs defaultValue="history" className="space-y-4">
        <TabsList className="bg-[#e9f8e7] text-[#023337]">
          <TabsTrigger value="history" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Donation History
          </TabsTrigger>
          <TabsTrigger value="eligibility" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Eligibility Tracker
          </TabsTrigger>
          <TabsTrigger value="tests" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Test Results
          </TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337]">Donation History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[#023337]">Date</TableHead>
                    <TableHead className="text-[#023337]">Venue</TableHead>
                    <TableHead className="text-[#023337]">Unit Number</TableHead>
                    <TableHead className="text-[#023337]">Bag Type</TableHead>
                    <TableHead className="text-[#023337]">Outcome</TableHead>
                    <TableHead className="text-[#023337]">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donor.donationHistory.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell className="text-[#023337]">{donation.date}</TableCell>
                      <TableCell className="text-[#023337]">{donation.venue}</TableCell>
                      <TableCell className="text-[#023337]">{donation.unitNumber}</TableCell>
                      <TableCell className="text-[#023337]">{donation.bagType}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            donation.outcome === "Accepted"
                              ? "bg-[#4ea674] text-white"
                              : donation.outcome === "QNS"
                                ? "bg-yellow-500 text-white"
                                : "bg-red-500 text-white"
                          }
                        >
                          {donation.outcome}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#023337]">{donation.notes || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="eligibility">
          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337]">Eligibility Tracker</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-[#e9f8e7] rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4 text-[#4ea674]" />
                    <span className="font-medium text-[#023337]">Last Donation</span>
                  </div>
                  <p className="text-lg font-bold text-[#023337]">{donor.lastDonation}</p>
                </div>
                <div className="p-4 bg-[#e9f8e7] rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-[#4ea674]" />
                    <span className="font-medium text-[#023337]">Next Eligible Date</span>
                  </div>
                  <p className="text-lg font-bold text-[#023337]">{donor.nextEligibleDate}</p>
                </div>
                <div className="p-4 bg-[#e9f8e7] rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-4 w-4 text-[#4ea674]" />
                    <span className="font-medium text-[#023337]">Current Status</span>
                  </div>
                  <Badge className={getEligibilityColor(donor.eligibilityStatus)}>
                    {donor.eligibilityStatus.replace("_", " ")}
                  </Badge>
                </div>
              </div>
              {donor.deferralReason && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Current Deferral</span>
                  </div>
                  <p className="text-yellow-800">{donor.deferralReason}</p>
                  {donor.deferralUntil && (
                    <p className="text-sm text-yellow-600 mt-1">Deferred until: {donor.deferralUntil}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests">
          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337]">Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[#023337]">Date</TableHead>
                    <TableHead className="text-[#023337]">Test Type</TableHead>
                    <TableHead className="text-[#023337]">Result</TableHead>
                    <TableHead className="text-[#023337]">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donor.testResults.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="text-[#023337]">{test.date}</TableCell>
                      <TableCell className="text-[#023337]">{test.testType}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            test.result === "Non-Reactive"
                              ? "bg-[#4ea674] text-white"
                              : test.result === "Pending"
                                ? "bg-yellow-500 text-white"
                                : "bg-red-500 text-white"
                          }
                        >
                          {test.result}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#023337]">{test.notes || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#023337]">Documents & Attachments</CardTitle>
                <Button size="sm" className="bg-[#4ea674] hover:bg-[#4ea674]/80 text-white">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {donor.documents.length === 0 ? (
                <div className="text-center py-8 text-[#023337]/70">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-[#023337]/30" />
                  <p>No documents uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {donor.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-[#e9f8e7] rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4 text-[#4ea674]" />
                        <div>
                          <p className="font-medium text-[#023337]">{doc.name}</p>
                          <p className="text-sm text-[#023337]/70">Uploaded: {doc.uploadDate}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-[#4ea674] text-[#4ea674] bg-transparent">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#023337]">Donor Management</h1>
          <p className="text-[#023337]/70">Manage donor registration, eligibility, and donation history</p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isAddDonorOpen} onOpenChange={setIsAddDonorOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#4ea674] hover:bg-[#4ea674]/80 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Register Donor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-[#023337]">Donor Registration - Step {registrationStep} of 3</DialogTitle>
              </DialogHeader>

              {registrationStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#023337]">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-[#023337]">
                        First Name *
                      </Label>
                      <Input id="firstName" className="border-[#c0e6b9] focus:border-[#4ea674]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-[#023337]">
                        Last Name *
                      </Label>
                      <Input id="lastName" className="border-[#c0e6b9] focus:border-[#4ea674]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth" className="text-[#023337]">
                        Date of Birth *
                      </Label>
                      <Input id="dateOfBirth" type="date" className="border-[#c0e6b9] focus:border-[#4ea674]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-[#023337]">
                        Sex *
                      </Label>
                      <Select>
                        <SelectTrigger className="border-[#c0e6b9] focus:border-[#4ea674]">
                          <SelectValue placeholder="Select sex" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="civilStatus" className="text-[#023337]">
                        Civil Status *
                      </Label>
                      <Select>
                        <SelectTrigger className="border-[#c0e6b9] focus:border-[#4ea674]">
                          <SelectValue placeholder="Select civil status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Single with Partner">Single with Partner</SelectItem>
                          <SelectItem value="Married">Married</SelectItem>
                          <SelectItem value="Widow">Widow</SelectItem>
                          <SelectItem value="Separated">Separated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="photo" className="text-[#023337]">
                        Photo (Optional)
                      </Label>
                      <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        className="border-[#c0e6b9] focus:border-[#4ea674]"
                      />
                    </div>
                  </div>

                  <h4 className="text-md font-semibold text-[#023337] mt-6">Address Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="province" className="text-[#023337]">
                        Province *
                      </Label>
                      <Select>
                        <SelectTrigger className="border-[#c0e6b9] focus:border-[#4ea674]">
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Albay">Albay</SelectItem>
                          <SelectItem value="Camarines Sur">Camarines Sur</SelectItem>
                          <SelectItem value="Camarines Norte">Camarines Norte</SelectItem>
                          <SelectItem value="Catanduanes">Catanduanes</SelectItem>
                          <SelectItem value="Masbate">Masbate</SelectItem>
                          <SelectItem value="Sorsogon">Sorsogon</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-[#023337]">
                        City/Municipality *
                      </Label>
                      <Input id="city" className="border-[#c0e6b9] focus:border-[#4ea674]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="barangay" className="text-[#023337]">
                        Barangay *
                      </Label>
                      <Input id="barangay" className="border-[#c0e6b9] focus:border-[#4ea674]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="street" className="text-[#023337]">
                        Street Address
                      </Label>
                      <Input id="street" className="border-[#c0e6b9] focus:border-[#4ea674]" />
                    </div>
                  </div>

                  <h4 className="text-md font-semibold text-[#023337] mt-6">Contact Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[#023337]">
                        Phone Number *
                      </Label>
                      <Input id="phone" className="border-[#c0e6b9] focus:border-[#4ea674]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[#023337]">
                        Email Address
                      </Label>
                      <Input id="email" type="email" className="border-[#c0e6b9] focus:border-[#4ea674]" />
                    </div>
                  </div>
                </div>
              )}

              {registrationStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#023337]">Donor Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="donorType" className="text-[#023337]">
                        Donor Type *
                      </Label>
                      <Select>
                        <SelectTrigger className="border-[#c0e6b9] focus:border-[#4ea674]">
                          <SelectValue placeholder="Select donor type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Voluntary">Voluntary</SelectItem>
                          <SelectItem value="Replacement">Replacement</SelectItem>
                          <SelectItem value="Walk-in">Walk-in</SelectItem>
                          <SelectItem value="Repeat">Repeat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bagType" className="text-[#023337]">
                        Bag Type *
                      </Label>
                      <Select>
                        <SelectTrigger className="border-[#c0e6b9] focus:border-[#4ea674]">
                          <SelectValue placeholder="Select bag type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="450mL">450mL</SelectItem>
                          <SelectItem value="350mL">350mL</SelectItem>
                          <SelectItem value="Apheresis">Apheresis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="isFirstTime" className="text-[#023337]">
                        Donor Status *
                      </Label>
                      <Select>
                        <SelectTrigger className="border-[#c0e6b9] focus:border-[#4ea674]">
                          <SelectValue placeholder="Select donor status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">First-time Donor</SelectItem>
                          <SelectItem value="false">Repeat Donor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#023337]">Auto-Generated Donor ID</Label>
                      <div className="p-3 bg-[#e9f8e7] rounded-md border border-[#c0e6b9]">
                        <p className="font-mono text-[#023337]">{generateDonorId()}</p>
                        <p className="text-xs text-[#023337]/70 mt-1">Format: DYYMM00000</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <QrCode className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">QR Code Generation</span>
                    </div>
                    <p className="text-blue-700 text-sm">
                      A unique QR code will be automatically generated for this donor upon registration completion.
                    </p>
                  </div>
                </div>
              )}

              {registrationStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#023337]">Medical Screening (Optional)</h3>
                  <p className="text-[#023337]/70 text-sm">
                    Medical screening can be completed during registration or at the time of donation. Only Medical
                    Officers can apply deferrals.
                  </p>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[#023337]">Screening Status</Label>
                      <Select>
                        <SelectTrigger className="border-[#c0e6b9] focus:border-[#4ea674]">
                          <SelectValue placeholder="Select screening status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eligible">Eligible</SelectItem>
                          <SelectItem value="temporary_deferral">Temporary Deferral</SelectItem>
                          <SelectItem value="permanent_deferral">Permanent Deferral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deferralReason" className="text-[#023337]">
                        Deferral Reason (if applicable)
                      </Label>
                      <Textarea
                        id="deferralReason"
                        placeholder="Enter reason for deferral..."
                        className="border-[#c0e6b9] focus:border-[#4ea674]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deferralUntil" className="text-[#023337]">
                        Deferral Until (for temporary deferrals)
                      </Label>
                      <Input id="deferralUntil" type="date" className="border-[#c0e6b9] focus:border-[#4ea674]" />
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="h-4 w-4 text-amber-600" />
                      <span className="font-medium text-amber-800">Medical Officer Authorization Required</span>
                    </div>
                    <p className="text-amber-700 text-sm">
                      Deferral decisions require Medical Officer role authorization and will be logged in the audit
                      trail.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    registrationStep > 1 ? setRegistrationStep(registrationStep - 1) : setIsAddDonorOpen(false)
                  }
                >
                  {registrationStep > 1 ? "Previous" : "Cancel"}
                </Button>
                <Button
                  className="bg-[#4ea674] hover:bg-[#4ea674]/80 text-white"
                  onClick={() =>
                    registrationStep < 3 ? setRegistrationStep(registrationStep + 1) : setIsAddDonorOpen(false)
                  }
                >
                  {registrationStep < 3 ? "Next" : "Complete Registration"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="border-[#4ea674] text-[#4ea674] bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {[
          { title: "Total Donors", value: donorStats.total, icon: User, color: "text-[#023337]" },
          { title: "Active Donors", value: donorStats.active, icon: CheckCircle, color: "text-[#4ea674]" },
          { title: "Eligible Donors", value: donorStats.eligible, icon: Heart, color: "text-[#4ea674]" },
          { title: "Repeat Donors", value: donorStats.repeatDonors, icon: Users, color: "text-[#4ea674]" },
          { title: "Temp. Deferred", value: donorStats.temporaryDeferrals, icon: Clock, color: "text-yellow-500" },
          { title: "Perm. Deferred", value: donorStats.permanentDeferrals, icon: AlertTriangle, color: "text-red-500" },
          { title: "This Month", value: "24", icon: Activity, color: "text-[#023337]" },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-[#c0e6b9]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-[#023337]">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="donors" className="space-y-4">
        <TabsList className="bg-[#e9f8e7] text-[#023337]">
          <TabsTrigger value="donors" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            All Donors
          </TabsTrigger>
          <TabsTrigger value="screening" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Eligibility Screening
          </TabsTrigger>
          <TabsTrigger value="deferrals" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Deferrals
          </TabsTrigger>
          <TabsTrigger value="repeat" className="data-[state=active]:bg-[#4ea674] data-[state=active]:text-white">
            Top Repeat Donors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="donors" className="space-y-4">
          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337] flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Search & Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#023337]/50" />
                  <Input
                    placeholder="Search by name, ID, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-[#c0e6b9] focus:border-[#4ea674]"
                  />
                </div>
                <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
                  <SelectTrigger className="border-[#c0e6b9] focus:border-[#4ea674]">
                    <SelectValue placeholder="Blood Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Blood Types</SelectItem>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="deferred">Deferred</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedBarangay} onValueChange={setSelectedBarangay}>
                  <SelectTrigger className="border-[#c0e6b9] focus:border-[#4ea674]">
                    <SelectValue placeholder="Barangay" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Barangays</SelectItem>
                    <SelectItem value="Rizal">Rizal</SelectItem>
                    <SelectItem value="Mayon">Mayon</SelectItem>
                    <SelectItem value="Centro">Centro</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedDonorType} onValueChange={setSelectedDonorType}>
                  <SelectTrigger className="border-[#c0e6b9] focus:border-[#4ea674]">
                    <SelectValue placeholder="Donor Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Voluntary">Voluntary</SelectItem>
                    <SelectItem value="Replacement">Replacement</SelectItem>
                    <SelectItem value="Walk-in">Walk-in</SelectItem>
                    <SelectItem value="Repeat">Repeat</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedEligibility} onValueChange={setSelectedEligibility}>
                  <SelectTrigger className="border-[#c0e6b9] focus:border-[#4ea674]">
                    <SelectValue placeholder="Eligibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Eligibility</SelectItem>
                    <SelectItem value="eligible">Eligible</SelectItem>
                    <SelectItem value="temporarily_deferred">Temporarily Deferred</SelectItem>
                    <SelectItem value="permanently_deferred">Permanently Deferred</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337]">Registered Donors ({filteredDonors.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[#023337]">Donor ID</TableHead>
                    <TableHead className="text-[#023337]">Name</TableHead>
                    <TableHead className="text-[#023337]">Blood Type</TableHead>
                    <TableHead className="text-[#023337]">Last Donation</TableHead>
                    <TableHead className="text-[#023337]">Deferral Status</TableHead>
                    <TableHead className="text-[#023337]">Next Eligible</TableHead>
                    <TableHead className="text-[#023337]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDonors.map((donor) => (
                    <TableRow key={donor.id}>
                      <TableCell className="font-medium text-[#023337]">{donor.id}</TableCell>
                      <TableCell className="text-[#023337]">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={donor.photo || "/placeholder.svg"}
                              alt={`${donor.firstName} ${donor.lastName}`}
                            />
                            <AvatarFallback className="bg-[#4ea674] text-white text-xs">
                              {donor.firstName[0]}
                              {donor.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {donor.firstName} {donor.lastName}
                            </p>
                            <p className="text-xs text-[#023337]/70">
                              {donor.donorType} • {donor.age} years
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-[#023337]">
                        <Badge variant="outline" className="border-[#4ea674] text-[#4ea674]">
                          {donor.bloodType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#023337]">{donor.lastDonation}</TableCell>
                      <TableCell>
                        <Badge className={getEligibilityColor(donor.eligibilityStatus)}>
                          {donor.eligibilityStatus.replace("_", " ")}
                        </Badge>
                        {donor.deferralReason && (
                          <p className="text-xs text-[#023337]/70 mt-1">{donor.deferralReason}</p>
                        )}
                      </TableCell>
                      <TableCell className="text-[#023337]">{donor.nextEligibleDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#4ea674] text-[#4ea674] bg-transparent"
                            onClick={() => {
                              setSelectedDonor(donor)
                              setIsDonorProfileOpen(true)
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" className="bg-[#4ea674] hover:bg-[#4ea674]/80 text-white">
                            Add Donation
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-yellow-500 text-yellow-600 bg-transparent"
                          >
                            Assign Deferral
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

        <TabsContent value="screening" className="space-y-4">
          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337]">Eligibility Screening Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDonors
                  .filter((donor) => donor.eligibilityStatus === "temporarily_deferred")
                  .map((donor) => (
                    <div key={donor.id} className="flex items-center justify-between p-4 bg-[#e9f8e7] rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={donor.photo || "/placeholder.svg"}
                            alt={`${donor.firstName} ${donor.lastName}`}
                          />
                          <AvatarFallback className="bg-[#4ea674] text-white">
                            {donor.firstName[0]}
                            {donor.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium text-[#023337]">
                            {donor.firstName} {donor.lastName}
                          </span>
                        </div>
                        <Badge variant="outline" className="border-[#4ea674] text-[#4ea674]">
                          {donor.bloodType}
                        </Badge>
                        <span className="text-[#023337]">{donor.id}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-[#023337]">{donor.deferralReason}</p>
                          <p className="text-xs text-[#023337]/70">Deferred until: {donor.deferralUntil}</p>
                        </div>
                        <Button size="sm" className="bg-[#4ea674] hover:bg-[#4ea674]/80 text-white">
                          Review Eligibility
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deferrals" className="space-y-4">
          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337]">Deferred Donors Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[#023337]">Donor</TableHead>
                    <TableHead className="text-[#023337]">Blood Type</TableHead>
                    <TableHead className="text-[#023337]">Deferral Type</TableHead>
                    <TableHead className="text-[#023337]">Deferral Reason</TableHead>
                    <TableHead className="text-[#023337]">Deferred Until</TableHead>
                    <TableHead className="text-[#023337]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDonors
                    .filter((donor) => donor.eligibilityStatus.includes("deferred"))
                    .map((donor) => (
                      <TableRow key={donor.id}>
                        <TableCell className="text-[#023337]">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={donor.photo || "/placeholder.svg"}
                                alt={`${donor.firstName} ${donor.lastName}`}
                              />
                              <AvatarFallback className="bg-[#4ea674] text-white text-xs">
                                {donor.firstName[0]}
                                {donor.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {donor.firstName} {donor.lastName}
                              </p>
                              <p className="text-xs text-[#023337]/70">{donor.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-[#023337]">
                          <Badge variant="outline" className="border-[#4ea674] text-[#4ea674]">
                            {donor.bloodType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              donor.eligibilityStatus === "temporarily_deferred"
                                ? "bg-yellow-500 text-white"
                                : "bg-red-500 text-white"
                            }
                          >
                            {donor.eligibilityStatus.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[#023337]">{donor.deferralReason}</TableCell>
                        <TableCell className="text-[#023337]">
                          {donor.deferralUntil ||
                            (donor.eligibilityStatus === "permanently_deferred" ? "Permanent" : "-")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {donor.eligibilityStatus === "temporarily_deferred" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-[#4ea674] text-[#4ea674] bg-transparent"
                              >
                                Reinstate
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#023337] text-[#023337] bg-transparent"
                            >
                              Update
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

        <TabsContent value="repeat" className="space-y-4">
          <Card className="border-[#c0e6b9]">
            <CardHeader>
              <CardTitle className="text-[#023337]">Top Repeat Donors Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[#023337]">Rank</TableHead>
                    <TableHead className="text-[#023337]">Donor</TableHead>
                    <TableHead className="text-[#023337]">Blood Type</TableHead>
                    <TableHead className="text-[#023337]">Total Donations</TableHead>
                    <TableHead className="text-[#023337]">Last Donation</TableHead>
                    <TableHead className="text-[#023337]">Member Since</TableHead>
                    <TableHead className="text-[#023337]">Recognition</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDonors
                    .sort((a, b) => b.totalDonations - a.totalDonations)
                    .map((donor, index) => (
                      <TableRow key={donor.id}>
                        <TableCell className="text-[#023337] font-medium">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`text-lg ${
                                index === 0
                                  ? "text-yellow-500"
                                  : index === 1
                                    ? "text-gray-400"
                                    : index === 2
                                      ? "text-amber-600"
                                      : "text-[#023337]"
                              }`}
                            >
                              #{index + 1}
                            </span>
                            {index < 3 && <Heart className="h-4 w-4 text-red-500" />}
                          </div>
                        </TableCell>
                        <TableCell className="text-[#023337]">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={donor.photo || "/placeholder.svg"}
                                alt={`${donor.firstName} ${donor.lastName}`}
                              />
                              <AvatarFallback className="bg-[#4ea674] text-white text-xs">
                                {donor.firstName[0]}
                                {donor.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {donor.firstName} {donor.lastName}
                              </p>
                              <p className="text-xs text-[#023337]/70">{donor.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-[#023337]">
                          <Badge variant="outline" className="border-[#4ea674] text-[#4ea674]">
                            {donor.bloodType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[#023337] font-medium text-lg">{donor.totalDonations}</TableCell>
                        <TableCell className="text-[#023337]">{donor.lastDonation}</TableCell>
                        <TableCell className="text-[#023337]">{donor.registrationDate}</TableCell>
                        <TableCell>
                          {donor.totalDonations >= 10 && <Badge className="bg-[#4ea674] text-white">Hero Donor</Badge>}
                          {donor.totalDonations >= 5 && donor.totalDonations < 10 && (
                            <Badge className="bg-blue-500 text-white">Regular Donor</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDonorProfileOpen} onOpenChange={setIsDonorProfileOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#023337]">Donor Profile</DialogTitle>
          </DialogHeader>
          {selectedDonor && <DonorProfileView donor={selectedDonor} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
