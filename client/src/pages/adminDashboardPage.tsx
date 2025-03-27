import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { API_URL } from "../App";

interface User {
  _id: string;
  name: string;
  email: string;
  wallet_id: string;
  resume_url: string;
  description: string;
  tag: string;
  profile_pic: string;
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/wallet/users`, {
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
              const response = await fetch(`${API_URL}/api/wallet/${user.wallet_id}`, {
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

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6 text-neon-blue">Cyberpunk Leaderboard</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="w-full max-w-2xl">
        {users
          .sort((a, b) => (walletBalances[b._id] || 0) - (walletBalances[a._id] || 0))
          .map((user, index) => (
            <motion.div
              key={user._id}
              className="bg-gray-900 border-2 border-neon-purple p-4 mb-4 rounded-lg cursor-pointer"
              onClick={() => toggleUser(user._id)}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center">
                <span className="text-neon-blue text-xl font-bold">#{index + 1}</span>
                <span className="text-lg text-neon-green">{user.name}</span>
                <span className="text-sm text--400">Score: {walletBalances[user._id] || 0}</span>
              </div>

              {selectedUser === user._id && (
                <motion.div
                  className="mt-4 p-3 bg-gray-800 rounded-lg"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.5 }}
                >
                  <img
                    src={user.profile_pic}
                    alt={user.name}
                    className="w-16 h-16 rounded-full mb-2 border-2 border-neon-green"
                  />
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Tag:</strong> {user.tag}</p>
                  <p><strong>Description:</strong> {user.description}</p>
                  <p><strong>Resume:</strong> <a href={user.resume_url} target="_blank" className="text-neon-blue underline">View</a></p>
                  <p><strong>Certificates:</strong> <a href={user.certificates} target="_blank" className="text-neon-blue underline">View</a></p>
                </motion.div>
              )}
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default Leaderboard;