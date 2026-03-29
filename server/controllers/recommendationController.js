const opportunityCatalog = {
  Internship: [
    {
      key: "internshala-platform",
      title: "Internshala Premium Internships",
      provider: "Internshala",
      url: "https://internshala.com/internships/",
      tags: ["remote", "paid", "startup", "web", "data"],
      minYear: 1,
      deadlineHint: "Rolling",
      requiredSkills: ["communication"],
    },
    {
      key: "wellfound-startup-roles",
      title: "Wellfound Startup Internships",
      provider: "Wellfound",
      url: "https://wellfound.com/jobs",
      tags: ["startup", "product", "engineering"],
      minYear: 2,
      deadlineHint: "Rolling",
      requiredSkills: ["problem solving"],
    },
    {
      key: "linkedin-jobs-intern",
      title: "LinkedIn Internship Openings",
      provider: "LinkedIn",
      url: "https://www.linkedin.com/jobs/",
      tags: ["corporate", "paid", "global"],
      minYear: 2,
      deadlineHint: "Weekly refresh",
      requiredSkills: ["communication"],
    },
  ],
  Scholarship: [
    {
      key: "nsp-scholarships",
      title: "National Scholarship Portal",
      provider: "Govt. of India",
      url: "https://scholarships.gov.in",
      tags: ["government", "need-based", "merit-based"],
      minYear: 1,
      deadlineHint: "Annual windows",
      requiredSkills: [],
    },
    {
      key: "buddy4study",
      title: "Buddy4Study Programs",
      provider: "Buddy4Study",
      url: "https://www.buddy4study.com",
      tags: ["private", "need-based", "women", "merit-based"],
      minYear: 1,
      deadlineHint: "Monthly opportunities",
      requiredSkills: [],
    },
    {
      key: "chevening",
      title: "Chevening Scholarships",
      provider: "Chevening",
      url: "https://www.chevening.org",
      tags: ["international", "leadership"],
      minYear: 4,
      deadlineHint: "Yearly intake",
      requiredSkills: ["communication"],
    },
  ],
  Fellowships: [
    {
      key: "acumen-fellowship",
      title: "Acumen Fellowship",
      provider: "Acumen",
      url: "https://acumen.org/fellowship",
      tags: ["social impact", "leadership"],
      minYear: 3,
      deadlineHint: "Cohort based",
      requiredSkills: ["communication"],
    },
    {
      key: "fulbright-fellowship",
      title: "Fulbright Programs",
      provider: "Fulbright",
      url: "https://foreign.fulbrightonline.org",
      tags: ["international", "research"],
      minYear: 4,
      deadlineHint: "Annual cycle",
      requiredSkills: ["research"],
    },
  ],
  Hackathons: [
    {
      key: "devpost-hackathons",
      title: "Devpost Hackathons",
      provider: "Devpost",
      url: "https://devpost.com/hackathons",
      tags: ["beginner", "ai", "web", "product"],
      minYear: 1,
      deadlineHint: "Weekly updates",
      requiredSkills: ["problem solving"],
    },
    {
      key: "unstop-hackathons",
      title: "Unstop Hackathons",
      provider: "Unstop",
      url: "https://unstop.com/hackathons",
      tags: ["college", "innovation", "engineering"],
      minYear: 1,
      deadlineHint: "Daily updates",
      requiredSkills: ["communication"],
    },
  ],
  "Freelance / Part-time": [
    {
      key: "upwork-gigs",
      title: "Upwork Starter Gigs",
      provider: "Upwork",
      url: "https://www.upwork.com",
      tags: ["web", "design", "content", "data"],
      minYear: 1,
      deadlineHint: "Rolling",
      requiredSkills: ["communication"],
    },
    {
      key: "fiverr-services",
      title: "Fiverr Service Offers",
      provider: "Fiverr",
      url: "https://www.fiverr.com",
      tags: ["design", "content", "editing"],
      minYear: 1,
      deadlineHint: "Rolling",
      requiredSkills: ["communication"],
    },
  ],
};

const parseYearNumber = (yearLabel = "") => {
  const match = String(yearLabel).match(/\d+/);
  return match ? Number(match[0]) : 4;
};

const tokenize = (text = "") =>
  String(text)
    .toLowerCase()
    .split(/[\s,/-]+/)
    .map((token) => token.trim())
    .filter(Boolean);

const buildScoredOpportunities = ({ track, selectedOption, timeline, profile }) => {
  const list = opportunityCatalog[track] || [];
  const userTokens = new Set([
    ...tokenize(profile?.interests),
    ...tokenize(profile?.skills),
    ...tokenize(selectedOption),
  ]);

  const yearNumber = parseYearNumber(profile?.year);
  const timelineBoost =
    ["Immediate", "This Week", "This Month", "Urgent", "Today"].includes(timeline) ? 6 : 2;

  return list
    .map((item) => {
      let score = 54;
      const reasons = [];

      const tagHits = item.tags.filter((tag) => userTokens.has(String(tag).toLowerCase()));
      if (tagHits.length > 0) {
        score += Math.min(24, tagHits.length * 8);
        reasons.push(`Matches your interests/skills: ${tagHits.join(", ")}`);
      }

      if (yearNumber >= item.minYear) {
        score += 10;
        reasons.push(`Year eligibility likely fit (min ${item.minYear})`);
      } else {
        score -= 8;
        reasons.push(`May need higher year level (min ${item.minYear})`);
      }

      score += timelineBoost;
      reasons.push(`Timeline alignment: ${timeline}`);

      const missingSkills = item.requiredSkills.filter(
        (skill) => !userTokens.has(String(skill).toLowerCase())
      );
      if (missingSkills.length > 0) {
        score -= Math.min(10, missingSkills.length * 5);
      }

      const confidence = Math.max(58, Math.min(97, score));

      return {
        ...item,
        confidence,
        reasons,
        missingSkills,
        nextActions: [
          "Open official link and verify current deadline",
          "Customize resume/portfolio for this opportunity",
          "Submit and track status in dashboard",
        ],
      };
    })
    .sort((a, b) => b.confidence - a.confidence);
};

const generateRecommendations = async (req, res) => {
  try {
    const { track, selectedOption, timeline, profile } = req.body;

    if (!track || !selectedOption || !timeline) {
      return res.status(400).json({
        message: "Track, selectedOption, and timeline are required.",
      });
    }

    const opportunities = buildScoredOpportunities({
      track,
      selectedOption,
      timeline,
      profile: profile || {},
    });

    const recommendations = opportunities.map((item) => item.title);

    return res.status(200).json({
      message: "Recommendations generated successfully.",
      recommendations,
      opportunities,
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
