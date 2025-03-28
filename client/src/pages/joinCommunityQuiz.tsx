import React, { useEffect, useState } from "react";
import { API_URL } from "../App";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  question: string;
  options: string[];
}

interface Quiz {
  quiz_name: string;
  description: string;
  question_set: Question[];
  start_time: number;
  end_time: number;
}

const JoinCommunityQuiz: React.FC = () => {
  const { quiz_id } = useParams<{ quiz_id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`${API_URL}api/community/quiz/${quiz_id}/questions`, {
          headers: {
            Authorization: `BEARER ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setQuiz({
            quiz_name: data.quiz_name,
            description: data.description,
            question_set: data.questions,
            start_time: data.start_time,
            end_time: data.end_time,
          });
        } else {
          alert("Failed to fetch quiz: " + data.message);
          navigate("/community/quizzes");
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
        navigate("/community/quizzes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [quiz_id, navigate]);

  useEffect(() => {
    if (!quiz) return;

    const timer = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const endTime = quiz.end_time;
      const diff = endTime - now;

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft("Time's up!");
        handleSubmit();
      } else {
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz]);

  const handleOptionChange = (questionIndex: number, selectedOption: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}api/community/submit/quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `BEARER ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          quiz_id,
          answers,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Quiz submitted successfully!");
        navigate("/community/quizzes");
      } else {
        alert(`Error submitting quiz: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("An error occurred while submitting your quiz.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < (quiz?.question_set.length || 0) - 1) {
      setCurrentQuestion((curr) => curr + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((curr) => curr - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1535] to-[#111c44] p-8 font-['Inter'] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1535] to-[#111c44] p-8 font-['Inter'] flex justify-center items-center">
        <div className="text-white text-xl">Quiz not found or not accessible.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1535] to-[#111c44] p-8 font-['Inter']">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-[#0075ff] to-[#00a3ff] bg-clip-text text-transparent"
          >
            {quiz.quiz_name}
          </motion.h1>
          <p className="text-gray-400 mt-2">{quiz.description}</p>
          <div className="mt-4 text-xl font-semibold text-white">Time Left: {timeLeft}</div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#ffffff10] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-8"
        >
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Question {currentQuestion + 1} of {quiz.question_set.length}
              </h2>
              <div className="flex items-center space-x-2 text-gray-400">
                <span>Progress:</span>
                <div className="w-32 h-2 bg-[#ffffff20] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0075ff] to-[#00a3ff] transition-all duration-300"
                    style={{
                      width: `${(Object.keys(answers).length / quiz.question_set.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <p className="text-xl text-white mb-6">{quiz.question_set[currentQuestion].question}</p>

                <div className="space-y-4">
                  {quiz.question_set[currentQuestion].options.map((option, optionIndex) => (
                    <motion.label
                      key={optionIndex}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`block p-4 bg-[#ffffff10] border ${
                        answers[currentQuestion] === option
                          ? "border-[#0075ff]"
                          : "border-[#ffffff20]"
                      } rounded-xl cursor-pointer hover:bg-[#ffffff15] transition-all duration-300`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 ${
                            answers[currentQuestion] === option
                              ? "border-[#0075ff] bg-[#0075ff]"
                              : "border-[#ffffff40]"
                          } flex items-center justify-center transition-all duration-300`}
                        >
                          {answers[currentQuestion] === option && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-white rounded-full"
                            />
                          )}
                        </div>
                        <input
                          type="radio"
                          name={`question-${currentQuestion}`}
                          value={option}
                          checked={answers[currentQuestion] === option}
                          onChange={() => handleOptionChange(currentQuestion, option)}
                          className="hidden"
                        />
                        <span className="text-white">{option}</span>
                      </div>
                    </motion.label>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
                className="px-6 py-3 bg-[#ffffff20] rounded-xl text-white font-medium hover:bg-[#ffffff30] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </motion.button>
              {currentQuestion < quiz.question_set.length - 1 ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-6 py-3 bg-gradient-to-r from-[#0075ff] to-[#00a3ff] rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300"
                >
                  Next
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-[#0075ff] to-[#00a3ff] rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  ) : (
                    "Submit Quiz"
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default JoinCommunityQuiz; 