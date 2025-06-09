import React, { useState, useEffect } from "react";
import "../css/EmotionFusion.css";

export default function EmotionFusion({
  faceExpressions,
  pitch,
  poseEmotion,
  onDetect,
}) {
  const [fusedEmotion, setFusedEmotion] = useState("Neutral");

  useEffect(() => {
    // Defensive: lowercase keys to avoid case mismatches
    const normalizedFaceExpressions = faceExpressions
      ? Object.fromEntries(
          Object.entries(faceExpressions).map(([k, v]) => [k.toLowerCase(), v])
        )
      : {};

    // Find dominant face emotion or fallback neutral
    let dominantFaceEmotion = Object.entries(normalizedFaceExpressions).reduce(
      (max, cur) => (cur[1] > max[1] ? cur : max),
      ["neutral", 0]
    )[0];

    // Pitch thresholds for low, moderate, high
    let pitchLevel = "moderate";
    if (pitch !== undefined && pitch !== null) {
      if (pitch > 270) pitchLevel = "high";
      else if (pitch < 160) pitchLevel = "low";
    }

    // Base default
    let combinedEmotion = "Neutral";
    let baseEmotion = "neutral";

    // Fusion logic
    switch (dominantFaceEmotion) {
      case "happy":
        baseEmotion = "happy";
        combinedEmotion =
          pitchLevel === "high"
            ? "Happy & Excited"
            : pitchLevel === "moderate"
            ? "Happy & Relaxed"
            : "Calm & Content";
        break;
      case "sad":
        baseEmotion = "sad";
        combinedEmotion =
          pitchLevel === "high" ? "Sad & Distressed" : "Sad & Withdrawn";
        break;
      case "angry":
        baseEmotion = "angry";
        combinedEmotion =
          pitchLevel === "high" ? "Angry & Tense" : "Frustrated";
        break;
      case "surprised":
        baseEmotion = "surprised";
        combinedEmotion =
          pitchLevel === "high" ? "Surprised & Alert" : "Mildly Shocked";
        break;
      case "disgusted":
        baseEmotion = "disgusted";
        combinedEmotion = "Displeased / Disgusted";
        break;
      case "fearful":
        baseEmotion = "fearful";
        combinedEmotion = "Anxious / Fearful";
        break;
      default:
        baseEmotion = "neutral";
        combinedEmotion = "Calm & Neutral";
    }

    // Integrate pose emotion (normalize case)
    const normalizedPose = poseEmotion ? poseEmotion.toLowerCase() : "";
    if (
      normalizedPose.includes("anxiety") ||
      normalizedPose.includes("slouching")
    ) {
      combinedEmotion += " with Anxiety";
    } else if (
      normalizedPose.includes("neutral") &&
      combinedEmotion.toLowerCase().includes("neutral")
    ) {
      combinedEmotion = "Calm & Neutral";
    }

    setFusedEmotion(combinedEmotion);
    if (onDetect) onDetect(baseEmotion, combinedEmotion); // pass simple and full
  }, [faceExpressions, pitch, poseEmotion, onDetect]);

  return (
    <div className="fusion-container">
      <h3>Fused Emotion</h3>
      <p>{fusedEmotion}</p>
    </div>
  );
}
