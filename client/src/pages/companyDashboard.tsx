import React, { useEffect, useState } from "react";
import { Line, Pie, Doughnut, Bar } from "react-chartjs-2";
import { motion, AnimatePresence } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { API_URL } from "../App";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);



// Vision UI themed Card Component
const StatCard = ({ value, label, icon, trend }: { value: number | string; label: string; icon: string; trend?: { value: number; isPositive: boolean } }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-[#ffffff10] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-6 flex items-center justify-between"
  >
    <div>
      <div className="text-3xl font-bold bg-gradient-to-r from-[#0075ff] to-[#00a3ff] bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-gray-400 mt-1">{label}</div>
      {trend && (
        <div className={`text-sm mt-2 ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {trend.isPositive ? '↑' : '↓'} {trend.value}%
        </div>
      )}
    </div>
    <div className="text-4xl opacity-70">{icon}</div>
  </motion.div>
);

// Vision UI themed Notification Component
const NotificationItem = ({ message, time }: { message: string; time: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[#ffffff10] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-4 mb-4"
  >
    <div className="text-white">{message}</div>
    <div className="text-sm text-gray-400 mt-2">{time}</div>
  </motion.div>
);

const CompanyDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    contests: 0,
    quizzes: 0,
    recruitmentDrives: 0,
    unverifiedUsers: 0,
    companies: 0,
  });
  const [unverifiedUserAlert, setUnverifiedUserAlert] = useState<{ _id: string; name: string; collegeYear: string }[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          authorization: `BEARER ${localStorage.getItem("token")}`,
        };

        // Fetch all data concurrently
        const [usersRes, contestsRes, quizzesRes, recruitmentsRes, unverifiedRes] = await Promise.all([
          fetch(`${API_URL}api/community/users`, { headers }),
          fetch(`${API_URL}api/community/contest`, { headers }),
          fetch(`${API_URL}api/community/quizzes`, { headers }),
          fetch(`${API_URL}api/community/recruitment/all`, { headers }),
          fetch(`${API_URL}api/community/unverified-users`, { headers }),
        ]);

        // Parse responses
        const [usersData, contestsData, quizzesData, recruitmentsData, unverifiedUsersData] = await Promise.all([
          usersRes.json(),
          contestsRes.json(),
          quizzesRes.json(),
          recruitmentsRes.json(),
          unverifiedRes.json(),
        ]);

        setStats({
          users: Array.isArray(usersData.users) ? usersData.users.length : 0,
          contests: Array.isArray(contestsData.data) ? contestsData.data.length : 0,
          quizzes: Array.isArray(quizzesData.quizzes) ? quizzesData.quizzes.length : 0,
          recruitmentDrives: Array.isArray(recruitmentsData) ? recruitmentsData.length : 0,
          unverifiedUsers: Array.isArray(unverifiedUsersData.unverifiedUsers)
            ? unverifiedUsersData.unverifiedUsers.length
            : 0,
          companies: new Set(recruitmentsData.map((r: { company_id: string }) => r.company_id)).size,
        });

        setUnverifiedUserAlert(unverifiedUsersData.unverifiedUsers || []);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Active Users",
        data: [200, 250, 300, 350, 400, 450, 500, 450, 400, 350, 300, 400],
        borderColor: "#0075ff",
        backgroundColor: "rgba(0, 117, 255, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: "Total Users",
        data: [300, 350, 400, 450, 500, 550, 600, 550, 500, 450, 400, 500],
        borderColor: "#00d5ff",
        backgroundColor: "rgba(0, 213, 255, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };

  const barChartData = {
    labels: ["M", "T", "W", "T", "F", "S", "S"],
    datasets: [{
      label: "Active Users",
      data: [300, 220, 100, 280, 500, 320, 400],
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      borderRadius: 6,
    }],
  };

  const pieChartData = {
    labels: ["Active", "Completed", "Upcoming"],
    datasets: [{
      data: [30, 50, 20],
      backgroundColor: [
        "rgba(0, 117, 255, 0.8)",
        "rgba(0, 213, 255, 0.8)",
        "rgba(255, 0, 128, 0.8)",
      ],
      borderColor: [
        "#0075ff",
        "#00d5ff",
        "#ff0080",
      ],
      borderWidth: 2,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#fff",
        borderWidth: 1,
        padding: 10,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
          font: {
            family: "Inter, sans-serif",
          },
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
          font: {
            family: "Inter, sans-serif",
          },
        },
      },
    },
  };

  return (
    <div className="flex min-h-screen bg-[#0f1535] text-white font-['Inter']">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 bg-gradient-to-b from-[#0f1535] to-[#111c44] backdrop-blur-xl border-r border-[#ffffff10] p-6"
      >
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#0075ff] to-[#00a3ff] bg-clip-text text-transparent">
            MLVTEC
          </h1>
        </div>
        <nav className="space-y-2">
          {[
            { id: "dashboard", label: "Dashboard", icon: "📊" },
            { id: "leaderboard", label: "Leaderboard", icon: "🏆" },
            { id: "contests", label: "Contests", icon: "🎯" },
            { id: "quizzes", label: "Quizzes", icon: "❓" },
            { id: "marketplace", label: "Marketplace", icon: "🏪" },
            { id: "wallet", label: "Wallet", icon: "💰" },
            { id: "notifications", label: "Notifications", icon: "🔔" },
          ].map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ x: 5, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                activeTab === item.id ? 'bg-gradient-to-r from-[#0075ff] to-[#00a3ff] text-white' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </motion.div>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-hidden bg-gradient-to-br from-[#0f1535] to-[#111c44]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <div className="flex space-x-4 items-center">
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              placeholder="Search..."
              className="bg-[#ffffff10] border border-[#ffffff20] p-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#0075ff] transition-all duration-300"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-[#0075ff] to-[#00a3ff] px-6 py-3 rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300"
            >
              + Add New
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <StatCard value={stats.users} label="Total Users" icon="👥" trend={{ value: 12, isPositive: true }} />
          <StatCard value={stats.unverifiedUsers} label="Unverified Users" icon="⚠️" trend={{ value: 5, isPositive: false }} />
          <StatCard value={stats.companies} label="Companies" icon="🏢" trend={{ value: 8, isPositive: true }} />
          <StatCard value={stats.recruitmentDrives} label="Recruitment Drives" icon="📋" trend={{ value: 15, isPositive: true }} />
          <StatCard value={stats.contests} label="Contests" icon="🎯" trend={{ value: 10, isPositive: true }} />
          <StatCard value={stats.quizzes} label="Quizzes" icon="📝" trend={{ value: 7, isPositive: true }} />
        </div>

        {/* Platform Statistics */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#0f1535] to-[#111c44] p-6 rounded-xl border border-[#ffffff10] backdrop-blur-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Sales Overview</h2>
                  <p className="text-green-400">+5% more in 2024</p>
                </div>
              </div>
              <div style={{ height: "300px" }}>
                <Line data={lineChartData} options={chartOptions} />
              </div>
            </motion.div>
          </div>
          <div className="col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#0f1535] to-[#111c44] p-6 rounded-xl border border-[#ffffff10] backdrop-blur-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Active Users</h2>
                  <p className="text-green-400">(+23) than last week</p>
                </div>
              </div>
              <div style={{ height: "300px" }}>
                <Bar data={barChartData} options={chartOptions} />
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-400">👥</span>
                    <span>Users</span>
                  </div>
                  <span className="font-bold">32,984</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">🎯</span>
                    <span>Clicks</span>
                  </div>
                  <span className="font-bold">2.42M</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-purple-400">💰</span>
                    <span>Sales</span>
                  </div>
                  <span className="font-bold">$2,400</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400">📦</span>
                    <span>Items</span>
                  </div>
                  <span className="font-bold">320</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Alerts Section */}
        <AnimatePresence>
          {unverifiedUserAlert.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-br from-[#0f1535] to-[#111c44] p-6 rounded-xl border border-[#ffffff10] backdrop-blur-xl cursor-pointer hover:border-[#ffffff30] transition-all duration-300"
              onClick={() => window.location.href = "/community/verification"}
            >
              <h3 className="text-xl font-bold mb-4 text-white">Unverified Users Alert</h3>
              <ul className="space-y-3">
                {unverifiedUserAlert.map((user) => (
                  <motion.li
                    key={user._id}
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-3 bg-[#ffffff10] p-3 rounded-xl"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#0075ff] flex items-center justify-center">
                      👤
                    </div>
                    <span className="text-white">{user.name}</span>
                    <span className="text-gray-400">(Year: {user.collegeYear})</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default CompanyDashboard;
