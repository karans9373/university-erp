import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  BedDouble,
  Bell,
  BellPlus,
  Bot,
  CreditCard,
  Download,
  FileSpreadsheet,
  GraduationCap,
  IdCard,
  Library,
  LogOut,
  Search,
  SendHorizonal,
  ShieldCheck,
  Sparkles,
  SquarePen,
  UserPlus,
  Users,
  Printer,
} from "lucide-react";
import { ChartCard } from "../components/dashboard/ChartCard";
import { DataTable } from "../components/dashboard/DataTable";
import { Sidebar } from "../components/dashboard/Sidebar";
import { StatCard } from "../components/dashboard/StatCard";
import { demoCredentials, roleOptions } from "../data/mock";
import {
  askChatbot,
  createAttendance,
  createNotice,
  createResult,
  createStudent,
  EXPORT_EXCEL_URL,
  EXPORT_PDF_URL,
  fetchCollection,
  fetchDashboard,
  login,
} from "../lib/api";

const fallbackDashboard = {
  stats: [
    { label: "Students", value: 42860, delta: "+12%" },
    { label: "Faculty", value: 1840, delta: "+4%" },
    { label: "Courses", value: 312, delta: "+8%" },
    { label: "Fee Collection", value: "$3.6M", delta: "+17%" },
  ],
  attendanceTrend: [
    { name: "Jan", attendance: 91 },
    { name: "Feb", attendance: 89 },
    { name: "Mar", attendance: 93 },
    { name: "Apr", attendance: 95 },
  ],
  feeTrend: [
    { name: "Spring 2026", paid: 3600, balance: 1200 },
    { name: "Fall 2026", paid: 2900, balance: 800 },
  ],
  gradeDistribution: [
    { name: "A+", value: 44 },
    { name: "A", value: 31 },
    { name: "B+", value: 14 },
  ],
};

const initialAllocations = [
  {
    studentName: "Maya Rodriguez",
    registrationNumber: "UNI-2026-1042",
    hostel: "Maple Residency / Room 508",
    library: "Activated",
    messCard: "Gold Vegetarian",
    idCard: "Issued",
    cardCode: "UNI-CARD-1042-AI",
  },
  {
    studentName: "Aditya Menon",
    registrationNumber: "UNI-2026-1187",
    hostel: "Pending Allotment",
    library: "Awaiting Approval",
    messCard: "Pending",
    idCard: "Printing",
    cardCode: "UNI-CARD-1187-CS",
  },
];

const initialStudentServices = [
  { label: "University ID Card", value: "Issued and active", icon: IdCard, accent: "from-brand-blue to-brand-lavender" },
  { label: "Library Access", value: "Enabled for digital + physical borrowing", icon: Library, accent: "from-brand-cyan to-brand-blue" },
  { label: "Hostel Allocation", value: "Maple Residency / Room 508", icon: BedDouble, accent: "from-brand-peach to-brand-pink" },
  { label: "Mess Card Plan", value: "Gold Vegetarian meal plan active", icon: CreditCard, accent: "from-brand-lavender to-brand-pink" },
];

const roleNavigation = {
  admin: [
    { key: "overview", label: "Overview", icon: Sparkles },
    { key: "students", label: "Students", icon: GraduationCap },
    { key: "allocations", label: "Allocations", icon: ShieldCheck },
    { key: "fees", label: "Fees & Exports", icon: CreditCard },
    { key: "announcements", label: "Announcements", icon: Bell },
  ],
  teacher: [
    { key: "overview", label: "Overview", icon: Sparkles },
    { key: "attendance", label: "Attendance", icon: Users },
    { key: "results", label: "Result Desk", icon: BadgeCheck },
    { key: "announcements", label: "Notices", icon: Bell },
  ],
  student: [
    { key: "overview", label: "My Dashboard", icon: Sparkles },
    { key: "fees", label: "Fees & Dues", icon: CreditCard },
    { key: "services", label: "Cards & Services", icon: IdCard },
    { key: "results", label: "Results", icon: BadgeCheck },
    { key: "announcements", label: "Notices", icon: Bell },
  ],
};

export function PortalPage({ onExit }) {
  const [auth, setAuth] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  const [dashboard, setDashboard] = useState(fallbackDashboard);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [results, setResults] = useState([]);
  const [fees, setFees] = useState([]);
  const [notices, setNotices] = useState([]);
  const [allocations, setAllocations] = useState(initialAllocations);
  const [search, setSearch] = useState("");
  const [chatInput, setChatInput] = useState("How can I download my semester result?");
  const [chatReply, setChatReply] = useState("UniSphere Assistant is ready to help with admissions, fees, attendance, cards, and results.");
  const [loginForm, setLoginForm] = useState({
    role: "admin",
    email: "admin@unisphere.edu",
    password: "Admin@123",
  });
  const [loginError, setLoginError] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [noticeForm, setNoticeForm] = useState({
    title: "Important Fee Deadline",
    category: "Finance",
    content: "All students must clear pending semester dues before 25 May 2026 to avoid exam hall ticket hold.",
  });
  const [noticeStatus, setNoticeStatus] = useState("");
  const [attendanceForm, setAttendanceForm] = useState({
    studentName: "Maya Rodriguez",
    course: "Applied Machine Learning",
    month: "April",
    present: 24,
    total: 26,
  });
  const [resultForm, setResultForm] = useState({
    studentName: "Maya Rodriguez",
    course: "Applied Machine Learning",
    examName: "Quiz Assessment",
    marks: 88,
    grade: "A",
  });
  const [staffStatus, setStaffStatus] = useState("");
  const [studentForm, setStudentForm] = useState({
    name: "Aarav Sharma",
    email: "aarav.sharma@unisphere.edu",
    registrationNumber: "UNI-2026-1450",
    program: "BBA Global Business",
    semester: 2,
    cgpa: 0,
    attendancePercentage: 0,
    password: "Student@123",
  });
  const [studentStatus, setStudentStatus] = useState("");

  const activeRole = auth?.user?.role || loginForm.role;
  const sidebarItems = roleNavigation[activeRole] || roleNavigation.admin;
  const isPortalLoading = isAuthenticating || isBootstrapping;
  const loadingMessage = isAuthenticating
    ? "Signing you in and securing your university session..."
    : "Loading dashboard data from the university cloud...";
  const loadingDetail = isAuthenticating
    ? "Render can take a few extra seconds on the first request, so your portal is warming up."
    : "We are fetching analytics, student records, attendance, results, notices, and services.";

  useEffect(() => {
    if (auth) {
      bootstrapPortal(auth.token);
      setActiveSection((roleNavigation[auth.user.role] || roleNavigation.admin)[0].key);
    }
  }, [auth]);

  async function bootstrapPortal(token) {
    setIsBootstrapping(true);
    try {
      const [dashboardData, studentRows, attendanceRows, resultRows, feeRows, noticeRows] = await Promise.all([
        fetchDashboard(token),
        fetchCollection("/students", token),
        fetchCollection("/attendance", token),
        fetchCollection("/results", token),
        fetchCollection("/fees", token),
        fetchCollection("/notices", token),
      ]);
      setDashboard(dashboardData);
      setStudents(
        studentRows.length
          ? studentRows
          : [
              {
                name: "Maya Rodriguez",
                registrationNumber: "UNI-2026-1042",
                program: "B.Tech AI & Data Science",
                semester: 6,
                cgpa: 8.84,
                attendancePercentage: 93,
              },
            ]
      );
      setAttendance(
        attendanceRows.length
          ? attendanceRows
          : [{ month: "March", studentName: "Maya Rodriguez", course: "Applied Machine Learning", percentage: 96.1, present: 25, total: 26 }]
      );
      setResults(
        resultRows.length
          ? resultRows
          : [{ examName: "End Semester", studentName: "Maya Rodriguez", course: "Applied Machine Learning", marks: 91, grade: "A+" }]
      );
      setFees(
        feeRows.length
          ? feeRows
          : [{ semesterLabel: "Spring 2026", studentName: "Maya Rodriguez", totalAmount: 4800, paidAmount: 3600, balance: 1200, status: "Partial" }]
      );
      setNotices(
        noticeRows.length
          ? noticeRows
          : [
              { title: "Global Immersion Week", category: "Event", content: "Exchange programs, innovation booths, and international seminars begin Monday." },
              { title: "Placement Bootcamp", category: "Placement", content: "Resume review, portfolio checks, and recruiter sessions are live this Friday." },
            ]
      );
    } catch {
      setStudents([
        {
          name: "Maya Rodriguez",
          registrationNumber: "UNI-2026-1042",
          program: "B.Tech AI & Data Science",
          semester: 6,
          cgpa: 8.84,
          attendancePercentage: 93,
        },
      ]);
      setAttendance([
        { month: "March", studentName: "Maya Rodriguez", course: "Applied Machine Learning", percentage: 96.1, present: 25, total: 26 },
      ]);
        setResults([{ examName: "End Semester", studentName: "Maya Rodriguez", course: "Applied Machine Learning", marks: 91, grade: "A+" }]);
        setFees([{ semesterLabel: "Spring 2026", studentName: "Maya Rodriguez", totalAmount: 4800, paidAmount: 3600, balance: 1200, status: "Partial" }]);
    } finally {
      setIsBootstrapping(false);
      }
  }

  async function handleLogin(event) {
    event.preventDefault();
    setLoginError("");
    setIsAuthenticating(true);
    try {
      const session = await login({ email: loginForm.email, password: loginForm.password });
      setAuth({ token: session.accessToken, user: session.user });
    } catch {
      setLoginError("Login failed. Check that Netlify is using the correct VITE_API_BASE_URL and that the Render backend has finished waking up with the demo users available.");
    } finally {
      setIsAuthenticating(false);
    }
  }

  function LoadingOverlay() {
    return (
      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-xl">
        <div className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/20 bg-white/80 p-8 text-center shadow-[0_30px_120px_rgba(15,23,42,0.28)] dark:bg-slate-950/85">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-pink" />
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-brand-blue via-brand-lavender to-brand-cyan shadow-[0_20px_45px_rgba(59,130,246,0.32)]">
            <div className="h-10 w-10 rounded-full border-4 border-white/35 border-t-white animate-spin" />
          </div>
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-brand-blue">UniSphere ERP</p>
            <h3 className="mt-3 font-display text-3xl font-bold text-slate-900 dark:text-white">Preparing your portal</h3>
            <p className="mt-4 text-base font-medium text-slate-700 dark:text-slate-200">{loadingMessage}</p>
            <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-300">{loadingDetail}</p>
          </div>
          <div className="mt-6 grid gap-3 text-left sm:grid-cols-3">
            {["Authenticating role access", "Connecting to Python API", "Building a live dashboard view"].map((item, index) => (
              <div key={item} className="rounded-[1.25rem] border border-slate-200/70 bg-white/75 px-4 py-4 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-blue/10 text-xs font-bold text-brand-blue">{index + 1}</span>
                  <span className="font-semibold">In progress</span>
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function handleQuickRoleSelect(roleKey) {
    const credential =
      roleKey === "teacher"
        ? demoCredentials.find((item) => item.role === "Staff")
        : demoCredentials.find((item) => item.role.toLowerCase() === roleKey);
    if (!credential) {
      return;
    }
    setLoginForm({
      role: roleKey,
      email: credential.email,
      password: credential.password,
    });
  }

  async function handleAskChatbot() {
    try {
      const reply = await askChatbot(chatInput);
      setChatReply(reply);
    } catch {
      setChatReply(`UniSphere Assistant: For "${chatInput}", check the student services and exports areas in your role dashboard.`);
    }
  }

  async function handleCreateNotice(event) {
    event.preventDefault();
    setNoticeStatus("");
    try {
      if (auth?.token) {
        await createNotice(noticeForm, auth.token);
      }
      const newNotice = { ...noticeForm };
      setNotices((current) => [newNotice, ...current]);
      setNoticeStatus("Notification pushed successfully. It is now visible in the main landing page notification wall.");
      setNoticeForm({
        title: "",
        category: "General",
        content: "",
      });
    } catch {
      setNoticeStatus("Notification saved locally in the UI, but the API push could not be confirmed.");
      setNotices((current) => [{ ...noticeForm }, ...current]);
    }
  }

  async function handleCreateAttendance(event) {
    event.preventDefault();
    setStaffStatus("");
    const payload = {
      ...attendanceForm,
      present: Number(attendanceForm.present),
      total: Number(attendanceForm.total),
    };

    try {
      if (auth?.token) {
        await createAttendance(payload, auth.token);
      }
      setAttendance((current) => [
        {
          ...payload,
          percentage: Number(((payload.present / payload.total) * 100).toFixed(1)),
        },
        ...current,
      ]);
      setStudents((current) =>
        current.map((student) =>
          student.name === payload.studentName
            ? {
                ...student,
                attendancePercentage: Number(((payload.present / payload.total) * 100).toFixed(1)),
              }
            : student
        )
      );
      setStaffStatus("Attendance added successfully.");
    } catch {
      setStaffStatus("Attendance saved in the interface, but the API confirmation was not completed.");
      setAttendance((current) => [
        {
          ...payload,
          percentage: Number(((payload.present / payload.total) * 100).toFixed(1)),
        },
        ...current,
      ]);
    }
  }

  async function handleCreateResult(event) {
    event.preventDefault();
    setStaffStatus("");
    const payload = {
      ...resultForm,
      marks: Number(resultForm.marks),
    };

    try {
      if (auth?.token) {
        await createResult(payload, auth.token);
      }
      setResults((current) => [payload, ...current]);
      setStaffStatus("Result published successfully.");
    } catch {
      setStaffStatus("Result saved in the interface, but the API confirmation was not completed.");
      setResults((current) => [payload, ...current]);
    }
  }

  async function handleCreateStudent(event) {
    event.preventDefault();
    setStudentStatus("");
    const payload = {
      ...studentForm,
      semester: Number(studentForm.semester),
      cgpa: Number(studentForm.cgpa),
      attendancePercentage: Number(studentForm.attendancePercentage),
    };

    try {
      if (auth?.token) {
        await createStudent(payload, auth.token);
      }
      setStudents((current) => [
        {
          name: payload.name,
          email: payload.email,
          registrationNumber: payload.registrationNumber,
          program: payload.program,
          semester: payload.semester,
          cgpa: payload.cgpa,
          attendancePercentage: payload.attendancePercentage,
        },
        ...current,
      ]);
      setStudentStatus("Student added successfully.");
      setStudentForm({
        name: "",
        email: "",
        registrationNumber: "",
        program: "",
        semester: 1,
        cgpa: 0,
        attendancePercentage: 0,
        password: "Student@123",
      });
    } catch {
      setStudentStatus("Student saved in the interface, but the API confirmation was not completed.");
      setStudents((current) => [
        {
          name: payload.name,
          email: payload.email,
          registrationNumber: payload.registrationNumber,
          program: payload.program,
          semester: payload.semester,
          cgpa: payload.cgpa,
          attendancePercentage: payload.attendancePercentage,
        },
        ...current,
      ]);
    }
  }

  function cycleAllocation(value, options) {
    const currentIndex = options.indexOf(value);
    return options[(currentIndex + 1) % options.length];
  }

  function updateAllocation(studentName, field) {
    const fieldOptions = {
      hostel: ["Pending Allotment", "Maple Residency / Room 508", "Orchid Towers / Room 312"],
      library: ["Awaiting Approval", "Activated", "Restricted"],
      messCard: ["Pending", "Silver Meal Plan", "Gold Vegetarian", "Gold Regular"],
      idCard: ["Printing", "Issued", "Renewal Needed"],
    };
    setAllocations((current) =>
      current.map((item) =>
        item.studentName === studentName ? { ...item, [field]: cycleAllocation(item[field], fieldOptions[field]) } : item
      )
    );
  }

  const filteredStudents = useMemo(() => {
    return students.filter((item) => {
      const q = search.toLowerCase();
      return !q || Object.values(item).join(" ").toLowerCase().includes(q);
    });
  }, [search, students]);

  const currentStudent = useMemo(() => {
    const base = students.find((item) => item.name === auth?.user?.name) || students[0];
    const allocation = allocations.find((item) => item.studentName === base?.name) || allocations[0];
    const feeRows = fees.filter((item) => item.studentName === base?.name);
    const resultRows = results.filter((item) => item.studentName === base?.name);
    const attendanceRows = attendance.filter((item) => item.studentName === base?.name);
    return { ...base, allocation, feeRows, resultRows, attendanceRows };
  }, [allocations, attendance, auth?.user?.name, fees, results, students]);

  const personalizedServices = useMemo(() => {
    if (!currentStudent?.allocation) {
      return initialStudentServices;
    }
    return [
      { label: "University ID Card", value: currentStudent.allocation.idCard, icon: IdCard, accent: "from-brand-blue to-brand-lavender" },
      { label: "Library Access", value: currentStudent.allocation.library, icon: Library, accent: "from-brand-cyan to-brand-blue" },
      { label: "Hostel Allocation", value: currentStudent.allocation.hostel, icon: BedDouble, accent: "from-brand-peach to-brand-pink" },
      { label: "Mess Card Plan", value: currentStudent.allocation.messCard, icon: CreditCard, accent: "from-brand-lavender to-brand-pink" },
    ];
  }, [currentStudent]);

  function renderLoginScreen() {
    return (
      <section className="section-shell py-10">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-panel rounded-[2rem] p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-blue">Role-Based Access</p>
            <h2 className="mt-4 font-display text-4xl font-bold">Choose how you want to enter the university system</h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Admins manage allocations and campus operations, staff handle academic workflows, and students access personal services like dues, cards, hostel, library, notices, and results.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {roleOptions.map((item) => {
                const Icon = item.icon;
                const isActive = loginForm.role === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleQuickRoleSelect(item.key)}
                    className={`rounded-[1.75rem] border p-5 text-left transition ${
                      isActive
                        ? "border-brand-blue bg-brand-blue/10 shadow-lg"
                        : "border-slate-200/80 bg-white/70 hover:-translate-y-1 hover:border-brand-blue/30 dark:border-white/10 dark:bg-white/5"
                    }`}
                  >
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} text-white`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="mt-4 font-display text-xl font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.subtitle}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-8">
            <h3 className="font-display text-3xl font-bold">Login to UniSphere ERP</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">Use the demo credentials or edit them manually if you connect your own backend users.</p>
            <form className="mt-8 space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-300">Email</label>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-blue dark:border-white/10 dark:bg-white/5"
                  value={loginForm.email}
                  onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-300">Password</label>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-blue dark:border-white/10 dark:bg-white/5"
                  type="password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                />
              </div>
              {loginError ? <p className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-600">{loginError}</p> : null}
                <button
                  className="w-full rounded-full bg-brand-navy px-5 py-4 font-semibold text-white transition hover:bg-brand-blue disabled:cursor-not-allowed disabled:bg-slate-400"
                  type="submit"
                  disabled={isPortalLoading}
                >
                  {isAuthenticating ? "Signing In..." : "Continue to Dashboard"}
                </button>
              </form>
            <div className="mt-6 rounded-[1.5rem] bg-gradient-to-br from-brand-navy to-brand-lavender p-5 text-white">
              <p className="font-display text-xl font-bold">Quick Demo Credentials</p>
              <div className="mt-4 space-y-3">
                {demoCredentials.map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => handleQuickRoleSelect(item.role === "Staff" ? "teacher" : item.role.toLowerCase())}
                    className="flex w-full items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-left transition hover:bg-white/20"
                  >
                    <div>
                      <p className="font-semibold">{item.role}</p>
                      <p className="text-sm text-white/75">{item.email}</p>
                    </div>
                    <span className="text-sm text-white/75">{item.password}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  function renderOverview() {
    const titleMap = {
      admin: "University Control Center",
      teacher: "Faculty Operations Workspace",
      student: "Student Success Dashboard",
    };
    const subtitleMap = {
      admin: "Monitor campus operations, allocate services, review trends, and export university-level records.",
      teacher: "Track attendance, results, and announcements for academic execution.",
      student: "Review your academic progress, dues, service allocations, and important notices in one place.",
    };

    return (
      <>
        <div className="glass-panel rounded-[2rem] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-300">Welcome back</p>
              <h2 className="font-display text-3xl font-bold">{titleMap[auth.user.role] || "University Dashboard"}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{subtitleMap[auth.user.role]}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-3 rounded-full bg-white/80 px-4 py-3 dark:bg-white/5">
                <Search size={16} className="text-slate-400" />
                <input
                  className="w-52 bg-transparent text-sm outline-none"
                  placeholder="Search students, courses..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <a className="rounded-full bg-brand-blue px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-navy" href={EXPORT_PDF_URL} target="_blank" rel="noreferrer">
                <Download className="mr-2 inline" size={16} />
                Export PDF
              </a>
              <a className="rounded-full bg-brand-cyan px-4 py-3 text-sm font-semibold text-brand-navy transition hover:bg-brand-peach" href={EXPORT_EXCEL_URL} target="_blank" rel="noreferrer">
                <FileSpreadsheet className="mr-2 inline" size={16} />
                Export Excel
              </a>
              <button className="rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-900" onClick={() => setAuth(null)} type="button">
                <LogOut className="mr-2 inline" size={16} />
                Logout
              </button>
              <button className="rounded-full border border-slate-300 px-4 py-3 text-sm font-semibold dark:border-white/10" onClick={onExit} type="button">
                Exit Portal
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {dashboard.stats?.map((item, index) => (
            <StatCard key={item.label} item={item} index={index} />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <ChartCard
              title="Attendance Momentum"
              type="area"
              data={dashboard.attendanceTrend || []}
              description="This graph helps the university track how regularly students are attending classes across recent months. Admins and staff can quickly detect dips, intervene early, and plan support actions before performance drops."
            />
          </div>
          <ChartCard
            title="Grade Distribution"
            type="pie"
            data={dashboard.gradeDistribution || []}
            description="This graph shows the spread of student performance bands. It helps academic leaders understand overall learning quality and identify whether more students are clustering in top, mid, or risk categories."
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <ChartCard
            title="Fee Collection Status"
            type="bar"
            data={dashboard.feeTrend || []}
            description="This chart compares paid amounts versus pending balances. It is useful for finance teams to monitor collection efficiency and for students to understand what remains due in each term."
          />
          <div className="glass-panel rounded-[1.75rem] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-peach to-brand-pink text-white">
                <Bot size={22} />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold">AI Chatbot Support</h3>
                <p className="text-sm text-slate-500 dark:text-slate-300">Ask about fees, attendance, results, documents, or services</p>
              </div>
            </div>
            <div className="mt-5 rounded-3xl bg-slate-950 px-4 py-5 text-sm leading-7 text-white">{chatReply}</div>
            <div className="mt-4 flex gap-3">
              <input
                className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-white/5"
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
              />
              <button className="rounded-full bg-brand-cyan px-4 py-3 font-semibold text-brand-navy" onClick={handleAskChatbot} type="button">
                <SendHorizonal size={16} />
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  function renderAdminStudents() {
    return (
      <div className="grid gap-6">
        <div className="glass-panel rounded-[1.75rem] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-blue to-brand-lavender text-white">
              <UserPlus size={22} />
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold">Add Student</h3>
              <p className="text-sm text-slate-500 dark:text-slate-300">Admins can create new student accounts and academic profiles from here.</p>
            </div>
          </div>
          <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={handleCreateStudent}>
            <input
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-blue dark:border-white/10 dark:bg-white/5"
              placeholder="Student full name"
              value={studentForm.name}
              onChange={(event) => setStudentForm((current) => ({ ...current, name: event.target.value }))}
            />
            <input
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-blue dark:border-white/10 dark:bg-white/5"
              placeholder="Student email"
              value={studentForm.email}
              onChange={(event) => setStudentForm((current) => ({ ...current, email: event.target.value }))}
            />
            <input
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-blue dark:border-white/10 dark:bg-white/5"
              placeholder="Registration number"
              value={studentForm.registrationNumber}
              onChange={(event) => setStudentForm((current) => ({ ...current, registrationNumber: event.target.value }))}
            />
            <input
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-blue dark:border-white/10 dark:bg-white/5"
              placeholder="Program"
              value={studentForm.program}
              onChange={(event) => setStudentForm((current) => ({ ...current, program: event.target.value }))}
            />
            <input
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-blue dark:border-white/10 dark:bg-white/5"
              placeholder="Semester"
              type="number"
              value={studentForm.semester}
              onChange={(event) => setStudentForm((current) => ({ ...current, semester: event.target.value }))}
            />
            <input
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-blue dark:border-white/10 dark:bg-white/5"
              placeholder="Default password"
              value={studentForm.password}
              onChange={(event) => setStudentForm((current) => ({ ...current, password: event.target.value }))}
            />
            <div className="grid gap-4 sm:grid-cols-2 md:col-span-2">
              <input
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-blue dark:border-white/10 dark:bg-white/5"
                placeholder="Opening CGPA"
                type="number"
                step="0.01"
                value={studentForm.cgpa}
                onChange={(event) => setStudentForm((current) => ({ ...current, cgpa: event.target.value }))}
              />
              <input
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-blue dark:border-white/10 dark:bg-white/5"
                placeholder="Opening attendance %"
                type="number"
                step="0.1"
                value={studentForm.attendancePercentage}
                onChange={(event) => setStudentForm((current) => ({ ...current, attendancePercentage: event.target.value }))}
              />
            </div>
            <div className="md:col-span-2">
              {studentStatus ? <div className="mb-4 rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">{studentStatus}</div> : null}
              <button className="rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue" type="submit">
                Add Student
              </button>
            </div>
          </form>
        </div>
        <DataTable
          title="Student Management"
          columns={[
            { key: "name", label: "Student" },
            { key: "registrationNumber", label: "Registration" },
            { key: "program", label: "Program" },
            { key: "semester", label: "Semester" },
            { key: "cgpa", label: "CGPA" },
            { key: "attendancePercentage", label: "Attendance %" },
          ]}
          rows={filteredStudents}
        />
      </div>
    );
  }

  function renderAllocations() {
    return (
      <div className="grid gap-6">
        <div className="grid gap-5 lg:grid-cols-4">
          {[
            { title: "Hostel", text: "Allocate hostel rooms, change buildings, and monitor allotment statuses.", icon: BedDouble },
            { title: "Library", text: "Enable library borrowing and digital access based on student compliance.", icon: Library },
            { title: "Mess Card", text: "Assign meal plans and update card privileges by residence or category.", icon: CreditCard },
            { title: "ID Cards", text: "Issue, reprint, and renew smart campus identity cards.", icon: IdCard },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="glass-panel rounded-[1.75rem] p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-blue to-brand-cyan text-white">
                  <Icon size={22} />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">{card.title} Allocation</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{card.text}</p>
              </div>
            );
          })}
        </div>
        <div className="glass-panel rounded-[1.75rem] p-5">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-display text-xl font-semibold">Student Service Allocation Board</h3>
            <p className="text-sm text-slate-500 dark:text-slate-300">Click the action buttons to simulate resource allocation updates</p>
          </div>
          <div className="space-y-4">
            {allocations.map((row) => (
              <div key={row.studentName} className="rounded-[1.5rem] border border-slate-200/70 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <h4 className="font-display text-xl font-semibold">{row.studentName}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-300">{row.registrationNumber}</p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {[
                      { key: "hostel", label: "Hostel" },
                      { key: "library", label: "Library" },
                      { key: "messCard", label: "Mess Card" },
                      { key: "idCard", label: "ID Card" },
                    ].map((field) => (
                      <div key={field.key} className="rounded-2xl bg-slate-100/80 px-4 py-3 dark:bg-slate-900/60">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{field.label}</p>
                        <p className="mt-1 text-sm font-medium">{row[field.key]}</p>
                        <button
                          className="mt-3 rounded-full bg-brand-navy px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-blue"
                          onClick={() => updateAllocation(row.studentName, field.key)}
                          type="button"
                        >
                          Update {field.label}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderFees() {
    const feeRows = auth.user.role === "student" ? currentStudent?.feeRows || [] : fees;
    return (
      <div className="grid gap-6">
        {auth.user.role === "student" ? (
          <div className="grid gap-5 md:grid-cols-3">
            <div className="glass-panel rounded-[1.75rem] p-5">
              <p className="text-sm text-slate-500 dark:text-slate-300">Current Semester Fee</p>
              <p className="mt-3 font-display text-3xl font-bold">${feeRows[0]?.totalAmount || 4800}</p>
            </div>
            <div className="glass-panel rounded-[1.75rem] p-5">
              <p className="text-sm text-slate-500 dark:text-slate-300">Paid So Far</p>
              <p className="mt-3 font-display text-3xl font-bold text-emerald-600">${feeRows[0]?.paidAmount || 3600}</p>
            </div>
            <div className="glass-panel rounded-[1.75rem] p-5">
              <p className="text-sm text-slate-500 dark:text-slate-300">Pending Dues</p>
              <p className="mt-3 font-display text-3xl font-bold text-amber-600">${feeRows[0]?.balance || 1200}</p>
            </div>
          </div>
        ) : null}
        <DataTable
          title={auth.user.role === "student" ? "My Fee Structure and Dues" : "Fee Management"}
          columns={[
            ...(auth.user.role === "student" ? [] : [{ key: "studentName", label: "Student" }]),
            { key: "semesterLabel", label: "Semester" },
            { key: "totalAmount", label: "Total" },
            { key: "paidAmount", label: "Paid" },
            { key: "balance", label: "Balance" },
            { key: "status", label: "Status" },
          ]}
          rows={feeRows}
        />
      </div>
    );
  }

  function renderTeacherAttendanceSection() {
    return (
      <div className="grid gap-6">
        <div className="glass-panel rounded-[1.75rem] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-blue to-brand-cyan text-white">
              <Users size={22} />
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold">Add Attendance</h3>
              <p className="text-sm text-slate-500 dark:text-slate-300">Professors can mark present classes and publish updated attendance records here.</p>
            </div>
          </div>
          <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={handleCreateAttendance}>
            <input
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-blue dark:border-white/10 dark:bg-white/5"
              placeholder="Student name"
              value={attendanceForm.studentName}
              onChange={(event) => setAttendanceForm((current) => ({ ...current, studentName: event.target.value }))}
            />
            <input
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-blue dark:border-white/10 dark:bg-white/5"
              placeholder="Course title"
              value={attendanceForm.course}
              onChange={(event) => setAttendanceForm((current) => ({ ...current, course: event.target.value }))}
            />
            <input
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-blue dark:border-white/10 dark:bg-white/5"
              placeholder="Month"
              value={attendanceForm.month}
              onChange={(event) => setAttendanceForm((current) => ({ ...current, month: event.target.value }))}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-blue dark:border-white/10 dark:bg-white/5"
                placeholder="Present"
                type="number"
                value={attendanceForm.present}
                onChange={(event) => setAttendanceForm((current) => ({ ...current, present: event.target.value }))}
              />
              <input
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-blue dark:border-white/10 dark:bg-white/5"
                placeholder="Total"
                type="number"
                value={attendanceForm.total}
                onChange={(event) => setAttendanceForm((current) => ({ ...current, total: event.target.value }))}
              />
            </div>
            <div className="md:col-span-2">
              {staffStatus ? <div className="mb-4 rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">{staffStatus}</div> : null}
              <button className="rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue" type="submit">
                Add Attendance Record
              </button>
            </div>
          </form>
        </div>
        <DataTable
          title="Attendance Review"
          columns={[
            { key: "studentName", label: "Student" },
            { key: "course", label: "Course" },
            { key: "present", label: "Present" },
            { key: "total", label: "Total" },
            { key: "percentage", label: "Percentage" },
          ]}
          rows={attendance}
        />
      </div>
    );
  }

  function renderTeacherResultsSection() {
    return (
      <div className="grid gap-6">
        <div className="glass-panel rounded-[1.75rem] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-lavender to-brand-pink text-white">
              <SquarePen size={22} />
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold">Publish Result</h3>
              <p className="text-sm text-slate-500 dark:text-slate-300">Professors can add exam results and grades for students from this section.</p>
            </div>
          </div>
          <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={handleCreateResult}>
            <input
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-blue dark:border-white/10 dark:bg-white/5"
              placeholder="Student name"
              value={resultForm.studentName}
              onChange={(event) => setResultForm((current) => ({ ...current, studentName: event.target.value }))}
            />
            <input
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-blue dark:border-white/10 dark:bg-white/5"
              placeholder="Course title"
              value={resultForm.course}
              onChange={(event) => setResultForm((current) => ({ ...current, course: event.target.value }))}
            />
            <input
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-blue dark:border-white/10 dark:bg-white/5"
              placeholder="Exam name"
              value={resultForm.examName}
              onChange={(event) => setResultForm((current) => ({ ...current, examName: event.target.value }))}
            />
            <input
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-blue dark:border-white/10 dark:bg-white/5"
              placeholder="Marks"
              type="number"
              value={resultForm.marks}
              onChange={(event) => setResultForm((current) => ({ ...current, marks: event.target.value }))}
            />
            <input
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-blue dark:border-white/10 dark:bg-white/5 md:col-span-2"
              placeholder="Grade"
              value={resultForm.grade}
              onChange={(event) => setResultForm((current) => ({ ...current, grade: event.target.value }))}
            />
            <div className="md:col-span-2">
              {staffStatus ? <div className="mb-4 rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">{staffStatus}</div> : null}
              <button className="rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue" type="submit">
                Publish Result
              </button>
            </div>
          </form>
        </div>
        <DataTable
          title="Result Processing Queue"
          columns={[
            { key: "studentName", label: "Student" },
            { key: "course", label: "Course" },
            { key: "examName", label: "Exam" },
            { key: "marks", label: "Marks" },
            { key: "grade", label: "Grade" },
          ]}
          rows={results}
        />
      </div>
    );
  }

  function renderResults() {
    const resultRows = auth.user.role === "student" ? currentStudent?.resultRows || [] : results;
    const attendanceRows = auth.user.role === "student" ? currentStudent?.attendanceRows || [] : attendance;
    return (
      <div className="grid gap-6 xl:grid-cols-2">
        <DataTable
          title={auth.user.role === "teacher" ? "Result Processing Queue" : auth.user.role === "student" ? "My Results" : "Result Processing"}
          columns={[
            ...(auth.user.role === "student" ? [] : [{ key: "studentName", label: "Student" }]),
            { key: "course", label: "Course" },
            { key: "examName", label: "Exam" },
            { key: "marks", label: "Marks" },
            { key: "grade", label: "Grade" },
          ]}
          rows={resultRows}
        />
        <DataTable
          title={auth.user.role === "teacher" ? "Attendance Review" : auth.user.role === "student" ? "My Attendance" : "Attendance Records"}
          columns={[
            ...(auth.user.role === "student" ? [] : [{ key: "studentName", label: "Student" }]),
            { key: "course", label: "Course" },
            { key: "present", label: "Present" },
            { key: "total", label: "Total" },
            { key: "percentage", label: "Percentage" },
          ]}
          rows={attendanceRows}
        />
      </div>
    );
  }

  function renderServices() {
    return (
      <div className="grid gap-6">
        <div className="grid gap-5 lg:grid-cols-4">
          {personalizedServices.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="glass-panel rounded-[1.75rem] p-5">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} text-white`}>
                  <Icon size={22} />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{item.label}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.value}</p>
              </div>
            );
          })}
        </div>
        <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <div className="glass-panel rounded-[1.75rem] p-5">
            <h3 className="font-display text-xl font-semibold">Student Identity and Campus Access</h3>
            <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-slate-200/70 dark:border-white/10">
              <div className="bg-gradient-to-r from-brand-navy to-brand-blue p-5 text-white">
                <p className="text-sm text-white/70">International University ID</p>
                <p className="mt-1 font-display text-2xl font-bold">{currentStudent?.name || "Maya Rodriguez"}</p>
                <p className="text-sm text-white/75">{currentStudent?.registrationNumber || "UNI-2026-1042"}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-semibold tracking-[0.2em]">
                    CARD CODE: {currentStudent?.allocation?.cardCode || "UNI-CARD-1042-AI"}
                  </span>
                  <button
                    className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-navy transition hover:bg-brand-cyan"
                    onClick={() => window.print()}
                    type="button"
                  >
                    <Printer className="mr-2 inline" size={16} />
                    Print Card
                  </button>
                </div>
              </div>
              <div className="grid gap-4 p-5 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Program</p>
                  <p className="mt-1 font-medium">{currentStudent?.program || "B.Tech AI & Data Science"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Semester</p>
                  <p className="mt-1 font-medium">{currentStudent?.semester || 6}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Library</p>
                  <p className="mt-1 font-medium">{currentStudent?.allocation?.library || "Activated"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Mess Card</p>
                  <p className="mt-1 font-medium">{currentStudent?.allocation?.messCard || "Gold Vegetarian"}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="glass-panel rounded-[1.75rem] p-5">
            <h3 className="font-display text-xl font-semibold">Self-Service Quick Actions</h3>
            <div className="mt-4 space-y-3">
              {[
                "Download fee receipt PDF",
                "View hostel and room assignment",
                "Check ID card and library activation",
                "Review dues before payment deadline",
                "Open AI help for academic or finance support",
              ].map((line) => (
                <div key={line} className="rounded-2xl bg-slate-100/80 px-4 py-4 text-sm leading-7 dark:bg-slate-900/60">
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderAnnouncements() {
    return (
      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <div className="glass-panel rounded-[1.75rem] p-5">
          <h3 className="font-display text-xl font-semibold">Notices and University Events</h3>
          <div className="mt-5 space-y-4">
            {notices.map((item, index) => (
              <div key={`${item.title}-${index}`} className="rounded-[1.5rem] border border-slate-200/70 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-lg font-semibold">{item.title}</h4>
                  <span className="rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue">{item.category}</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel rounded-[1.75rem] p-5">
          {auth.user.role === "admin" ? (
            <>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-blue to-brand-lavender text-white">
                  <BellPlus size={22} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold">Push New Notification</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-300">Post a fresh notice from admin and show it on the public landing page notification wall.</p>
                </div>
              </div>
              <form className="mt-5 space-y-4" onSubmit={handleCreateNotice}>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-blue dark:border-white/10 dark:bg-white/5"
                  placeholder="Notification title"
                  value={noticeForm.title}
                  onChange={(event) => setNoticeForm((current) => ({ ...current, title: event.target.value }))}
                />
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-blue dark:border-white/10 dark:bg-white/5"
                  placeholder="Category"
                  value={noticeForm.category}
                  onChange={(event) => setNoticeForm((current) => ({ ...current, category: event.target.value }))}
                />
                <textarea
                  className="min-h-36 w-full rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-blue dark:border-white/10 dark:bg-white/5"
                  placeholder="Type the notification content here"
                  value={noticeForm.content}
                  onChange={(event) => setNoticeForm((current) => ({ ...current, content: event.target.value }))}
                />
                {noticeStatus ? <div className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">{noticeStatus}</div> : null}
                <button className="rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue" type="submit">
                  Push Notification
                </button>
              </form>
            </>
          ) : (
            <>
              <h3 className="font-display text-xl font-semibold">Why These Modules Matter</h3>
              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                <div className="rounded-2xl bg-slate-100/80 p-4 dark:bg-slate-900/60">
                  Attendance charts help identify at-risk students early so staff can intervene before grades fall.
                </div>
                <div className="rounded-2xl bg-slate-100/80 p-4 dark:bg-slate-900/60">
                  Fee and dues views keep finance teams and students aligned on pending balances and payment timelines.
                </div>
                <div className="rounded-2xl bg-slate-100/80 p-4 dark:bg-slate-900/60">
                  Allocation boards make hostel, mess card, library, and ID workflows visible instead of scattered across departments.
                </div>
                <div className="rounded-2xl bg-slate-100/80 p-4 dark:bg-slate-900/60">
                  Export tools generate printable PDF and spreadsheet records for academic meetings, audits, and operational reviews.
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  function renderSection() {
    if (activeSection === "overview") return renderOverview();
    if (activeSection === "students") return renderAdminStudents();
    if (activeSection === "allocations") return renderAllocations();
    if (activeSection === "fees") return renderFees();
    if (auth.user.role === "teacher" && activeSection === "attendance") return renderTeacherAttendanceSection();
    if (auth.user.role === "teacher" && activeSection === "results") return renderTeacherResultsSection();
    if (activeSection === "results" || activeSection === "attendance") return renderResults();
    if (activeSection === "services") return renderServices();
    if (activeSection === "announcements") return renderAnnouncements();
    return renderOverview();
  }

  if (!auth) {
    return (
      <>
        {isPortalLoading ? <LoadingOverlay /> : null}
        {renderLoginScreen()}
      </>
    );
  }

  return (
      <>
        {isPortalLoading ? <LoadingOverlay /> : null}
        <section className="section-shell py-8">
        <div className="grid gap-6 xl:grid-cols-[290px_1fr]">
          <Sidebar user={auth.user} items={sidebarItems} activeItem={activeSection} onSelect={setActiveSection} />
          <div className="space-y-6">
          <div className="glass-panel flex flex-col gap-4 rounded-[1.5rem] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-300">Signed in session</p>
              <p className="font-display text-2xl font-bold">{auth.user.name}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-900" onClick={() => setAuth(null)} type="button">
                <LogOut className="mr-2 inline" size={16} />
                Logout
              </button>
              <button className="rounded-full border border-slate-300 px-4 py-3 text-sm font-semibold dark:border-white/10" onClick={onExit} type="button">
                Exit Portal
              </button>
            </div>
          </div>
          {renderSection()}
          </div>
        </div>
        </section>
      </>
    );
}
