import FeatureCard from "../components/FeatureCard";
import { useMode } from "../context/ModeContext";
import { getModeResponse } from "../utils/modeResponse";
import { useLanguage } from "../context/useLanguage";

const features = [
  {
    title: "Best Match",
    description: "Find internship and scholarship opportunities that fit your profile.",
    to: "/best-match",
  },
  {
    title: "Quick Tasks",
    description: "Use handy productivity tools to finish daily work faster.",
    to: "/quick-tasks",
  },
  {
    title: "Career Roadmap",
    description: "Get a guided career path with learning steps and events.",
    to: "/career-roadmap",
  },
  {
    title: "Connect Seniors",
    description: "Reach out to experienced seniors for practical guidance.",
    to: "/connect-seniors",
  },
];

const dashboardStats = [
  { label: "Learning Streak", value: "12 Days", note: "+2 from last week" },
  { label: "Tasks Completed", value: "37", note: "8 done today" },
  { label: "Mentor Replies", value: "5", note: "2 unread" },
  { label: "Roadmap Progress", value: "64%", note: "Milestone 4 active" },
];

const todayFocus = [
  "Finish one roadmap milestone module",
  "Review internship shortlist and save top 3",
  "Send one mentorship query with specific goal",
  "Update resume with measurable impact bullets",
  "Practice two interview questions out loud",
  "Apply to one internship and one scholarship",
  "Review one senior profile and book one call",
  "Plan tomorrow's top three priorities",
];

const momentumFeed = [
  { title: "Assignment draft generated", time: "45 min ago" },
  { title: "New senior mentor available", time: "2 hr ago" },
  { title: "Roadmap checkpoint unlocked", time: "Yesterday" },
];

function DashboardPage() {
  const { mode } = useMode();
  const { language } = useLanguage();
  const isHindi = language === "hi";
  const heroMessage = getModeResponse(
    mode,
    isHindi
      ? "एक जगह से गति बनाएं: प्लान करें, काम करें और प्रगति ट्रैक करें।"
      : "Build momentum from one place: plan, execute, and track progress.",
    "greet"
  );

  return (
    <section className="dashboard-page">
      <header className="dashboard-hero">
        <div>
          <p className="dashboard-kicker">Control Center</p>
          <h1>{isHindi ? "डैशबोर्ड" : "Dashboard"}</h1>
          <p>{heroMessage}</p>
        </div>

        <div className="dashboard-hero-meta">
          <span className="mode-chip">{isHindi ? "मोड" : "Mode"}: {mode}</span>
          <div className="dashboard-score-card">
            <strong>{isHindi ? "फोकस स्कोर" : "Focus Score"}</strong>
            <p>82 / 100</p>
          </div>
        </div>
      </header>

      <div className="dashboard-stats-grid">
        {dashboardStats.map((stat) => (
          <article className="stat-card" key={stat.label}>
            <p>{stat.label}</p>
            <h3>{stat.value}</h3>
            <small>{stat.note}</small>
          </article>
        ))}
      </div>

      <div className="dashboard-main-grid">
        <article className="dashboard-panel">
          <h2>{isHindi ? "आज का फोकस" : "Today Focus"}</h2>
          <ul className="focus-list">
            {todayFocus.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="dashboard-panel">
          <h2>{isHindi ? "मोमेंटम फीड" : "Momentum Feed"}</h2>
          <ul className="momentum-list">
            {momentumFeed.map((entry) => (
              <li key={entry.title}>
                <span>{entry.title}</span>
                <small>{entry.time}</small>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <section className="dashboard-feature-section">
        <h2>{isHindi ? "क्विक एक्शन्स" : "Quick Actions"}</h2>
        <p>{isHindi ? "डैशबोर्ड से किसी भी ExplainX मॉड्यूल में जाएँ।" : "Jump into any ExplainX module from your dashboard."}</p>
        <div className="feature-grid">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
            to={feature.to}
          />
        ))}
        </div>
      </section>
    </section>
  );
}

export default DashboardPage;

