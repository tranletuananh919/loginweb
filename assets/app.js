/* global google, window, document */
(function () {
  const $ = (sel) => document.querySelector(sel);
  const signedOut = $("#signed-out");
  const signedIn = $("#signed-in");
  const gBtn = $("#g-btn");
  const pic = $("#user-picture");
  const name = $("#user-name");
  const email = $("#user-email");
  const jwt = $("#user-jwt");
  const signout = $("#signout");

  const cfg = window.APP_CONFIG || {};
  const CLIENT_ID = cfg.GOOGLE_CLIENT_ID;

  if (!CLIENT_ID || CLIENT_ID.includes("YOUR_GOOGLE_CLIENT_ID")) {
    gBtn.innerHTML = [
      '<div class="note"><b>Thiếu GOOGLE_CLIENT_ID.</b>',
      ' Hãy mở <code>assets/config.example.js</code>, copy thành <code>assets/config.js</code>',
      ' rồi thay <code>YOUR_GOOGLE_CLIENT_ID</code> bằng client ID của bạn.',
      '</div>'
    ].join("");
    return;
  }

  function decodeJwt(token) {
    const [header, payload, signature] = token.split(".");
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return decoded;
  }

  function onCredentialResponse(resp) {
    try {
      const payload = decodeJwt(resp.credential);
      // Persist a tiny session (demo only)
      localStorage.setItem("demo_id_token", resp.credential);
      renderSignedIn(payload, resp.credential);
    } catch (err) {
      console.error(err);
      alert("Không giải mã được ID token.");
    }
  }

  function renderSignedIn(payload, raw) {
    signedOut.classList.add("hidden");
    signedIn.classList.remove("hidden");
    pic.src = payload.picture || "";
    pic.alt = payload.name || "Avatar";
    name.textContent = payload.name || "";
    email.textContent = payload.email || "";
    jwt.textContent = JSON.stringify(payload, null, 2);
  }

  function renderSignedOut() {
    signedIn.classList.add("hidden");
    signedOut.classList.remove("hidden");
    jwt.textContent = "";
    // Render the Google button each time we go back to signed-out
    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: onCredentialResponse,
      // itp_support toggles third-party cookie aware behavior; default is fine
    });
    google.accounts.id.renderButton(gBtn, {
      type: "standard",
      shape: "pill",
      size: "large",
      text: "signin_with",
      logo_alignment: "left",
      width: 320
    });
    // Optional One Tap
    google.accounts.id.prompt();
  }

  signout.addEventListener("click", () => {
    localStorage.removeItem("demo_id_token");
    try { google.accounts.id.disableAutoSelect(); } catch {}
    renderSignedOut();
  });

  // Auto sign-in if we have a cached token (demo only)
  const cached = localStorage.getItem("demo_id_token");
  if (cached) {
    try {
      renderSignedIn(decodeJwt(cached), cached);
    } catch {
      renderSignedOut();
    }
  } else {
    renderSignedOut();
  }
})();
