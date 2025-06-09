export async function fetchChatResponse(message) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: message }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("HuggingFace API Error:", error);
    throw new Error("HuggingFace API error");
  }

  const data = await response.json();
  return data.generated_text || "Sorry, no response.";
}
