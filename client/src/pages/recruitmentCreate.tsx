import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../App";

interface Stage {
  stage_name: string;
  stage_type: string;
  description?: string;
  id?: string;
}

const CreateRecruitmentDrive: React.FC = () => {
  const [driveName, setDriveName] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [companyId, setCompanyId] = useState<string>("");
  const [stages, setStages] = useState<Stage[]>([]);
  const [currentStage, setCurrentStage] = useState<Stage>({ stage_name: "", stage_type: "" });
  const [isStageDialogOpen, setIsStageDialogOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAddStage = () => {
    if (!currentStage.stage_name || !currentStage.stage_type) {
      setError("Please fill in all stage fields");
      return;
    }
    setStages([...stages, currentStage]);
    setCurrentStage({ stage_name: "", stage_type: "" });
    setIsStageDialogOpen(false);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!driveName || !startDate || !endDate || !companyId || stages.length === 0) {
      setError("Please fill all required fields and add at least one stage.");
      return;
    }

    try {
      const formattedStages = stages.map(({ id, ...stage }) => ({
        ...stage,
        stage_id: id,
      }));

      const response = await fetch(`${API_URL}/api/community/create/drive`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `BEARER ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          drive_name: driveName,
          start_date: new Date(startDate).getTime(),
          end_date: new Date(endDate).getTime(),
          description,
          stages: formattedStages,
          company_id: companyId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Recruitment Drive Created Successfully!");
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        setError(data.message || "Failed to create recruitment drive");
      }
    } catch (error) {
      console.error("Error creating recruitment drive:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] p-4 sm:p-6 md:p-8 font-['Inter']">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent">
            Create Recruitment Drive
          </h1>
        </motion.div>

        {/* Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-400 text-lg text-center mb-6"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-green-400 text-lg text-center mb-6"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Form */}
        <motion.div
          className="bg-gradient-to-r from-[#ffffff0a] to-[#ffffff05] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-gray-400 mb-2">Drive Name</label>
                <input
                  type="text"
                  value={driveName}
                  onChange={(e) => setDriveName(e.target.value)}
                  className="w-full bg-[#ffffff0a] border border-[#ffffff20] rounded-xl p-3 text-white focus:outline-none focus:border-purple-500/50"
                  placeholder="Enter drive name"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Company ID</label>
                <input
                  type="text"
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  className="w-full bg-[#ffffff0a] border border-[#ffffff20] rounded-xl p-3 text-white focus:outline-none focus:border-purple-500/50"
                  placeholder="Enter company ID"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#ffffff0a] border border-[#ffffff20] rounded-xl p-3 text-white focus:outline-none focus:border-purple-500/50 min-h-[100px]"
                  placeholder="Enter description"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-gray-400 mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-[#ffffff0a] border border-[#ffffff20] rounded-xl p-3 text-white focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-[#ffffff0a] border border-[#ffffff20] rounded-xl p-3 text-white focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Stages</label>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsStageDialogOpen(true)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300"
                >
                  + Add Stage
                </motion.button>
              </div>

              <div className="mt-4">
                <AnimatePresence>
                  {stages.map((stage, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-purple-500/10 rounded-lg p-4 mb-2"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-purple-400 font-medium">{stage.stage_name}</h3>
                          <p className="text-gray-400 text-sm">{stage.stage_type}</p>
                        </div>
                        <input
                          type="text"
                          placeholder="Stage ID"
                          value={stage.id || ""}
                          onChange={(e) => {
                            const newStages = [...stages];
                            newStages[index].id = e.target.value;
                            setStages(newStages);
                          }}
                          className="bg-[#ffffff0a] border border-[#ffffff20] rounded-lg p-2 text-white text-sm w-32 focus:outline-none focus:border-purple-500/50"
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="w-full mt-8 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300"
          >
            Create Drive
          </motion.button>
        </motion.div>

        {/* Stage Dialog */}
        {isStageDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#111111] border border-[#ffffff20] rounded-xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold text-purple-400 mb-4">Add Stage</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 mb-2">Stage Name</label>
                  <input
                    type="text"
                    value={currentStage.stage_name}
                    onChange={(e) => setCurrentStage({ ...currentStage, stage_name: e.target.value })}
                    className="w-full bg-[#ffffff0a] border border-[#ffffff20] rounded-xl p-3 text-white focus:outline-none focus:border-purple-500/50"
                    placeholder="Enter stage name"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Stage Type</label>
                  <select
                    value={currentStage.stage_type}
                    onChange={(e) => setCurrentStage({ ...currentStage, stage_type: e.target.value })}
                    className="w-full bg-[#ffffff0a] border border-[#ffffff20] rounded-xl p-3 text-white focus:outline-none focus:border-purple-500/50"
                  >
                    <option value="">Select type</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Contest">Contest</option>
                    <option value="Interview">Interview</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Description (Optional)</label>
                  <textarea
                    value={currentStage.description}
                    onChange={(e) => setCurrentStage({ ...currentStage, description: e.target.value })}
                    className="w-full bg-[#ffffff0a] border border-[#ffffff20] rounded-xl p-3 text-white focus:outline-none focus:border-purple-500/50"
                    placeholder="Enter description"
                  />
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsStageDialogOpen(false)}
                    className="px-4 py-2 border border-purple-500/30 rounded-xl text-purple-400 hover:bg-purple-500/10 transition-all duration-300"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddStage}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300"
                  >
                    Add Stage
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default CreateRecruitmentDrive;