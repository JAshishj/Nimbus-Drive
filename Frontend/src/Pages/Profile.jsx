import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import { useAuth } from "../Context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const [showDeleteNote, setShowDeleteNote] = useState(false);

  const name = user?.name || "Nimbus User";
  const email = user?.email || "";
  const initial = (name.charAt(0) || "N").toUpperCase();

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
            Your account, in one place.
          </p>
          <p className="mt-4 text-white/80 max-w-sm">
            Manage who you are here — your details, your session, and your
            data.
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

          <Link
            to="/"
            className="ml-[-7%] inline-flex items-center gap-1.5 text-base font-semibold text-mute hover:text-ink transition-colors cursor-pointer"
          >
            <Icon name="arrowLeft" size={19} />
            Back to My Drive
          </Link>

          <div className="mt-4 rounded-2xl border border-line bg-surface p-8 text-center">
            <span className="mx-auto grid place-items-center w-20 h-20 rounded-full bg-accent text-white font-display text-3xl font-semibold">
              {initial}
            </span>
            <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">
              {name}
            </h1>
            <p className="mt-1 text-sm text-mute">{email}</p>

            <div className="mt-6 pt-6 border-t border-line space-y-3">
              <Link
                to="/logout"
                replace={true}
                className="inline-flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-[#185275] transition-colors shadow-sm"
              >
                <Icon name="logout" size={18} />
                Log out
              </Link>
              <button
                onClick={() => setShowDeleteNote(true)}
                className="inline-flex items-center justify-center gap-2 w-full h-11 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:border-red-300 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Icon name="trash" size={16} />
                Delete account
              </button>
              {showDeleteNote && (
                <p className="text-xs text-faint">
                  Account deletion is coming soon.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;