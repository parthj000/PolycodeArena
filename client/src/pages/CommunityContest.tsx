import React, { useEffect, useState } from "react";
import { API_URL } from "../App";
import { useNavigate } from "react-router-dom";

const ContestPageCommunity: React.FC = () => {
  const [contests, setContests] = useState<any[]>([]);
  const [selectedContest, setSelectedContest] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await fetch(`${API_URL}/api/community/contest`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `BEARER ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setContests(data.data);
        } else {
          console.error("Failed to fetch contests");
        }
      } catch (error) {
        console.error("Error fetching contests:", error);
      }
    };

    fetchContests();
  }, []);

  const handleJoinContest = (contest: any) => {
    navigate(`/community/join/${contest._id}`);
  };

  const handleBackToList = () => {
    setSelectedContest(null);
  };

  const handleCopy = () => {
    if (selectedContest) {
      navigator.clipboard.writeText(selectedContest.meta.invitation_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="p-6 min-h-screen"
     
    >
      {!selectedContest ? (
        <>
          
          <div
            onClick={() => navigate("/community/create")}
            className="border-2 border-dashed border-gray-500 p-10 text-center cursor-pointer mb-8 rounded-lg bg-black hover:border-white"
          >
            <span className="text-3xl font-semibold text-gray-300">+ Create Contest</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contests.map((contest, index) => (
              <div
                key={index}
                
 className="border rounded-lg shadow-md p-4 bg-[radial-gradient(circle,#32343756,black)] border-[#91919148] cursor-pointer hover:border-red-300 hover:shadow-lg"
  

                onClick={() => setSelectedContest(contest)}
              >
                <h2 className="text-2xl font-bold text-white-400 mb-4">
                  {contest.meta.contest_name}
                </h2>
                <div className="text-gray-300  rounded-lg">
                    <strong>Start:</strong> {new Date(contest.start_time * 1000).toLocaleString()}
                  </div>
                  <div className="text-gray-300 rounded-lg">
                    <strong>End:</strong> {new Date(contest.end_time * 1000).toLocaleString()}
                  </div>
                
                <button
                  className="mt-4 py-2 px-4 rounded-md  transition-transform duration-300 bg-[#64666b56] "
                >
                  Read More
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div>
          <button
            className="mb-4 py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700"
            onClick={handleBackToList}
          >
            ← Back to List
          </button>
          <div className="border-none border-gray-500 rounded-lg py-6 bg-black space-y-4">
            <h1 className="text-4xl font-bold text-green-400">
              {selectedContest.meta.contest_name}
            </h1>
            <p className="text-lg text-gray-300">
              Contest ID: <span className="text-white">{selectedContest._id}</span>
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-300 bg-gray-800 p-2 rounded">
                <strong>Start:</strong> {new Date(selectedContest.start_time * 1000).toLocaleString()}
              </div>
              <div className="text-gray-300 bg-gray-800 p-2 rounded">
                <strong>End:</strong> {new Date(selectedContest.end_time * 1000).toLocaleString()}
              </div>
              <div className="text-gray-300  p-2 rounded col-span-2">
                <strong>Prize Distribution:</strong>
                <ul>
                  {selectedContest.meta.prize_distribution.map((prize: string, idx: number) => (
                    <li key={idx}>
                      {`${idx + 1} prize: ${prize}`}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-gray-300">
              Description: {selectedContest.meta.description || "No description available."}
            </p>
            <p
              className="text-gray-300 cursor-pointer "
              onClick={handleCopy}
              title="Click to copy"
            >
              Invitation Code: <span className="font-mono bg-gray-700 px-4 py-2 rounded">{selectedContest.meta.invitation_code}</span>
              {copied && (
              <p className="text-green-500 text-sm my-2">Copied to clipboard!</p>
            )}
            </p>
            
            <button
              className="mt-4 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              onClick={() => handleJoinContest(selectedContest)}
            >
              Join Contest
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestPageCommunity;
