import { useEffect, useMemo, useState } from "react";
import FeatureCard from "../components/FeatureCard";
import { useMode } from "../context/useMode";
import { getModeResponse } from "../utils/modeResponse";
import { useLanguage } from "../context/useLanguage";
import {
  addTodo,
  deleteTodo,
  deriveDashboard,
  hydrateActivityFromServer,
  loadActivity,
  relativeTime,
  toggleTodo,
} from "../utils/userActivity";

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

function DashboardPage() {
  const { mode } = useMode();
  const { language } = useLanguage();
  const isHindi = language === "hi";
  const [activity, setActivity] = useState(() => loadActivity());
  const [newTodo, setNewTodo] = useState("");

  const stats = useMemo(() => deriveDashboard(activity), [activity]);

  useEffect(() => {
    const sync = () => setActivity(loadActivity());
    window.addEventListener("activity-updated", sync);
    hydrateActivityFromServer().then((data) => setActivity(data));

    return () => {
      window.removeEventListener("activity-updated", sync);
    };
  }, []);
  const heroMessage = getModeResponse(
    mode,
    isHindi
      ? "एक जगह से गति बनाएं: प्लान करें, काम करें और प्रगति ट्रैक करें।"
      : "Build momentum from one place: plan, execute, and track progress.",
    "greet"
  );

  const dashboardStats = [
    {
      label: "Learning Streak",
      value: `${activity.touchedDays.length} Days`,
      note: activity.touchedDays.length === 0 ? "0 activity days" : "Active days tracked",
    },
    {
      label: "Tasks Completed",
      value: String(stats.tasksCompleted),
      note: `${stats.completedTodos} done in Today Focus`,
    },
    {
      label: "Mentor Contacts",
      value: String(stats.mentorContacts),
      note: `Clicked on ${stats.mentorContacts} seniors contact`,
    },
    {
      label: "Roadmap Progress",
      value: `${stats.roadmapProgress}%`,
      note: stats.roadmapProgress === 0 ? "No roadmap action yet" : "Calculated from roadmap actions",
    },
  ];

  const handleAddTodo = (event) => {
    event.preventDefault();
    if (!newTodo.trim()) {
      return;
    }

    setActivity(addTodo(newTodo));
    setNewTodo("");
  };

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
            <p>{stats.focusScore} / 100</p>
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
          <form className="focus-add-form" onSubmit={handleAddTodo}>
            <input
              value={newTodo}
              onChange={(event) => setNewTodo(event.target.value)}
              placeholder={isHindi ? "नया टास्क जोड़ें" : "Add new task"}
            />
            <button type="submit">{isHindi ? "जोड़ें" : "Add"}</button>
          </form>
          <ul className="focus-list">
            {activity.todos.map((item) => (
              <li key={item.id} className={item.done ? "done" : ""}>
                <label className="focus-item-main">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => setActivity(toggleTodo(item.id))}
                  />
                  <span>{item.text}</span>
                </label>
                <button type="button" className="focus-delete-btn" onClick={() => setActivity(deleteTodo(item.id))}>
                  {isHindi ? "हटाएं" : "Delete"}
                </button>
              </li>
            ))}
            {activity.todos.length === 0 && (
              <li className="focus-empty">{isHindi ? "कोई टास्क नहीं, नया जोड़ें।" : "No tasks yet, add one."}</li>
            )}
          </ul>
        </article>

        <article className="dashboard-panel">
          <h2>{isHindi ? "मोमेंटम फीड" : "Momentum Feed"}</h2>
          <ul className="momentum-list">
            {activity.momentum.map((entry) => (
              <li key={entry.id}>
                <span>{entry.title}</span>
                <small>{relativeTime(entry.at)}</small>
              </li>
            ))}
            {activity.momentum.length === 0 && (
              <li>
                <span>{isHindi ? "अब तक कोई गतिविधि नहीं" : "No activity yet"}</span>
                <small>{isHindi ? "0 actions" : "0 actions"}</small>
              </li>
            )}
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

