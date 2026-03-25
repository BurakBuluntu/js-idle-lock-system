/**
 * idle-lock.js
 * Dynamic Timeout & SweetAlert2 Supported Auto Lock System
 * * Features:
 * - Reads "app_lock_timeout_minutes" from localStorage (Default: 30 min).
 * - Listens for mousemove (throttled), click, and keypress events.
 * - Shows a SweetAlert2 countdown modal in the last 10 seconds.
 * - Locks session via API and redirects to lockscreen.
 */

(function () {
  "use strict";

  // --- Page Protection: Do not run on auth-related pages ---
  const path = window.location.pathname.toLowerCase();
  const ignoredPaths = ["/login", "/register", "/lockscreen", "/forgot-password"];
  if (ignoredPaths.some((p) => path.includes(p))) {
    return;
  }

  // --- CONFIGURATION ---
  const STORAGE_KEY = "app_lock_timeout_minutes";
  const DEFAULT_TIMEOUT_MINUTES = 30; 
  const WARNING_SECONDS = 10; 
  const THROTTLE_MS = 1000; 

  // --- API & REDIRECT URLS (Change these for your system) ---
  const LOCK_API_ENDPOINT = "/api/auth/lock"; 
  const REDIRECT_URL = "/lockscreen";

  let idleSeconds = 0;
  let timeoutSeconds = getTimeoutSeconds();
  let warningShown = false;
  let countdownInterval = null;
  let lastThrottleTime = 0;

  function getTimeoutSeconds() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw !== null) {
        const minutes = parseInt(raw, 10);
        if (!isNaN(minutes) && minutes > 0) return minutes * 60;
      }
    } catch (e) {}
    return DEFAULT_TIMEOUT_MINUTES * 60;
  }

  function resetIdleTimer() {
    idleSeconds = 0;
    if (warningShown) {
      warningShown = false;
      if (typeof Swal !== "undefined" && Swal.isVisible()) {
        Swal.close();
      }
    }
  }

  function throttledReset() {
    const now = Date.now();
    if (now - lastThrottleTime < THROTTLE_MS) return;
    lastThrottleTime = now;
    resetIdleTimer();
  }

  function lockAndRedirect() {
    // Get CSRF token if exists (Common in Django/Flask/Laravel)
    const csrfMeta = document.querySelector('meta[name="csrf-token"]');
    const csrfToken = csrfMeta ? csrfMeta.getAttribute("content") : "";

    fetch(LOCK_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
    })
    .then(() => { window.location.href = REDIRECT_URL; })
    .catch(() => { window.location.href = REDIRECT_URL; });
  }

  function showWarningModal() {
    if (typeof Swal === "undefined") {
      lockAndRedirect();
      return;
    }

    warningShown = true;
    let remaining = WARNING_SECONDS;

    Swal.fire({
      title: "Session Expiring!",
      html: `You have been inactive. You will be redirected to the lock screen in <b>${remaining}</b> seconds.`,
      icon: "warning",
      confirmButtonText: `I'm still here (${remaining})`,
      confirmButtonColor: "#533fbd",
      allowOutsideClick: false,
      timer: WARNING_SECONDS * 1000,
      timerProgressBar: true,
      didOpen: (popup) => {
        const confirmBtn = Swal.getConfirmButton();
        const htmlContainer = Swal.getHtmlContainer();

        countdownInterval = setInterval(() => {
          remaining--;
          if (remaining <= 0) {
            clearInterval(countdownInterval);
            return;
          }
          if (confirmBtn) confirmBtn.textContent = `I'm still here (${remaining})`;
          if (htmlContainer) {
            htmlContainer.innerHTML = `You have been inactive. You will be redirected to the lock screen in <b>${remaining}</b> seconds.`;
          }
        }, 1000);

        const onActivity = () => {
          popup.removeEventListener("mousemove", onActivity);
          document.removeEventListener("mousemove", onActivity);
          resetIdleTimer();
        };
        popup.addEventListener("mousemove", onActivity);
        document.addEventListener("mousemove", onActivity);
      },
      willClose: () => {
        if (countdownInterval) clearInterval(countdownInterval);
      }
    }).then((result) => {
      if (result.isConfirmed) {
        resetIdleTimer();
      } else if (result.dismiss === Swal.DismissReason.timer) {
        lockAndRedirect();
      }
    });
  }

  document.addEventListener("mousemove", throttledReset, { passive: true });
  document.addEventListener("click", resetIdleTimer);
  document.addEventListener("keypress", resetIdleTimer);

  setInterval(() => {
    timeoutSeconds = getTimeoutSeconds();
    idleSeconds++;
    if (idleSeconds >= (timeoutSeconds - WARNING_SECONDS) && !warningShown) {
      showWarningModal();
    }
  }, 1000);
})();
