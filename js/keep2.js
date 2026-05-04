function pageRender() {
    console.log("pageRenderInIt", `userLoggedIn: ${userLoggedIn}`);
    clearAlertBox();
    const logInMain = document.getElementById("logIn");
    if (!userLoggedIn) {
        while (logInMain.lastElementChild) {
            logInMain.removeChild(logInMain.lastElementChild);
        }

        const logInForm = document.createElement("div");
        logInForm.id = "logInForm";
        logInForm.className = "logInForm";
        logInForm.innerHTML = `
        <div>
            <h2 class="formTitle">CMS of Events</h2>
            <p>Log In to update events</p>
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
            if (e.key === "Enter") { passwordInput.blur(); logIn(); }
        });

        const message_button_container = document.createElement("div");
        message_button_container.className = "logInMessage_Button";

        const messageText = document.createElement("p");
        messageText.id = "logInMessageText";
        messageText.innerHTML = "&nbsp;";

        const submit = document.createElement("button");
        submit.id = "logInSubmit";
        submit.className = "logInSubmit";
        submit.innerHTML = "Submit";
        submit.addEventListener("click", () => logIn());

        message_button_container.appendChild(messageText);
        message_button_container.appendChild(submit);

        logInForm.appendChild(userIDField);
        logInForm.appendChild(passwordField);
        logInForm.appendChild(message_button_container);
        logInMain.appendChild(logInForm);
        updateEyeLocation();

    } else {
        while (logInMain.lastElementChild) {
            logInMain.removeChild(logInMain.lastElementChild);
        }
        const logInP = document.createElement("p");
        logInP.className = "logInP";
        logInP.innerHTML = `Hello, ${users[userID]}<br>userID: ${userID} &nbsp;|&nbsp; session: ${sessionID}`;

        const logOut = document.createElement("button");
        logOut.id = "logOut";
        logOut.className = "logOutButton";
        logOut.innerHTML = "Log Out";
        logOut.addEventListener("click", () => logOutAlert("logOut?"));

        logInMain.appendChild(logInP);
        logInMain.appendChild(logOut);
    }

    
    console.log("pageRenderEnd", `userLoggedIn: ${userLoggedIn}`);
}

async function logIn() {
    console.log("LogInInIt", `userLoggedIn: ${userLoggedIn}`);
    const inputUserID   = $("userID").value.toLowerCase().trim();
    const inputPassword = $("password").value;

    $("logInMessageText").innerHTML = "";

    if (!inputUserID || !inputPassword) {
        setMsg("logInMessageText", "Please enter both fields !!", "accent1");
        return;
    }
    if (!Object.keys(users).includes(inputUserID)) {
        setMsg("logInMessageText",
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
        setMsg("logInMessageText", dots[count % 3], "accent2");
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
                setMsg("logInMessageText", "Login Successful!", "accent2");

                // FIX: Set session vars immediately so heartbeat and timers work correctly
                userLoggedIn = true;
                sessionID    = generatedSessionID;
                userID       = inputUserID;
                user         = users[inputUserID];

                sessionStorage.setItem("sessionID", generatedSessionID);
                sessionStorage.setItem("userID", inputUserID);
                sessionStorage.setItem("userLoggedIn", "true");

                setTimeout(() => {
                    pageRender();
                    startHeartbeat();
                    resetInactivityTimer();
                }, 1000);
            } else {
                setMsg("logInMessageText", "An active session exists!<br>Try after 5 min", "accent1");
                $("userID").value = "";
                $("password").value = "";
            }
        } else {
            setMsg("logInMessageText", "Wrong password! Try Again", "accent1");
            $("password").value = "";
        }
    } catch (err) {
        clearInterval(verifyingInterval);
        console.error("Fetch error:", err);
        setMsg("logInMessageText", "Connection error. Try again.", "accent1");
    }
    
    console.log("LogInEnd", `userLoggedIn: ${userLoggedIn}`);
}

async function logOut(inputStatus) {
    console.log("LogOutInIt", `userLoggedIn: ${userLoggedIn}`);
    stopHeartbeat();
    stopInactivityTimer();

    alertLoggingOut("loggingOut");

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
    } catch (err) {
    }

    userLoggedIn = false;
    userID       = undefined;
    user         = undefined;
    sessionID    = undefined;
    clearSession();
    alertLoggingOut("loggedOut");
    setTimeout(() => {
        clearAlertBox();
        pageRender();
    }, 1500);
    userLoggedIn = false;
    
    console.log("LogOutEnd", `userLoggedIn: ${userLoggedIn}`);
}

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

let inactivityTimer;
let warningTimer;
const timeOutMinutes = 0.5;
const warningMinutes = 0.25;

function resetInactivityTimer() {
    console.log("resetInactivityTimerInIt", `userLoggedIn: ${userLoggedIn}`);

    if (!userLoggedIn) return;
    
    console.log("resetInactivityTimerInIt(return Check)", `userLoggedIn: ${userLoggedIn}`);
    clearTimeout(inactivityTimer);
    clearTimeout(warningTimer);

    warningTimer = setTimeout(() => {
        logOutAlert("autologOut");
    }, (timeOutMinutes - warningMinutes) * 60 * 1000);

    inactivityTimer = setTimeout(() => {
        logOut("timeOut_logOut");
    }, timeOutMinutes * 60 * 1000);

    
    console.log("resetInactivityTimerEnd", `userLoggedIn: ${userLoggedIn}`);
}

function stopInactivityTimer() {
    clearTimeout(inactivityTimer);
    clearTimeout(warningTimer);
}

["mousemove", "keypress", "touchmove", "keyup", "touchend", "click", "scroll"].forEach(event => {
    document.addEventListener(event, () => {
        if (userLoggedIn) resetInactivityTimer();
    }, { passive: true });
});

function logOutAlert(event) {
    console.log("LogOutAlertInIt", `userLoggedIn: ${userLoggedIn}`);
    clearAlertBox();
    const alertBox = $("alertLogOut");
    if (!alertBox) return;

    alertBox.className = "alerting";

    let alertText;
    if (event === "logOut?") {
        alertText = "<p>Are you sure,<br> you want to Log Out?</p>";
    } else {
        // When the warning fires, stop BOTH timers immediately so the hard
        // inactivityTimer can't fire logOut() (or this alert again) while
        // the dialog is open. resetInactivityTimer() on "Stay Logged In"
        // will restart fresh timers if the user chooses to stay.
        stopInactivityTimer();
        alertText = `<p>Due to inactivity,<br>
                                you will be logged out in
                            <strong>${warningMinutes} minute${warningMinutes > 1 ? "s" : ""}</strong></p>`;
    }

    const div = document.createElement("div");
    div.id = "alertLogOutDiv";
    div.innerHTML = `
        <div>
            ${alertText}
        </div>
        <div id="alertButtons">
            <button id="logOutCancel">Stay Logged In</button>
            <button id="logOutContinue">Log Out Now</button>
        </div>
    `;
    alertBox.appendChild(div);

    $("logOutCancel").addEventListener("click", () => {
        clearAlertBox();
        resetInactivityTimer();
    }, { once: true });

    $("logOutContinue").addEventListener("click", () => {
        clearAlertBox();
        logOut("manual");
        stopInactivityTimer();
    }, { once: true });
    
    console.log("LogOutAlertEnd", `userLoggedIn: ${userLoggedIn}`);
}

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

// FIX: Renamed from alertSigingOut → alertLoggingOut (typo fix)
let loggingOutInterval;
function alertLoggingOut(event) {
    clearAlertBox();
    clearInterval(loggingOutInterval);
    const alertLogOut = $("alertLogOut");
    // FIX: Null guard to prevent crash if element is missing
    if (!alertLogOut) return;
    alertLogOut.className = "alerting";

    if (event === "loggingOut") {
        const div = document.createElement("div");
        div.id = "alertLoggingOutDiv";
        const p = document.createElement("p");
        p.id = "alertLoggingOutP";
        div.appendChild(p);
        alertLogOut.appendChild(div);
        let count = 0;
        loggingOutInterval = setInterval(() => {
            const dots = ["Logging Out.", "Logging Out..", "Logging Out..."];
            setMsg("alertLoggingOutP", dots[count % 3], "accent2");
            count++;
        }, 400);
    } else {
        clearInterval(loggingOutInterval);
        const div = document.createElement("div");
        div.id = "alertLoggedOutDiv";
        const p = document.createElement("p");
        p.id = "alertLoggedOutP";
        div.appendChild(p);
        alertLogOut.appendChild(div);
        // FIX: Typo "Loged" → "Logged"
        setMsg("alertLoggedOutP", "Log Out Successful !", "accent2");
    }
    // FIX: Removed erroneous resetInactivityTimer() call here —
    // timers must NOT be restarted during a logout sequence
}

function clearAlertBox() {
    const alertLogOut = $("alertLogOut");
    // FIX: Null guard to prevent crash if element is missing
    if (!alertLogOut) return;
    alertLogOut.className = "";
    while (alertLogOut.lastElementChild) {
        alertLogOut.removeChild(alertLogOut.lastElementChild);
    }
}

let userLoggedIn = false;
const $ = id => document.getElementById(id);
const users = {
    chairman:          "Dr. A. B. Koteshwara Rao Sir",
    po_unit_1:         "Dr. Sateesh Virothu Sir",
    po_unit_2:         "Dr. T. S. Vamsi Krishna Sir",
    president_unit_1:  "Unit-1 Student President",
    president_unit_2:  "Unit-2 Student President",
    nsswebhandler:     "Webhandler",
    webhandler_unit_1: "Unit-1 Web Handler",
    webhandler_unit_2: "Unit-2 Web Handler",
    org_author:        "Lokesh Anand Varma"
};
let userID, user, sessionID;
const logInOut_Proxy_URL = "https://gappscript-proxy.nss-gvpce-a.workers.dev/";
let startTime;
window.addEventListener("DOMContentLoaded", () => {
    startTime = new Date();
    const footerHeight = document.querySelector("footer").clientHeight;
    document.documentElement.style.setProperty("--footerHeight", `${footerHeight}px`);

    const savedSession = sessionStorage.getItem("userLoggedIn");
    if (savedSession === "true") {
        sessionID    = sessionStorage.getItem("sessionID");
        userID       = sessionStorage.getItem("userID");
        user         = users[userID];
        userLoggedIn = true;
        sendHeartbeat();
        setTimeout(resetInactivityTimer, 500);
    }
    pageRender();
});

window.addEventListener("resize", () => updateEyeLocation());