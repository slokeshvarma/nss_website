/* ============================================================
   signIn.js — complete & fully corrected
   ============================================================ */

/* ── Page Render ─────────────────────────────────────── */
function pageRender() {
    const signInMain = document.getElementById("signIn");
    if (!userLoggedIn) {
        while (signInMain.lastElementChild) {
            signInMain.removeChild(signInMain.lastElementChild);
        }
        clearAlertBox();

        const signInForm = document.createElement("div");
        signInForm.id = "signInForm";
        signInForm.className = "signInForm";
        signInForm.innerHTML = `
        <div>
            <h2 class="formTitle">CMS of Events</h2>
            <p>Sign In to update events</p>
        </div>`;

        const userIDField = document.createElement("div");
        userIDField.className = "formField";
        const userIDLabel = document.createElement("label");
        userIDLabel.innerHTML = "User ID";
        const userIDInput = document.createElement("input");
        userIDInput.type = "text";
        userIDInput.id = "userID";
        userIDInput.placeholder = "Enter your user ID";
        userIDInput.autocomplete = "off";
        userIDField.appendChild(userIDLabel);
        userIDField.appendChild(userIDInput);

        const passwordField = document.createElement("div");
        passwordField.className = "formField";
        const passwordLabel = document.createElement("label");
        passwordLabel.id = "passwordLabel";
        passwordLabel.innerHTML = "Password";
        const passwordInput = document.createElement("input");
        passwordInput.type = "password";
        passwordInput.id = "password";
        passwordInput.placeholder = "Enter your Password";
        passwordInput.autocomplete = "off";

        userIDInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") passwordInput.focus();
        });

        const passwordEye = document.createElement("i");
        passwordEye.id = "passwordEye";
        passwordEye.className = "fa-solid fa-eye";
        passwordEye.addEventListener("click", () => {
            const el  = document.getElementById("password");
            const eye = document.getElementById("passwordEye");
            if (el.type === "password") {
                eye.classList.replace("fa-eye", "fa-eye-slash");
                el.type = "text";
            } else {
                eye.classList.replace("fa-eye-slash", "fa-eye");
                el.type = "password";
            }
        });

        passwordField.appendChild(passwordEye);
        passwordField.appendChild(passwordLabel);
        passwordField.appendChild(passwordInput);

        passwordInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") { passwordInput.blur(); signIn(); }
        });

        const message_button_container = document.createElement("div");
        message_button_container.className = "signInMessage_Button";

        const messageText = document.createElement("p");
        messageText.id = "signInMessageText";
        messageText.innerHTML = "&nbsp;";

        const submit = document.createElement("button");
        submit.id = "signInSubmit";
        submit.className = "signInSubmit";
        submit.innerHTML = "Submit";
        submit.addEventListener("click", () => signIn());

        message_button_container.appendChild(messageText);
        message_button_container.appendChild(submit);

        signInForm.appendChild(userIDField);
        signInForm.appendChild(passwordField);
        signInForm.appendChild(message_button_container);
        signInMain.appendChild(signInForm);
        updateEyeLocation();

    } else {
        while (signInMain.lastElementChild) {
            signInMain.removeChild(signInMain.lastElementChild);
        }
        const signInP = document.createElement("p");
        signInP.className = "signInP";
        signInP.innerHTML = `Hello, ${users[userID]}<br>userID: ${userID} &nbsp;|&nbsp; session: ${sessionID}`;

        const logOut = document.createElement("button");
        logOut.id = "signOut";
        logOut.className = "signOutButton";
        logOut.innerHTML = "Sign Out";
        logOut.addEventListener("click", () => signOut("manual"));

        signInMain.appendChild(signInP);
        signInMain.appendChild(logOut);
    }
}

/* ── Sign In ─────────────────────────────────────────── */
async function signIn() {
    const inputUserID   = $("userID").value.toLowerCase().trim();
    const inputPassword = $("password").value;

    $("signInMessageText").innerHTML = "";

    if (!inputUserID || !inputPassword) {
        setMsg("signInMessageText", "Please enter both fields !!", "accent1");
        return;
    }
    if (!Object.keys(users).includes(inputUserID)) {
        setMsg("signInMessageText",
            inputUserID.length < 8
                ? `"${inputUserID}" is not a Valid User ID !!`
                : `"${inputUserID}"<br>is not a User ID !!`,
            "accent1"
        );
        $("userID").value = "";
        $("password").value = "";
        return;
    }

    let count = 0;
    const verifyingInterval = setInterval(() => {
        const dots = ["Verifying.", "Verifying..", "Verifying..."];
        setMsg("signInMessageText", dots[count % 3], "accent2");
        count++;
    }, 400);

    const generatedSessionID = Math.random().toString(36).substring(2, 7).toUpperCase();
    const logInData = {
        action: "logIn",
        sessionID: generatedSessionID,
        userID: inputUserID,
        password: inputPassword
    };

    try {
        const response = await fetch(logInOut_Proxy_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify(logInData)
        });
        const rawText = await response.text();
        console.log("Raw response:", rawText);
        const data = JSON.parse(rawText);
        clearInterval(verifyingInterval);

        if (data.auth) {
            if (!data.activeSession) {
                setMsg("signInMessageText", "Login Successful!", "accent2");
                sessionStorage.setItem("sessionID", generatedSessionID);
                sessionStorage.setItem("userID", inputUserID);
                sessionStorage.setItem("userLoggedIn", "true");
                setTimeout(() => {
                    userLoggedIn = true;
                    sessionID    = generatedSessionID;
                    userID       = inputUserID;
                    user         = users[inputUserID];
                    pageRender();
                    startHeartbeat();
                    resetInactivityTimer();
                }, 1000);
            } else {
                setMsg("signInMessageText", "An active session exists!<br>Try after 5 min", "accent1");
                $("userID").value = "";
                $("password").value = "";
            }
        } else {
            setMsg("signInMessageText", "Wrong password! Try Again", "accent1");
            $("password").value = "";
        }
    } catch (err) {
        clearInterval(verifyingInterval);
        console.error("Fetch error:", err);
        setMsg("signInMessageText", "Connection error. Try again.", "accent1");
    }
}

/* ── Sign Out ────────────────────────────────────────── */
async function signOut(inputStatus) {
    stopHeartbeat();
    stopInactivityTimer(); // clears timer AND alert box

    showAlertMessage("Signing out...", "accent2");

    const userData = {
        action: "logOut",
        sessionID: sessionStorage.getItem("sessionID"),
        userID: sessionStorage.getItem("userID"),
        status: inputStatus
    };

    try {
        const response = await fetch(logInOut_Proxy_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify(userData)
        });
        const res = await response.json();
        console.log("SignOut response:", res);
    } catch (err) {
        console.error("SignOut error:", err);
    }

    userLoggedIn = false;
    userID       = undefined;
    user         = undefined;
    sessionID    = undefined;
    clearSession();

    showAlertMessage("Sign Out Successful ✓", "accent2");
    setTimeout(() => {
        clearAlertBox();
        pageRender();
    }, 1500);
}

/* ── Heartbeat ───────────────────────────────────────── */
let heartBeatInterval;

function startHeartbeat() {
    sendHeartbeat();
    heartBeatInterval = setInterval(sendHeartbeat, 5 * 60 * 1000);
}

function sendHeartbeat() {
    if (!sessionID || !userID) return;
    navigator.sendBeacon(logInOut_Proxy_URL, JSON.stringify({
        action: "heartBeat",
        sessionID: sessionID,
        userID: userID
    }));
}

function stopHeartbeat() {
    clearInterval(heartBeatInterval);
}

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && userLoggedIn) sendHeartbeat();
});

/* ── Inactivity Timer ────────────────────────────────── */
let inactivityTimer;
let warningTimer;
let inactivityPaused = false; // ✅ freeze timer while alert popup is visible
const timeOutMinutes = 3;
const warningMinutes = 1;

function resetInactivityTimer() {
    if (!userLoggedIn) return;
    clearTimeout(inactivityTimer);
    clearTimeout(warningTimer);
    clearAlertBox(); // hides warning + sets inactivityPaused = false

    warningTimer = setTimeout(() => {
        autoLogOutAlert();
    }, (timeOutMinutes - warningMinutes) * 60 * 1000);

    inactivityTimer = setTimeout(() => {
        signOut("timeOut_logOut");
    }, timeOutMinutes * 60 * 1000);
}

function stopInactivityTimer() {
    clearTimeout(inactivityTimer);
    clearTimeout(warningTimer);
    clearAlertBox();
}

// ✅ inactivityPaused check — won't reset timer while popup is showing
["mousemove", "keypress", "touchmove", "keyup", "touchend", "click"].forEach(evt => {
    document.addEventListener(evt, () => {
        if (userLoggedIn && !inactivityPaused) resetInactivityTimer();
    }, { passive: true });
});

/* ── Auto Logout Alert ───────────────────────────────── */
function autoLogOutAlert() {
    const alertBox = $("alertAutoSignOut");
    if (!alertBox) return;

    inactivityPaused = true; // ✅ freeze — moving mouse won't reset timer now

    clearAlertBox();
    alertBox.className = "alerting";

    const div = document.createElement("div");
    div.id = "alertAutoSignOutDiv";
    div.innerHTML = `
        <div>
            <p>Due to inactivity,<br>
            you will be signed out in
            <strong>${warningMinutes} minute${warningMinutes > 1 ? "s" : ""}</strong>.</p>
        </div>
        <div>
            <button id="autoSignOutCancel">Stay Signed In</button>
            <button id="autoSignOutContinue">Sign Out Now</button>
        </div>
    `;
    alertBox.appendChild(div);

    $("autoSignOutCancel").addEventListener("click", () => {
        resetInactivityTimer(); // also calls clearAlertBox → inactivityPaused = false
    }, { once: true });

    $("autoSignOutContinue").addEventListener("click", () => {
        signOut("timeOut_manual_logOut");
    }, { once: true });
}

/* ── Alert Box Helpers ───────────────────────────────── */
function clearAlertBox() {
    inactivityPaused = false; // ✅ always unfreeze when alert is cleared
    const alertBox = $("alertAutoSignOut");
    if (!alertBox) return;
    alertBox.className = "";
    while (alertBox.lastElementChild) alertBox.removeChild(alertBox.lastElementChild);
}

function showAlertMessage(msg, colorVar) {
    const alertBox = $("alertAutoSignOut");
    if (!alertBox) return;
    clearAlertBox();
    alertBox.className = "alerting";
    const p = document.createElement("p");
    p.style.color = `var(--${colorVar}Color)`;
    p.innerHTML = msg;
    alertBox.appendChild(p);
}

/* ── Misc Helpers ────────────────────────────────────── */
function setMsg(id, html, colorVar) {
    const el = $(id);
    if (!el) return;
    el.innerHTML = html;
    el.style.color = `var(--${colorVar}Color)`;
}

function updateEyeLocation() {
    const passwordInput = document.getElementById("password");
    const passwordEye   = document.getElementById("passwordEye");
    if (!passwordInput || !passwordEye) return;
    const appearanceAdjustment = 2;
    document.documentElement.style.setProperty(
        "--passwordEyeBottom",
        `${passwordInput.clientHeight / 2 - passwordEye.clientHeight / 2 - appearanceAdjustment}px`
    );
}

function clearSession() {
    sessionStorage.removeItem("sessionID");
    sessionStorage.removeItem("userID");
    sessionStorage.removeItem("userLoggedIn");
}

/* ── State & Constants ───────────────────────────────── */
let userLoggedIn = false;
const $ = id => document.getElementById(id);
const users = {
    chairman:          "Dr. A. B. Koteshwara Rao Sir",
    po_unit_1:         "Dr. Sateesh Virothu Sir",
    po_unit_2:         "Dr. T. S. Vamsi Krishna Sir",
    president_unit_1:  "Unit-1 Student President",
    president_unit_2:  "Unit-2 Student President",
    nsswebhandler:     "Webhandler",
    webhandler_unit_1: "Unit-1 Student President",
    webhandler_unit_2: "Unit-2 Student President",
    author:            "Lokesh Anand Varma"
};
let userID, user, sessionID;
const logInOut_Proxy_URL = "https://gappscript-proxy.nss-gvpce-a.workers.dev/";

/* ── Init ────────────────────────────────────────────── */
window.addEventListener("DOMContentLoaded", () => {
    const footerHeight = document.querySelector("footer").clientHeight;
    document.documentElement.style.setProperty("--footerHeight", `${footerHeight}px`);

    const isRefreshing = sessionStorage.getItem("isRefreshing");
    sessionStorage.removeItem("isRefreshing");

    const savedSession = sessionStorage.getItem("userLoggedIn");
    if (savedSession === "true") {
        sessionID    = sessionStorage.getItem("sessionID");
        userID       = sessionStorage.getItem("userID");
        user         = users[userID];
        userLoggedIn = true;
        if (isRefreshing === "true") sendHeartbeat();
        setTimeout(resetInactivityTimer, 500);
    }
    pageRender();
});

window.addEventListener("resize", () => updateEyeLocation());

window.addEventListener("beforeunload", () => {
    if (userLoggedIn) {
        sessionStorage.setItem("isRefreshing", "true");
        navigator.sendBeacon(logInOut_Proxy_URL, JSON.stringify({
            action: "logOut",
            sessionID: sessionID,
            userID: userID,
            status: "abrupt_close"
        }));
    }
});