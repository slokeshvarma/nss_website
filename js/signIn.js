function pageRender() {
    const signInMain = document.getElementById("signIn");
    if (!userLoggedIn) {
        while (signInMain.lastElementChild) {
            signInMain.removeChild(signInMain.lastElementChild);
        };
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
        userIDInput.autocomplete = 'off';

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
        passwordInput.autocomplete = 'off';

        userIDInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") passwordInput.focus();
        });

        const passwordEye = document.createElement('i');
        passwordEye.id = "passwordEye";
        passwordEye.className = "fa-solid fa-eye";
        passwordEye.addEventListener("click", () => {
            const passwordInputElement = document.getElementById("password");
            const passwordEyeElement = document.getElementById("passwordEye");
            if (passwordInputElement.type === "password") {
                passwordEyeElement.classList.replace("fa-eye", "fa-eye-slash");
                passwordInputElement.type = "text";
            } else {
                passwordEyeElement.classList.replace("fa-eye-slash", "fa-eye");
                passwordInputElement.type = "password";
            }
        });

        passwordField.appendChild(passwordEye);
        passwordField.appendChild(passwordLabel);
        passwordField.appendChild(passwordInput);

        passwordInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                passwordInput.blur();
                signIn();
            }
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
        submit.addEventListener("click", () => {
            signIn();
        });

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
        };
        const signInP = document.createElement("p");
        signInP.className = "signInP";
        signInP.innerHTML = `Hello, ${users[userID]} <br> user: ${user}, userID: ${userID}, sessionID: ${sessionID}`;
        const logOut = document.createElement("button");
        logOut.id = "signOut";
        logOut.className = "signOutButton";
        logOut.innerHTML = "Sign Out";
        logOut.addEventListener("click", () => {
            signOut("manual");
        });
        signInMain.appendChild(signInP);
        signInMain.appendChild(logOut);
    }
}

async function signIn() {
    const inputUserID = $("userID").value.toLowerCase().trim();
    const inputPassword = $("password").value;

    $("signInMessageText").innerHTML = ``;
    if (!inputUserID || !inputPassword) {
        $("signInMessageText").innerHTML = `Please enter both fields !!`;
        $("signInMessageText").style.color = "var(--accent1Color)";
        return;
    }
    if (!Object.keys(users).includes(inputUserID)) {
        if (inputUserID.length < 8) {
            $("signInMessageText").innerHTML = `"${inputUserID}" is not a Valid User ID !!`;
        } else {
            $("signInMessageText").innerHTML = `"${inputUserID}" <br> is not a User ID !!`;
        }
        $("signInMessageText").style.color = "var(--accent1Color)";
        $("userID").value = "";
        $("password").value = "";
        return;
    } else {
        if ($("password").value === "") {
            $("signInMessageText").innerHTML = `Please enter the Password !!`;
            $("signInMessageText").style.color = "var(--accent1Color)";
            return;
        }
    }

    $("signInMessageText").style.color = "var(--accent2Color)";
    let count = 0;
    const verifyingInterval = setInterval(() => {
        if (count === 0) {
            $("signInMessageText").innerHTML = "Verifying.";
        } else if (count === 1) {
            $("signInMessageText").innerHTML = "Verifying..";
        } else {
            $("signInMessageText").innerHTML = "Verifying...";
            count = -1;
        }
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
                $("signInMessageText").innerHTML = "Login Successful!";
                $("signInMessageText").style.color = "var(--accent2Color)";

                sessionStorage.setItem("sessionID", generatedSessionID);
                sessionStorage.setItem("userID", inputUserID);
                sessionStorage.setItem("userLoggedIn", "true");

                setTimeout(() => {
                    userLoggedIn = true;
                    sessionID = generatedSessionID;
                    userID = inputUserID;
                    user = users[inputUserID];
                    pageRender();
                    startHeartbeat();
                    resetInactivityTimer();
                }, 1000);
            } else {
                $("signInMessageText").innerHTML = "An Active session exits! <br> Try after 10:00 min";
                $("signInMessageText").style.color = "var(--accent1Color)";
                $("userID").value = "";
                $("password").value = "";
            }
        } else {
            $("signInMessageText").innerHTML = "Wrong password! Try Again";
            $("signInMessageText").style.color = "var(--accent1Color)";
            $("password").value = "";
        }
    } catch (err) {
        clearInterval(verifyingInterval);
        console.error("Fetch error:", err);
        $("signInMessageText").innerHTML = "Connection error. Try again.";
        $("signInMessageText").style.color = "var(--accent1Color)";
    }
}

async function signOut(inputStatus) {
    stopHeartbeat();
    stopInactivityTimer();
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
    userID = undefined;
    user = undefined;
    sessionID = undefined;
    clearSession();
    pageRender();
}

function startHeartbeat() {
    sendHeartbeat();
    heartBeatInterval = setInterval(sendHeartbeat, 5 * 60 * 1000);
}

function sendHeartbeat() {
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
    if (document.visibilityState === "visible" && userLoggedIn) {
        sendHeartbeat();
    }
});

function updateEyeLocation() {
    const passwordInput = document.getElementById("password");
    const passwordEye = document.getElementById("passwordEye");
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

let userLoggedIn = false;
const $ = id => document.getElementById(id);
const users = {
    chairman: "Dr. A. B. Koteshwara Rao Sir",
    po_unit_1: "Dr. Sateesh Virothu Sir",
    po_unit_2: "Dr. T. S. Vamsi Krishna Sir",
    president_unit_1: "Unit-1 Student President",
    president_unit_2: "Unit-2 Student President",
    nsswebhandler: "Webhandler",
    webhandler_unit_1: "Unit-1 Student President",
    webhandler_unit_2: "Unit-2 Student President",
    author: "Lokesh Anand Varma"
};
let userID, user, sessionID;
let heartBeatInterval;
const logInOut_Proxy_URL = "https://gappscript-proxy.nss-gvpce-a.workers.dev/";

window.addEventListener("DOMContentLoaded", () => {
    const footerHeight = document.querySelector("footer").clientHeight;
    document.documentElement.style.setProperty("--footerHeight", `${footerHeight}px`);

    const savedSession = sessionStorage.getItem("userLoggedIn");
    if (savedSession === "true") {
        sessionID = sessionStorage.getItem("sessionID");
        userID = sessionStorage.getItem("userID");
        user = users[userID];
        userLoggedIn = true;
        setTimeout(resetInactivityTimer, 500);
    }
    pageRender();
});

window.addEventListener("resize", () => {
    updateEyeLocation();
});

let inactivityTimer;
let warningTimer;
const timeOutMinutes = 5;
["mousemove", "keypress", "touchmove", "keyup", "touchend", "click"].forEach(evt => {
    document.addEventListener(evt, () => {
        if (userLoggedIn) resetInactivityTimer();
    }, { passive: true });
});


function resetInactivityTimer() {
    if (!userLoggedIn) return;
    clearTimeout(inactivityTimer);
    clearTimeout(warningTimer);
    
    warningTimer = setTimeout(() => {
        autoLogOutAlert();
    }, (timeOutMinutes - 2) * 60 * 1000);

    inactivityTimer = setTimeout(() => {
        signOut("auto_logout");
    }, timeOutMinutes * 60 * 1000);
}

function stopInactivityTimer() {
    clearTimeout(inactivityTimer);
    clearTimeout(warningTimer);
}

function autoLogOutAlert() {
    initAutoLogoutPopup();
}
/* ============================================================
   AUTO LOGOUT POPUP — drop this into your signIn.js
   Requires: your existing CSS variables + Font Awesome
   ============================================================ */

/* ---------- inject popup HTML + CSS once ---------- */
function initAutoLogoutPopup() {
    if (document.getElementById("autoLogoutOverlay")) return;

    const style = document.createElement("style");
    style.textContent = `
        #autoLogoutOverlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.55);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }
        #autoLogoutOverlay.visible {
            opacity: 1;
            pointer-events: auto;
        }
        #autoLogoutPopup {
            background-color: var(--background1Color);
            color: var(--text1Color);
            border: 1.5px solid var(--primaryColor);
            border-radius: 1.25rem;
            padding: clamp(1.5rem, 3vw, 2.5rem);
            width: clamp(280px, 90vw, 420px);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            box-shadow: 0 8px 40px rgba(0,0,0,0.35);
            transform: translateY(20px) scale(0.97);
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            position: relative;
            overflow: hidden;
        }
        #autoLogoutOverlay.visible #autoLogoutPopup {
            transform: translateY(0) scale(1);
        }
        /* top accent bar */
        #autoLogoutPopup::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 4px;
            background: var(--primaryColor);
            border-radius: 1.25rem 1.25rem 0 0;
        }
        .alPopup_icon {
            width: clamp(48px, 8vw, 64px);
            height: clamp(48px, 8vw, 64px);
            border-radius: 50%;
            background-color: var(--primaryColor);
            color: var(--text2Color);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: clamp(1.25rem, 3vw, 1.75rem);
            margin-top: 0.5rem;
            animation: alPulse 1.5s ease-in-out infinite;
        }
        @keyframes alPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(56, 70, 135, 0.4); }
            50%       { box-shadow: 0 0 0 10px rgba(56, 70, 135, 0); }
        }
        .alPopup_title {
            font-size: clamp(1rem, 2.5vw, 1.35rem);
            font-weight: 650;
            color: var(--text1Color);
            text-align: center;
            line-height: 1.3;
        }
        .alPopup_msg {
            font-size: clamp(0.8rem, 2vw, 0.95rem);
            color: var(--text1Color);
            opacity: 0.72;
            text-align: center;
            line-height: 1.5;
        }
        .alPopup_countdown {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.25rem;
        }
        .alPopup_countdown_number {
            font-size: clamp(2.5rem, 8vw, 4rem);
            font-weight: 700;
            color: var(--accentColor);
            font-variant-numeric: tabular-nums;
            line-height: 1;
            transition: color 0.5s ease;
        }
        .alPopup_countdown_number.urgent {
            color: var(--accentColor);
            animation: alUrgent 0.5s ease-in-out infinite alternate;
        }
        @keyframes alUrgent {
            from { opacity: 1; }
            to   { opacity: 0.5; }
        }
        .alPopup_countdown_label {
            font-size: clamp(0.65rem, 1.5vw, 0.75rem);
            color: var(--text1Color);
            opacity: 0.5;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }
        /* progress ring */
        .alPopup_ring {
            position: relative;
            width: clamp(80px, 15vw, 110px);
            height: clamp(80px, 15vw, 110px);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .alPopup_ring svg {
            position: absolute;
            inset: 0;
            transform: rotate(-90deg);
        }
        .alRing_bg {
            fill: none;
            stroke: var(--primaryColor);
            opacity: 0.15;
            stroke-width: 5;
        }
        .alRing_progress {
            fill: none;
            stroke: var(--accentColor);
            stroke-width: 5;
            stroke-linecap: round;
            transition: stroke-dashoffset 1s linear, stroke 0.5s ease;
        }
        .alPopup_btns {
            display: flex;
            flex-direction: column;
            gap: 0.6rem;
            width: 100%;
            margin-top: 0.25rem;
        }
        .alBtn_stay {
            width: 100%;
            padding: clamp(0.6rem, 1.5vw, 0.85rem);
            background-color: var(--primaryColor);
            color: var(--text2Color);
            border: none;
            border-radius: 0.75rem;
            font-size: clamp(0.8rem, 2vw, 0.95rem);
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            transition: opacity 0.2s ease, transform 0.15s ease;
        }
        .alBtn_stay:hover {
            opacity: 0.88;
            transform: translateY(-1px);
        }
        .alBtn_stay:active {
            transform: translateY(0);
        }
        .alBtn_logout {
            width: 100%;
            padding: clamp(0.5rem, 1.25vw, 0.7rem);
            background: transparent;
            color: var(--text1Color);
            border: 1px solid var(--primaryColor);
            opacity: 0.6;
            border-radius: 0.75rem;
            font-size: clamp(0.75rem, 1.75vw, 0.875rem);
            cursor: pointer;
            transition: opacity 0.2s ease;
        }
        .alBtn_logout:hover { opacity: 1; }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement("div");
    overlay.id = "autoLogoutOverlay";
    overlay.innerHTML = `
        <div id="autoLogoutPopup">
            <div class="alPopup_icon">
                <i class="fa-solid fa-clock"></i>
            </div>
            <p class="alPopup_title">Still there?</p>
            <p class="alPopup_msg">
                You've been inactive for a while.<br>
                You'll be automatically signed out in
            </p>
            <div class="alPopup_ring">
                <svg viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg">
                    <circle class="alRing_bg" cx="55" cy="55" r="48"/>
                    <circle class="alRing_progress" id="alRingProgress" cx="55" cy="55" r="48"/>
                </svg>
                <div class="alPopup_countdown">
                    <span class="alPopup_countdown_number" id="alCountdownNum">02:00</span>
                    <span class="alPopup_countdown_label">remaining</span>
                </div>
            </div>
            <div class="alPopup_btns">
                <button class="alBtn_stay" id="alBtnStay">
                    <i class="fa-solid fa-rotate-right"></i>
                    Stay Signed In
                </button>
                <button class="alBtn_logout" id="alBtnLogout">
                    Sign out now
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById("alBtnStay").addEventListener("click", () => {
        hideAutoLogoutPopup();
        resetInactivityTimer();
    });
    document.getElementById("alBtnLogout").addEventListener("click", () => {
        hideAutoLogoutPopup();
        signOut("manual");
    });
}

/* ---------- show / hide ---------- */
let alCountdownInterval = null;
const AL_WARNING_SECS = 120; // 2 minute countdown

function showAutoLogoutPopup() {
    initAutoLogoutPopup();
    const overlay = document.getElementById("autoLogoutOverlay");
    const numEl = document.getElementById("alCountdownNum");
    const ring = document.getElementById("alRingProgress");

    const circumference = 2 * Math.PI * 48; // r=48
    ring.style.strokeDasharray = circumference;

    let remaining = AL_WARNING_SECS;

    function updateDisplay() {
        const m = Math.floor(remaining / 60);
        const s = remaining % 60;
        numEl.textContent = `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;

        // ring progress
        const fraction = remaining / AL_WARNING_SECS;
        ring.style.strokeDashoffset = circumference * (1 - fraction);

        // urgent styling under 30s
        if (remaining <= 30) {
            numEl.classList.add("urgent");
        } else {
            numEl.classList.remove("urgent");
        }
    }

    updateDisplay();
    overlay.classList.add("visible");

    clearInterval(alCountdownInterval);
    alCountdownInterval = setInterval(() => {
        remaining--;
        updateDisplay();
        if (remaining <= 0) {
            clearInterval(alCountdownInterval);
        }
    }, 1000);
}

function hideAutoLogoutPopup() {
    clearInterval(alCountdownInterval);
    const overlay = document.getElementById("autoLogoutOverlay");
    if (overlay) overlay.classList.remove("visible");
}

/* ---------- inactivity timer ---------- */
let inactivityTimer;
let warningTimer;
const TIMEOUT_MIN = 5;
const WARNING_BEFORE_SECS = 120; // show warning 2 min before logout

function resetInactivityTimer() {
    if (!userLoggedIn) return;
    clearTimeout(inactivityTimer);
    clearTimeout(warningTimer);
    hideAutoLogoutPopup();

    const totalMs = TIMEOUT_MIN * 60 * 1000;
    const warningMs = totalMs - (WARNING_BEFORE_SECS * 1000);

    warningTimer = setTimeout(() => {
        showAutoLogoutPopup();
    }, warningMs);

    inactivityTimer = setTimeout(() => {
        hideAutoLogoutPopup();
        signOut("auto_logout");
    }, totalMs);
}

function stopInactivityTimer() {
    clearTimeout(inactivityTimer);
    clearTimeout(warningTimer);
    hideAutoLogoutPopup();
}

/* ---------- activity listeners ---------- */
["mousemove", "keypress", "touchmove", "keyup", "touchend", "click", "scroll"].forEach(evt => {
    document.addEventListener(evt, () => {
        if (userLoggedIn) resetInactivityTimer();
    }, { passive: true });
});