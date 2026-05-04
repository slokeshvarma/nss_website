function setURL(pageTitle, pushingURL) {
    const currentURL = window.location.href.split("/");
    const lastTag = currentURL[currentURL.length - 1];

    const newURL = lastTag
        ? window.location.href.replace(lastTag, pushingURL)
        : window.location.href + pushingURL;

    window.history.pushState({ page: 1 }, pageTitle, newURL);
}

function pageRender() {
    const logInMain = document.getElementById("logIn");
    while (logInMain.lastElementChild) {
            logInMain.removeChild(logInMain.lastElementChild);
    }
    if (!userLoggedIn) {
        logInPageRender(logInMain);
    } else {
        setURL("CMS Event Updater", "EventUpdaterCMS");
        cmsEventPageRender(logInMain);
    }
}


function logInPageRender(logInMain) {
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
    messageText.innerHTML = "";

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
}

function cmsEventPageRender(logInMain) {
    cmsUpdatingRender(logInMain)
    cmsUpdatingFormRender(logInMain)
}

function cmsUpdatingRender(logInMain) {
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

function cmsUpdatingFormRender(logInMain) {
    const eventDataForm = document.createElement("div");
    eventDataForm.id = "eventDataForm";
    eventDataForm.className = "eventDataForm";
    eventDataForm.innerHTML = `
    <div class="eventDataFormTitle">
        <h2 class="formTitle">CMS of Events</h2>
        <p>Fill form to update events</p>
    </div>`;

    inputEventDetails.forEach(formField => {
        const formFieldDiv = document.createElement("div");
        formFieldDiv.className = "formField";
        const formFieldLabel = document.createElement("label");
        formFieldLabel.innerHTML = `${formField}`;
        const formFieldInput = document.createElement("input");
        formFieldInput.type = "text";
        formFieldInput.id = `${formField}`;
        formFieldInput.placeholder = `Enter the ${formField}`;
        formFieldInput.autocomplete = "off";
        formFieldDiv.appendChild(formFieldLabel);
        formFieldDiv.appendChild(formFieldInput);
        eventDataForm.appendChild(formFieldDiv);
    })
    
    for (let index = 0; index < inputEventDetails.length; index++) {
        if (index < inputEventDetails.length) {
            $(inputEventDetails[index]).addEventListener("keydown", (e) => {
                if (e.key === "Enter") $(inputEventDetails[index + 1]).focus();
            });
        }
        if (index > 0) {
            $(inputEventDetails[index]).addEventListener("keydown", (e) => {
                if (e.key === "Enter" && e.key ==="Shift") $(inputEventDetails[index -1]).focus();
            });
        }
    }

    userIDInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") passwordInput.focus();
    });

}

const logInAppScriptLink = "https://script.google.com/macros/s/AKfycbxLtDMInrMaQl2K5llhsqD0Ll--Y4J1QBeC-s8prCsrpNf6ykZiEBJjja_dzdPCQ8WV/exec";
const eventDataUpdateAppScriptLink = "https://script.google.com/macros/s/AKfycbzil5IzzZI4rQiI4ht0ibRhJ_7XXvhQ7VgqZXHFIS4a3Z5sKJ4jedplhA2vYYuYX_bAIw/exec";

async function logIn() {
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
        googleAppScriptLink: logInAppScriptLink,
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
}

async function logOut(inputStatus) {
    window.history.pushState({ page: 1 }, "Logging Out", "/LogOut");
    stopHeartbeat();
    stopInactivityTimer();
    clearTimeout(autoLogoutTimer);
    autoLogoutTimer = null;

    alertSigningOut("loggingOut");

    const userData = {
        googleAppScriptLink: logInAppScriptLink,
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
    alertSigningOut("loggedOut");
    setTimeout(() => {
        clearAlertBox();
        pageRender();
    }, 1500);
}

let heartBeatInterval;

function startHeartbeat() {
    sendHeartbeat();
    heartBeatInterval = setInterval(sendHeartbeat, 5 * 60 * 1000);
}

function sendHeartbeat() {
    if (!sessionID || !userID) return;
    navigator.sendBeacon(logInOut_Proxy_URL, JSON.stringify({
        googleAppScriptLink: logInAppScriptLink,
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
let autoLogoutTimer = null;
const timeOutMinutes = 15;
const warningMinutes = 3;

function resetInactivityTimer() {
    if (!userLoggedIn) return;
    clearTimeout(inactivityTimer);
    clearTimeout(warningTimer);

    warningTimer = setTimeout(() => {
        logOutAlert("autologOut");
    }, (timeOutMinutes - warningMinutes) * 60 * 1000);

    inactivityTimer = setTimeout(() => {
        logOut("timeOut_logOut");
    }, timeOutMinutes * 60 * 1000);
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
    if (!userLoggedIn) return;
    clearAlertBox();
    const alertBox = $("alertLogOut");
    if (!alertBox) return;

    alertBox.className = "alerting";

    let alertText;
    if (event === "logOut?") {
        alertText = "<p>Are you sure,<br> you want to Log Out?</p>";
    } else {
        // Stop both timers — we take over the countdown manually below
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

    // For the inactivity warning: if the user ignores the dialog,
    // auto-logout after the warning period elapses
    clearTimeout(autoLogoutTimer);
    autoLogoutTimer = null;
    if (event !== "logOut?") {
        autoLogoutTimer = setTimeout(() => {
            clearAlertBox();
            logOut("timeOut_logOut");
        }, warningMinutes * 60 * 1000);
    }

    $("logOutCancel").addEventListener("click", () => {
        clearTimeout(autoLogoutTimer);
        clearAlertBox();
        resetInactivityTimer();
    }, { once: true });

    $("logOutContinue").addEventListener("click", () => {
        clearTimeout(autoLogoutTimer);
        clearAlertBox();
        logOut("manual_logOut");
    }, { once: true });
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

let loggingOutInterval;
function alertSigningOut(event) {
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

function eventIdGenerator(eventDate, eventName, eventUnit) {
    const dates = {
         1: "A",  2: "B",  3: "C",  4: "4",  5: "D",  6: "E",  7: "F",  8: "G",  9: "H", 10: "1",
        11: "I", 12: "J", 13: "K", 14: "L", 15: "5", 16: "M", 17: "N", 18: "O", 19: "P", 20: "2",
        21: "Q", 22: "R", 23: "S", 24: "T", 25: "U", 26: "V", 27: "W", 28: "X", 29: "Y", 30: "3",
        31: "Z"
    }
    const months = {
        0: "J", 1: "F", 2: "M", 3: "A", 4: "Y", 5: "U", 6: "L", 7: "G", 8: "S", 9: "O", 10: "N", 11: "D"
    }

    const [day, month, year] = eventDate.split("-");
    const date = new Date(`${year}-${monthw}-${day}`);
    const yearSuffix = `${date.getFullYear()}`.slice(-2);

    eventUnit = String(eventUnit);
    if (eventUnit.length > 2) {
        eventUnit = "B";
    }
    const EventIdUniqueChar = Math.random().toString(36).substring(2, 3).toUpperCase();
    const eventID = `${dates[date.getDate()]}${months[date.getMonth()]}${yearSuffix}${eventName.slice(0, 1)}${eventUnit}${EventIdUniqueChar}`;

    return eventID;
}

function enterBloodDonation() {
    eventDataEntry("18-04-2026", "Blood Donation", "1 & 2",
"Rotract", "Like every year, a collabration between nss and rotract lead to a sucessful blood donation", "Like every year, a collabration between nss and rotract lead to a sucessful blood donation \n Like every year, a collabration between nss and rotract lead to a sucessful blood donation \n Like every year, a collabration between nss and rotract lead to a sucessful blood donation")
}

const inputEventDetails = [ "eventDate",
                            "eventName",
                            "eventUnit",
                            "eventCoOrganizer",
                            "eventDescription_oneLine",
                            "eventDescription_multipleLine",
                            "eventPosterGoogleID",
                            "eventGroupPhoto_1GoogleID",
                            "eventGroupPhoto_2GoogleID",
                            "eventGroupPhoto_3GoogleID",
                            "eventPhoto_1GoogleID",
                            "eventPhoto_2GoogleID",
                            "eventPhoto_3GoogleID",
]

async function eventDataEntry() {
    if (!userLoggedIn) {
        return;
    }

    const inputEventID = eventIdGenerator(inputEventDate, inputEventName, inputEventUnit);
    console.log(inputEventID);
    const eventData = {
        googleAppScriptLink: eventDataUpdateAppScriptLink,
        action: "addEvent",
        sessionID: sessionStorage.getItem("sessionID"),
        userID: sessionStorage.getItem("userID"),
        eventID: inputEventID,
        eventDate: inputEventDate, 
        eventName: inputEventName,
        eventUnit: inputEventUnit,
        eventCoOrganizer: inputEventCoOrganizer,
        eventDescription_oneLine: inputEventDescription_oneLine,
        eventDescription_multipleLine: inputEventDescription_multipleLine
    };

    try {
        const response = await fetch(logInOut_Proxy_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify(eventData)
        });
        const res = await response.text()
        console.log(res.dataAdded)
    } catch (err) {
    console.error("eventDataEntry error:", err);
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