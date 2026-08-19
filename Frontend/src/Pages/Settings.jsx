import { Link } from "react-router-dom";
import Icon from "../components/Icon";

const Settings = () => {
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
            Make it yours.
          </p>
          <p className="mt-4 text-white/80 max-w-sm">
            Personalization, storage, and account preferences — all in the
            works.
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
            <span className="mx-auto grid place-items-center w-14 h-14 rounded-2xl bg-accent-soft text-accent mb-5">
              <Icon name="settings" size={26} />
            </span>
            <h1 className="font-display text-2xl font-semibold tracking-tight">
              Settings
            </h1>
            <p className="mt-2 text-sm text-mute">
              Coming soon — we're building this right now.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-[#185275] transition-colors shadow-sm"
            >
              <Icon name="drive" size={18} />
              Back to My Drive
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;