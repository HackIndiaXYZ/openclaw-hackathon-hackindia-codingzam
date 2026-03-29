import SeniorCard from "../components/SeniorCard";
import { useMemo, useState, useEffect } from "react";
import { useMode } from "../context/useMode";
import { getModeResponse } from "../utils/modeResponse";
import { fetchSeniors, registerAsMentor } from "../services/seniorApi";
import { useLanguage } from "../context/useLanguage";
import { recordSeniorClick } from "../utils/userActivity";

const initialSeniors = [
  {
    id: 1,
    name: "Aarav Sharma",
    role: "Frontend Engineer at Product Studio",
    expertise: "Frontend",
    availability: "Weekend",
    paid: false,
    contactLink: "https://www.linkedin.com",
    bookCallLink: "https://calendly.com",
    rating: 4.9,
    responseTime: "< 2 hours",
    mentees: 24,
  },
  {
    id: 2,
    name: "Isha Verma",
    role: "Data Analyst at Growth Labs",
    expertise: "Data",
    availability: "Weekday Evening",
    paid: true,
    contactLink: "https://www.linkedin.com",
    bookCallLink: "https://calendly.com",
    rating: 4.8,
    responseTime: "< 1 hour",
    mentees: 18,
  },
  {
    id: 3,
    name: "Kabir Mehta",
    role: "Backend Engineer at Cloud Systems",
    expertise: "Backend",
    availability: "Weekend",
    paid: false,
    contactLink: "https://www.linkedin.com",
    bookCallLink: "https://calendly.com",
    rating: 4.7,
    responseTime: "< 3 hours",
    mentees: 31,
  },
  {
    id: 4,
    name: "Naina Rao",
    role: "AI/ML Associate at Insight AI",
    expertise: "AI/ML",
    availability: "Flexible",
    paid: true,
    contactLink: "https://www.linkedin.com",
    bookCallLink: "https://calendly.com",
    rating: 5.0,
    responseTime: "< 30 mins",
    mentees: 42,
  },
];

function SeniorsPage() {
  const { mode } = useMode();
  const { language } = useLanguage();
  const isHindi = language === "hi";
  const [seniors, setSeniors] = useState(initialSeniors);
  const [sortBy, setSortBy] = useState("rating");
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    expertise: null,
    availability: null,
    pricing: null,
  });
  const [registrationStep, setRegistrationStep] = useState(0);
  const [submitMessage, setSubmitMessage] = useState({ show: false, error: false, text: "" });
  const [mentorForm, setMentorForm] = useState({
    name: "",
    role: "",
    expertise: "Frontend",
    availability: "Weekday Evening",
    paid: false,
    contactLink: "",
    bookCallLink: "",
    rating: 4.5,
    responseTime: "< 2 hours",
    mentees: 0,
  });

  // Fetch seniors from backend on component mount
  useEffect(() => {
    const loadSeniors = async () => {
      try {
        const response = await fetchSeniors();
        if (response.data.seniors) {
          const normalized = response.data.seniors.map((item, index) => {
            const expertiseValue = Array.isArray(item.expertise)
              ? item.expertise[0] || "General"
              : item.expertise || "General";

            const pricing = typeof item.bookingPrice === "number" ? item.bookingPrice : 0;

            return {
              id: item.id || item._id || `${Date.now()}-${index}`,
              name: item.name || "Mentor",
              role: item.role || "Senior Mentor",
              expertise: expertiseValue,
              availability: item.availability || "Flexible",
              paid: pricing > 0,
              contactLink: item.contactLink || "https://www.linkedin.com",
              bookCallLink: item.bookCallLink || "https://calendly.com",
              rating: item.rating || 4.6,
              responseTime: item.responseTime || "< 24 hours",
              mentees: item.mentees || 0,
            };
          });

          setSeniors(normalized);
        }
      } catch (error) {
        console.error("Failed to fetch seniors:", error);
        // Keep initialSeniors as fallback
      }
    };
    loadSeniors();
  }, []);

  const menuOptions = {
    expertise: ["Frontend", "Backend", "Data", "AI/ML", "Product", "DevOps", "UX/Design"],
    availability: ["Weekday Morning", "Weekday Evening", "Weekend", "Flexible"],
    pricing: ["Free", "Paid"],
  };

  const filteredAndSortedSeniors = useMemo(() => {
    let result = seniors.filter((senior) => {
      const searchLower = searchInput.toLowerCase();
      const matchesSearch =
        senior.name.toLowerCase().includes(searchLower) ||
        senior.role.toLowerCase().includes(searchLower) ||
        senior.expertise.toLowerCase().includes(searchLower);

      const matchesExpertise = !filters.expertise || senior.expertise === filters.expertise;
      const matchesAvailability = !filters.availability || senior.availability === filters.availability;
      const matchesPricing =
        !filters.pricing ||
        (filters.pricing === "Paid" && senior.paid) ||
        (filters.pricing === "Free" && !senior.paid);

      return matchesSearch && matchesExpertise && matchesAvailability && matchesPricing;
    });

    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "responseTime") {
      result.sort((a, b) => {
        const timeA = parseInt(a.responseTime) || 999;
        const timeB = parseInt(b.responseTime) || 999;
        return timeA - timeB;
      });
    } else if (sortBy === "mentees") {
      result.sort((a, b) => b.mentees - a.mentees);
    }

    return result;
  }, [filters, searchInput, seniors, sortBy]);

  const handleFilterClick = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type] === value ? null : value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({ expertise: null, availability: null, pricing: null });
    setSearchInput("");
    setSortBy("rating");
  };

  const handleMentorChange = (event) => {
    const { name, value, type, checked } = event.target;
    setMentorForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMentorSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        name: mentorForm.name.trim(),
        role: mentorForm.role.trim(),
        expertise: mentorForm.expertise,
        availability: mentorForm.availability,
        paid: mentorForm.paid,
        contactLink: mentorForm.contactLink.trim() || "https://www.linkedin.com",
        bookCallLink: mentorForm.bookCallLink.trim() || "https://calendly.com",
      };

      const response = await registerAsMentor(payload);
      const returned = response.data?.mentor || payload;

      const newMentor = {
        id: returned.id || returned._id || Date.now(),
        name: returned.name,
        role: returned.role,
        expertise: Array.isArray(returned.expertise) ? returned.expertise[0] : returned.expertise,
        availability: returned.availability,
        paid: Boolean(returned.paid),
        contactLink: returned.contactLink || payload.contactLink,
        bookCallLink: returned.bookCallLink || payload.bookCallLink,
        rating: returned.rating || 4.5,
        responseTime: returned.responseTime || "< 24 hours",
        mentees: returned.mentees || 0,
      };

      setSeniors((prev) => [newMentor, ...prev]);
      setMentorForm({
        name: "",
        role: "",
        expertise: "Frontend",
        availability: "Weekday Evening",
        paid: false,
        contactLink: "",
        bookCallLink: "",
        rating: 4.5,
        responseTime: "< 2 hours",
        mentees: 0,
      });
      setRegistrationStep(0);
      setSubmitMessage({
        show: true,
        error: false,
        text: isHindi
          ? "✅ प्रोफाइल सफलतापूर्वक जुड़ गई!"
          : "✅ Profile added successfully!",
      });
    } catch (error) {
      const message = error.response?.data?.message;
      setSubmitMessage({
        show: true,
        error: true,
        text: message || (isHindi ? "रजिस्ट्रेशन असफल। कृपया दोबारा प्रयास करें।" : "Registration failed. Please try again."),
      });
    }

    setTimeout(() => {
      setSubmitMessage({ show: false, error: false, text: "" });
    }, 3000);
  };

  const goToNextStep = () => {
    if (registrationStep < 3) {
      setRegistrationStep(registrationStep + 1);
    }
  };

  const goToPrevStep = () => {
    if (registrationStep > 0) {
      setRegistrationStep(registrationStep - 1);
    }
  };

  const trackSeniorClick = (senior) => {
    recordSeniorClick(String(senior.id), senior.name);
  };

  return (
    <section className="seniors-page">
      <div className="seniors-header">
        <h1>{isHindi ? "सीनियर मेंटर्स से जुड़ें" : "Connect With Senior Mentors"}</h1>
        <p>
          {getModeResponse(
            mode,
            isHindi
              ? "अपने करियर सफर के लिए सही मेंटर चुनें। खोजें, जुड़ें और साथ में बढ़ें।"
              : "Find the perfect mentor to guide your career journey. Browse, connect, and grow together.",
            isHindi ? "अनुभवी मेंटर्स से जुड़ें और मार्गदर्शन पाएं" : "Connect with experienced mentors & get guidance"
          )}
        </p>
      </div>

      {/* Search Bar */}
      <div className="seniors-search-wrapper">
        <input
          type="text"
          className="seniors-search-input"
          placeholder={isHindi ? "🔍 नाम, भूमिका या विशेषज्ञता से खोजें..." : "🔍 Search by name, role, or expertise..."}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        {searchInput && (
          <button
            className="search-clear-btn"
            onClick={() => setSearchInput("")}
            aria-label={isHindi ? "खोज साफ करें" : "Clear search"}
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="seniors-filter-section">
        <div className="filter-chips-group">
          <div className="filter-category">
            <span className="filter-label">{isHindi ? "विशेषज्ञता:" : "Expertise:"}</span>
            <div className="filter-chips">
              {menuOptions.expertise.map((item) => (
                <button
                  key={item}
                  className={`filter-chip ${filters.expertise === item ? "active" : ""}`}
                  onClick={() => handleFilterClick("expertise", item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-category">
            <span className="filter-label">{isHindi ? "उपलब्धता:" : "Availability:"}</span>
            <div className="filter-chips">
              {menuOptions.availability.map((item) => (
                <button
                  key={item}
                  className={`filter-chip ${filters.availability === item ? "active" : ""}`}
                  onClick={() => handleFilterClick("availability", item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-category">
            <span className="filter-label">{isHindi ? "फीस:" : "Pricing:"}</span>
            <div className="filter-chips">
              {menuOptions.pricing.map((item) => (
                <button
                  key={item}
                  className={`filter-chip ${filters.pricing === item ? "active" : ""}`}
                  onClick={() => handleFilterClick("pricing", item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sort and Clear */}
        <div className="seniors-control-bar">
          <select
            className="sort-dropdown"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="rating">{isHindi ? "सॉर्ट: टॉप रेटेड" : "Sort: Top Rated"}</option>
            <option value="responseTime">{isHindi ? "सॉर्ट: सबसे तेज़ रिस्पॉन्स" : "Sort: Fastest Response"}</option>
            <option value="mentees">{isHindi ? "सॉर्ट: सबसे अनुभवी" : "Sort: Most Experienced"}</option>
          </select>

          {(searchInput || filters.expertise || filters.availability || filters.pricing) && (
            <button className="clear-filters-btn" onClick={handleClearFilters}>
              {isHindi ? "सभी फिल्टर्स साफ करें" : "Clear All Filters"}
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="seniors-results-info">
        <p className="results-count">
          {isHindi ? "मिले" : "Found"} <strong>{filteredAndSortedSeniors.length}</strong> {isHindi ? "मेंटर" : "mentor"}
          {filteredAndSortedSeniors.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Mentors Grid */}
      <div className="seniors-grid">
        {filteredAndSortedSeniors.length > 0 ? (
          filteredAndSortedSeniors.map((senior) => (
            <SeniorCard
              key={senior.id}
              senior={senior}
              onContactClick={() => trackSeniorClick(senior)}
              onBookClick={() => trackSeniorClick(senior)}
            />
          ))
        ) : (
          <div className="no-results-message">
            <p>{isHindi ? "आपके मानदंड से मेल खाते मेंटर्स नहीं मिले।" : "No mentors found matching your criteria."}</p>
            <button className="reset-filters-link" onClick={handleClearFilters}>
              {isHindi ? "← फिल्टर्स रीसेट करें और फिर प्रयास करें" : "← Reset filters & try again"}
            </button>
          </div>
        )}
      </div>

      {/* Mentor Registration Section */}
      <div className="senior-join-panel">
        <h2>{isHindi ? "🌟 मेंटर बनें" : "🌟 Become A Mentor"}</h2>
        <p>{isHindi ? "अपनी विशेषज्ञता साझा करें और छात्रों की करियर यात्रा में मदद करें।" : "Share your expertise and help students navigate their career. Register in just a few steps."}</p>

        {submitMessage.show && (
          <div className={submitMessage.error ? "status error" : "success-message"}>
            {submitMessage.text}
          </div>
        )}

        <form className="senior-join-form-guided" onSubmit={handleMentorSubmit}>
          {/* Step 0: Basic Info */}
          {registrationStep === 0 && (
            <div className="form-step active">
              <h3>{isHindi ? "स्टेप 1/4 - आपकी प्रोफाइल" : "Step 1 of 4 - Your Profile"}</h3>
              <input
                name="name"
                placeholder={isHindi ? "पूरा नाम" : "Full Name"}
                value={mentorForm.name}
                onChange={handleMentorChange}
                required
              />
              <input
                name="role"
                placeholder={isHindi ? "वर्तमान भूमिका और कंपनी" : "Current Role & Company (e.g., Frontend Engineer @ TechCorp)"}
                value={mentorForm.role}
                onChange={handleMentorChange}
                required
              />
            </div>
          )}

          {/* Step 1: Expertise & Availability */}
          {registrationStep === 1 && (
            <div className="form-step active">
              <h3>{isHindi ? "स्टेप 2/4 - विशेषज्ञता और उपलब्धता" : "Step 2 of 4 - Expertise & Availability"}</h3>
              <label>{isHindi ? "अपनी मुख्य विशेषज्ञता चुनें:" : "Select Your Primary Expertise:"}</label>
              <div className="option-chip-group">
                {menuOptions.expertise.map((exp) => (
                  <button
                    key={exp}
                    type="button"
                    className={`option-chip-large ${mentorForm.expertise === exp ? "active" : ""}`}
                    onClick={() => setMentorForm({ ...mentorForm, expertise: exp })}
                  >
                    {exp}
                  </button>
                ))}
              </div>

              <label style={{ marginTop: "16px" }}>{isHindi ? "आप कब उपलब्ध हैं?" : "When are you available?"}</label>
              <div className="option-chip-group">
                {menuOptions.availability.map((avail) => (
                  <button
                    key={avail}
                    type="button"
                    className={`option-chip-large ${mentorForm.availability === avail ? "active" : ""}`}
                    onClick={() => setMentorForm({ ...mentorForm, availability: avail })}
                  >
                    {avail}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Contact & Booking */}
          {registrationStep === 2 && (
            <div className="form-step active">
              <h3>{isHindi ? "स्टेप 3/4 - संपर्क और बुकिंग" : "Step 3 of 4 - Contact & Booking"}</h3>
              <input
                name="contactLink"
                placeholder={isHindi ? "आपकी LinkedIn/Portfolio लिंक" : "Your LinkedIn or Portfolio Link"}
                value={mentorForm.contactLink}
                onChange={handleMentorChange}
                required
              />
              <input
                name="bookCallLink"
                placeholder={isHindi ? "बुकिंग लिंक (Calendly आदि)" : "Booking Link (Calendly, etc.)"}
                value={mentorForm.bookCallLink}
                onChange={handleMentorChange}
                required
              />
            </div>
          )}

          {/* Step 3: Pricing */}
          {registrationStep === 3 && (
            <div className="form-step active">
              <h3>{isHindi ? "स्टेप 4/4 - फीस और सारांश" : "Step 4 of 4 - Pricing & Summary"}</h3>
              <div className="pricing-options">
                <button
                  type="button"
                  className={`pricing-option ${!mentorForm.paid ? "active" : ""}`}
                  onClick={() => setMentorForm({ ...mentorForm, paid: false })}
                >
                  <span className="pricing-label">{isHindi ? "फ्री मेंटरशिप" : "Free Mentorship"}</span>
                  <span className="pricing-desc">{isHindi ? "बिना शुल्क के जूनियर्स की मदद करें" : "Help juniors grow at no cost"}</span>
                </button>
                <button
                  type="button"
                  className={`pricing-option ${mentorForm.paid ? "active" : ""}`}
                  onClick={() => setMentorForm({ ...mentorForm, paid: true })}
                >
                  <span className="pricing-label">{isHindi ? "पेड मेंटरशिप" : "Paid Mentorship"}</span>
                  <span className="pricing-desc">{isHindi ? "अपनी फीस खुद तय करें" : "Set your own rates"}</span>
                </button>
              </div>

              <div className="profile-preview">
                <h4>{isHindi ? "आपकी प्रोफाइल प्रीव्यू:" : "Your Profile Preview:"}</h4>
                <div className="preview-card">
                  <h5>{mentorForm.name}</h5>
                  <p className="preview-role">{mentorForm.role}</p>
                  <div className="preview-tags">
                    <span className="tag">{mentorForm.expertise}</span>
                    <span className="tag">{mentorForm.availability}</span>
                    <span className={`tag ${mentorForm.paid ? "paid" : "free"}`}>
                      {mentorForm.paid ? (isHindi ? "पेड" : "Paid") : (isHindi ? "फ्री" : "Free")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step Navigation */}
          <div className="form-step-controls">
            {registrationStep > 0 && (
              <button type="button" className="btn-secondary" onClick={goToPrevStep}>
                {isHindi ? "← वापस" : "← Back"}
              </button>
            )}

            {registrationStep < 3 ? (
              <button type="button" className="btn-primary" onClick={goToNextStep}>
                {isHindi ? "आगे →" : "Next →"}
              </button>
            ) : (
              <button type="submit" className="btn-primary btn-submit">
                {isHindi ? "रजिस्ट्रेशन पूरा करें" : "Complete Registration"}
              </button>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="step-progress">
            <div className="progress-dots">
              {[0, 1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`dot ${step === registrationStep ? "current" : step < registrationStep ? "completed" : ""}`}
                  onClick={() => step <= registrationStep && setRegistrationStep(step)}
                />
              ))}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default SeniorsPage;

