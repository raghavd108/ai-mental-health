import React, { useState } from "react";

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
    // Optionally save this to your backend
  };

  return (
    <div className="settings-page">
      <h2>Settings</h2>
      <div>
        <label>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={handleToggle}
          />
          Enable Notifications
        </label>
      </div>
    </div>
  );
}
