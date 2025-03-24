import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { API_URL } from "../App";
import { motion, AnimatePresence } from "framer-motion";

interface User {
  _id: string;
  name: string;
  email: string;
  collegeYear: string;
  cgpa: string;
  wallet_id: string;
}

const UnverifiedUsersDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rejectedUsers, setRejectedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUnverifiedUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/community/unverified-users`, {
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
        setUsers(data.unverifiedUsers);
      } catch (err) {
        console.error("Error fetching unverified users:", err);
        setError("An error occurred while fetching users.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnverifiedUsers();
  }, []);

  const handleVerify = async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/community/verify-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Failed to verify user: ${errorData.message}`);
        return;
      }

      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      console.error("Error verifying user:", err);
      setError("An error occurred while verifying the user.");
    }
  };

  const toggleExpand = (userId: string) => {
    setExpandedUserId((prevId) => (prevId === userId ? null : userId));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const excelData: User[] = XLSX.utils.sheet_to_json(sheet);

      validateUsers(excelData);
    };
    reader.readAsArrayBuffer(file);
  };

  const validateUsers = (excelUsers: User[]) => {
    const matchedUsers: User[] = [];
    const rejectedUsers: User[] = [];

    users.forEach((user) => {
      const match = excelUsers.find(
        (excelUser) =>
          excelUser.email === user.email &&
          excelUser.name === user.name &&
          excelUser.collegeYear === user.collegeYear &&
          excelUser.cgpa === user.cgpa
      );

      if (match) {
        matchedUsers.push(user);
      } else {
        rejectedUsers.push(user);
      }
    });

    setUsers(matchedUsers);
    setRejectedUsers(rejectedUsers);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1535] to-[#111c44] p-8 font-['Inter']">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-lg mb-4"
            >
              {error}
            </motion.div>
          )}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-[#0075ff] to-[#00a3ff] bg-clip-text text-transparent"
          >
            Unverified Users
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#ffffff10] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-8 mb-8"
        >
          <label className="block text-white text-lg font-medium mb-4">
            Upload Verification Data
          </label>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="block w-full text-white bg-[#ffffff15] px-4 py-3 rounded-xl cursor-pointer hover:bg-[#ffffff20] transition-all duration-300"
          />
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#ffffff10] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-8 mb-8"
            >
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#0075ff] to-[#00a3ff] bg-clip-text text-transparent mb-6">
                Pending Verification
              </h2>
              <div className="space-y-4">
                <AnimatePresence>
                  {users.map((user) => (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-[#ffffff08] rounded-xl overflow-hidden"
                    >
                      <div
                        className="p-4 cursor-pointer flex justify-between items-center hover:bg-[#ffffff10] transition-all duration-300"
                        onClick={() => toggleExpand(user._id)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0075ff] to-[#00a3ff] flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-white font-medium">{user.name}</h3>
                            <p className="text-gray-400 text-sm">{user.wallet_id}</p>
                          </div>
                        </div>
                        <motion.span
                          animate={{ rotate: expandedUserId === user._id ? 180 : 0 }}
                          className="text-white"
                        >
                          ▼
                        </motion.span>
                      </div>

                      <AnimatePresence>
                        {expandedUserId === user._id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-[#ffffff20]"
                          >
                            <div className="p-4 space-y-2 text-gray-400">
                              <p><span className="text-white">Email:</span> {user.email}</p>
                              <p><span className="text-white">College Year:</span> {user.collegeYear}</p>
                              <p><span className="text-white">CGPA:</span> {user.cgpa}</p>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleVerify(user._id)}
                                className="mt-4 px-6 py-2 bg-gradient-to-r from-[#0075ff] to-[#00a3ff] rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300"
                              >
                                Verify User
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {rejectedUsers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#ffffff10] backdrop-blur-xl border border-red-500/20 rounded-xl p-8"
              >
                <h2 className="text-2xl font-bold text-red-400 mb-6">
                  Rejected Users
                </h2>
                <div className="space-y-4">
                  <AnimatePresence>
                    {rejectedUsers.map((user) => (
                      <motion.div
                        key={user._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-[#ffffff08] rounded-xl p-4 border border-red-500/20"
                      >
                        <h3 className="text-white font-medium mb-2">{user.name}</h3>
                        <div className="space-y-2 text-gray-400">
                          <p><span className="text-white">Email:</span> {user.email}</p>
                          <p><span className="text-white">College Year:</span> {user.collegeYear}</p>
                          <p><span className="text-white">CGPA:</span> {user.cgpa}</p>
                          <p className="text-red-400 font-medium">Mismatch found. Verification failed.</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default UnverifiedUsersDashboard;
