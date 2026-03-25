Harika, GitHub repon için son dokunuşları yapalım. UI entegrasyonu ve kullanım detaylarını da eklediğimizde, herkesin saniyeler içinde kendi projesine dahil edebileceği profesyonel bir README.md ortaya çıkmış olacak.İşte tüm parçaları birleştiren Final README sürümü:🛡️ JS Dynamic Idle Lock SystemA lightweight, vanilla JavaScript solution to automatically lock user sessions after a period of inactivity. Perfect for dashboards, admin panels, and security-sensitive web applications.✨ FeaturesDynamic Timeout: Set duration via localStorage or use the default 30 minutes.Toggle Support: Users can enable or disable the auto-lock feature.Visual Warning: Beautiful countdown modal using SweetAlert2.Performance Optimized: Uses event throttling for mousemove to prevent CPU overhead.Secure: Automatically triggers a backend API call to lock the session before redirecting.Zero Dependencies: Pure Vanilla JS (SweetAlert2 is only required for the UI components).🚀 Quick StartInclude SweetAlert2 in your project (CDN or NPM).Add idle-lock.js to your shared layout or base HTML.Configure your API endpoints inside idle-lock.js:JavaScriptconst LOCK_API_ENDPOINT = "/api/auth/lock"; 
const REDIRECT_URL = "/lockscreen";
🛠️ UI Integration (Settings Page)To allow users to customize their lock settings, you can use the following logic in your settings or profile page.1. Enable / Disable ToggleControls whether the idle lock system is active.JavaScript// localStorage key: "app_lock_enabled"
const idleLockSwitch = document.getElementById("idle-lock-switch");

idleLockSwitch.addEventListener("change", (e) => {
  const isEnabled = e.target.checked;
  localStorage.setItem("app_lock_enabled", isEnabled ? "true" : "false");
});
2. Set Custom TimeoutUpdates the inactivity period (in minutes).JavaScript// localStorage key: "app_lock_timeout_minutes"
const timeoutInput = document.getElementById("idle-lock-timeout-input");
const saveBtn = document.getElementById("idle-lock-save-btn");

saveBtn.addEventListener("click", () => {
  let minutes = parseInt(timeoutInput.value, 10);
  
  // Suggested Validation: Min 1 min, Max 1440 mins (24h)
  if (isNaN(minutes) || minutes < 1) minutes = 1;
  localStorage.setItem("app_lock_timeout_minutes", minutes.toString());
});
3. Reset to DefaultQuickly restores the system to the default 30-minute setting.JavaScriptconst defaultBtn = document.getElementById("idle-lock-default-btn");

defaultBtn.addEventListener("click", () => {
  const DEFAULT_VAL = "30";
  localStorage.setItem("app_lock_timeout_minutes", DEFAULT_VAL);
  document.getElementById("idle-lock-timeout-input").value = DEFAULT_VAL;
});
⚙️ Configuration SummaryThe core script monitors the following localStorage keys:KeyTypeDefaultDescriptionapp_lock_enabledString"true"Global on/off switch for the script.app_lock_timeout_minutesString"30"Inactivity duration before locking.🤝 ContributingContributions, issues, and feature requests are welcome! Feel free to check the issues page.📝 LicenseThis project is MIT licensed.
