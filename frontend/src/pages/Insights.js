import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import axios from "axios";

export default function Insights() {
  const { token } = useAuth();
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await axios.get("http://localhost:3001/api/insights", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInsights(res.data);
      } catch (err) {
        setError("Failed to load insights. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    if (token) fetchInsights();
  }, [token]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Your Mood & Emotion Trends</h2>

      {loading ? (
        <p style={styles.message}>Loading insights...</p>
      ) : error ? (
        <p style={{ ...styles.message, color: "red" }}>{error}</p>
      ) : insights.length === 0 ? (
        <p style={styles.message}>No insights recorded yet.</p>
      ) : (
        <ul style={styles.list}>
          {insights.map((entry) => (
            <li key={entry._id} style={styles.item}>
              <strong>{entry.timestamp}</strong>:{" "}
              <span style={styles.mood}>{entry.mood}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    maxWidth: "700px",
    margin: "auto",
    background: "#f5f7fa",
    borderRadius: "12px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    marginTop: "40px",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
    textAlign: "center",
  },
  message: {
    textAlign: "center",
    color: "#555",
  },
  list: {
    listStyleType: "none",
    padding: 0,
  },
  item: {
    padding: "12px 16px",
    background: "#fff",
    marginBottom: "10px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    display: "flex",
    justifyContent: "space-between",
  },
  mood: {
    fontWeight: "bold",
    color: "#2b6cb0",
    textTransform: "capitalize",
  },
};
