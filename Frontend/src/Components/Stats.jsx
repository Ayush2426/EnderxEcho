"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { axiosInstance } from "../Lib/axios"; // Adjust path if needed
import toast from "react-hot-toast";

// --- Helper Functions & Interfaces ---
const cn = (...classes) => classes.filter(Boolean).join(" ");

const CircleProgress = ({ data, index }) => {
  const strokeWidth = 16;
  const radius = (data.size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress =
    data.value >= 100 ? 0 : ((100 - data.value) / 100) * circumference;
  const gradientId = `gradient-${data.label.toLowerCase()}`;
  const gradientUrl = `url(#${gradientId})`;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
    >
      <svg
        width={data.size}
        height={data.size}
        viewBox={`0 0 ${data.size} ${data.size}`}
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: data.color, stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: data.gradientEnd, stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>
        <circle
          cx={data.size / 2}
          cy={data.size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-base-300"
        />
        <motion.circle
          cx={data.size / 2}
          cy={data.size / 2}
          r={radius}
          fill="none"
          stroke={gradientUrl}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: progress }}
          transition={{ duration: 1.8, delay: index * 0.2, ease: "easeInOut" }}
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
};

// --- Main Stats Card Component ---
export default function StatsCard({ className }) {
  // UPDATED: Added totalVisits to the state
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalConversations: 0,
    totalVisits: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/stats");
        setStats(res.data);
      } catch (error) {
        toast.error("Could not load app statistics.");
      }
    };
    fetchStats();
  }, []);

  // REMOVED: formatTime and useScreenTimeStore are no longer needed

  const activities = [
    {
      label: "TOTAL USERS",
      value: (stats.totalUsers / 50) * 100, // Example: Target is 50 users
      color: "#FF2D55",
      gradientEnd: "#FF6B8B",
      size: 200,
      current: stats.totalUsers,
      target: 50,
      unit: "Users",
    },
    {
      label: "CONVERSATIONS",
      value: (stats.totalConversations / 100) * 100, // Example: Target is 100
      color: "#A3F900",
      gradientEnd: "#C5FF4D",
      size: 160,
      current: stats.totalConversations,
      target: 100,
      unit: "Chats",
    },
    // UPDATED: Replaced "SCREEN TIME" with "SITE VISITS"
    {
      label: "SITE VISITS",
      value: (stats.totalVisits / 1000) * 100, // Example: Target is 1000 visits
      color: "#04C7DD",
      gradientEnd: "#4DDFED",
      size: 120,
      current: stats.totalVisits,
      target: 1000,
      unit: "Visits",
    },
  ];

  return (
    <div
      className={cn(
        "relative w-full max-w-3xl mx-auto p-8 rounded-3xl bg-base-100",
        className
      )}
    >
      <div className="flex flex-col items-center gap-8">
        <motion.h2
          className="text-2xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          App Statistics
        </motion.h2>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-[200px] h-[200px]">
            {activities.map((activity, index) => (
              <CircleProgress
                // Key updated to re-trigger animation when data changes
                key={`${activity.label}-${activity.current}`}
                data={activity}
                index={index}
              />
            ))}
          </div>

          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {activities.map((activity) => (
              <div key={activity.label} className="flex flex-col">
                <span className="text-sm font-medium text-base-content/70">
                  {activity.label}
                </span>
                <span
                  className="text-2xl font-semibold"
                  style={{ color: activity.color }}
                >
                  {activity.current}
                  <span className="text-base ml-1 text-base-content/70">
                    / {activity.target} {activity.unit}
                  </span>
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
