import React from "react";
import ThemeToggle from "@/components/toggles/ThemeToggle";
import { Settings, X } from "lucide-react";

const DashSpeedDial = () => {
  return (
    <section>
      <div className="fab fab-flower">
        {/* a focusable div with tabIndex is necessary to work on all browsers. role="button" is necessary for accessibility */}
        <div
          tabIndex={0}
          role="button"
          className="btn btn-lg btn-neutral btn-circle"
        >
          <Settings className="h-5 w-5" />
        </div>

        {/* Main Action button replaces the original button when FAB is open */}
        <button className="fab-main-action btn btn-circle btn-lg btn-neutral">
          <X className="h-5 w-5" />
        </button>

        {/* buttons that show up when FAB is open */}
        <ThemeToggle />
      </div>
    </section>
  );
};

export default DashSpeedDial;
