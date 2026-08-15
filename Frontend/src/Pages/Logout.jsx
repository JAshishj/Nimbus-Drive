import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import Spinner from "../components/Spinner";
import { useAuth } from "../Context/AuthContext";

const Logout = () => {
  const { logout } = useAuth();
  const [state, setState] = useState("signing-out");
  const [errorMessage, setErrorMessage] = useState("");
  const ranRef = useRef(false);

  const runLogout = async () => {
    setState("signing-out");
    try {
      await logout();
      setState("done");
    } catch (error) {
      setErrorMessage(
        error.message || "We couldn't sign you out. Please try again.",
      );
      setState("error");
    }
  };

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;
    runLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            See you next time.
          </p>
          <p className="mt-4 text-white/80 max-w-sm">
            Your files are exactly where you left them. Sign back in whenever
            you're ready.
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

          <div className="rounded-2xl border border-line bg-surface p-8 text-center">
            {state === "signing-out" && (
              <>
                <span className="mx-auto grid place-items-center w-14 h-14 rounded-2xl bg-accent-soft text-accent mb-5">
                  <Spinner className="h-6 w-6 text-accent" />
                </span>
                <h1 className="font-display text-2xl font-semibold tracking-tight">
                  Signing you out…
                </h1>
                <p className="mt-2 text-sm text-mute">
                  Clearing your session.
                </p>
              </>
            )}

            {state === "done" && (
              <>
                <span className="mx-auto grid place-items-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mb-5">
                  <Icon name="check" size={26} strokeWidth={2.5} />
                </span>
                <h1 className="font-display text-2xl font-semibold tracking-tight">
                  You're signed out
                </h1>
                <p className="mt-2 text-sm text-mute">
                  Thanks for using Nimbus Drive.
                </p>
                <Link
                  to="/login"
                  className="mt-6 inline-flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-[#185275] transition-colors shadow-sm"
                >
                  <Icon name="drive" size={18} />
                  Sign back in
                </Link>
              </>
            )}

            {state === "error" && (
              <>
                <span className="mx-auto grid place-items-center w-14 h-14 rounded-2xl bg-red-50 text-red-600 mb-5">
                  <Icon name="info" size={26} />
                </span>
                <h1 className="font-display text-2xl font-semibold tracking-tight">
                  Couldn't sign you out
                </h1>
                <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
                <button
                  onClick={runLogout}
                  className="mt-6 inline-flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-[#185275] transition-colors shadow-sm cursor-pointer"
                >
                  <Icon name="logout" size={18} />
                  Try again
                </button>
                <Link
                  to="/login"
                  className="mt-3 inline-flex items-center justify-center gap-2 w-full h-11 rounded-xl border border-line text-sm font-medium hover:bg-canvas transition-colors"
                >
                  Back to login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;