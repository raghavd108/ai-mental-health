import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./components/AuthPage";
import Home from "./pages/Home";
import TherapySession from "./pages/TherapySession";
import Insights from "./pages/Insights";
import Settings from "./pages/Settings";
import Navbar from "./components/Navbar";
import { EmotionProvider } from "./context/EmotionContext";

export default function App() {
  const [faceExpressions, setFaceExpressions] = useState(null);
  const [pitch, setPitch] = useState(null);
  const [poseEmotion, setPoseEmotion] = useState(null);

  return (
    <EmotionProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/therapy"
            element={
              <TherapySession
                faceExpressions={faceExpressions}
                setFaceExpressions={setFaceExpressions}
                pitch={pitch}
                setPitch={setPitch}
                poseEmotion={poseEmotion}
                setPoseEmotion={setPoseEmotion}
              />
            }
          />
          <Route path="/insights" element={<Insights />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<AuthPage />} />
        </Routes>
      </Router>
    </EmotionProvider>
  );
}
