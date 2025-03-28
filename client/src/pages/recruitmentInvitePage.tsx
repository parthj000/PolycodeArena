import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const RecruitmentInvite: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const navigate = useNavigate();
  const { recruitment_id } = useParams<{ recruitment_id: string }>();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}api/community/users`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(`Failed to fetch users: ${errorData.message}`);
          return;
        }

        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("An error occurred while fetching users.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleInvite = async (userId: string) => {
    if (!recruitment_id) {
      setError("Recruitment ID is missing.");
      return;
    }

    try {
      // First, get the recruitment drive details
      const driveResponse = await fetch(
        `${API_URL}api/community/recruitment/${recruitment_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!driveResponse.ok) {
        throw new Error("Failed to fetch recruitment drive details");
      }

      const driveData = await driveResponse.json();
      const driveName = driveData.recruitmentDrive.meta.drive_name;
      const companyId = driveData.recruitmentDrive.meta.company_id;
      const invitationCode = driveData.recruitmentDrive.meta.invitation_code;

      // Send the invite request
      const response = await fetch(
        `${API_URL}api/community/recruitment/${recruitment_id}/inviteusers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ 
            user_ids: [userId],
            email: users.find(u => u._id === userId)?.email,
            username: users.find(u => u._id === userId)?.name,
            company_name: companyId,
            drive_name: driveName,
            invitation_code: invitationCode
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Failed to invite user: ${errorData.message}`);
        return;
      }

      const data = await response.json();
      if (data.emailSent) {
        setSuccess("User successfully invited and email notification sent!");
      } else {
        setSuccess("User invited successfully, but email notification could not be sent.");
      }
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error inviting user:", err);
      setError("An error occurred while inviting the user.");
    }
  };

  const toggleUserDetails = (userId: string) => {
    setExpandedUserId((prevId) => (prevId === userId ? null : userId));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery.toLowerCase() === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = selectedTag === 'all' || user.tag === selectedTag;
    
    return matchesSearch && matchesTag;
  });

  const uniqueTags = ["all", ...Array.from(new Set(users.map(user => user.tag)))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1535] to-[#111c44] p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#0f1535] to-[#111c44] p-8 rounded-xl border border-[#ffffff10] backdrop-blur-xl mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent">
            Invite Users
          </h1>
          <p className="text-gray-400 mt-2">Select users to invite to the recruitment drive</p>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-[#ffffff10] rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-xl">
                  👥
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Users</p>
                  <p className="text-white font-medium">{users.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-[#ffffff10] rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-xl">
                  🎯
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Filtered Users</p>
                  <p className="text-white font-medium">{filteredUsers.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-[#ffffff10] rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-xl">
                  🏷️
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Available Tags</p>
                  <p className="text-white font-medium">{uniqueTags.length - 1}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#0f1535] to-[#111c44] p-6 rounded-xl border border-[#ffffff10] backdrop-blur-xl mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
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
          </div>
        </motion.div>

        {/* Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-500/20 text-red-400 p-4 rounded-xl mb-6 border border-red-500/20"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-500/20 text-green-400 p-4 rounded-xl mb-6 border border-green-500/20"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* User List */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-64 space-y-4"
          >
            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-indigo-400">Loading users...</p>
          </motion.div>
        ) : (
          <div className="bg-gradient-to-br from-[#0f1535] to-[#111c44] rounded-xl border border-[#ffffff10] backdrop-blur-xl overflow-hidden">
            <div className="p-6">
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredUsers.map((user, index) => (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-[#ffffff10] rounded-xl overflow-hidden hover:bg-[#ffffff15] transition-all duration-300"
                    >
                      <div className="p-6 cursor-pointer" onClick={() => toggleUserDetails(user._id)}>
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          <div className="flex items-center space-x-4 flex-1">
                            <motion.div 
                              className="w-12 h-12 rounded-xl overflow-hidden bg-indigo-500/20"
                              whileHover={{ scale: 1.1 }}
                            >
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
                            </motion.div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent">
                                {user.name}
                              </h3>
                              <p className="text-gray-400 text-sm">{user.email}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex items-center space-x-2 bg-indigo-500/10 px-3 py-1 rounded-full">
                              <span className="text-indigo-400">Tag:</span>
                              <span className="text-white">{user.tag}</span>
                            </div>
                            <motion.button
                              whileHover={{ 
                                scale: 1.05,
                                boxShadow: "0 8px 30px rgba(99, 102, 241, 0.2)"
                              }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInvite(user._id);
                              }}
                              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-xl text-white font-medium transition-all duration-300 flex items-center space-x-2"
                            >
                              <span>Invite</span>
                              <span>→</span>
                            </motion.button>
                          </div>
                        </div>

                        <AnimatePresence>
                          {expandedUserId === user._id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 space-y-4"
                            >
                              <div className="bg-[#ffffff08] rounded-xl p-4">
                                <p className="text-gray-400">
                                  <span className="text-indigo-400 font-medium">Description:</span>{" "}
                                  {user.description}
                                </p>
                              </div>
                              <div className="flex gap-4">
                                {user.resume_url && (
                                  <motion.a
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    href={user.resume_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-[#ffffff10] rounded-xl text-indigo-400 hover:bg-[#ffffff15] transition-all duration-300"
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
                                    className="px-4 py-2 bg-[#ffffff10] rounded-xl text-indigo-400 hover:bg-[#ffffff15] transition-all duration-300"
                                  >
                                    View Certificates
                                  </motion.a>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
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

export default RecruitmentInvite;
