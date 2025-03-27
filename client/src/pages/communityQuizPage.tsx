import React, { useEffect, useState } from "react";
import { API_URL } from "../App";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const QuizPageCommunity: React.FC = () => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(`${API_URL}/api/community/quizzes`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `BEARER ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setQuizzes(data.quizzes || []);
        } else {
          console.error("Failed to fetch quizzes");
          setQuizzes([]);
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        setQuizzes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleJoinQuiz = (quiz: any) => {
    navigate(`/community/quiz/${quiz._id}`);
  };

  const handleBackToList = () => {
    setSelectedQuiz(null);
  };

  const handleCopy = () => {
    if (selectedQuiz?.meta?.invitation_code) {
      navigator.clipboard.writeText(selectedQuiz.meta.invitation_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
                My Quizzes
              </motion.h1>
              <p className="text-gray-400 mt-2">Manage and monitor your created quizzes</p>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/community/create/quiz")}
              className="bg-[#ffffff10] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-8 text-center cursor-pointer mb-8 hover:border-[#0075ff] transition-all duration-300"
            >
              <span className="text-3xl font-semibold bg-gradient-to-r from-[#0075ff] to-[#00a3ff] bg-clip-text text-transparent">
                + Create Quiz
              </span>
            </motion.div>

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
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold text-white mb-2">Description</h2>
                <p className="text-gray-400">
                  {selectedQuiz.meta.description || "No description available."}
                </p>
              </div>

              <div className="relative">
                <div
                  onClick={handleCopy}
                  className="bg-[#ffffff10] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-4 cursor-pointer hover:border-[#0075ff] transition-all duration-300"
                >
                  <p className="text-gray-400 mb-2">Invitation Code:</p>
                  <p className="font-mono text-white bg-[#ffffff10] px-4 py-2 rounded-lg">
                    {selectedQuiz.meta.invitation_code}
                  </p>
                </div>
                <AnimatePresence>
                  {copied && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 px-4 py-2 bg-green-500 text-white rounded-lg"
                    >
                      Copied!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleJoinQuiz(selectedQuiz)}
                  className="px-6 py-3 bg-gradient-to-r from-[#0075ff] to-[#00a3ff] rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300"
                >
                  Join Quiz
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default QuizPageCommunity;
