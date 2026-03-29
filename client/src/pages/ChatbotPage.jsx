import { useState } from "react";
import MessageBubble from "../components/MessageBubble";
import { useMode } from "../context/useMode";
import { getModeResponse } from "../utils/modeResponse";
import { fetchFreeAiAdvice } from "../services/aiAdvisorApi";
import { useLanguage } from "../context/useLanguage";
import { addMomentum, recordCounter } from "../utils/userActivity";
import { generateRecommendations, trackOpportunityAction } from "../services/recommendationApi";

const serviceTracks = [
  "Internship",
  "Scholarship",
  "Career Guidance",
  "Guidance In Any Task",
  "Fellowships",
  "Hackathons",
  "Freelance / Part-time",
];

const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate"];
const interestPresets = ["Web Development", "Data Science", "AI/ML", "Design", "Finance"];
const skillPresets = ["React", "Python", "SQL", "Communication", "Problem Solving"];

const secondaryOptionsByTrack = {
  Internship: [
    "Remote Internship",
    "Paid Internship",
    "Startup Internship",
    "Product Internship",
    "Research Internship",
  ],
  Scholarship: [
    "Merit-Based",
    "Need-Based",
    "Women In STEM",
    "Study Abroad",
    "Government Scholarships",
  ],
  "Career Guidance": [
    "Role Selection",
    "Skill Gap Analysis",
    "Portfolio Review",
    "Interview Prep",
    "90-Day Action Plan",
  ],
  "Guidance In Any Task": [
    "Assignment Strategy",
    "Email Drafting",
    "Presentation Structuring",
    "Time Management",
    "Productivity Planning",
  ],
  Fellowships: [
    "Research Fellowships",
    "Public Policy Fellowships",
    "International Fellowships",
    "Social Impact Fellowships",
    "Startup Fellowships",
  ],
  Hackathons: [
    "Beginner Friendly",
    "Web/Software",
    "AI/ML",
    "Blockchain",
    "Open Innovation",
  ],
  "Freelance / Part-time": [
    "Web Development",
    "Design",
    "Content Writing",
    "Data Analysis",
    "Virtual Assistance",
  ],
};

const timeOptionsByTrack = {
  Internship: ["Immediate", "1-2 Months", "3-6 Months", "Flexible"],
  Scholarship: ["This Month", "Next 3 Months", "This Year", "Any Time"],
  "Career Guidance": ["Today", "This Week", "This Month", "Long Term"],
  "Guidance In Any Task": ["Urgent", "2-3 Days", "This Week", "Flexible"],
  Fellowships: ["This Month", "Next 3 Months", "This Year", "Flexible"],
  Hackathons: ["This Week", "This Month", "This Quarter", "Flexible"],
  "Freelance / Part-time": ["Immediate", "This Week", "This Month", "Flexible"],
};

const recommendationMap = {
  Scholarship: {
    "Merit-Based": [
      "INSPIRE Scholarship",
      "Central Sector Scheme Scholarship",
      "National Scholarship Portal merit track",
      "University merit fellowships",
    ],
    "Need-Based": [
      "Post Matric Scholarship",
      "State social welfare scholarships",
      "Minority scholarship programs",
      "Fee waiver grants by institutes",
    ],
    "Women In STEM": [
      "Women Scientist Scheme",
      "AICTE Pragati Scholarship",
      "Google Women Techmakers opportunities",
      "Women in Engineering campus grants",
    ],
    "Study Abroad": [
      "Commonwealth Scholarship",
      "Fulbright-Nehru Fellowship",
      "DAAD scholarships",
      "Chevening scholarships",
    ],
    "Government Scholarships": [
      "National Scholarship Portal schemes",
      "State merit scholarship portals",
      "Central labor welfare schemes",
      "Department-specific educational grants",
    ],
  },
  Internship: {
    "Remote Internship": [
      "Apply to remote startup cohorts",
      "Target global internship portals",
      "Focus on async project internships",
      "Build GitHub-ready portfolio tasks",
    ],
    "Paid Internship": [
      "Prioritize product companies",
      "Use stipend filters on job boards",
      "Prepare measurable project bullets",
      "Target return-offer internship programs",
    ],
    "Startup Internship": [
      "Seed-stage startups for broad exposure",
      "Direct founder outreach with mini case study",
      "Highlight ownership and speed",
      "Choose teams with shipping culture",
    ],
    "Product Internship": [
      "Target strong B2C/B2B product companies",
      "Prepare UI/feature case studies",
      "Practice product thinking rounds",
      "Show metrics-driven project impact",
    ],
    "Research Internship": [
      "Shortlist professor labs and research groups",
      "Share focused statement of interest",
      "Attach mini literature summary",
      "Highlight domain coursework and projects",
    ],
  },
  "Career Guidance": {
    "Role Selection": [
      "Match interests to 2 role tracks",
      "Evaluate role demand and learning curve",
      "Choose one primary and one backup role",
      "Plan first 4-week sprint",
    ],
    "Skill Gap Analysis": [
      "Map current skills vs job requirements",
      "Create top 5 must-learn list",
      "Set weekly project-based practice",
      "Review progress every Sunday",
    ],
    "Portfolio Review": [
      "Keep 3 high-quality showcase projects",
      "Add problem, solution, impact per project",
      "Record short demo videos",
      "Link deployed versions and source",
    ],
    "Interview Prep": [
      "Prepare role-based question bank",
      "Practice 3 mock rounds weekly",
      "Use STAR framework for behavior rounds",
      "Track weak areas in a revision log",
    ],
    "90-Day Action Plan": [
      "Month 1: foundations + mini-projects",
      "Month 2: portfolio + applications",
      "Month 3: interview prep + outreach",
      "Weekly reflection and adjustment",
    ],
  },
  "Guidance In Any Task": {
    "Assignment Strategy": [
      "Break into sections and deadlines",
      "Draft outline before writing",
      "Use citations and examples early",
      "Review with checklist before submit",
    ],
    "Email Drafting": [
      "Set clear subject line",
      "Keep purpose in first 2 lines",
      "Use concise action request",
      "Close with professional sign-off",
    ],
    "Presentation Structuring": [
      "Open with problem statement",
      "Use 3 key insights max",
      "Add one proof slide per insight",
      "End with clear call to action",
    ],
    "Time Management": [
      "Use 90-minute focus blocks",
      "Group similar tasks together",
      "Limit daily top priorities to 3",
      "Weekly review and carry-forward",
    ],
    "Productivity Planning": [
      "Plan day the night before",
      "Start with highest-impact task",
      "Use friction-free task tracker",
      "Protect no-notification deep work",
    ],
  },
  Fellowships: {
    "Research Fellowships": ["Summer research programs", "Professor-led labs", "Domain research fellowships"],
    "Public Policy Fellowships": ["Policy research cohort", "Governance fellowships", "Think tank internships"],
    "International Fellowships": ["Fulbright", "Chevening", "Erasmus scholarships"],
    "Social Impact Fellowships": ["NGO fellowships", "Rural impact projects", "Education impact cohorts"],
    "Startup Fellowships": ["Founder office fellowships", "Early-stage operator fellowship", "Product growth fellowship"],
  },
  Hackathons: {
    "Beginner Friendly": ["Local college hackathons", "Community buildathons", "No-code challenge tracks"],
    "Web/Software": ["MERN stack challenge", "Cloud app sprint", "Open source challenge"],
    "AI/ML": ["Applied AI hackathons", "GenAI app challenge", "Data science competitions"],
    Blockchain: ["Web3 product sprint", "Smart contract challenge", "DeFi innovation track"],
    "Open Innovation": ["Corporate innovation challenge", "Public problem solving challenge", "Cross-domain challenge"],
  },
  "Freelance / Part-time": {
    "Web Development": ["Portfolio website gigs", "Landing page projects", "Maintenance retainers"],
    Design: ["UI redesign projects", "Brand kit work", "Social creatives"],
    "Content Writing": ["Tech blog writing", "SEO content projects", "Newsletter writing"],
    "Data Analysis": ["Dashboard setup gigs", "Data cleanup projects", "Reporting automation"],
    "Virtual Assistance": ["Operations support", "Client coordination", "Documentation tasks"],
  },
};

const resourceLinksByTrack = {
  Internship: [
    { name: "Internshala", url: "https://internshala.com" },
    { name: "LinkedIn Jobs", url: "https://www.linkedin.com/jobs" },
    { name: "Wellfound", url: "https://wellfound.com/jobs" },
  ],
  Scholarship: [
    { name: "National Scholarship Portal", url: "https://scholarships.gov.in" },
    { name: "Buddy4Study", url: "https://www.buddy4study.com" },
    { name: "Scholarships.com", url: "https://www.scholarships.com" },
  ],
  Fellowships: [
    { name: "Chevening", url: "https://www.chevening.org" },
    { name: "Fulbright", url: "https://foreign.fulbrightonline.org" },
    { name: "Acumen", url: "https://acumen.org/fellowship" },
  ],
  Hackathons: [
    { name: "Devpost", url: "https://devpost.com/hackathons" },
    { name: "Unstop", url: "https://unstop.com/hackathons" },
    { name: "MLH", url: "https://mlh.io" },
  ],
  "Freelance / Part-time": [
    { name: "Upwork", url: "https://www.upwork.com" },
    { name: "Fiverr", url: "https://www.fiverr.com" },
    { name: "Freelancer", url: "https://www.freelancer.com" },
  ],
};

function ChatbotPage({ title = "Chat Assistant" }) {
  const { mode } = useMode();
  const { language } = useLanguage();
  const isHindi = language === "hi";
  const isBestMatch = title === "Best Match";
  const pageTitle = isHindi && title === "Best Match" ? "बेस्ट मैच" : title;
  const labelMaps = {
    years: {
      "1st Year": "पहला वर्ष",
      "2nd Year": "दूसरा वर्ष",
      "3rd Year": "तीसरा वर्ष",
      "4th Year": "चौथा वर्ष",
      Graduate: "ग्रेजुएट",
    },
    track: {
      Internship: "इंटर्नशिप",
      Scholarship: "स्कॉलरशिप",
      "Career Guidance": "करियर गाइडेंस",
      "Guidance In Any Task": "किसी भी कार्य में मार्गदर्शन",
    },
  };

  const displayLabel = (group, value) => {
    if (!isHindi) {
      return value;
    }

    return labelMaps[group]?.[value] || value;
  };
  const greetingText = getModeResponse(
    mode,
    isHindi
      ? `नमस्ते, मैं आपका ${pageTitle} असिस्टेंट हूँ। आप कुछ भी पूछ सकते हैं।`
      : `Hi, I am your ${title} assistant. Ask me anything.`,
    "greet"
  );

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "bot",
      text: greetingText,
    },
  ]);
  const [profile, setProfile] = useState({
    name: "",
    age: 18,
    year: "",
    college: "",
    interests: "",
    skills: "",
    resumeSummary: "",
  });
  const [profileSubmitted, setProfileSubmitted] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [recommendationScores, setRecommendationScores] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [aiAdvice, setAiAdvice] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const addBotMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        role: "bot",
        text,
      },
    ]);
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        role: "user",
        text,
      },
    ]);
  };

  const buildBotReply = (question) => {
    const lower = question.toLowerCase();
    const hasCareerIntent =
      lower.includes("internship") ||
      lower.includes("career") ||
      lower.includes("roadmap") ||
      lower.includes("skill");

    if (hasCareerIntent) {
      return getModeResponse(
        mode,
        "Great direction. Start with one target role, two core skills, and one weekly project.",
        "reply"
      );
    }

    if (lower.length < 5) {
      return getModeResponse(mode, "", "fallback");
    }

    return getModeResponse(
      mode,
      `You asked: "${question}". I suggest breaking this into small action steps and starting today.`,
      "reply"
    );
  };

  const handleSend = () => {
    const trimmed = input.trim();

    if (!trimmed) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate bot latency for a conversational feel.
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        role: "bot",
        text: buildBotReply(trimmed),
      };

      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSend();
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const adjustAge = (delta) => {
    setProfile((prev) => {
      const nextAge = Math.min(60, Math.max(14, Number(prev.age) + delta));
      return { ...prev, age: nextAge };
    });
  };

  const setYear = (value) => {
    setProfile((prev) => ({ ...prev, year: value }));
  };

  const addTag = (field, tag) => {
    setProfile((prev) => {
      const current = prev[field].trim();
      const chunks = current ? current.split(",").map((item) => item.trim()) : [];

      if (chunks.includes(tag)) {
        return prev;
      }

      return {
        ...prev,
        [field]: current ? `${current}, ${tag}` : tag,
      };
    });
  };

  const calculateRecommendationScores = (list, userProfile, track, timeline) => {
    const lowerSkills = userProfile.skills.toLowerCase();
    const lowerInterests = userProfile.interests.toLowerCase();

    return list.map((item, index) => {
      let score = 84 - index * 6;

      if (track === "Internship" && lowerSkills.includes("react") && item.toLowerCase().includes("product")) {
        score += 7;
      }

      if (track === "Scholarship" && lowerInterests.includes("data") && item.toLowerCase().includes("merit")) {
        score += 6;
      }

      if (timeline === "Immediate" || timeline === "This Month" || timeline === "Today") {
        score += 4;
      }

      const normalized = Math.min(98, Math.max(58, score));
      return { label: item, score: normalized };
    });
  };

  const handleProfileSubmit = (event) => {
    event.preventDefault();

    if (!profile.year) {
      addBotMessage(isHindi ? "कृपया आगे बढ़ने से पहले अपना वर्ष चुनें।" : "Please choose your year with the year buttons before continuing.");
      return;
    }

    const info = `${profile.name}, ${profile.age} yrs, ${profile.year}, ${profile.college}`;
    addUserMessage(`Profile submitted: ${info}`);
    setProfileSubmitted(true);
    recordCounter("bestMatchActions", 1);
    addMomentum("Saved Best Match profile");
    addBotMessage(
      getModeResponse(
        mode,
        isHindi
          ? "प्रोफाइल सेव हो गई। अब नीचे से एक सपोर्ट पाथ चुनें ताकि मैं उपयुक्त विकल्प सुझा सकूं।"
          : "Profile captured. Choose one support path below so I can recommend best-fit options.",
        "reply"
      )
    );
  };

  const handleTrackPick = (track) => {
    setSelectedTrack(track);
    setSelectedOption("");
    setSelectedTime("");
    setRecommendationScores([]);
    setOpportunities([]);
    setAiAdvice("");
    recordCounter("bestMatchActions", 1);
    addMomentum(`Selected Best Match category: ${track}`);
    addUserMessage(`Selected: ${track}`);
    addBotMessage(isHindi ? "बहुत बढ़िया। अब अपनी जरूरत के अनुसार सबसे उपयुक्त विकल्प चुनें।" : "Great. Pick the most relevant option for your current need.");
  };

  const handleSecondaryPick = (option) => {
    setSelectedOption(option);
    setSelectedTime("");
    setRecommendationScores([]);
    setOpportunities([]);
    setAiAdvice("");
    addUserMessage(`Preference: ${option}`);
    addBotMessage(isHindi ? "अच्छा चयन। अब टाइमलाइन चुनें।" : "Nice choice. Select your timeline preference.");
  };

  const handleTimePick = async (timeOption) => {
    setSelectedTime(timeOption);
    recordCounter("bestMatchActions", 1);
    addMomentum(`Generated Best Match results for ${selectedTrack}`);
    addUserMessage(isHindi ? `टाइमलाइन: ${timeOption}` : `Timeline: ${timeOption}`);
    addBotMessage(isHindi ? "आपके लिए सबसे उपयुक्त विकल्पों का स्कोर निकाला जा रहा है..." : "Computing your best-fit options with probability scores...");

    const scored = calculateRecommendationScores(
      recommendationMap[selectedTrack]?.[selectedOption] || [],
      profile,
      selectedTrack,
      timeOption
    );

    try {
      const response = await generateRecommendations({
        track: selectedTrack,
        selectedOption,
        timeline: timeOption,
        profile,
      });

      const backendOpportunities = response.data?.opportunities || [];
      setOpportunities(backendOpportunities);

      if (backendOpportunities.length > 0) {
        setRecommendationScores(
          backendOpportunities.map((item) => ({ label: item.title, score: item.confidence }))
        );
      } else {
        setRecommendationScores(scored);
      }
    } catch {
      setRecommendationScores(scored);
    }

    setIsAiLoading(true);
    const advice = await fetchFreeAiAdvice({
      selectedTrack,
      selectedOption,
      selectedTime: timeOption,
      profile,
      recommendations: scored.map((item) => `${item.label} (${item.score}%)`),
    });
    setAiAdvice(advice);
    setIsAiLoading(false);
    addBotMessage(isHindi ? "हो गया। आपकी रिकमेंडेशन लिस्ट के नीचे AI सलाह जोड़ दी गई है।" : "Done. I have added AI-enhanced guidance under your recommendation list.");
  };

  const handleOpportunityAction = async (item, action) => {
    try {
      await trackOpportunityAction({ key: item.key || item.title, action });
      recordCounter("bestMatchActions", 1);
      if (action === "applied") {
        recordCounter("applicationClicks", 1);
      }
      addMomentum(`Opportunity ${action}: ${item.title}`);
      addBotMessage(
        isHindi
          ? `${item.title} को ${action} के रूप में अपडेट किया गया।`
          : `${item.title} marked as ${action}.`
      );
    } catch {
      addBotMessage(isHindi ? "स्थिति अपडेट नहीं हो सकी।" : "Could not update status right now.");
    }
  };

  const recommendations =
    recommendationMap[selectedTrack]?.[selectedOption] || [
      "Build a clear weekly action plan",
      "Keep one focused application tracker",
      "Strengthen profile with measurable projects",
      "Take weekly mentor feedback",
    ];

  const resourceLinks = resourceLinksByTrack[selectedTrack] || [];

  const trackResourceClick = (name) => {
    recordCounter("applicationClicks", 1);
    addMomentum(`Opened opportunity website: ${name}`);
  };

  return (
    <section className="chat-page">
      <div className="chat-header">
        <h1>{pageTitle}</h1>
        <p>{getModeResponse(mode, isHindi ? "सरल गाइडेड तरीके से असिस्टेंट से चैट करें।" : "Chat with the assistant in a simple guided style.", "reply")}</p>
      </div>

      {isBestMatch && (
        <div className="guided-match-panel">
          <h2>{isHindi ? "बेस्ट मैच प्रोफाइल फॉर्म" : "Best Match Profile Form"}</h2>
          <p>{isHindi ? "कम टाइपिंग वाला फ्लो: बटन से विकल्प चुनें और स्कोर-आधारित सुझाव पाएं।" : "Minimal typing flow: choose options with buttons and get score-based recommendations."}</p>

          <form className="guided-profile-grid" onSubmit={handleProfileSubmit}>
            <input
              name="name"
              placeholder={isHindi ? "नाम" : "Name"}
              value={profile.name}
              onChange={handleProfileChange}
              required
            />

            <div className="age-stepper">
              <span>Age</span>
              <div>
                <button type="button" onClick={() => adjustAge(-1)}>
                  -
                </button>
                <strong>{profile.age}</strong>
                <button type="button" onClick={() => adjustAge(1)}>
                  +
                </button>
              </div>
            </div>

            <div className="quick-pick-block year-picks">
              <label>{isHindi ? "वर्ष" : "Year"}</label>
              <div className="option-chip-row">
                {yearOptions.map((yearValue) => (
                  <button
                    key={yearValue}
                    type="button"
                    className={profile.year === yearValue ? "option-chip active" : "option-chip"}
                    onClick={() => setYear(yearValue)}
                  >
                    {displayLabel("years", yearValue)}
                  </button>
                ))}
              </div>
            </div>

            <input
              name="college"
              placeholder={isHindi ? "कॉलेज" : "College"}
              value={profile.college}
              onChange={handleProfileChange}
              required
            />

            <div className="quick-pick-block full-width">
              <label>{isHindi ? "रुचियां क्विक ऐड" : "Interests Quick Add"}</label>
              <div className="option-chip-row">
                {interestPresets.map((tag) => (
                  <button key={tag} type="button" className="option-chip" onClick={() => addTag("interests", tag)}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <input
              name="interests"
              placeholder={isHindi ? "रुचियां" : "Interests"}
              value={profile.interests}
              onChange={handleProfileChange}
              required
            />

            <div className="quick-pick-block full-width">
              <label>{isHindi ? "स्किल्स क्विक ऐड" : "Skills Quick Add"}</label>
              <div className="option-chip-row">
                {skillPresets.map((tag) => (
                  <button key={tag} type="button" className="option-chip" onClick={() => addTag("skills", tag)}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <input
              name="skills"
              placeholder={isHindi ? "स्किल्स" : "Skills"}
              value={profile.skills}
              onChange={handleProfileChange}
              required
            />
            <textarea
              name="resumeSummary"
              placeholder={isHindi ? "रिज्यूमे सारांश / अनुभव स्नैपशॉट" : "Resume summary / experience snapshot"}
              value={profile.resumeSummary}
              onChange={handleProfileChange}
              required
            />
            <button type="submit">{isHindi ? "प्रोफाइल सेव करें" : "Save Profile"}</button>
          </form>

          {profileSubmitted && (
            <div className="choice-flow">
              <h3>{isHindi ? "स्टेप 1: श्रेणी चुनें" : "Step 1: Choose Category"}</h3>
              <div className="option-chip-row">
                {serviceTracks.map((track) => (
                  <button
                    key={track}
                    type="button"
                    className={selectedTrack === track ? "option-chip active" : "option-chip"}
                    onClick={() => handleTrackPick(track)}
                  >
                    {displayLabel("track", track)}
                  </button>
                ))}
              </div>

              {!!selectedTrack && (
                <>
                  <h3>{isHindi ? "स्टेप 2: विशिष्ट विकल्प चुनें" : "Step 2: Pick Specific Preference"}</h3>
                  <div className="option-chip-row">
                    {secondaryOptionsByTrack[selectedTrack].map((choice) => (
                      <button
                        key={choice}
                        type="button"
                        className={selectedOption === choice ? "option-chip active" : "option-chip"}
                        onClick={() => handleSecondaryPick(choice)}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {!!selectedOption && (
                <>
                  <h3>{isHindi ? "स्टेप 3: टाइमलाइन चुनें" : "Step 3: Select Timeline"}</h3>
                  <div className="option-chip-row">
                    {timeOptionsByTrack[selectedTrack].map((timeChoice) => (
                      <button
                        key={timeChoice}
                        type="button"
                        className={selectedTime === timeChoice ? "option-chip active" : "option-chip"}
                        onClick={() => handleTimePick(timeChoice)}
                      >
                        {timeChoice}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {!!selectedTime && (
                <div className="predictable-results">
                  <h3>{isHindi ? "सबसे उपयुक्त विकल्प" : "Most Preferable Options"}</h3>
                  <ul className="answer-list">
                    {recommendations.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  {!!recommendationScores.length && (
                    <div className="probability-grid">
                      {recommendationScores.map((entry) => (
                        <article key={entry.label} className="probability-card">
                          <p>{entry.label}</p>
                          <strong>{entry.score}% {isHindi ? "मैच" : "Match"}</strong>
                        </article>
                      ))}
                    </div>
                  )}

                  {!!opportunities.length && (
                    <div className="opportunity-cards-grid">
                      {opportunities.map((item) => (
                        <article key={item.key} className="opportunity-card">
                          <h4>{item.title}</h4>
                          <p>
                            <strong>{isHindi ? "प्रदाता" : "Provider"}:</strong> {item.provider}
                          </p>
                          <p>
                            <strong>{isHindi ? "डेडलाइन" : "Deadline"}:</strong> {item.deadlineHint}
                          </p>
                          <p>
                            <strong>{isHindi ? "कॉन्फिडेंस" : "Confidence"}:</strong> {item.confidence}%
                          </p>
                          {!!item.reasons?.length && (
                            <ul>
                              {item.reasons.slice(0, 3).map((reason) => (
                                <li key={reason}>{reason}</li>
                              ))}
                            </ul>
                          )}
                          {!!item.missingSkills?.length && (
                            <p>
                              <strong>{isHindi ? "Missing Skills" : "Missing Skills"}:</strong> {item.missingSkills.join(", ")}
                            </p>
                          )}
                          <div className="opportunity-actions">
                            <a href={item.url} target="_blank" rel="noreferrer">
                              {isHindi ? "ओपन करें" : "Open"}
                            </a>
                            <button type="button" onClick={() => handleOpportunityAction(item, "saved")}>Save</button>
                            <button type="button" onClick={() => handleOpportunityAction(item, "applied")}>Applied</button>
                            <button type="button" onClick={() => handleOpportunityAction(item, "rejected")}>Reject</button>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}

                  {isAiLoading && <p className="tool-loading">{isHindi ? "AI सलाह बनाई जा रही है..." : "Generating AI-enhanced advice..."}</p>}

                  {!!aiAdvice && (
                    <div className="ai-advice-box">
                      <h4>{isHindi ? "AI जनरेटेड मार्गदर्शन" : "AI Generated Guidance"}</h4>
                      <p>{aiAdvice}</p>
                    </div>
                  )}

                  {!!resourceLinks.length && (
                    <div className="resource-links-box">
                      <h4>{isHindi ? "लोकप्रिय वेबसाइट्स (अप्लाई करें)" : "Popular Websites (Apply)"}</h4>
                      <div className="resource-link-grid">
                        {resourceLinks.map((site) => (
                          <a
                            key={site.url}
                            href={site.url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => trackResourceClick(site.name)}
                          >
                            {site.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="chat-window">
        {messages.map((message) => (
          <MessageBubble key={message.id} role={message.role} text={message.text} />
        ))}
      </div>

      <form className="chat-input-row" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={isHindi ? "अपना संदेश लिखें..." : "Type your message..."}
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button type="submit">{isHindi ? "भेजें" : "Send"}</button>
      </form>
    </section>
  );
}

export default ChatbotPage;

