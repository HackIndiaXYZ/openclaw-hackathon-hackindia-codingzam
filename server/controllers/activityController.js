const Activity = require("../models/Activity");

const createDefaultActivity = (userId) => ({
  userId,
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
  opportunityActions: [],
});

const sanitizeIncoming = (payload = {}) => {
  const safeCounters = {
    quickTaskActions: Number(payload?.counters?.quickTaskActions || 0),
    mentorContacts: Number(payload?.counters?.mentorContacts || 0),
    bestMatchActions: Number(payload?.counters?.bestMatchActions || 0),
    roadmapActions: Number(payload?.counters?.roadmapActions || 0),
    applicationClicks: Number(payload?.counters?.applicationClicks || 0),
  };

  return {
    todos: Array.isArray(payload.todos) ? payload.todos.slice(0, 100) : [],
    momentum: Array.isArray(payload.momentum) ? payload.momentum.slice(0, 100) : [],
    counters: safeCounters,
    touchedDays: Array.isArray(payload.touchedDays) ? payload.touchedDays.slice(-90) : [],
    seniorClicks: payload.seniorClicks && typeof payload.seniorClicks === "object" ? payload.seniorClicks : {},
    opportunityActions: Array.isArray(payload.opportunityActions) ? payload.opportunityActions.slice(-200) : [],
  };
};

const getActivity = async (req, res) => {
  try {
    const userId = req.user.userId;
    let activity = await Activity.findOne({ userId }).lean();

    if (!activity) {
      activity = createDefaultActivity(userId);
    }

    return res.status(200).json({ activity });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch activity.", error: error.message });
  }
};

const syncActivity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const incoming = sanitizeIncoming(req.body?.activity);

    const activity = await Activity.findOneAndUpdate(
      { userId },
      {
        $set: {
          todos: incoming.todos,
          momentum: incoming.momentum,
          counters: incoming.counters,
          touchedDays: incoming.touchedDays,
          seniorClicks: incoming.seniorClicks,
          opportunityActions: incoming.opportunityActions,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    return res.status(200).json({ message: "Activity synced.", activity });
  } catch (error) {
    return res.status(500).json({ message: "Failed to sync activity.", error: error.message });
  }
};

const trackOpportunityAction = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { key, action } = req.body;

    if (!key || !action) {
      return res.status(400).json({ message: "key and action are required." });
    }

    if (!["saved", "applied", "rejected"].includes(action)) {
      return res.status(400).json({ message: "Invalid action." });
    }

    const activity = await Activity.findOneAndUpdate(
      { userId },
      {
        $push: {
          opportunityActions: {
            key,
            action,
            at: Date.now(),
          },
          momentum: {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            title: `Opportunity ${action}: ${key}`,
            at: Date.now(),
          },
        },
        $inc: {
          "counters.applicationClicks": action === "applied" ? 1 : 0,
          "counters.bestMatchActions": 1,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    return res.status(200).json({ message: "Opportunity action tracked.", activity });
  } catch (error) {
    return res.status(500).json({ message: "Failed to track opportunity action.", error: error.message });
  }
};

module.exports = {
  getActivity,
  syncActivity,
  trackOpportunityAction,
};
