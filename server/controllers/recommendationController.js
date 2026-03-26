// Generate recommendations based on user profile
const generateRecommendations = async (req, res) => {
  try {
    const { track, selectedOption, timeline, profile } = req.body;
    const userId = req.user.userId;

    if (!track || !selectedOption || !timeline) {
      return res.status(400).json({
        message: "Track, selectedOption, and timeline are required.",
      });
    }

    // Generate recommendations based on track
    const recommendationMap = {
      "Internship": {
        "Tech": ["Google STEP", "Microsoft Internship", "Amazon Internship", "Meta Internship", "Apple Internship"],
        "Finance": ["Goldman Sachs", "Morgan Stanley", "JP Morgan", "Barclays", "Deloitte"],
        "Consulting": ["McKinsey", "BCG", "Bain", "Deloitte", "Accenture"],
        "Other": ["Flipkart", "CareerBuilder", "LinkedIn", "Internshala", "LetsIntern"],
      },
      "Scholarship": {
        "Merit-Based": ["INSPIRE Scholarship", "National Scholarship Portal", "AICTE Scholarship", "State Scholarships", "University Scholarships"],
        "Need-Based": ["MANYA Scholarship", "Scholarship Portal", "EBC Scholarship", "SC/ST Scholarship", "OBC Scholarship"],
        "Subject-Specific": ["Science Scholarship", "Engineering Scholarship", "Commerce Scholarship", "Arts Scholarship", "Professional Course Scholarship"],
        "International": ["Erasmus+", "Chevening Scholarship", "Fulbright", "DAAD", "Japanese Scholarships"],
      },
      "Career Guidance": {
        "Role Selection": ["Software Engineer", "Data Scientist", "Product Manager", "UX Designer", "DevOps Engineer"],
        "Skill Gap Analysis": ["Learn Python", "Master System Design", "Practice DSA", "Learn Cloud", "Web Development"],
        "Portfolio Review": ["GitHub Optimization", "Project Documentation", "Demo Videos", "Case Studies"],
        "Interview Prep": ["Mock Interviews", "LeetCode Practice", "Behavioral Questions", "System Design"],
      },
      "Guidance In Any Task": {
        "Assignment Strategy": ["Break into sections", "Create timeline", "Research thoroughly", "Review carefully"],
        "Email Drafting": ["Use professional tone", "Be concise", "Proofread", "Follow guidelines"],
        "Presentation": ["Strong opening", "Visual hierarchy", "Storytelling", "Call to action"],
        "Time Management": ["Prioritize tasks", "Set deadlines", "Take breaks", "Track progress"],
      },
    };

    const recs = recommendationMap[track]?.[selectedOption] || [];

    return res.status(200).json({
      message: "Recommendations generated successfully.",
      recommendations: recs,
      track,
      selectedOption,
      timeline,
      generatedAt: new Date(),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to generate recommendations.",
      error: error.message,
    });
  }
};

module.exports = {
  generateRecommendations,
};
