import { getActivity as getActivityApi, syncActivity as syncActivityApi } from "../services/activityApi";

const STORAGE_PREFIX = "explainx-activity";

const getUserKey = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return "guest";
  }

  try {
    const [, payloadSegment] = token.split(".");
    const json = atob(payloadSegment.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(json);
    return payload.userId || payload.email || "guest";
  } catch {
    return "guest";
  }
};

const createInitialState = () => ({
  todos: [],
  momentum: [],
  counters: {
    quickTaskActions: 0,
    mentorContacts: 0,
    bestMatchActions: 0,
    roadmapActions: 0,
    applicationClicks: 0,
  },
  touchedDays: [],
  seniorClicks: {},
});

const keyForUser = () => `${STORAGE_PREFIX}:${getUserKey()}`;

export const loadActivity = () => {
  const raw = localStorage.getItem(keyForUser());

  if (!raw) {
    return createInitialState();
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      ...createInitialState(),
      ...parsed,
      counters: {
        ...createInitialState().counters,
        ...(parsed.counters || {}),
      },
    };
  } catch {
    return createInitialState();
  }
};

const saveActivity = (activity) => {
  localStorage.setItem(keyForUser(), JSON.stringify(activity));
  window.dispatchEvent(new Event("activity-updated"));
  syncActivityApi(activity).catch(() => {
    // Keep local-first UX even if backend sync fails.
  });
};

export const hydrateActivityFromServer = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return loadActivity();
    }

    const response = await getActivityApi();
    const serverActivity = response.data?.activity;
    if (!serverActivity) {
      return loadActivity();
    }

    const merged = {
      ...createInitialState(),
      ...serverActivity,
      counters: {
        ...createInitialState().counters,
        ...(serverActivity.counters || {}),
      },
    };

    localStorage.setItem(keyForUser(), JSON.stringify(merged));
    window.dispatchEvent(new Event("activity-updated"));
    return merged;
  } catch {
    return loadActivity();
  }
};

const touchToday = (activity) => {
  const today = new Date().toISOString().slice(0, 10);

  if (activity.touchedDays.includes(today)) {
    return activity;
  }

  return {
    ...activity,
    touchedDays: [...activity.touchedDays, today].slice(-60),
  };
};

export const addTodo = (text) => {
  const clean = text.trim();
  if (!clean) {
    return loadActivity();
  }

  const current = loadActivity();
  const next = touchToday({
    ...current,
    todos: [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        text: clean,
        done: false,
      },
      ...current.todos,
    ],
  });

  saveActivity(next);
  return next;
};

export const toggleTodo = (id) => {
  const current = loadActivity();
  const todos = current.todos.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo));
  const next = touchToday({ ...current, todos });
  saveActivity(next);
  return next;
};

export const deleteTodo = (id) => {
  const current = loadActivity();
  const todos = current.todos.filter((todo) => todo.id !== id);
  const next = { ...current, todos };
  saveActivity(next);
  return next;
};

export const addMomentum = (title) => {
  const current = loadActivity();
  const next = touchToday({
    ...current,
    momentum: [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title,
        at: Date.now(),
      },
      ...current.momentum,
    ].slice(0, 30),
  });

  saveActivity(next);
  return next;
};

export const recordCounter = (counterKey, amount = 1) => {
  const current = loadActivity();
  const next = touchToday({
    ...current,
    counters: {
      ...current.counters,
      [counterKey]: Math.max(0, (current.counters[counterKey] || 0) + amount),
    },
  });

  saveActivity(next);
  return next;
};

export const recordSeniorClick = (seniorId, seniorName) => {
  const current = loadActivity();
  const next = touchToday({
    ...current,
    counters: {
      ...current.counters,
      mentorContacts: current.counters.mentorContacts + 1,
    },
    seniorClicks: {
      ...current.seniorClicks,
      [seniorId]: (current.seniorClicks[seniorId] || 0) + 1,
    },
    momentum: [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title: `Clicked contact for ${seniorName}`,
        at: Date.now(),
      },
      ...current.momentum,
    ].slice(0, 30),
  });

  saveActivity(next);
  return next;
};

export const relativeTime = (timestamp) => {
  const diff = Date.now() - timestamp;
  if (diff < 60 * 1000) {
    return "just now";
  }
  if (diff < 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 1000))} min ago`;
  }
  if (diff < 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 60 * 1000))} hr ago`;
  }
  return `${Math.floor(diff / (24 * 60 * 60 * 1000))} day ago`;
};

export const deriveDashboard = (activity) => {
  const completedTodos = activity.todos.filter((todo) => todo.done).length;
  const focusScore = Math.min(
    100,
    completedTodos * 10 +
      activity.counters.quickTaskActions * 5 +
      activity.counters.bestMatchActions * 8 +
      activity.counters.mentorContacts * 5 +
      activity.counters.roadmapActions * 10 +
      activity.counters.applicationClicks * 8
  );

  const roadmapProgress = Math.min(100, activity.counters.roadmapActions * 20);
  const tasksCompleted = completedTodos + activity.counters.quickTaskActions;

  return {
    focusScore,
    roadmapProgress,
    tasksCompleted,
    mentorContacts: activity.counters.mentorContacts,
    completedTodos,
  };
};
