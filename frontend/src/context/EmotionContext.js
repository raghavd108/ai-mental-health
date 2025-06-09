import React, { createContext, useState } from "react";

export const EmotionContext = createContext();

export const EmotionProvider = ({ children }) => {
  const [emotions, setEmotions] = useState([]);

  const addEmotion = (emotion) => {
    setEmotions((prev) => [...prev, { emotion, time: Date.now() }]);
  };

  return (
    <EmotionContext.Provider value={{ emotions, addEmotion }}>
      {children}
    </EmotionContext.Provider>
  );
};
