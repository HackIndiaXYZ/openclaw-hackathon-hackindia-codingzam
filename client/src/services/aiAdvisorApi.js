function buildPrompt({ selectedTrack, selectedOption, selectedTime, profile, recommendations }) {
  return [
    `Category: ${selectedTrack}`,
    `Preference: ${selectedOption}`,
    `Timeline: ${selectedTime}`,
    `Student profile: ${profile.year}, interests ${profile.interests}, skills ${profile.skills}`,
    `Top recommendations: ${recommendations.join("; ")}`,
    "Provide one concise practical action plan with 4 bullet points.",
  ].join(" | ");
}

function fallbackAdvice({ selectedTrack, selectedOption, selectedTime }) {
  return `Focus on ${selectedTrack} with ${selectedOption} in the ${selectedTime} window. Prioritize one high-impact application each week, improve one portfolio artifact, and track outcomes every Sunday.`;
}

export async function fetchFreeAiAdvice(context) {
  try {
    const prompt = buildPrompt(context);
    const query = encodeURIComponent(prompt.slice(0, 450));
    const response = await fetch(
      `https://api.affiliateplus.xyz/api/chatbot?botname=ExplainX&ownername=ExplainX&message=${query}`
    );

    if (!response.ok) {
      return fallbackAdvice(context);
    }

    const data = await response.json();
    const message = typeof data?.message === "string" ? data.message.trim() : "";

    if (!message) {
      return fallbackAdvice(context);
    }

    return message;
  } catch {
    return fallbackAdvice(context);
  }
}

