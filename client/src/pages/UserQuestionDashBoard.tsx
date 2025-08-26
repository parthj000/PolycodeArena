import React, { useEffect, useState } from "react";
import { API_URL } from "../App";
import ProblemSet from "./ProblemSet";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface Contest {
    question_set: any[];
    start_time: number;
    end_time: number;
}

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

const UserQuestionDashBoard: React.FC = () => {
    const navigate = useNavigate();
    const [contest, setContest] = useState<Contest | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [output, setOutput] = useState<string | any[]>(""); // Can be string or array
    const contestId = window.location.pathname.split("/").pop();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const checkAuthentication = async () => {
        try {
            const response = await fetch(`${API_URL}api/user/auth`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `BEARER ${localStorage.getItem("token")}`,
                },
            });

            if (response.ok) {
                setIsAuthenticated(true);
                const data = await response.json();
                if (data.token) {
                    setToken(data.token);
                }
            } else {
                setIsAuthenticated(false);
                console.error("User authentication failed");
            }
        } catch (error) {
            console.error("Error during authentication:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!localStorage.getItem(`contest_${contestId}`)) {
            navigate("/user/contests");
        }

        setToken(localStorage.getItem(`contest_${contestId}`));
        checkAuthentication();
    }, []);

    useEffect(() => {
        if (isAuthenticated && token) {
            const eventSource = new EventSource(
                `${API_URL}api/user/join/${token}`
            );

            eventSource.onmessage = (event: MessageEvent) => {
                const data = JSON.parse(event.data);
                console.log(data, "this is data");

                if (data.contest) {
                    if (new Date().valueOf() / 1000 > data.contest.end_time) {
                        setError("Contest has been ended");
                        eventSource.close();
                    }
                    if (new Date().valueOf() / 1000 < data.contest.start_time) {
                        setError("Contest has not started yet");
                        eventSource.close();
                    }
                    setContest(data.contest);
                }
            };

            eventSource.onerror = (err) => {
                console.error("SSE connection error:", err);
                eventSource.close();
            };

            return () => {
                eventSource.close();
            };
        }
    }, [isAuthenticated, token]);

    return (
        <motion.div
           
            className="min-h-screen bg-gradient-to-br from-[#0f1535] to-[#111c44] p-8 font-['Inter'] relative overflow-hidden"
        >
            {/* Animated background elements */}
            <motion.div
                
                className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-indigo-600/20 to-transparent"
            />
            <motion.div
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-indigo-400/10 to-transparent"
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
                            Loading contest...
                        </motion.p>
                    </motion.div>
                ) : error ? (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-red-500/20 text-red-400 p-8 rounded-xl mb-6 border border-red-500/20 backdrop-blur-xl text-center"
                    >
                        <h2 className="text-2xl font-bold mb-4">Error</h2>
                        <p>{error}</p>
                        <motion.button
                            whileHover={{ 
                                scale: 1.02,
                                backgroundColor: "rgba(239, 68, 68, 0.2)"
                            }}
                            whileTap={{ scale: 0.98 }}
                            className="mt-6 px-6 py-2 bg-red-500/10 rounded-xl text-red-400 hover:bg-red-500/20 transition-all duration-300"
                            onClick={() => navigate("/user/contests")}
                        >
                            Return to Contests
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="kapa-4 relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-8"
                    >
                        {/* Main Content */}
                        <motion.div
                            variants={itemVariants}
                            className="lg:col-span-4 bg-gradient-to-br from-[#ffffff0a] to-[#ffffff05] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-6 relative overflow-hidden"
                        >
                            <motion.div
                               
                                className="kapa-1 absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-indigo-600/10 to-transparent rounded-xl pointer-events-none"
                            />
                            {contest && (
                                <ProblemSet
                                    questions={contest.question_set || []}
                                    token={token || ""}
                                    setOutput={setOutput}
                                />
                            )}

                            
                        </motion.div>

                        {/* Sidebar */}
                        
                            
                        
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default UserQuestionDashBoard;
