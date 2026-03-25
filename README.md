# 🛡️ JS Dynamic Idle Lock System

A lightweight, vanilla JavaScript solution to automatically lock user sessions after a period of inactivity. Perfect for dashboards, admin panels, and security-sensitive web applications.

## ✨ Features

* **Dynamic Timeout:** Set duration via `localStorage` or defaults to 30 minutes.
* **Toggle Support:** Users can enable or disable the auto-lock feature.
* **Visual Warning:** Beautiful countdown modal using **SweetAlert2**.
* **Performance Optimized:** Uses event throttling for `mousemove` to save CPU resources.
* **Secure:** Automatically triggers a backend API call to lock the session before redirecting.

---

## 🚀 1. Core Implementation (`idle-lock.js`)

Include this script in your project. It monitors activity and handles the locking logic.

```javascript
(function () {
  "use strict";

  // Global Kill-Switch Check
  if (localStorage.getItem("app_lock_enabled") === "false") return;

  // Page Protection: Skip on Auth Pages
  const ignoredPaths = ["/login", "/register", "/lockscreen", "/forgot-password"];
  if (ignoredPaths.some(p => window.location.pathname.toLowerCase().includes(p))) return;

  const CONFIG = {
    STORAGE_KEY: "app_lock_timeout_minutes",
    DEFAULT_MIN: 30,
    WARNING_SEC: 10,
    API_URL: "/api/auth/lock", // Change to your endpoint
    REDIRECT: "/lockscreen"    // Change to your route
  };

  let idleSeconds = 0, warningShown = false, countdownInterval = null;

  const getTimeout = () => (parseInt(localStorage.getItem(CONFIG.STORAGE_KEY)) || CONFIG.DEFAULT_MIN) * 60;

  const resetTimer = () => {
    idleSeconds = 0;
    if (warningShown && typeof Swal !== "undefined") {
      warningShown = false;
      if (Swal.isVisible()) Swal.close();
    }
  };

  // Activity Listeners
  document.addEventListener("mousemove", resetTimer, { passive: true });
  document.addEventListener("click", resetTimer);
  document.addEventListener("keypress", resetTimer);

  // Monitor Loop
  setInterval(() => {
    idleSeconds++;
    if (idleSeconds >= (getTimeout() - CONFIG.WARNING_SEC) && !warningShown) showWarning();
  }, 1000);

  function showWarning() {
    if (typeof Swal === "undefined") { location.href = CONFIG.REDIRECT; return; }
    warningShown = true;
    let rem = CONFIG.WARNING_SEC;

    Swal.fire({
      title: "Session Expiring!",
      html: `Inactivity detected. Locking in <b>${rem}</b> seconds.`,
      icon: "warning",
      confirmButtonText: "I'm Still Here",
      timer: CONFIG.WARNING_SEC * 1000,
      timerProgressBar: true,
      didOpen: () => {
        countdownInterval = setInterval(() => {
          rem--;
          const el = Swal.getHtmlContainer().querySelector('b');
          if (el) el.textContent = rem;
        }, 1000);
      },
      willClose: () => clearInterval(countdownInterval)
    }).then((res) => {
      if (res.isConfirmed) resetTimer();
      else if (res.dismiss === Swal.DismissReason.timer) {
        fetch(CONFIG.API_URL, { method: "POST" }).finally(() => location.href = CONFIG.REDIRECT);
      }
    });
  }
})();
