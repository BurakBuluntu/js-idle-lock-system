# 🛡️ JS Dynamic Idle Lock System

A lightweight, vanilla JavaScript solution to automatically lock user sessions after a period of inactivity. Perfect for dashboards, admin panels, and security-sensitive web applications.

## ✨ Features
- **Dynamic Timeout:** Set duration via `localStorage` or use the default 30 minutes.
- **Visual Warning:** Beautiful countdown modal using **SweetAlert2**.
- **Performance Optimized:** Uses event throttling for `mousemove` to prevent CPU overhead.
- **Secure:** Automatically triggers a backend API call to lock the session before redirecting.
- **Easy Integration:** No complex dependencies (except SweetAlert2 for UI).

## 🚀 Quick Start

1. Include **SweetAlert2** in your project.
2. Add `idle-lock.js` to your shared layout or base HTML.
3. Configure your API endpoints:

```javascript
const LOCK_API_ENDPOINT = "/api/auth/lock"; 
const REDIRECT_URL = "/lockscreen";
