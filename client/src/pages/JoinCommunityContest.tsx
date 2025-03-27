import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../App";
import { motion, AnimatePresence } from "framer-motion";

interface Ranking {
    user_id: string;
    name: string;
    wallet_id: string;
    total_marks: number;
    marks: { [questionId: number]: number };
}

interface ContestUpdate {
    message?: string;
    rankings?: Record<string, Ranking>;
    timestamp?: string;
    participants?: Ranking[];
    show_message?: string;
}

const leaderboardData = [
    {
        rank: 1,
        name: "Barracuda3172",
        whitehatScore: 959,
        totalEarnings: "$14,439,800",
        paidReports: 7,
    },
    {
        rank: 2,
        name: "RetailDdene2946",
        whitehatScore: 661,
        totalEarnings: "$10,020,000",
        paidReports: 2,
    },
    {
        rank: 3,
        name: "PwningEth",
        whitehatScore: 537,
        totalEarnings: "$8,000,000",
        paidReports: 8,
    },
    {
        rank: 4,
        name: "GothicShanon89238",
        whitehatScore: 296,
        totalEarnings: "$4,181,150",
        paidReports: 16,
    },
    {
        rank: 5,
        name: "LonelySloth",
        whitehatScore: 273,
        totalEarnings: "$3,462,409",
        paidReports: 57,
    },
];

const JoinContestCommunity: React.FC = () => {
    const { contest_id } = useParams<{ contest_id: string }>();
    const [rankings, setRankings] = useState<Ranking[]>([]);
    const [participants, setParticipants] = useState<Ranking[]>([]);
    const [error, setError] = useState<string | null>(null);

    const payReward = async () => {
        try {
            const url = `${API_URL}/api/community/contest/pay-reward`;
            const data = { contest_id: contest_id };
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(data),
            });
            const k = await response.json();
            alert(k.message);
        } catch (error) {
            console.error("Network Error:", error);
        }
    };

    const distributeCerts = async () => {
        try {
            const url = `${API_URL}/api/community/generate-certificate`;
            const data = { contest_id: contest_id };
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(data),
            });
            const k = await response.json();
            alert(k.message);
        } catch (error) {
            console.error("Network Error:", error);
        }
    };

    useEffect(() => {
        const joinContest = async () => {
            if (!contest_id) {
                setError("Contest ID is missing in the URL!");
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/community/join`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ contest_id }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    setError(`Failed to join contest: ${errorData.message}`);
                    return;
                }

                const data = await response.json();
                const { token } = data;

                if (!token) {
                    setError("Token is missing in the server response.");
                    return;
                }

                const eventSource = new EventSource(
                    `${API_URL}/api/community/join/${token}`
                );

                eventSource.onmessage = (event) => {
                    const update: ContestUpdate = JSON.parse(event.data);
                    if (update.rankings) {
                        setRankings(Object.values(update.rankings));
                    } else if (update.participants) {
                        setParticipants(update.participants);
                    } else if (update.show_message) {
                        setError(update.show_message);
                    }
                };

                eventSource.onerror = () => {
                    eventSource.close();
                };

                return () => {
                    eventSource.close();
                };
            } catch (err) {
                console.error("Error joining contest:", err);
                setError("An error occurred while joining the contest.");
            }
        };

        joinContest();
    }, [contest_id]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[#111111] p-8 font-['Inter'] relative overflow-hidden"
        >
            {/* Animated background elements */}
            <motion.div
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: 0.15, scale: 1 }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
                className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-purple-600/20 to-transparent"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.1, scale: 1.2 }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", delay: 0.5 }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-purple-400/10 to-transparent"
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 max-w-7xl mx-auto"
            >
                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-xl text-center mb-6 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-4"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.h1
                    className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Contest: {contest_id}
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                >
                    <motion.div
                        className="bg-gradient-to-br from-[#ffffff0a] to-[#ffffff05] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-6"
                        whileHover={{ boxShadow: "0 8px 40px rgba(147, 51, 234, 0.2)" }}
                    >
                        <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
                            Leaderboard
                        </h2>
                        <motion.ul className="space-y-4">
                            {rankings.map((ranking, index) => (
                                <motion.li
                                    key={ranking.user_id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex justify-between items-center border-b border-[#ffffff10] py-2 text-gray-400"
                                >
                                    <span className="flex items-center space-x-2">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 flex items-center justify-center text-white text-sm">
                                            {index + 1}
                                        </div>
                                        <span>{ranking.name}</span>
                                    </span>
                                    <span className="text-purple-300">
                                        {ranking.total_marks}
                                    </span>
                                </motion.li>
                            ))}
                        </motion.ul>
                    </motion.div>

                    <motion.div
                        className="md:col-span-2 bg-gradient-to-br from-[#ffffff0a] to-[#ffffff05] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-6"
                        whileHover={{ boxShadow: "0 8px 40px rgba(147, 51, 234, 0.2)" }}
                    >
                        <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
                            Participants
                        </h2>
                        <motion.ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {participants.map((participant, index) => (
                                <motion.li
                                    key={participant.user_id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center space-x-2 text-gray-400 bg-[#ffffff08] rounded-lg p-3"
                                >
                                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                                    <span>{participant.user_id}</span>
                                </motion.li>
                            ))}
                        </motion.ul>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap justify-center gap-6"
                >
                    <motion.button
                        whileHover={{ 
                            scale: 1.02,
                            boxShadow: "0 8px 40px rgba(147, 51, 234, 0.2)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        onClick={payReward}
                        className="px-8 py-4 bg-gradient-to-br from-[#ffffff0a] to-[#ffffff05] backdrop-blur-xl border border-[#ffffff20] rounded-xl text-2xl font-semibold bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent hover:border-purple-500/30 transition-all duration-300"
                    >
                        Pay Reward
                    </motion.button>

                    <motion.button
                        whileHover={{ 
                            scale: 1.02,
                            boxShadow: "0 8px 40px rgba(147, 51, 234, 0.2)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        onClick={distributeCerts}
                        className="px-8 py-4 bg-gradient-to-br from-[#ffffff0a] to-[#ffffff05] backdrop-blur-xl border border-[#ffffff20] rounded-xl text-2xl font-semibold bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent hover:border-purple-500/30 transition-all duration-300"
                    >
                        Distribute Certificates
                    </motion.button>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default JoinContestCommunity;
