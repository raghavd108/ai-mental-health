import React, { useState, useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "../css/ChatBot.css";

const synth = window.speechSynthesis;

const suggestionsByMood = {
  sad: "I noticed your voice pitch was low. Are you feeling sad?",
  angry: "You sound tense. What's bothering you?",
  happy: "You sound cheerful! What’s making your day great?",
  fearful: "You seem a bit nervous. Want to share what's on your mind?",
  neutral: "I’m here to listen. Tell me what you're feeling.",
  surprised: "You sound surprised! What happened?",
};

const moodRepliesEnglish = {
  sad: [
    "I'm sorry you're feeling this way. Do you want to talk about it?",
    "It’s okay to feel sad sometimes. What can I do to help you?",
    "You're not alone. I’m here to listen.",
    "What do you think triggered these feelings?",
    "Have you experienced this sadness before?",
    "How are you coping with these emotions?",
    "Would you like to try some breathing exercises together?",
    "What support do you need right now?",
    "I'm here to support you. Would you like to reflect on what's making you feel this way?",
    "Have you been able to express this sadness to anyone else?",
    "Sometimes writing down feelings can help. Want to try?",
    "Can we explore any recent events that might have impacted you emotionally?",
  ],
  angry: [
    "Sounds like something's bothering you. Want to share it?",
    "Anger can be tough. Let's explore what’s behind it.",
    "Try taking a deep breath. What triggered this feeling?",
    "Have you noticed any patterns when you get angry?",
    "What usually helps you calm down?",
    "How do you express your anger?",
    "Are there specific people or situations that upset you?",
    "Would you like to practice some relaxation techniques?",
    "It's completely valid to feel angry. Let’s understand it together.",
    "Would it help if we identified the situations that intensify this feeling?",
    "Anger often masks deeper pain. Is there something underlying this emotion?",
    "Let’s talk about how you usually process these moments.",
  ],
  happy: [
    "You sound happy! That’s wonderful. What’s going well today?",
    "Love your energy! Tell me what made you smile?",
    "It’s so nice to hear happiness in your voice. Keep it up!",
    "What activities bring you joy?",
    "How do you usually celebrate your happiness?",
    "Do you feel your happiness is lasting or temporary?",
    "Would you like to share a happy memory with me?",
    "What support helps maintain your positive mood?",
    "I'm glad to witness your joy. What do you think contributes most to this?",
    "Let’s reflect on what activities support your happiness.",
    "Do you have people in your life who encourage this positivity?",
    "What aspects of today felt especially meaningful to you?",
  ],
  fearful: [
    "Feeling nervous? I’m here for you.",
    "Anxiety can be difficult. Want to share what’s making you feel this way?",
    "You’re safe here. Talk to me about what’s worrying you.",
    "When did you start feeling this way?",
    "Are there particular thoughts that increase your fear?",
    "What coping strategies have you tried?",
    "Would you like to practice grounding techniques?",
    "How can I support you in managing this fear?",
    "What’s the worst that you think could happen in this situation?",
    "Sometimes fears are linked to past experiences. Would you like to explore that?",
    "Do you feel this anxiety physically too? Let’s talk about that sensation.",
    "Would guided visualization help calm your mind?",
  ],
  neutral: [
    "I'm here to chat. What’s on your mind?",
    "Let’s talk about anything you’d like.",
    "Feel free to open up. I'm listening.",
    "How have you been feeling lately?",
    "Is there anything bothering you today?",
    "What do you want to focus on during our time?",
    "Would you like to discuss your daily routine or challenges?",
    "How do you usually relax and unwind?",
    "Sometimes just talking can help clarify thoughts. What’s on your mind?",
    "Would you like to explore your current mental space?",
    "Are there areas of your life where you feel stuck or uncertain?",
    "Would a small self-check-in activity help today?",
  ],
  surprised: [
    "You sound surprised! What happened?",
    "Can you tell me more about what surprised you?",
    "How did that make you feel?",
    "Was it a pleasant or unpleasant surprise?",
    "Do surprises often affect your mood?",
    "Would you like to talk about how you usually react to unexpected events?",
    "Are there recent events that caught you off guard?",
    "How do you usually cope when things don’t go as expected?",
    "It seems something unexpected happened. How are you coping with it?",
    "Does this kind of surprise usually affect you emotionally?",
    "Would it help to process the chain of events together?",
    "Do you feel this event may shift something in your plans or routine?",
  ],
};

const moodRepliesHinglish = {
  sad: [
    "Mujhe afsos hai ke aap aise mehsoos kar rahe ho. Kya aap baat karna chahoge?",
    "Kabhi kabhi udaas hona bilkul theek hai. Main aapki madad kaise kar sakta hoon?",
    "Aap akela nahi ho. Main yahan sunne ke liye hoon.",
    "Aapko kya lagta hai is udaasi ka karan kya hai?",
    "Kya aapne pehle bhi aise mehsoos kiya hai?",
    "Aap apne emotions ko kaise handle kar rahe ho?",
    "Kya aap mere saath kuch breathing exercises karna chahoge?",
    "Abhi aapko kis tarah ki madad chahiye?",
    "Aap jo mehsoos kar rahe hain, wo samajhna zaruri hai. Kya hum uss baare mein baat kar sakte hain?",
    "Kya aapne pehle kisi se apni udaasi share ki hai?",
    "Kabhi kabhi apne jazbaat likhne se madad milti hai. Kya aap try karna chahenge?",
    "Kya hum recent kisi ghatna ke baare mein baat kar sakte hain jiska aapke mood par asar pada ho?",
  ],
  angry: [
    "Lagta hai kuch aapko pareshaan kar raha hai. Kya baat karna chahoge?",
    "Gussa kabhi kabhi mushkil hota hai. Chaliye samajhte hain iska karan.",
    "Ek gehri saans lo. Kya cheez gussa la rahi hai?",
    "Kya aapne notice kiya hai ki kab aap zyada gussa hote hain?",
    "Aam tor par kya aapko shaant kar deta hai?",
    "Aap apne gusse ko kaise vyakt karte ho?",
    "Kya kuch khaas log ya situations hain jo aapko pareshaan karte hain?",
    "Kya aap relaxation techniques try karna chahoge?",
    "Gussa aana ek natural reaction hai. Chaliye samajhne ki koshish karte hain ki yeh kyun aaya.",
    "Kya kuch situations hain jahan aapko zyada gussa aata hai?",
    "Kya lagta hai is gusse ke peeche koi aur emotion chhupa hai?",
    "Aap aise situations mein kya karte hain jab gussa zyada hota hai?",
  ],
  happy: [
    "Aapki awaaz khushi se bhari hui hai! Kya acha ho raha hai aaj?",
    "Aapki energy bahut achi hai! Kya baat hai jo aapko muskura diya?",
    "Khushi sun kar accha laga. Aise hi khush rahiye!",
    "Kaunse kaam aapko khushi dete hain?",
    "Aap apni khushi kaise celebrate karte hain?",
    "Kya aapko lagta hai ki yeh khushi lambe samay tak rahegi ya thodi der ke liye hai?",
    "Kya aap apni koi khushi ki yaad mere saath share karna chahoge?",
    "Kaun si cheezein aapki positive mood banaye rakhne mein madad karti hain?",
    "Aapki khushi sun kar bahut accha laga. Kya cheez sabse zyada contribute karti hai?",
    "Chaliye un kaamon ke baare mein baat karte hain jo aapko khushi dete hain.",
    "Kya aapke aas paas aise log hain jo aapko motivate karte hain?",
    "Aaj ka kaunsa moment sabse khaas laga aapko?",
  ],
  fearful: [
    "Nervous lag raha hai? Main yahan hoon aapke liye.",
    "Anxiety mushkil hoti hai. Kya aap bata sakte hain kya cheez aapko aise mehsoos karwati hai?",
    "Yahan aap safe ho. Mujhse apni fikr share karo.",
    "Aapko kab se aise lag raha hai?",
    "Kya koi khaas soch hai jo aapka darr badhata hai?",
    "Aapne kaunse tarike try kiye hain apni anxiety ko handle karne ke liye?",
    "Kya aap grounding techniques try karna chahoge?",
    "Main kaise madad kar sakta hoon aapko apne darr ko samajhne mein?",
    "Kya aap bata sakte ho ki sabse bura kya ho sakta hai is situation mein?",
    "Kya yeh darr kisi purani yaad se juda ho sakta hai?",
    "Kya yeh anxiety physical symptoms ke roop mein bhi mehsoos hoti hai?",
    "Kya aapko lagta hai ki ek chhoti relaxation exercise se madad ho sakti hai?",
  ],
  neutral: [
    "Main yahan baat karne ke liye hoon. Aap kya soch rahe ho?",
    "Koi bhi baat karo, main sun raha hoon.",
    "Khul kar baat karo. Main sun raha hoon.",
    "Aap abhi tak kaise mehsoos kar rahe ho?",
    "Kya aaj kuch pareshaani hai?",
    "Aap is samay kis baat par dhyan dena chahte ho?",
    "Kya aap apni daily routine ya problems ke baare mein baat karna chahoge?",
    "Aap apne aapko kaise relax karte hain?",
    "Kabhi kabhi sirf baat karna bhi thoughts ko clear karta hai. Aap kya soch rahe ho?",
    "Kya aap apne current mental space ke baare mein baat karna chahenge?",
    "Kya aap kisi aise area mein stuck mehsoos kar rahe ho?",
    "Kya aap ek chhoti self-check activity try karna chahenge aaj?",
  ],
  surprised: [
    "Aapki awaaz se lag raha hai aap hairan ho! Kya hua?",
    "Kya aap mujhe bata sakte hain ki aapko kya hairat mein daala?",
    "Isne aapko kaise mehsoos karwaya?",
    "Kya yeh acha surprise tha ya bura?",
    "Kya surprises aapke mood ko prabhavit karte hain?",
    "Kya aap batana chahoge ki aap aam tor par ajeeb situations mein kaise react karte hain?",
    "Kya kuch recent incidents hain jo aapko hairat mein daale hain?",
    "Jab cheezein expected ke mutabik nahi hoti, toh aap kaise cope karte hain?",
    "Lagta hai kuch unexpected hua hai. Aap isse kaise handle kar rahe hain?",
    "Kya aise surprises aapko emotional level par impact karte hain?",
    "Kya hum mil kar is situation ko breakdown karna chahenge?",
    "Kya lagta hai yeh ghatna aapke plans ya routine par asar daalegi?",
  ],
};

// Assuming you have moodRepliesEnglish and moodRepliesHinglish objects already defined

const detectLanguage = (text) => {
  const hinglishKeywords = [
    "kya",
    "hai",
    "kaise",
    "mein",
    "ho",
    "hoon",
    "nahi",
    "toh",
    "batao",
    "tum",
    "aap",
    "chahiye",
    "kar",
    "raha",
    "rha",
    "rahi",
    "kyun",
    "kyuki",
    "kaha",
    "bata",
    "mil",
    "dekho",
    "sun",
    "jaise",
    "mera",
    "tumhara",
    "mujhe",
    "acha",
    "accha",
    "theek",
    "samajh",
    "baat",
    "karna",
    "mehsoos",
    "thoda",
    "zyada",
    "zarurat",
    "madad",
    "soch",
    "bhi",
    "hogaya",
    "ke",
    "par",
    "se",
    "nazar",
    "lagta",
    "lag",
    "jaa",
    "lo",
    "sakta",
    "rahta",
  ];
  return hinglishKeywords.some((word) => text.includes(word));
};

const generateReply = (input, mood) => {
  const text = input.toLowerCase();

  // Detect if input is Hinglish
  const isHinglish = detectLanguage(text);

  // Select which moodReplies dictionary to use
  const moodReplies = isHinglish ? moodRepliesHinglish : moodRepliesEnglish;

  if (text.includes("hello") || text.includes("hi")) {
    return isHinglish
      ? "Hi! Aap kaisa mehsoos kar rahe ho abhi?"
      : "Hi there! How are you feeling right now?";
  }
  if (text.includes("thank")) {
    return isHinglish
      ? "Aapka swagat hai. Jab bhi zarurat ho, main yahan hoon."
      : "You're very welcome. I’m here whenever you need me.";
  }
  if (text.includes("help")) {
    return isHinglish
      ? "Bilkul. Main aapki madad ke liye hoon. Batao kya pareshani hai?"
      : "Of course. I’m here to support you. Tell me what’s bothering you.";
  }
  if (text.includes("stress")) {
    return isHinglish
      ? "Stress kabhi kabhi bahut zyada ho sakta hai. Kya aap baat karna chahenge ki kya wajah hai?"
      : "Stress can be overwhelming. Would you like to talk about what’s causing it?";
  }
  if (text.includes("anxiety")) {
    return isHinglish
      ? "Anxiety mushkil hoti hai. Kya aap bata sakte hain kya cheez trigger karti hai?"
      : "Anxiety is tough. Can you share what you think triggers it?";
  }
  if (text.includes("happy")) {
    return isHinglish
      ? "Mujhe khushi hui yeh sun ke aap khush ho! Kya wajah hai?"
      : "I’m glad to hear you’re happy! What’s contributing to this mood?";
  }
  if (text.includes("sad")) {
    return isHinglish
      ? "Mujhe afsos hai ke aap udaas ho. Kya aap thoda aur batana chahenge?"
      : "I’m sorry you’re feeling sad. Want to tell me more about it?";
  }
  if (mood && moodReplies[mood]) {
    const replies = moodReplies[mood];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  return isHinglish
    ? "Kya aap mujhe apne jazbaat ke baare mein thoda aur bata sakte hain?"
    : "Can you tell me more about how you're feeling?";
};

export default function ChatBot({
  autoMessage,
  clearAutoMessage,
  detectedEmotion,
}) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [emotion, setEmotion] = useState(null);

  const messagesEndRef = useRef(null);
  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  const synth = window.speechSynthesis;

  const speak = (text, callback) => {
    if (synth.speaking) synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      setSpeaking(false);
      callback?.();
    };
    synth.speak(utterance);
    setSpeaking(true);
  };

  const handleVoiceInput = () => {
    if (!listening) {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: false });
    } else {
      SpeechRecognition.stopListening();
    }
  };

  useEffect(() => {
    if (!listening && transcript.trim()) {
      sendMessage(transcript);
      resetTranscript();
    }
  }, [transcript, listening]);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    setMessages((msgs) => [...msgs, { from: "user", text }]);
    setLoading(true);

    const currentEmotion = detectedEmotion?.toLowerCase() || "neutral";
    setEmotion(currentEmotion);

    // Generate reply based only on user input & current emotion — no emotion change notification
    const reply = generateReply(text, currentEmotion);

    setMessages((msgs) => [...msgs, { from: "bot", text: reply }]);

    speak(reply, () => {
      handleVoiceInput();
    });

    setLoading(false);
  };

  // Remove the effect that sends emotion change notification messages

  useEffect(() => {
    if (autoMessage) {
      const intro = `Hello! You seem ${autoMessage.toLowerCase()}. Let's talk about it.`;
      const delay = setTimeout(() => {
        setMessages((msgs) => [...msgs, { from: "bot", text: intro }]);
        speak(intro, () => handleVoiceInput());
        setEmotion(autoMessage.toLowerCase());
        clearAutoMessage?.();
      }, 1000);

      return () => clearTimeout(delay);
    }
  }, [autoMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">AI Voice Therapist</div>
      <div className="chatbot-messages">
        {messages.map((msg, i) => (
          <p key={i} className={`chatbot-message ${msg.from}`}>
            {msg.text}
          </p>
        ))}
        {loading && <p className="chatbot-loading">Bot is thinking...</p>}
        <div ref={messagesEndRef} />
      </div>
      <div className="chatbot-input-area">
        <button
          className={`chatbot-button ${listening ? "recording" : ""}`}
          onClick={handleVoiceInput}
          disabled={loading || speaking}
        >
          {listening ? "Listening..." : "Talk"}
        </button>
      </div>
    </div>
  );
}
