import React, { useState, useEffect } from "react";
import "../css/TherapySession.css";

import Chatbot from "../components/ChatBot";
import FacialExpression from "../components/FacialExpression";
import VoicePitchDetector from "../components/VoicePitchDetector";
import EmotionFusion from "../components/EmotionFusion";
// import BodyLanguage from "../components/BodyLanguage"; // Future use

export default function TherapySession() {
  const [faceExpressions, setFaceExpressions] = useState(null);
  const [pitch, setPitch] = useState(null);
  // const [poseEmotion, setPoseEmotion] = useState(null); // For future use

  const [autoMessage, setAutoMessage] = useState(null);
  const [lastTriggeredEmotion, setLastTriggeredEmotion] = useState(null);
  const [firstEmotionTriggered, setFirstEmotionTriggered] = useState(false); // NEW

  // Combine all sources of emotions
  const detectDominantEmotion = () => {
    const emotions = [faceExpressions, pitch]; // pitch is already formatted
    for (const source of emotions) {
      if (source && typeof source === "object" && source.emotion) {
        return source.emotion; // string like "happy"
      } else if (source && typeof source === "object") {
        // Facial expressions — choose the dominant one
        const dominant = Object.entries(source).reduce(
          (max, cur) => (cur[1] > max[1] ? cur : max),
          ["neutral", 0]
        )[0];
        return dominant;
      }
    }
    return null;
  };

  // Initial auto greeting based on first detected emotion
  useEffect(() => {
    const newEmotion = detectDominantEmotion();
    if (newEmotion && !firstEmotionTriggered) {
      setAutoMessage(newEmotion);
      setLastTriggeredEmotion(newEmotion);
      setFirstEmotionTriggered(true); // prevent repeat
    }
  }, [faceExpressions, pitch, firstEmotionTriggered]);

  return (
    <div className="therapy-session">
      <h2>Live Therapy Session</h2>
      <div className="therapy-layout">
        <div className="therapy-left">
          <FacialExpression onExpressionDetected={setFaceExpressions} />
          <div className="fusion-voice-container">
            <VoicePitchDetector onPitchDetected={setPitch} />
            {/* Future pose detection support */}
            {/* <BodyLanguage onPoseClassified={setPoseEmotion} /> */}
            <EmotionFusion faceExpressions={faceExpressions} pitch={pitch} />
          </div>
        </div>
        <div className="therapy-right">
          <Chatbot
            autoMessage={autoMessage} // ✅ valid variable
            detectedEmotion={detectDominantEmotion()} // ✅ call to your function
          />
        </div>
      </div>
    </div>
  );
}
