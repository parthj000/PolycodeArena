import React, { useEffect, useState } from "react";
import { API_URL } from "../App";
import { useNavigate } from "react-router-dom";
import CodeBlock from "../components/CodeBlock";
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

// Modal Component for Invitation Code
const Modal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (invitationCode: string) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
    const [invitationCode, setInvitationCode] = useState<string>("");

    const handleSubmit = () => {
        if (invitationCode.trim() === "") {
            alert("Please enter an invitation code.");
            return;
        }
        onSubmit(invitationCode);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-gradient-to-br from-[#0f1535] to-[#111c44] p-8 rounded-xl border border-[#ffffff20] backdrop-blur-xl w-full max-w-md relative overflow-hidden"
            >
                {/* Background gradients */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-indigo-600/10 to-transparent rounded-xl pointer-events-none"
                />
                <motion.div
                    initial={{ opacity: 0, rotate: 0 }}
                    animate={{ opacity: 0.1, rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(99,102,241,0.2)_0deg,transparent_60deg,rgba(99,102,241,0.2)_120deg,transparent_180deg,rgba(99,102,241,0.2)_240deg,transparent_300deg)] rounded-xl pointer-events-none"
                />

                <div className="relative">
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent mb-6"
                    >
                    Enter Invitation Code
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                <input
                    type="text"
                            className="w-full px-4 py-3 bg-[#ffffff10] border border-[#ffffff20] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300 mb-6"
                    placeholder="Enter Invitation Code"
                    value={invitationCode}
                    onChange={(e) => setInvitationCode(e.target.value)}
                />
                        <div className="flex justify-end space-x-4">
                            <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(99, 102, 241, 0.1)" }}
                                whileTap={{ scale: 0.98 }}
                                className="px-6 py-2 border border-indigo-500/30 text-indigo-400 rounded-xl hover:border-indigo-500/50 transition-all duration-300"
                        onClick={onClose}
                    >
                        Cancel
                            </motion.button>
                            <motion.button
                                whileHover={{ 
                                    scale: 1.02,
                                    boxShadow: "0 5px 20px rgba(99, 102, 241, 0.3)"
                                }}
                                whileTap={{ scale: 0.98 }}
                                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-400 text-white rounded-xl transition-all duration-300"
                        onClick={handleSubmit}
                    >
                        Submit
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const ContestPage: React.FC = () => {
    const [contests, setContests] = useState<any[]>([]);
    const [selectedContest, setSelectedContest] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const response = await fetch(`${API_URL}api/user/contest`, {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `BEARER ${localStorage.getItem("token")}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setContests(data.data);
                } else {
                    setError("Failed to fetch contests");
                }
            } catch (error) {
                console.error("Error fetching contests:", error);
                setError("Could not fetch contests.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchContests();
    }, []);

    const handleJoinContest = (contest: any) => {
        navigate(`/user/join/${contest._id}`);
    };

    const handleRegisterContest = () => {
        setIsModalOpen(true);
    };

    const handleBackToList = () => {
        setSelectedContest(null);
    };

    const handleRegisterSubmit = async (invitationCode: string) => {
        try {
            const response = await fetch(
                `${API_URL}api/user/contest/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `BEARER ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        invitation_code: invitationCode,
                        contest_id: selectedContest._id,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem(`contest_${selectedContest._id}`, data.token);
                setIsModalOpen(false);
            }

            alert(data.message);
        } catch (error) {
            console.error("Error registering contest:", error);
            alert("An error occurred. Please try again.");
        }
    };

    const activeContests = contests.filter(c => new Date(c.end_time * 1000) > new Date());
    const completedContests = contests.filter(c => new Date(c.end_time * 1000) <= new Date());

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

                <AnimatePresence mode="wait">
            {!selectedContest ? (
                        // List View
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {/* Header with Stats */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-br from-[#0f1535] to-[#111c44] p-8 rounded-xl border border-[#ffffff10] backdrop-blur-xl mb-8"
                            >
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent">
                                    Your Contests
                                </h1>
                                <p className="text-gray-400 mt-2">Track your contest progress and opportunities</p>

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

                            {/* Error Display */}
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
                            </AnimatePresence>

                            {/* Loading State */}
                            {isLoading ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center h-64 space-y-4"
                                >
                                    <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                                    <p className="text-indigo-400">Loading contests...</p>
                                </motion.div>
                            ) : (
                                <div className="space-y-8">
                                    {/* Active Contests Section */}
                                    <div className="bg-gradient-to-br from-[#0f1535] to-[#111c44] rounded-xl border border-[#ffffff10] backdrop-blur-xl overflow-hidden">
                                        <div className="p-6">
                                            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent mb-6">
                                                Active Contests
                                            </h2>
                                            <div className="space-y-4">
                                                <AnimatePresence>
                                                    {activeContests.map((contest, index) => (
                                                        <motion.div
                                                            key={contest._id}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -20 }}
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
                                                </AnimatePresence>
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
                                                <AnimatePresence>
                                                    {completedContests.map((contest, index) => (
                                                        <motion.div
                                                            key={contest._id}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -20 }}
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
                                                </AnimatePresence>
                                                {completedContests.length === 0 && (
                                                    <div className="text-center text-gray-400 py-8">
                                                        No completed contests found
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                    </div>
                            )}
                        </motion.div>
                    ) : (
                        // Detail View
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="relative"
                        >
                            <motion.button
                                whileHover={{ 
                                    scale: 1.02,
                                    backgroundColor: "rgba(99, 102, 241, 0.1)"
                                }}
                                whileTap={{ scale: 0.98 }}
                                className="mb-8 px-6 py-2 bg-[#ffffff20] text-white rounded-xl hover:bg-[#ffffff30] transition-all duration-300 flex items-center space-x-2"
                        onClick={handleBackToList}
                    >
                                <span>←</span>
                                <span>Back to List</span>
                            </motion.button>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-br from-[#0f1535] to-[#111c44] p-8 rounded-xl border border-[#ffffff10] backdrop-blur-xl relative overflow-hidden"
                            >
                                {/* Background gradients for detail view */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0.1, 0.2, 0.1] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-indigo-600/10 to-transparent rounded-xl pointer-events-none"
                                />

                                <motion.h1
                                    className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent mb-6"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                        {selectedContest.meta.contest_name}
                                </motion.h1>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                                >
                                    <div className="space-y-4">
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
                                    <div className="text-gray-400">
                                        <span className="font-medium text-indigo-300">Prize Distribution:</span>
                                        <ul className="list-disc list-inside mt-2">
                                            {selectedContest.meta.prize_distribution.map((prize: string, idx: number) => (
                                                <motion.li
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.3 + idx * 0.1 }}
                                                >
                                                    {prize}
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="mb-8"
                                >
                                    <h3 className="text-xl font-medium text-indigo-300 mb-2">Description</h3>
                                    <p className="text-gray-400">
                                        {selectedContest.meta.description || "No description available."}
                                    </p>
                                </motion.div>

                    {selectedContest.start_time < new Date().valueOf() / 1000 &&
                    selectedContest.end_time > new Date().valueOf() / 1000 ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="flex space-x-4"
                                    >
                                        <motion.button
                                            whileHover={{ 
                                                scale: 1.02,
                                                boxShadow: "0 5px 20px rgba(99, 102, 241, 0.3)"
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-400 text-white rounded-xl transition-all duration-300"
                                            onClick={() => handleJoinContest(selectedContest)}
                                        >
                                            Join Contest
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ 
                                                scale: 1.02,
                                                backgroundColor: "rgba(99, 102, 241, 0.1)"
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                            className="px-6 py-3 bg-[#ffffff20] text-white rounded-xl hover:bg-[#ffffff30] transition-all duration-300"
                                            onClick={handleRegisterContest}
                            >
                                Register
                                        </motion.button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="bg-red-500/20 text-red-400 p-4 rounded-xl border border-red-500/20"
                                    >
                                        This contest is not live
                                    </motion.div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {isModalOpen && (
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleRegisterSubmit}
            />
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default ContestPage;
