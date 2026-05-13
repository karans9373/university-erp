import {
  BadgeCheck,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CalendarCheck2,
  ClipboardList,
  CreditCard,
  GraduationCap,
  HousePlus,
  IdCard,
  Library,
  MonitorSmartphone,
  MessageSquareText,
  NotebookTabs,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

export const modules = [
  { title: "Student Management", icon: GraduationCap, text: "Lifecycle, profiles, enrollment, and progression tracking." },
  { title: "Attendance Intelligence", icon: CalendarCheck2, text: "Live attendance analytics, alerts, and visual trends." },
  { title: "Result & GPA Engine", icon: ShieldCheck, text: "Exam workflows, grading, GPA, and academic reports." },
  { title: "Fee Command Center", icon: CreditCard, text: "Invoicing, fee plans, scholarships, and receipts." },
  { title: "Library & Resources", icon: Library, text: "Library circulation, digital collections, and asset controls." },
  { title: "Placement Cell", icon: BriefcaseBusiness, text: "Industry readiness, recruiter events, and placement outcomes." },
  { title: "Campus Notices", icon: Bell, text: "Real-time notices, events, and student communications." },
  { title: "Hostel & Facilities", icon: Building2, text: "Accommodation, inventory, transport, and services tracking." },
  { title: "AI Student Assistant", icon: MessageSquareText, text: "Smart self-service support for students and staff." },
  { title: "Course Enrollment", icon: BookOpen, text: "Semester planning, subjects, electives, and timetable alignment." },
  { title: "ID & Access Control", icon: IdCard, text: "Student IDs, campus access, library permissions, and smart identity workflows." },
  { title: "Mess & Welfare", icon: HousePlus, text: "Mess card activation, food plans, hostel welfare tickets, and student support." },
];

export const heroStats = [
  { label: "Global Learners", value: "42K+" },
  { label: "Faculty & Staff", value: "1.8K" },
  { label: "Placement Success", value: "89.7%" },
  { label: "Campuses Connected", value: "12" },
];

export const demoCredentials = [
  { role: "Admin", email: "admin@unisphere.edu", password: "Admin@123" },
  { role: "Staff", email: "teacher@unisphere.edu", password: "Teacher@123" },
  { role: "Student", email: "student@unisphere.edu", password: "Student@123" },
];

export const roleOptions = [
  {
    key: "admin",
    title: "Admin Control",
    subtitle: "Manage the entire university",
    icon: ShieldCheck,
    accent: "from-brand-blue to-brand-lavender",
  },
  {
    key: "teacher",
    title: "Staff Workspace",
    subtitle: "Attendance, marks, and notices",
    icon: UsersRound,
    accent: "from-brand-cyan to-brand-blue",
  },
  {
    key: "student",
    title: "Student Self-Service",
    subtitle: "Fees, IDs, hostel, and academics",
    icon: GraduationCap,
    accent: "from-brand-peach to-brand-pink",
  },
];

export const landingHighlights = [
  { label: "Hostel Allotments", icon: HousePlus, text: "Allocate rooms, wardens, mess plans, and access permissions in one place." },
  { label: "Smart Identity", icon: IdCard, text: "Issue student IDs, library permissions, bus routes, and campus access cards." },
  { label: "Academic Workflow", icon: NotebookTabs, text: "Manage results, GPA, course loads, examinations, and faculty operations." },
  { label: "Mobile Experience", icon: MonitorSmartphone, text: "Students can check dues, notices, attendance, and documents from any device." },
  { label: "Operational Reports", icon: ClipboardList, text: "Download PDFs and Excel exports for finance, academics, and compliance reviews." },
  { label: "Verified Campus Data", icon: BadgeCheck, text: "A structured ERP feel for real university demos, sales presentations, and deployments." },
];
