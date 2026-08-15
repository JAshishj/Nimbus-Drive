import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";
import Icon from "../components/Icon";
import Spinner from "../components/Spinner";

const Register = () => {
  const [show, setShow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }
    setError({});

    try {
      setIsSubmitting(true);
      await authApi.register(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword,
      );
      navigate("/login", { replace: true });
    } catch (error) {
      setError({
        apiError: error.message || "Registration failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-accent text-white relative overflow-hidden">
        <div className="flex items-center gap-3">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-white/15">
            <Icon name="drive" size={22} />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">
            Nimbus
          </span>
        </div>

        <div>
          <p className="font-display text-4xl font-semibold leading-tight tracking-tight max-w-md">
            Your files, your place — set up home in seconds.
          </p>
          <p className="mt-4 text-white/80 max-w-sm">
            Create an account to start storing, organizing, and sharing
            everything that matters.
          </p>
        </div>

        <p className="text-white/60 text-sm">© 2026 Nimbus Drive</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 lg:hidden mb-10">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-accent text-white">
              <Icon name="drive" size={22} />
            </span>
            <span className="font-display text-xl font-semibold tracking-tight">
              Nimbus
            </span>
          </div>

          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-mute">
            Start with 15 GB of free storage.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error.apiError && (
              <p
                className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-600"
                role="alert"
              >
                {error.apiError}
              </p>
            )}

            <label className="block">
              <span className="text-sm font-medium">Full name</span>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Cooper"
                className="mt-1.5 w-full h-11 px-3.5 rounded-xl border border-line bg-surface text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Email</span>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="mt-1.5 w-full h-11 px-3.5 rounded-xl border border-line bg-surface text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Password</span>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={show ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="8+ characters"
                  className="mt-1.5 w-full h-11 px-3.5 pr-11 rounded-xl border border-line bg-surface text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center w-8 h-8 rounded-lg text-faint hover:text-ink hover:bg-line/50 transition-colors"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  <Icon name={show ? "eyeOff" : "eye"} size={17} />
                </button>
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium">Confirm Password</span>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={show ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="8+ characters"
                  className="mt-1.5 w-full h-11 px-3.5 pr-11 rounded-xl border border-line bg-surface text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center w-8 h-8 rounded-lg text-faint hover:text-ink hover:bg-line/50 transition-colors"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  <Icon name={show ? "eyeOff" : "eye"} size={17} />
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-5 h-11 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-[#185275] transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Spinner className="h-4 w-4 text-white" />
                  <span>Creating account…</span>
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="mt-8 text-sm text-mute text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-accent hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
