import React, { useEffect, useState, useRef } from "react";
import "../css/VoicePitchDetector.css";
export default function VoicePitchDetector({ onPitchDetected }) {
  const [pitch, setPitch] = useState(null);
  const pitchRef = useRef(null); // To prevent stale closure inside useEffect

  useEffect(() => {
    let audioContext;
    let analyser;
    let source;
    let rafId;

    const getUserMic = async () => {
      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        source = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);

        const bufferLength = analyser.fftSize;
        const dataArray = new Float32Array(bufferLength);

        const detectPitch = () => {
          analyser.getFloatTimeDomainData(dataArray);

          const autoCorrelate = (buf, sampleRate) => {
            let SIZE = buf.length;
            let rms = 0;
            for (let i = 0; i < SIZE; i++) rms += buf[i] * buf[i];
            rms = Math.sqrt(rms / SIZE);
            if (rms < 0.01) return -1;

            let r1 = 0,
              r2 = SIZE - 1,
              thres = 0.2;
            for (let i = 0; i < SIZE / 2; i++) {
              if (Math.abs(buf[i]) < thres) {
                r1 = i;
                break;
              }
            }
            for (let i = 1; i < SIZE / 2; i++) {
              if (Math.abs(buf[SIZE - i]) < thres) {
                r2 = SIZE - i;
                break;
              }
            }

            buf = buf.slice(r1, r2);
            SIZE = buf.length;

            let c = new Array(SIZE).fill(0);
            for (let i = 0; i < SIZE; i++) {
              for (let j = 0; j < SIZE - i; j++) {
                c[i] += buf[j] * buf[j + i];
              }
            }

            let d = 0;
            while (c[d] > c[d + 1]) d++;
            let maxval = -1,
              maxpos = -1;
            for (let i = d; i < SIZE; i++) {
              if (c[i] > maxval) {
                maxval = c[i];
                maxpos = i;
              }
            }

            let T0 = maxpos;
            let pitch = sampleRate / T0;
            return pitch > 50 && pitch < 1000 ? pitch : -1;
          };

          const detectedPitch = autoCorrelate(
            dataArray,
            audioContext.sampleRate
          );
          const finalPitch =
            detectedPitch > 0 ? detectedPitch.toFixed(2) : null;

          if (finalPitch !== pitchRef.current && finalPitch) {
            pitchRef.current = finalPitch;
            setPitch(finalPitch);
            if (onPitchDetected && typeof onPitchDetected === "function") {
              onPitchDetected(finalPitch);
            }
          }

          rafId = requestAnimationFrame(detectPitch);
        };

        detectPitch();
      } catch (err) {
        console.error("Error accessing mic", err);
      }
    };

    getUserMic();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (audioContext) audioContext.close();
    };
  }, [onPitchDetected]);

  return (
    <div className="voice-pitch-container">
      <h3>Voice Pitch Detector</h3>
      <p>{pitch ? `Pitch: ${pitch} Hz` : "Detecting..."}</p>
    </div>
  );
}
