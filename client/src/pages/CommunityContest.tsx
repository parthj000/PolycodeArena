import React, { useEffect, useState } from "react";
import { API_URL } from "../App";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const ContestPageCommunity: React.FC = () => {
  const [contests, setContests] = useState<any[]>([]);
  const [selectedContest, setSelectedContest] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchContests = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/community/contest`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `BEARER ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setContests(data.data);
        } else {
          console.error("Failed to fetch contests");
        }
      } catch (error) {
        console.error("Error fetching contests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContests();
  }, []);

  const handleJoinContest = (contest: any) => {
    navigate(`/community/join/${contest._id}`);
  };

  const handleBackToList = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setSelectedContest(null);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const handleCopy = () => {
    if (selectedContest) {
      navigator.clipboard.writeText(selectedContest.meta.invitation_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Calculate active and completed contests
  const activeContests = contests.filter(c => new Date(c.end_time * 1000) > new Date());
  const completedContests = contests.filter(c => new Date(c.end_time * 1000) <= new Date());

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-[#0f1535] to-[#111c44] p-8 font-['Inter'] relative overflow-hidden"
    >
      {/* Animated background elements */}
      <motion.div
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
        className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-indigo-600/20 to-transparent"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1.2 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", delay: 0.5 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-indigo-400/10 to-transparent"
      />
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
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)",
          zIndex: 0
        }}
      />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-64 space-y-4"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [1, 0.8, 1]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
              <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20"></div>
            </motion.div>
            <motion.p
              animate={{ 
                opacity: [1, 0.7, 1]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-indigo-400"
            >
              Loading contests...
            </motion.p>
          </motion.div>
        ) : !selectedContest ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10"
          >
            {/* Header with Stats */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#0f1535] to-[#111c44] p-8 rounded-xl border border-[#ffffff10] backdrop-blur-xl mb-8"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent">
                Community Contests
              </h1>
              <p className="text-gray-400 mt-2">Create and participate in community-driven coding contests</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-[#ffffff10] rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-xl">
                      📊
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Total Contests</p>
                      <p className="text-white font-medium">{contests.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#ffffff10] rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-xl">
                      🎯
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Active Contests</p>
                      <p className="text-white font-medium">{activeContests.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#ffffff10] rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-xl">
                      ✅
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Completed</p>
                      <p className="text-white font-medium">{completedContests.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Create Contest Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/community/create")}
              className="bg-gradient-to-br from-[#ffffff0a] to-[#ffffff05] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-6 text-center cursor-pointer mb-8 hover:border-indigo-500/30 transition-all duration-300"
            >
              <span className="text-2xl font-semibold bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent">
                + Create New Contest
              </span>
            </motion.div>

            {/* Active Contests Section */}
            <div className="bg-gradient-to-br from-[#0f1535] to-[#111c44] rounded-xl border border-[#ffffff10] backdrop-blur-xl overflow-hidden mb-8">
              <div className="p-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent mb-6">
                  Active Contests
                </h2>
                <div className="space-y-4">
                  {activeContests.map((contest, index) => (
                    <motion.div
                      key={contest._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-[#ffffff10] rounded-xl overflow-hidden hover:bg-[#ffffff15] transition-all duration-300"
                      onClick={() => setSelectedContest(contest)}
                    >
                      <div className="p-6 cursor-pointer">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          <div className="flex items-center space-x-4 flex-1">
                            <motion.div 
                              className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-2xl"
                              whileHover={{ scale: 1.1 }}
                            >
                              #{index + 1}
                            </motion.div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent">
                                {contest.meta.contest_name}
                              </h3>
                              <p className="text-gray-400 text-sm mt-1">
                                {contest.meta.description || "No description available"}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex items-center space-x-2 bg-indigo-500/10 px-3 py-1 rounded-full">
                              <span className="text-indigo-400">Prize:</span>
                              <span className="text-white">{contest.meta.prize_distribution[0]}</span>
                            </div>
                            <div className="flex items-center space-x-2 bg-green-500/10 px-3 py-1 rounded-full">
                              <span className="text-green-400">Start:</span>
                              <span className="text-white">
                                {new Date(contest.start_time * 1000).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 bg-red-500/10 px-3 py-1 rounded-full">
                              <span className="text-red-400">End:</span>
                              <span className="text-white">
                                {new Date(contest.end_time * 1000).toLocaleDateString()}
                              </span>
                            </div>
                            <motion.div
                              whileHover={{ scale: 1.1, x: 5 }}
                              whileTap={{ scale: 0.9 }}
                              className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center"
                            >
                              <span className="text-indigo-400">→</span>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {activeContests.length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                      No active contests found
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Completed Contests Section */}
            <div className="bg-gradient-to-br from-[#0f1535] to-[#111c44] rounded-xl border border-[#ffffff10] backdrop-blur-xl overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent mb-6">
                  Completed Contests
                </h2>
                <div className="space-y-4">
                  {completedContests.map((contest, index) => (
                    <motion.div
                      key={contest._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-[#ffffff10] rounded-xl overflow-hidden hover:bg-[#ffffff15] transition-all duration-300 opacity-75"
                      onClick={() => setSelectedContest(contest)}
                    >
                      <div className="p-6 cursor-pointer">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          <div className="flex items-center space-x-4 flex-1">
                            <motion.div 
                              className="w-12 h-12 rounded-xl bg-gray-500/20 flex items-center justify-center text-2xl"
                              whileHover={{ scale: 1.1 }}
                            >
                              #{index + 1}
                            </motion.div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-400">
                                {contest.meta.contest_name}
                              </h3>
                              <p className="text-gray-500 text-sm mt-1">
                                {contest.meta.description || "No description available"}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex items-center space-x-2 bg-gray-500/10 px-3 py-1 rounded-full">
                              <span className="text-gray-400">Prize:</span>
                              <span className="text-gray-300">{contest.meta.prize_distribution[0]}</span>
                            </div>
                            <div className="flex items-center space-x-2 bg-gray-500/10 px-3 py-1 rounded-full">
                              <span className="text-gray-400">Completed:</span>
                              <span className="text-gray-300">
                                {new Date(contest.end_time * 1000).toLocaleDateString()}
                              </span>
                            </div>
                            <motion.div
                              whileHover={{ scale: 1.1, x: 5 }}
                              whileTap={{ scale: 0.9 }}
                              className="w-8 h-8 rounded-full bg-gray-500/10 flex items-center justify-center"
                            >
                              <span className="text-gray-400">→</span>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {completedContests.length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                      No completed contests found
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10"
          >
            {/* Back Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBackToList}
              disabled={isTransitioning}
              className="mb-8 px-6 py-2 bg-[#ffffff20] rounded-xl text-white font-medium hover:bg-[#ffffff30] transition-all duration-300"
            >
              ← Back to List
            </motion.button>

            {/* Contest Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#ffffff0a] to-[#ffffff05] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-8 relative overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-indigo-600/10 to-transparent rounded-xl pointer-events-none"
              />

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-3 space-y-8">
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent mb-4">
                      {selectedContest.meta.contest_name}
                    </h1>
                    <p className="text-gray-400">
                      {selectedContest.meta.description || "No description available."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-[#ffffff10] rounded-xl p-4">
                        <h3 className="text-xl font-medium text-indigo-300 mb-4">Contest Schedule</h3>
                        <div className="space-y-2">
                          <p className="text-gray-400">
                            <span className="font-medium text-indigo-300">Start Time:</span>
                            <br />
                            {new Date(selectedContest.start_time * 1000).toLocaleString()}
                          </p>
                          <p className="text-gray-400">
                            <span className="font-medium text-indigo-300">End Time:</span>
                            <br />
                            {new Date(selectedContest.end_time * 1000).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#ffffff10] rounded-xl p-4">
                      <h3 className="text-xl font-medium text-indigo-300 mb-4">Prize Distribution</h3>
                      <ul className="space-y-2">
                        {selectedContest.meta.prize_distribution.map((prize: string, idx: number) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            className="flex items-center space-x-3"
                          >
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-medium">
                              {idx + 1}
                            </div>
                            <span className="text-gray-400">{prize}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleJoinContest(selectedContest)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-xl text-white font-medium transition-all duration-300"
                  >
                    Join Contest
                  </motion.button>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-[#ffffff10] rounded-xl p-4">
                    <h3 className="text-xl font-medium text-indigo-300 mb-4">Contest Details</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-400 text-sm">Contest ID</p>
                        <p className="font-mono text-white">{selectedContest._id}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Status</p>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            new Date().valueOf() / 1000 > selectedContest.end_time
                              ? "bg-red-500"
                              : new Date().valueOf() / 1000 < selectedContest.start_time
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`} />
                          <span className="text-white">
                            {new Date().valueOf() / 1000 > selectedContest.end_time
                              ? "Ended"
                              : new Date().valueOf() / 1000 < selectedContest.start_time
                              ? "Not Started"
                              : "Live"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    onClick={handleCopy}
                    className="bg-[#ffffff10] rounded-xl p-4 cursor-pointer relative"
                  >
                    <h3 className="text-xl font-medium text-indigo-300 mb-4">Invitation Code</h3>
                    <p className="font-mono text-white bg-[#ffffff15] px-4 py-2 rounded-lg">
                      {selectedContest.meta.invitation_code}
                    </p>
                    <AnimatePresence>
                      {copied && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-2 px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg backdrop-blur-sm"
                        >
                          Copied!
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ContestPageCommunity;
