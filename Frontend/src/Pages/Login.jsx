import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Icon from "../components/Icon";
import { useAuth } from "../Context/AuthContext";

const Login = () => {
  const { login } = useAuth();

  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({});

  const validate = () => {
    const newErrors = {};

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
      await login(formData.email, formData.password);
      navigate(location.state?.from || "/", { replace: true });

    } catch (error) {
      setError({
        apiError: error.message || "Login failed. Please try again.",
      });
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
            Every file, one home — reachable from anywhere.
          </p>
          <p className="mt-4 text-white/80 max-w-sm">
            Store, organize, and share your files with a drive that works the
            way you do.
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
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-mute">
            Sign in to access your drive.
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
              {error.email && (
                <p className="mt-1 text-sm text-red-600">{error.email}</p>
              )}
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
                  placeholder="••••••••"
                  className="mt-1.5 w-full h-11 px-3.5 pr-11 rounded-xl border border-line bg-surface text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-accent"
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
              {error.password && (
                <p className="mt-1 text-sm text-red-600">{error.password}</p>
              )}
            </label>

            <div className="flex items-center justify-center pt-1">
              <button
                type="button"
                className="text-sm font-medium text-accent hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-[#185275] transition-colors shadow-sm"
            >
              Sign in
            </button>
          </form>

          <p className="mt-8 text-sm text-mute text-center">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-accent hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
