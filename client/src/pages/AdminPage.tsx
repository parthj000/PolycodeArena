import React, { useState } from "react";
import { API_URL } from "../App";
import { motion, AnimatePresence } from "framer-motion";

interface TestCase {
  input: string;
  expected_output: string;
}

interface Question {
  question_id: number;
  question_text: string;
  question_description: string;
  max_marks: number;
  test_cases: {
    public: TestCase[];
    hidden: TestCase[];
  };
}

interface ContestData {
  contest_name: string;
  invitation_code: string;
  question_set: Question[];
  prize_distribution: number[];
  start_time: string;
  end_time: string;
  description: string;
  private: boolean;
}

const AdminPage: React.FC = () => {
  const [contestData, setContestData] = useState<ContestData>({
    contest_name: "",
    invitation_code: "",
    question_set: [
      {
        question_id: 1,
        question_text: "",
        question_description: "",
        max_marks: 0,
        test_cases: {
          public: [
            {
              input: "",
              expected_output: "",
            },
          ],
          hidden: [
            {
              input: "",
              expected_output: "",
            },
          ],
        },
      },
    ],
    prize_distribution: [0, 0, 0],
    start_time: "",
    end_time: "",
    description: "",
    private: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    section: "contest" | "questions" | "prize",
    key: string,
    index?: number,
    type?: "public" | "hidden",
    testCaseIndex?: number
  ) => {
    const value =
      e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
  
    setContestData((prevState) => {
      const newState = { ...prevState };
  
      if (section === "contest") {
        // Explicitly assert the type of `key` and `value`
        (newState[key as keyof ContestData] as unknown) = value;
      } else if (section === "questions") {
        if (type && testCaseIndex !== undefined) {
          const testCases = newState.question_set[index!].test_cases[type];
          // Explicitly assert the type of the test case being modified
          (testCases[testCaseIndex!] as unknown as Record<string, unknown>)[key] = value;
        } else {
          const question = newState.question_set[index!];
          // Ensure `key` maps to a valid property of `Question`
          (question[key as keyof Question] as unknown) =
            key === "max_marks" ? Number(value) : value;
        }
      } else if (section === "prize") {
        newState.prize_distribution[index!] = Number(value);
      }
  
      return newState;
    });
  };
  
  
  
  
  

  const handleTestCaseAdd = (questionIndex: number, type: "public" | "hidden") => {
    setContestData((prevState) => {
      const newState = { ...prevState };
      newState.question_set[questionIndex].test_cases[type].push({
        input: "",
        expected_output: "",
      });
      return newState;
    });
  };

  const handleQuestionAdd = () => {
    setContestData((prevState) => ({
      ...prevState,
      question_set: [
        ...prevState.question_set,
        {
          question_id: prevState.question_set.length + 1,
          question_text: "",
          question_description: "",
          max_marks: 0,
          test_cases: {
            public: [
              {
                input: "",
                expected_output: "",
              },
            ],
            hidden: [
              {
                input: "",
                expected_output: "",
              },
            ],
          },
        },
      ],
    }));
  };

  const convertToUnixTimestamp = (dateString: string): number => {
    const date = new Date(dateString);
    return Math.floor(date.getTime() / 1000); // Convert milliseconds to seconds
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Calculate total prize distribution sum
  const totalPrize = contestData.prize_distribution.reduce((acc, prize) => acc + prize, 0);
  const deductionAmount = totalPrize + 20; // Deduct 20 from the account

  // Show alert with deduction amount
  const userConfirmed = window.confirm(`The total prize distribution is ${totalPrize}. An additional 20 will be deducted from your account. Total deduction: ${deductionAmount}. Do you wish to proceed?`);

  if (!userConfirmed) {
    // If the user clicks "Cancel", stop the function execution
    return;
  }

  // Convert start and end times to Unix timestamps
  const startTimestamp = convertToUnixTimestamp(contestData.start_time);
  const endTimestamp = convertToUnixTimestamp(contestData.end_time);

  // Prepare the payload
  const payload = {
    ...contestData,
    start_time: startTimestamp,
    end_time: endTimestamp,
  };

  console.log("Form data as JSON:", JSON.stringify(payload, null, 2));

  try {
    // Send the request to the backend
    const response = await fetch(`${API_URL}api/community/create/contest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `BEARER ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    console.log(responseData, "this is the response");

    if (response.ok) {
      alert("Contest created successfully!");
    } else {
      alert("Error creating contest.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error creating contest.");
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1535] to-[#111c44] p-8 font-['Inter']">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-[#0075ff] to-[#00a3ff] bg-clip-text text-transparent"
          >
            Contest Creation Form
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-400 mt-2"
          >
            Fill out the details to create a new coding contest
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#ffffff10] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-8"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-white text-lg font-medium mb-2">
                  Contest Name
                </label>
                <input
                  type="text"
                  value={contestData.contest_name}
                  onChange={(e) => handleChange(e, "contest", "contest_name")}
                  className="w-full px-4 py-3 bg-[#ffffff08] border border-[#ffffff20] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#0075ff] transition-all duration-300"
                  placeholder="Enter contest name"
                />
              </div>

              <div>
                <label className="block text-white text-lg font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={contestData.description}
                  onChange={(e) => handleChange(e, "contest", "description")}
                  className="w-full px-4 py-3 bg-[#ffffff08] border border-[#ffffff20] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#0075ff] transition-all duration-300 min-h-[100px]"
                  placeholder="Enter contest description"
                />
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-white text-lg font-medium">Private Contest</label>
                <input
                  type="checkbox"
                  checked={contestData.private}
                  onChange={(e) => handleChange(e, "contest", "private")}
                  className="w-5 h-5 rounded border-[#ffffff20] bg-[#ffffff08] checked:bg-[#0075ff] transition-all duration-300"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#ffffff10] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-8"
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#0075ff] to-[#00a3ff] bg-clip-text text-transparent mb-6">
              Questions
            </h2>
            <AnimatePresence>
              {contestData.question_set.map((question, questionIndex) => (
                <motion.div
                  key={questionIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-[#ffffff08] rounded-xl p-6 mb-6"
                >
                  <h3 className="text-xl font-bold text-white mb-4">
                    Question {questionIndex + 1}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white text-lg mb-2">
                        Question Text
                      </label>
                      <input
                        type="text"
                        value={question.question_text}
                        onChange={(e) => handleChange(e, "questions", "question_text", questionIndex)}
                        className="w-full px-4 py-3 bg-[#ffffff08] border border-[#ffffff20] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#0075ff] transition-all duration-300"
                        placeholder="Enter question text"
                      />
                    </div>

                    <div>
                      <label className="block text-white text-lg mb-2">
                        Question Description
                      </label>
                      <textarea
                        value={question.question_description}
                        onChange={(e) => handleChange(e, "questions", "question_description", questionIndex)}
                        className="w-full px-4 py-3 bg-[#ffffff08] border border-[#ffffff20] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#0075ff] transition-all duration-300 min-h-[100px]"
                        placeholder="Enter question description"
                      />
                    </div>

                    <div>
                      <label className="block text-white text-lg mb-2">
                        Max Marks
                      </label>
                      <input
                        type="number"
                        value={question.max_marks}
                        onChange={(e) => handleChange(e, "questions", "max_marks", questionIndex)}
                        className="w-full px-4 py-3 bg-[#ffffff08] border border-[#ffffff20] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#0075ff] transition-all duration-300"
                        placeholder="Enter maximum marks"
                      />
                    </div>

                    {["public", "hidden"].map((type) => (
                      <div key={type} className="mt-6">
                        <h4 className="text-lg font-bold text-white capitalize mb-4">
                          {type} Test Cases
                        </h4>
                        <AnimatePresence>
                          {question.test_cases[type as "public" | "hidden"].map((testCase, testCaseIndex) => (
                            <motion.div
                              key={testCaseIndex}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="bg-[#ffffff05] rounded-xl p-4 mb-4"
                            >
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-white text-lg mb-2">
                                    Input
                                  </label>
                                  <input
                                    type="text"
                                    value={testCase.input}
                                    onChange={(e) => handleChange(e, "questions", "input", questionIndex, type as "public" | "hidden", testCaseIndex)}
                                    className="w-full px-4 py-3 bg-[#ffffff08] border border-[#ffffff20] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#0075ff] transition-all duration-300"
                                    placeholder="Enter input"
                                  />
                                </div>
                                <div>
                                  <label className="block text-white text-lg mb-2">
                                    Expected Output
                                  </label>
                                  <input
                                    type="text"
                                    value={testCase.expected_output}
                                    onChange={(e) => handleChange(e, "questions", "expected_output", questionIndex, type as "public" | "hidden", testCaseIndex)}
                                    className="w-full px-4 py-3 bg-[#ffffff08] border border-[#ffffff20] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#0075ff] transition-all duration-300"
                                    placeholder="Enter expected output"
                                  />
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={() => handleTestCaseAdd(questionIndex, type as "public" | "hidden")}
                          className="px-6 py-2 bg-[#ffffff15] rounded-xl text-white font-medium hover:bg-[#ffffff20] transition-all duration-300"
                        >
                          Add {type} Test Case
                        </motion.button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleQuestionAdd}
              className="px-6 py-3 bg-gradient-to-r from-[#0075ff] to-[#00a3ff] rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300"
            >
              Add Question
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#ffffff10] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-8"
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#0075ff] to-[#00a3ff] bg-clip-text text-transparent mb-6">
              Prize Distribution
            </h2>
            <div className="space-y-4">
              {contestData.prize_distribution.map((prize, index) => (
                <div key={index}>
                  <label className="block text-white text-lg mb-2">
                    Rank {index + 1} Prize
                  </label>
                  <input
                    type="number"
                    value={prize}
                    onChange={(e) => handleChange(e, "prize", "prize_distribution", index)}
                    className="w-full px-4 py-3 bg-[#ffffff08] border border-[#ffffff20] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#0075ff] transition-all duration-300"
                    placeholder={`Enter prize for rank ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#ffffff10] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-8"
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#0075ff] to-[#00a3ff] bg-clip-text text-transparent mb-6">
              Contest Schedule
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-lg mb-2">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  value={contestData.start_time}
                  onChange={(e) => handleChange(e, "contest", "start_time")}
                  className="w-full px-4 py-3 bg-[#ffffff08] border border-[#ffffff20] rounded-xl text-white focus:outline-none focus:border-[#0075ff] transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-white text-lg mb-2">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  value={contestData.end_time}
                  onChange={(e) => handleChange(e, "contest", "end_time")}
                  className="w-full px-4 py-3 bg-[#ffffff08] border border-[#ffffff20] rounded-xl text-white focus:outline-none focus:border-[#0075ff] transition-all duration-300"
                />
              </div>
            </div>
          </motion.div>

          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-[#0075ff] to-[#00a3ff] rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300"
            >
              Create Contest
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminPage;
