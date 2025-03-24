import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../App";

interface User {
  _id: string;
  name: string;
  email: string;
  wallet_id: string;
  resume_url: string;
  description: string;
  tag: string;
  profile_pic: string;
  certificates: string;
}

interface Wallet {
  current_balance: number;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [walletBalances, setWalletBalances] = useState<{ [key: string]: number }>({});
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/wallet/users`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data.users);
        setFilteredUsers(data.users);
        fetchWalletBalances(data.users);
      } catch (err) {
        setError("Error fetching user data.");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchWalletBalances = async (users: User[]) => {
      const balances: { [key: string]: number } = {};

      await Promise.all(
        users.map(async (user) => {
          if (user.wallet_id) {
            try {
              const response = await fetch(`${API_URL}/api/wallet/${user.wallet_id}`, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              });

              if (response.ok) {
                const walletData: { data: Wallet } = await response.json();
                balances[user._id] = walletData.data.current_balance;
              } else {
                balances[user._id] = 0;
              }
            } catch {
              balances[user._id] = 0;
            }
          } else {
            balances[user._id] = 0;
          }
        })
      );

      setWalletBalances(balances);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = [...users];
    
    if (selectedTag !== "all") {
      filtered = filtered.filter(user => user.tag === selectedTag);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredUsers(filtered);
  }, [selectedTag, searchQuery, users]);

  const toggleUser = (id: string) => {
    setSelectedUser(selectedUser === id ? null : id);
  };

  const uniqueTags = ["all", ...Array.from(new Set(users.map(user => user.tag)))];

  // Sort users by wallet balance
  const sortedUsers = [...filteredUsers].sort((a, b) => 
    (walletBalances[b._id] || 0) - (walletBalances[a._id] || 0)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1535] to-[#111c44] p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Animated Background Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="fixed inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)",
            zIndex: 0
          }}
        />

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#0f1535] to-[#111c44] p-6 rounded-xl border border-[#ffffff10] backdrop-blur-xl hover:border-indigo-500/30 transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl">
                👥
              </div>
              <div>
                <p className="text-gray-400">Total Users</p>
                <motion.h3 
                  className="text-2xl font-bold text-white"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {filteredUsers.length}
                </motion.h3>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#0f1535] to-[#111c44] p-6 rounded-xl border border-[#ffffff10] backdrop-blur-xl hover:border-green-500/30 transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-2xl">
                💰
              </div>
              <div>
                <p className="text-gray-400">Total Balance</p>
                <motion.h3 
                  className="text-2xl font-bold text-white"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  ${Object.values(walletBalances).reduce((a, b) => a + b, 0)}
                </motion.h3>
              </div>
            </div>
          </motion.div>

            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#0f1535] to-[#111c44] p-6 rounded-xl border border-[#ffffff10] backdrop-blur-xl hover:border-purple-500/30 transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-2xl">
                📄
              </div>
              <div>
                <p className="text-gray-400">Total Documents</p>
                <motion.h3 
                  className="text-2xl font-bold text-white"
                  initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
                >
                  {filteredUsers.filter(u => u.resume_url || u.certificates).length}
                </motion.h3>
              </div>
            </div>
          </motion.div>

                <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#0f1535] to-[#111c44] p-6 rounded-xl border border-[#ffffff10] backdrop-blur-xl hover:border-yellow-500/30 transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center text-2xl">
                ⭐
              </div>
              <div>
                <p className="text-gray-400">Average Score</p>
                <motion.h3 
                  className="text-2xl font-bold text-white"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {Math.round(Object.values(walletBalances).reduce((a, b) => a + b, 0) / filteredUsers.length || 0)}
                </motion.h3>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filter Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-wrap gap-4 items-center"
        >
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-[#ffffff10] border border-[#ffffff20] text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {uniqueTags.map((tag) => (
              <motion.button
                key={tag}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-xl border ${
                  selectedTag === tag
                    ? "bg-indigo-500/20 border-indigo-500/50 text-white"
                    : "bg-[#ffffff10] border-[#ffffff20] text-gray-400"
                } transition-all duration-300`}
              >
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* User List */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-500/20 text-red-400 p-4 rounded-xl mb-6"
          >
            {error}
          </motion.div>
        )}

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center h-64"
          >
            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          </motion.div>
        ) : (
          <div className="bg-gradient-to-br from-[#0f1535] to-[#111c44] rounded-xl border border-[#ffffff10] backdrop-blur-xl overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">User Management</h2>
              <div className="space-y-4">
                <AnimatePresence>
                  {sortedUsers.map((user, index) => (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-[#ffffff10] rounded-xl overflow-hidden hover:bg-[#ffffff15] transition-all duration-300"
                    >
                      <div
                        className="p-4 cursor-pointer flex items-center justify-between"
                        onClick={() => toggleUser(user._id)}
                      >
                        <div className="flex items-center space-x-4">
                          <motion.div 
                            className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-semibold"
                            whileHover={{ scale: 1.1 }}
                          >
                            #{index + 1}
                          </motion.div>
                          <div className="w-12 h-12 rounded-xl bg-[#ffffff20] overflow-hidden">
                            {user.profile_pic ? (
                  <img
                    src={user.profile_pic}
                    alt={user.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-2xl">
                                👤
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{user.name}</h3>
                            <p className="text-sm text-gray-400">{user.email}</p>
                          </div>
                          <span className="ml-4 px-3 py-1 rounded-full text-xs bg-indigo-500/20 text-indigo-400">
                            {user.tag}
                          </span>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <p className="text-sm text-gray-400">Balance</p>
                            <p className="font-semibold text-white">${walletBalances[user._id] || 0}</p>
                          </div>
                          <motion.button 
                            className="text-indigo-400 hover:text-indigo-300 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {selectedUser === user._id ? "▼" : "▶"}
                          </motion.button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {selectedUser === user._id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-[#ffffff20]"
                          >
                            <div className="p-4 space-y-3">
                              <p><span className="text-gray-400">Tag:</span> <span className="text-white">{user.tag}</span></p>
                              <p><span className="text-gray-400">Description:</span> <span className="text-white">{user.description}</span></p>
                              <div className="flex space-x-4">
                                {user.resume_url && (
                                  <motion.a
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    href={user.resume_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                                  >
                                    View Resume
                                  </motion.a>
                                )}
                                {user.certificates && (
                                  <motion.a
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    href={user.certificates}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                                  >
                                    View Certificates
                                  </motion.a>
                                )}
                              </div>
                            </div>
                </motion.div>
              )}
                      </AnimatePresence>
            </motion.div>
          ))}
                </AnimatePresence>
              </div>
            </div>
      </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;