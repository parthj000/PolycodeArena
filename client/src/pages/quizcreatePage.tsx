import React, { useState } from "react";
import { API_URL } from "../App";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  question: string;
  options: string[];
  correct_option: string;
}

interface QuizData {
  quiz_name: string;
  description: string;
  start_time: string;
  end_time: string;
  question_set: Question[];
}

const QuizCreation: React.FC = () => {
  const [quizData, setQuizData] = useState<QuizData>({
    quiz_name: "",
    description: "",
    start_time: "",
    end_time: "",
    question_set: [
      {
        question: "",
        options: ["", "", "", ""],
        correct_option: "",
      },
    ],
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: "quiz" | "questions",
    key: string,
    questionIndex?: number,
    optionIndex?: number
  ) => {
    const value = e.target.value;
    setQuizData((prevState) => {
      const newState = { ...prevState };
      if (section === "quiz") {
        newState[key as keyof QuizData] = value as any;
      } else if (section === "questions" && questionIndex !== undefined) {
        const question = newState.question_set[questionIndex];
        if (optionIndex !== undefined) {
          question.options[optionIndex] = value;
        } else {
          question[key as keyof Question] = value as any;
        }
      }
      return newState;
    });
  };

  const handleAddQuestion = () => {
    setQuizData((prevState) => ({
      ...prevState,
      question_set: [
        ...prevState.question_set,
        { question: "", options: ["", "", "", ""], correct_option: "" },
      ],
    }));
  };

  const handleRemoveQuestion = (index: number) => {
    setQuizData((prevState) => ({
      ...prevState,
      question_set: prevState.question_set.filter((_, i) => i !== index),
    }));
  };

  const convertToUnixTimestamp = (dateString: string): number => {
    const date = new Date(dateString);
    return Math.floor(date.getTime() / 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const startTimestamp = convertToUnixTimestamp(quizData.start_time);
    const endTimestamp = convertToUnixTimestamp(quizData.end_time);

    const payload = {
      ...quizData,
      start_time: startTimestamp,
      end_time: endTimestamp,
    };

    try {
      const response = await fetch(`${API_URL}/api/community/create/quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `BEARER ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (response.ok) {
        alert("Quiz created successfully!");
        window.location.href = "/community/quizzes";
      } else {
        alert(`Error: ${responseData.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the quiz.");
    } finally {
      setIsLoading(false);
    }
  };

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
            Create New Quiz
          </motion.h1>
          <p className="text-gray-400 mt-2">Design your quiz with questions and options</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#ffffff10] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">Quiz Name</label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  value={quizData.quiz_name}
                  onChange={(e) => handleChange(e, "quiz", "quiz_name")}
                  className="w-full px-4 py-3 bg-[#ffffff10] border border-[#ffffff20] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#0075ff] transition-all duration-300"
                  placeholder="Enter quiz name"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Description</label>
                <motion.textarea
                  whileFocus={{ scale: 1.01 }}
                  value={quizData.description}
                  onChange={(e) => handleChange(e, "quiz", "description")}
                  className="w-full px-4 py-3 bg-[#ffffff10] border border-[#ffffff20] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#0075ff] transition-all duration-300"
                  placeholder="Enter quiz description"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Start Time</label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="datetime-local"
                  value={quizData.start_time}
                  onChange={(e) => handleChange(e, "quiz", "start_time")}
                  className="w-full px-4 py-3 bg-[#ffffff10] border border-[#ffffff20] rounded-xl text-white focus:outline-none focus:border-[#0075ff] transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">End Time</label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="datetime-local"
                  value={quizData.end_time}
                  onChange={(e) => handleChange(e, "quiz", "end_time")}
                  className="w-full px-4 py-3 bg-[#ffffff10] border border-[#ffffff20] rounded-xl text-white focus:outline-none focus:border-[#0075ff] transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div className="mt-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Questions</h2>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleAddQuestion}
                  className="px-6 py-2 bg-gradient-to-r from-[#0075ff] to-[#00a3ff] rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300"
                >
                  Add Question
                </motion.button>
              </div>

              <AnimatePresence>
                {quizData.question_set.map((question, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-8 p-6 bg-[#ffffff10] backdrop-blur-xl border border-[#ffffff20] rounded-xl"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-white">Question {index + 1}</h3>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => handleRemoveQuestion(index)}
                        className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 hover:bg-red-500/30 transition-all duration-300"
                      >
                        Remove
                      </motion.button>
                    </div>

                    <div className="space-y-4">
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="text"
                        value={question.question}
                        onChange={(e) => handleChange(e, "questions", "question", index)}
                        className="w-full px-4 py-3 bg-[#ffffff10] border border-[#ffffff20] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#0075ff] transition-all duration-300"
                        placeholder="Enter question"
                        required
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {question.options.map((option, optionIndex) => (
                          <motion.input
                            key={optionIndex}
                            whileFocus={{ scale: 1.01 }}
                            type="text"
                            value={option}
                            onChange={(e) =>
                              handleChange(e, "questions", "options", index, optionIndex)
                            }
                            className="w-full px-4 py-3 bg-[#ffffff10] border border-[#ffffff20] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#0075ff] transition-all duration-300"
                            placeholder={`Option ${optionIndex + 1}`}
                            required
                          />
                        ))}
                      </div>

                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="text"
                        value={question.correct_option}
                        onChange={(e) => handleChange(e, "questions", "correct_option", index)}
                        className="w-full px-4 py-3 bg-[#ffffff10] border border-[#ffffff20] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#0075ff] transition-all duration-300"
                        placeholder="Enter correct option"
                        required
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 px-6 py-3 bg-gradient-to-r from-[#0075ff] to-[#00a3ff] rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              ) : (
                "Create Quiz"
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default QuizCreation;
