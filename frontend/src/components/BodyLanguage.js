// import React, { useEffect, useRef, useState } from "react";

// export default function BodyLanguage({ onPoseClassified }) {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!window.Pose || !window.CameraUtils) {
//       console.error("MediaPipe Pose or CameraUtils not loaded!");
//       return;
//     }

//     // Setup pose model
//     const pose = new window.Pose({
//       locateFile: (file) =>
//         `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
//     });

//     pose.setOptions({
//       modelComplexity: 1,
//       smoothLandmarks: true,
//       minDetectionConfidence: 0.5,
//       minTrackingConfidence: 0.5,
//     });

//     pose.onResults((results) => {
//       const canvas = canvasRef.current;
//       if (!canvas) return;
//       const ctx = canvas.getContext("2d");

//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

//       if (results.poseLandmarks) {
//         for (const landmark of results.poseLandmarks) {
//           const x = landmark.x * canvas.width;
//           const y = landmark.y * canvas.height;
//           ctx.beginPath();
//           ctx.arc(x, y, 5, 0, 2 * Math.PI);
//           ctx.fillStyle = "red";
//           ctx.fill();
//         }

//         // Simple posture classification
//         const leftShoulder = results.poseLandmarks[11];
//         const rightShoulder = results.poseLandmarks[12];
//         const leftHip = results.poseLandmarks[23];
//         const rightHip = results.poseLandmarks[24];

//         if (leftShoulder && rightShoulder && leftHip && rightHip) {
//           const avgShoulderY = (leftShoulder.y + rightShoulder.y) / 2;
//           const avgHipY = (leftHip.y + rightHip.y) / 2;
//           if (avgShoulderY > avgHipY + 0.05) {
//             onPoseClassified("Slouching / Anxiety");
//           } else {
//             onPoseClassified("Neutral / Upright");
//           }
//         } else {
//           onPoseClassified("Pose landmarks incomplete");
//         }
//       } else {
//         onPoseClassified("No pose detected");
//       }
//     });

//     // Start camera using CameraUtils.Camera
//     const camera = new window.CameraUtils.Camera(videoRef.current, {
//       onFrame: async () => {
//         if (!videoRef.current) return;
//         await pose.send({ image: videoRef.current });
//       },
//       width: 640,
//       height: 480,
//     });

//     camera
//       .start()
//       .then(() => {
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Camera start error:", err);
//       });

//     return () => {
//       camera.stop();
//       pose.close();
//     };
//   }, [onPoseClassified]);

//   return (
//     <div style={{ position: "relative", width: 640, height: 480 }}>
//       {loading && (
//         <p style={{ color: "white", position: "absolute", zIndex: 10 }}>
//           Loading MediaPipe Pose model and camera...
//         </p>
//       )}
//       <video
//         ref={videoRef}
//         style={{
//           position: "absolute",
//           width: 1,
//           height: 1,
//           top: -1000,
//           left: -1000,
//         }}
//         width="640"
//         height="480"
//         playsInline
//         muted
//         autoPlay
//       />
//       <canvas
//         ref={canvasRef}
//         width="640"
//         height="480"
//         style={{ position: "relative", zIndex: 1 }}
//       />
//     </div>
//   );
// }
