import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../App";

interface User {
  _id: string;
  name: string;
  email: string;
  wallet_id: string;
  profile_pic: string;
  resume_url: string;
  description: string;
  tag: string;
  certificates: string;
}

interface Wallet {
  current_balance: number;
}

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [walletBalances, setWalletBalances] = useState<{ [key: string]: number }>({});
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}api/wallet/users`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data.users);
        fetchWalletBalances(data.users);
      } catch (err) {
        setError("Error fetching leaderboard data.");
      }
    };

    const fetchWalletBalances = async (users: User[]) => {
      const balances: { [key: string]: number } = {};

      await Promise.all(
        users.map(async (user) => {
          if (user.wallet_id) {
            try {
              const response = await fetch(`${API_URL}api/wallet/${user.wallet_id}`, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              });

              if (response.ok) {
                const walletData: { data: Wallet } = await response.json();
                balances[user._id] = walletData.data.current_balance;
              } else {
                balances[user._id] = 0;
              }
            } catch {
              balances[user._id] = 0;
            }
          } else {
            balances[user._id] = 0;
          }
        })
      );

      setWalletBalances(balances);
    };

    fetchUsers();
  }, []);

  const toggleUser = (id: string) => {
    setSelectedUser(selectedUser === id ? null : id);
  };

  const handleDragStart = (id: string) => {
    setDragging(id);
  };

  const handleDragEnd = () => {
    setDragging(null);
  };

  const handleDrop = (id: string) => {
    if (dragging) {
      // Handle the logic for sorting or other drop actions here.
      console.log(`Dropped user ${dragging} on ${id}`);
    }
    setDragging(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1535] to-[#111c44] text-white p-8 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-8 text-neon-blue bg-gradient-to-r from-[#00f6ff] to-[#ff61a6] bg-clip-text text-transparent">
        Cyberpunk Leaderboard
      </h1>

      {error && <p className="text-red-500 text-lg mb-4">{error}</p>}

      <div className="w-full max-w-2xl">
        {users
          .sort((a, b) => (walletBalances[b._id] || 0) - (walletBalances[a._id] || 0))
          .map((user, index) => (
            <motion.div
              key={user._id}
              className={`bg-[#ffffff08] border border-1 border-neon-purple p-5 mb-6 rounded-lg cursor-pointer transform transition-all ${
                dragging === user._id ? "bg-gradient-to-r from-[#ff61a6] to-[#00f6ff]" : "hover:bg-[#ffffff20]"
              } hover:shadow-xl hover:scale-105`}
              onClick={() => toggleUser(user._id)}
              onDragStart={() => handleDragStart(user._id)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(user._id)}
              draggable
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center">
                <span className="text-neon-blue text-xl font-semibold">#{index + 1}</span>
                <span className="text-lg text-neon-green">{user.name}</span>
                <span className="text-sm text-gray-400">Score: {walletBalances[user._id] || 0}</span>
              </div>

              {selectedUser === user._id && (
                <motion.div
                  className="mt-4 p-4 rounded-lg bg-[#ffffff08] text-white"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={user.profile_pic ? user.profile_pic : `${API_URL}profile.png`}
                      alt={user.name}
                      className="w-20 h-20 rounded-full mb-2 border-2 border-neon-green shadow-lg"
                    />
                    <div className="ml-4">
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Tag:</strong> {user.tag}</p>
                      <p><strong>Description:</strong> {user.description}</p>
                      <p><strong>Resume:</strong> <a href={user.resume_url} target="_blank" className="text-neon-blue underline">View</a></p>
                      <p><strong>Certificates:</strong> <a href={user.certificates} target="_blank" className="text-neon-blue underline">View</a></p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default Leaderboard;
