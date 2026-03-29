import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../services/authApi";
import { useMode } from "../context/useMode";
import { getModeResponse } from "../utils/modeResponse";
import { useLanguage } from "../context/useLanguage";

function SignupPage() {
  const { mode } = useMode();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const text = language === "hi"
    ? {
        title: "अकाउंट बनाएं",
        subtitle: "अपनी ExplainX.ai यात्रा शुरू करें।",
        name: "नाम",
        email: "ईमेल",
        password: "पासवर्ड",
        namePlaceholder: "अपना पूरा नाम",
        emailPlaceholder: "you@example.com",
        passwordPlaceholder: "कम से कम 6 अक्षर",
        wait: "कृपया प्रतीक्षा करें...",
        signup: "साइन अप",
        creating: "आपका अकाउंट बनाया जा रहा है...",
        success: "साइनअप सफल। कृपया लॉगिन करें।",
        failed: "साइनअप असफल। कृपया फिर प्रयास करें।",
        already: "पहले से अकाउंट है?",
        login: "लॉगिन",
      }
    : {
        title: "Create Account",
        subtitle: "Start your ExplainX.ai journey.",
        name: "Name",
        email: "Email",
        password: "Password",
        namePlaceholder: "Your full name",
        emailPlaceholder: "you@example.com",
        passwordPlaceholder: "Minimum 6 characters",
        wait: "Please wait...",
        signup: "Sign Up",
        creating: "Creating your account...",
        success: "Signup successful. Please log in.",
        failed: "Signup failed. Please try again.",
        already: "Already have an account?",
        login: "Login",
      };
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [status, setStatus] = useState({ loading: false, message: "", error: false });

  // Update form state when user types in inputs.
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, message: text.creating, error: false });

    try {
      const response = await signupUser({ ...form, mode });

      // Keep signup and login auth behavior consistent by persisting JWT.
      if (response?.data?.token) {
        localStorage.setItem("token", response.data.token);
      }

      setStatus({
        loading: false,
        message: getModeResponse(mode, text.success),
        error: false,
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      const message = error.response?.data?.message || text.failed;
      setStatus({ loading: false, message, error: true });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{text.title}</h1>
        <p className="auth-subtitle">{getModeResponse(mode, text.subtitle)}</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="name">{text.name}</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder={text.namePlaceholder}
            value={form.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">{text.email}</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder={text.emailPlaceholder}
            value={form.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">{text.password}</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder={text.passwordPlaceholder}
            value={form.password}
            onChange={handleChange}
            minLength={6}
            required
          />

          <button type="submit" disabled={status.loading}>
            {status.loading ? text.wait : text.signup}
          </button>
        </form>

        {status.message && (
          <p className={status.error ? "status error" : "status success"}>{status.message}</p>
        )}

        <p className="auth-switch">
          {text.already} <Link to="/login">{text.login}</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;

