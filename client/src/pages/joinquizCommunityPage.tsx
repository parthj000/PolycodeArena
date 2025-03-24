import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../App";
import { motion, AnimatePresence } from "framer-motion";

interface Ranking {
    user_id: string;
    name: string;
    total_marks: number;
    marks: { [questionId: number]: number };
}

interface QuizUpdate {
    rankings?: Record<string, Ranking>;
    participants?: Ranking[];
    show_message?: string;
}

const QuizAdminDashboard: React.FC = () => {
    const { quiz_id } = useParams<{ quiz_id: string }>();
    const [rankings, setRankings] = useState<Ranking[]>([]);
    const [participants, setParticipants] = useState<Ranking[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Function to distribute rewards to quiz participants
    const distributeRewards = async () => {
        try {
            const response = await fetch(`${API_URL}/api/admin/quiz/${quiz_id}/distribute-rewards`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Rewards distributed successfully: ${data.message}`);
            } else {
                alert(`Failed to distribute rewards: ${data.message}`);
            }
        } catch (error) {
            console.error("Error distributing rewards:", error);
            alert("An error occurred while distributing rewards.");
        }
    };

    useEffect(() => {
        const fetchQuizData = async () => {
            if (!quiz_id) {
                setError("Quiz ID is missing in the URL!");
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/community/quiz/${quiz_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    setError(`Failed to fetch quiz data: ${errorData.message}`);
                    return;
                }

                const data: QuizUpdate = await response.json();
                
                if (data.rankings) {
                    setRankings(Object.values(data.rankings));
                }

                if (data.participants) {
                    setParticipants(data.participants);
                }

                if (data.show_message) {
                    setError(data.show_message);
                }
            } catch (err) {
                console.error("Error fetching quiz data:", err);
                setError("An error occurred while fetching the quiz data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuizData();
    }, [quiz_id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0f1535] to-[#111c44] p-8 font-['Inter'] flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f1535] to-[#111c44] p-8 font-['Inter']">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-8 text-red-400 text-center"
                    >
                        {error}
                    </motion.div>
                )}

                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold bg-gradient-to-r from-[#0075ff] to-[#00a3ff] bg-clip-text text-transparent"
                    >
                        Quiz Dashboard
                    </motion.h1>
                    <p className="text-gray-400 mt-2">Monitor quiz progress and participants</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Leaderboard */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-[#ffffff10] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-6"
                    >
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#0075ff] to-[#00a3ff] bg-clip-text text-transparent mb-6">
                            Leaderboard
                        </h2>
                        <div className="space-y-4">
                            {rankings.map((ranking, index) => (
                                <motion.div
                                    key={ranking.user_id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-[#ffffff08] border border-[#ffffff10] rounded-xl p-4 flex items-center justify-between"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#0075ff] to-[#00a3ff] flex items-center justify-center text-white font-bold">
                                            {index + 1}
                                        </div>
                                        <span className="text-white">{ranking.name}</span>
                                    </div>
                                    <span className="text-gray-400">Score: {ranking.total_marks}</span>
                                </motion.div>
                            ))}
                            {rankings.length === 0 && (
                                <p className="text-center text-gray-400">No rankings available yet.</p>
                            )}
                        </div>
                    </motion.div>

                    {/* Participants */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-[#ffffff10] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-6"
                    >
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#0075ff] to-[#00a3ff] bg-clip-text text-transparent mb-6">
                            Participants
                        </h2>
                        <div className="space-y-4">
                            {participants.map((participant, index) => (
                                <motion.div
                                    key={participant.user_id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-[#ffffff08] border border-[#ffffff10] rounded-xl p-4 flex items-center justify-between"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-8 h-8 rounded-full bg-[#ffffff20] flex items-center justify-center text-white">
                                            {index + 1}
                                        </div>
                                        <span className="text-white">{participant.name}</span>
                                    </div>
                                    <span className="text-gray-400 text-sm">ID: {participant.user_id}</span>
                                </motion.div>
                            ))}
                            {participants.length === 0 && (
                                <p className="text-center text-gray-400">No participants yet.</p>
                            )}
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 flex justify-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={distributeRewards}
                        className="px-8 py-4 bg-gradient-to-r from-[#0075ff] to-[#00a3ff] rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300"
                    >
                        Distribute Rewards
                    </motion.button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default QuizAdminDashboard;
