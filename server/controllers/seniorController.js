// Get all seniors
const getSeniors = async (req, res) => {
  try {
    const seniors = [
      {
        id: 1,
        name: "Priya Sharma",
        role: "Senior Software Engineer",
        expertise: ["React", "Node.js", "System Design"],
        availability: "Weekends",
        responseTime: "2-4 hours",
        rating: 4.9,
        bookingPrice: 500,
        image: "👩‍💻",
      },
      {
        id: 2,
        name: "Raj Patel",
        role: "Product Manager",
        expertise: ["Product Strategy", "Growth", "Analytics"],
        availability: "Evenings",
        responseTime: "1-2 hours",
        rating: 4.8,
        bookingPrice: 600,
        image: "👨‍💼",
      },
      {
        id: 3,
        name: "Sarah Chen",
        role: "Data Science Lead",
        expertise: ["Machine Learning", "Python", "Statistics"],
        availability: "Flexible",
        responseTime: "3-5 hours",
        rating: 4.7,
        bookingPrice: 700,
        image: "👩‍🔬",
      },
      {
        id: 4,
        name: "Arjun Desai",
        role: "UX Designer",
        expertise: ["UI/UX Design", "Figma", "User Research"],
        availability: "Mornings",
        responseTime: "1 hour",
        rating: 4.9,
        bookingPrice: 550,
        image: "👨‍🎨",
      },
    ];

    return res.status(200).json({
      message: "Seniors retrieved successfully.",
      seniors,
      count: seniors.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve seniors.",
      error: error.message,
    });
  }
};

// Register as a mentor
const registerMentor = async (req, res) => {
  try {
    const { name, role, expertise, availability, bookingPrice } = req.body;
    const userId = req.user.userId;

    if (!name || !role || !expertise || !availability) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    // In production, save to database
    const newMentor = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      name,
      role,
      expertise,
      availability,
      bookingPrice: bookingPrice || 500,
      responseTime: "2-4 hours",
      rating: 4.5,
      createdAt: new Date(),
    };

    return res.status(201).json({
      message: "Mentor registration successful.",
      mentor: newMentor,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to register as mentor.",
      error: error.message,
    });
  }
};

module.exports = {
  getSeniors,
  registerMentor,
};
