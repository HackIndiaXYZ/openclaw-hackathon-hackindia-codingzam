const modeTemplates = {
  default: {
    greet: (message) => `${message}`,
    reply: (message) => `${message}`,
    fallback: "Please share a bit more detail so I can help better.",
  },
  zenz: {
    greet: (message) => `Hello there. ${message} We will figure this out together.`,
    reply: (message) => `Nice question. ${message} One calm step at a time.`,
    fallback: "No stress. Tell me a little more, and I will guide you.",
  },
  savage: {
    greet: (message) => `Game on. ${message} Let us stop overthinking and execute.`,
    reply: (message) => `Straight talk: ${message} Start now, refine later.`,
    fallback: "That is too vague. Drop specifics and we will build a real plan.",
  },
};

// Build mode-aware chatbot text while keeping the core meaning intact.
export function getModeResponse(mode, baseMessage, type = "reply") {
  const selectedMode = modeTemplates[mode] ? mode : "default";
  const template = modeTemplates[selectedMode][type];

  if (typeof template === "function") {
    return template(baseMessage);
  }

  return template || baseMessage;
}

export function getModeLoadingMessage(mode, tool = "task") {
  if (mode === "zenz") {
    if (tool === "assignment") {
      return "Brewing your assignment outline with extra calm energy...";
    }

    if (tool === "pdf") {
      return "Aligning your PDF vibes. Almost done...";
    }

    if (tool === "roadmap") {
      return "Plotting your journey with calm focus and good tea energy...";
    }

    return "Loading gently. Good things take a moment.";
  }

  if (mode === "savage") {
    if (tool === "assignment") {
      return "Building your answer so you can stop starring at the blank page.";
    }

    if (tool === "pdf") {
      return "Crunching that PDF like deadlines crunch your weekend.";
    }

    if (tool === "roadmap") {
      return "Building your roadmap so your goals stop being just wallpaper quotes.";
    }

    return "Working on it. No panic, only progress.";
  }

  if (tool === "assignment") {
    return "Generating a structured answer...";
  }

  if (tool === "pdf") {
    return "Processing PDF demo action...";
  }

  if (tool === "roadmap") {
    return "Generating your career roadmap...";
  }

  return "Loading...";
}

