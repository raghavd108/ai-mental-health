import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import "../css/FacialExpression.css";

const MODEL_URL = "/models";

export default function FacialExpression({ onExpressionDetected }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  const detectExpressions = async () => {
    if (
      webcamRef.current &&
      webcamRef.current.video.readyState === 4 &&
      modelsLoaded
    ) {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;
      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
      };

      faceapi.matchDimensions(canvas, displaySize);

      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

      if (
        detections.length > 0 &&
        onExpressionDetected &&
        typeof onExpressionDetected === "function"
      ) {
        onExpressionDetected(detections[0].expressions);
      }
    }
  };

  useEffect(() => {
    let interval;
    if (modelsLoaded) {
      interval = setInterval(detectExpressions, 500);
    }
    return () => clearInterval(interval);
  }, [modelsLoaded]);

  return (
    <div className="facial-expression-container">
      <Webcam
        ref={webcamRef}
        audio={false}
        videoConstraints={{ facingMode: "user" }}
        className="facial-expression-video"
      />
      <canvas ref={canvasRef} className="facial-expression-canvas" />
    </div>
  );
}
