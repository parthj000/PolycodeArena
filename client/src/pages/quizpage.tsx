import React, { useEffect, useState } from "react";
import { API_URL } from "../App";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const QuizPage: React.FC = () => {
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [selectedQuiz, setSelectedQuiz] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [quizToRegister, setQuizToRegister] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await fetch(`${API_URL}/api/user/quizzes`, {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `BEARER ${localStorage.getItem("token")}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setQuizzes(data.quizzes);
                } else {
                    console.error("Failed to fetch quizzes.");
                }
            } catch (error) {
                console.error("Error fetching quizzes:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    const handleJoinQuiz = (quiz: any) => {
        navigate(`/user/quiz/join/${quiz._id}`);
    };

    const handleRegisterQuiz = (quiz: any) => {
        setQuizToRegister(quiz);
        setIsModalOpen(true);
    };

    const handleBackToList = () => {
        setSelectedQuiz(null);
    };

    const handleRegisterSubmit = async (invitationCode: string) => {
        try {
            const response = await fetch(`${API_URL}/api/user/quiz/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `BEARER ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    invitation_code: invitationCode,
                    quiz_id: quizToRegister._id,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem(`quiz_${selectedQuiz._id}`, data.token);
                setIsModalOpen(false);
                setQuizToRegister(null);
                alert("Successfully registered for the quiz!");
            } else {
                alert(`Registration failed: ${data.message}`);
            }
        } catch (error) {
            console.error("Error registering quiz:", error);
            alert("An error occurred. Please try again.");
        }
    };

    const Modal: React.FC<{
        isOpen: boolean;
        onClose: () => void;
        onSubmit: (invitationCode: string) => void;
    }> = ({ isOpen, onClose, onSubmit }) => {
        const [invitationCode, setInvitationCode] = useState<string>("");

        if (!isOpen) return null;

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-[#ffffff10] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-8 max-w-md w-full mx-4"
                    onClick={e => e.stopPropagation()}
                >
                    <h2 className="text-2xl font-bold text-white mb-6">Enter Invitation Code</h2>
                    <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="text"
                        className="w-full px-4 py-3 bg-[#ffffff10] border border-[#ffffff20] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#0075ff] transition-all duration-300 mb-6"
                        placeholder="Enter invitation code"
                        value={invitationCode}
                        onChange={(e) => setInvitationCode(e.target.value)}
                    />
                    <div className="flex space-x-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-[#ffffff20] rounded-xl text-white font-medium hover:bg-[#ffffff30] transition-all duration-300"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                if (invitationCode.trim() === "") {
                                    alert("Please enter an invitation code.");
                                    return;
                                }
                                onSubmit(invitationCode);
                            }}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#0075ff] to-[#00a3ff] rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300"
                        >
                            Register
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f1535] to-[#111c44] p-8 font-['Inter']">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >
                {!selectedQuiz ? (
                    <>
                        <div className="text-center mb-12">
                            <motion.h1
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl font-bold bg-gradient-to-r from-[#0075ff] to-[#00a3ff] bg-clip-text text-transparent"
                            >
                                Available Quizzes
                            </motion.h1>
                            <p className="text-gray-400 mt-2">Join or register for quizzes to test your knowledge</p>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {quizzes.map((quiz, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-[#ffffff10] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-6 cursor-pointer hover:border-[#0075ff] transition-all duration-300"
                                        onClick={() => setSelectedQuiz(quiz)}
                                    >
                                        <h2 className="text-xl font-bold bg-gradient-to-r from-[#0075ff] to-[#00a3ff] bg-clip-text text-transparent mb-4">
                                            {quiz.meta.quiz_name}
                                        </h2>
                                        <div className="space-y-2 text-gray-400">
                                            <p className="flex justify-between">
                                                <span>Start:</span>
                                                <span>{new Date(quiz.start_time * 1000).toLocaleString()}</span>
                                            </p>
                                            <p className="flex justify-between">
                                                <span>End:</span>
                                                <span>{new Date(quiz.end_time * 1000).toLocaleString()}</span>
                                            </p>
                                            <p className="flex justify-between">
                                                <span>Questions:</span>
                                                <span>{quiz.meta.total_questions}</span>
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#ffffff10] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-8"
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleBackToList}
                            className="mb-8 px-6 py-2 bg-[#ffffff20] rounded-xl text-white font-medium hover:bg-[#ffffff30] transition-all duration-300"
                        >
                            ← Back to List
                        </motion.button>

                        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0075ff] to-[#00a3ff] bg-clip-text text-transparent mb-6">
                            {selectedQuiz.meta.quiz_name}
                        </h1>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 text-gray-400">
                                    <p className="flex justify-between">
                                        <span>Start Time:</span>
                                        <span>{new Date(selectedQuiz.start_time * 1000).toLocaleString()}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>End Time:</span>
                                        <span>{new Date(selectedQuiz.end_time * 1000).toLocaleString()}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>Total Questions:</span>
                                        <span>{selectedQuiz.meta.total_questions}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h2 className="text-xl font-semibold text-white mb-2">Description</h2>
                                <p className="text-gray-400">
                                    {selectedQuiz.meta.description || "No description available."}
                                </p>
                            </div>

                            {selectedQuiz.start_time < new Date().valueOf() / 1000 &&
                            selectedQuiz.end_time > new Date().valueOf() / 1000 ? (
                                <div className="flex gap-4 mt-8">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleJoinQuiz(selectedQuiz)}
                                        className="px-6 py-3 bg-gradient-to-r from-[#0075ff] to-[#00a3ff] rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300"
                                    >
                                        Join Quiz
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleRegisterQuiz(selectedQuiz)}
                                        className="px-6 py-3 bg-[#ffffff20] rounded-xl text-white font-medium hover:bg-[#ffffff30] transition-all duration-300"
                                    >
                                        Register
                                    </motion.button>
                                </div>
                            ) : (
                                <div className="mt-8 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400">
                                    This quiz is not currently active
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </motion.div>

            <AnimatePresence>
                {isModalOpen && (
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleRegisterSubmit}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default QuizPage;
