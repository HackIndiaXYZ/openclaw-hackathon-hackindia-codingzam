import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authApi";
import { useMode } from "../context/ModeContext";
import { getModeResponse } from "../utils/modeResponse";
import { useLanguage } from "../context/useLanguage";

function LoginPage() {
  const navigate = useNavigate();
  const { mode } = useMode();
  const { language } = useLanguage();
  const text = language === "hi"
    ? {
        title: "वापस स्वागत है",
        subtitle: "जारी रखने के लिए लॉगिन करें।",
        email: "ईमेल",
        password: "पासवर्ड",
        emailPlaceholder: "you@example.com",
        passwordPlaceholder: "आपका पासवर्ड",
        wait: "कृपया प्रतीक्षा करें...",
        login: "लॉगिन",
        loginStart: "आपको लॉगिन किया जा रहा है...",
        loginSuccess: "लॉगिन सफल।",
        loginFailed: "लॉगिन असफल। कृपया फिर प्रयास करें।",
        newHere: "नए हैं?",
        createAccount: "अकाउंट बनाएं",
      }
    : {
        title: "Welcome Back",
        subtitle: "Login to continue.",
        email: "Email",
        password: "Password",
        emailPlaceholder: "you@example.com",
        passwordPlaceholder: "Your password",
        wait: "Please wait...",
        login: "Login",
        loginStart: "Logging you in...",
        loginSuccess: "Login successful.",
        loginFailed: "Login failed. Please try again.",
        newHere: "New here?",
        createAccount: "Create an account",
      };
  const [form, setForm] = useState({
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
    setStatus({ loading: true, message: text.loginStart, error: false });

    try {
      const response = await loginUser(form);

      // Store JWT so protected API calls can use it later.
      localStorage.setItem("token", response.data.token);

      setStatus({
        loading: false,
        message: text.loginSuccess,
        error: false,
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      const message = error.response?.data?.message || text.loginFailed;
      setStatus({ loading: false, message, error: true });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{text.title}</h1>
        <p className="auth-subtitle">{getModeResponse(mode, text.subtitle)}</p>

        <form className="auth-form" onSubmit={handleSubmit}>
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
            required
          />

          <button type="submit" disabled={status.loading}>
            {status.loading ? text.wait : text.login}
          </button>
        </form>

        {status.message && (
          <p className={status.error ? "status error" : "status success"}>{status.message}</p>
        )}

        <p className="auth-switch">
          {text.newHere} <Link to="/signup">{text.createAccount}</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

